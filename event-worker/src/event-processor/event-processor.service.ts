import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, NatsConnection, StorageType, StringCodec } from "nats";
import { STREAMS, STREAM_TOPICS } from "../common/constants";
import { GraphQLClient } from "graphql-request";

const CREATE_EVENT_MUTATION = `
  mutation CreateEvent($input: EventCreateInput!) {
    createEvent(input: $input) {
      eventGuid
    }
  }
`;

interface EventCreateInput {
  eventVerbTypeCode: string;
  sourceId?: string;
  sourceEntityTypeCode?: string;
  actorId: string;
  actorEntityTypeCode: string;
  targetId: string;
  targetEntityTypeCode: string;
  content?: any;
}

@Injectable()
export class EventProcessorService implements OnModuleInit {
  private readonly logger = new Logger(EventProcessorService.name);
  private readonly graphqlClient: GraphQLClient;
  private readonly eventStreamName = `${process.env.EVENT_STREAM_NAME}`;
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null;

  constructor() {
    const graphqlUrl = `${process.env.CASE_MANAGEMENT_API_URL}`;
    this.graphqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        "x-api-key": process.env.CASE_API_KEY || "",
      },
    });
    this.logger.log(`GraphQL client initialized with URL: ${graphqlUrl}`);
  }

  async onModuleInit() {
    try {
      this.logger.log("Initializing EventProcessorService...");

      const natsHost = process.env.NATS_HOST;
      this.logger.log(`Connecting to NATS at: ${natsHost}`);
      this.natsConnection = await connect({ servers: natsHost, waitOnFirstConnect: true });
      this.jsm = await this.natsConnection.jetstreamManager();
      this.logger.log("Connected to NATS successfully");

      await this.setupStream();
      this.logger.log("Stream setup completed");

      // Start subscription in background without blocking
      this.subscribeToTopics().catch((error) => {
        this.logger.error("Error in subscription loop:", error);
      });

      // Try to get stream info if it exists
      try {
        if (this.jsm) {
          const streamInfo = await this.jsm.streams.info(STREAMS.EVENTS);
          this.logger.debug(`Stream state in EventProcessorService: ${JSON.stringify(streamInfo.state)}`);
        }
      } catch (streamError: any) {
        this.logger.warn(`Could not get EventProcessorService stream info: ${streamError.message}`);
      }

      this.logger.log("EventProcessorService initialization completed");
    } catch (error) {
      this.logger.error("EventProcessorService initialization failed", error);
    }
  }

  private async setupStream(): Promise<void> {
    if (!this.jsm) throw new Error("JetStream management client is not initialized.");

    const streamConfig = {
      name: STREAMS.EVENTS,
      subjects: [
        STREAM_TOPICS.CASE_OPENED,
        STREAM_TOPICS.CASE_CLOSED,
        STREAM_TOPICS.COMPLAINT_ADDED_TO_CASE,
        STREAM_TOPICS.COMPLAINT_REMOVED_FROM_CASE,
        STREAM_TOPICS.COMPLAINT_OPENED,
        STREAM_TOPICS.COMPLAINT_CLOSED,
        STREAM_TOPICS.INVESTIGATION_CLOSED,
        STREAM_TOPICS.INVESTIGATION_ADDED_TO_CASE,
        STREAM_TOPICS.INSPECTION_CLOSED,
        STREAM_TOPICS.INSPECTION_ADDED_TO_CASE,
      ],
      storage: StorageType.Memory,
      max_age: 10 * 60 * 60 * 1e9, // 10 minutes in nanoseconds
    };

    try {
      // Check if stream already exists
      let streamExists = false;
      try {
        await this.jsm.streams.info(STREAMS.EVENTS);
        streamExists = true;
        this.logger.debug("Stream already exists");
      } catch (error: any) {
        if (error.code === "404") {
          this.logger.debug("Stream does not exist, will create it");
        } else {
          throw error;
        }
      }

      // Create stream if it doesn't exist
      if (!streamExists) {
        await this.jsm.streams.add(streamConfig);
        this.logger.log("Stream created successfully");
      }

      // Setup consumer
      try {
        await this.jsm.consumers.add(STREAMS.EVENTS, {
          ack_policy: AckPolicy.Explicit,
          durable_name: this.eventStreamName,
        });
        this.logger.log("Consumer created successfully");
      } catch (error) {
        if (error.code === "409") {
          this.logger.debug("Consumer already exists");
        } else {
          throw error;
        }
      }

      this.logger.log("Stream and consumer setup completed");
    } catch (error) {
      this.logger.error("Unable to setup streams and consumers", error);
      throw error; // Re-throw to prevent silent failures
    }
  }

  private async subscribeToTopics() {
    if (!this.natsConnection) {
      this.logger.error("NATS connection is not initialized");
      return;
    }

    try {
      const sc = StringCodec();
      this.logger.log(`Event processor service subscribing to stream: ${STREAMS.EVENTS}`);
      const consumer = await this.natsConnection.jetstream().consumers.get(STREAMS.EVENTS, this.eventStreamName);
      const iter = await consumer.consume({ max_messages: 1 });

      this.logger.log("Subscription started, waiting for messages...");

      for await (const message of iter) {
        const decodedData = sc.decode(message.data);
        try {
          this.logger.debug(`Received message on subject: ${message.subject}`);

          if (Object.values(STREAM_TOPICS).includes(message.subject)) {
            // Parse the decoded data as EventCreateInput
            const eventData: EventCreateInput = JSON.parse(decodedData);

            try {
              const data: any = await this.graphqlClient.request(CREATE_EVENT_MUTATION, { input: eventData });
              const eventId = data?.createEvent?.eventGuid ?? "";
              this.logger.debug(`Successfully created event ${eventId} for subject: ${message.subject}`);
              await message.ackAck(); // Acknowledge successful processing
            } catch (graphqlError) {
              this.logger.error(`GraphQL error creating event: ${graphqlError.message}`, graphqlError.stack);
              throw graphqlError; // Re-throw to trigger the catch block below
            }
          } else {
            this.logger.warn(`Unknown message subject: ${message.subject}`);
            await message.ackAck(); // Acknowledge unknown messages to prevent reprocessing
          }
        } catch (error) {
          this.logger.error(`Error processing message from ${message.subject}`, error);
          message.nak(60_000); // retry in 60 seconds
        }
      }
    } catch (error) {
      this.logger.error("Error in subscription loop:", error);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        this.logger.log("Attempting to reconnect...");
        this.subscribeToTopics().catch((err) => {
          this.logger.error("Reconnection failed:", err);
        });
      }, 5000);
    }
  }
}
