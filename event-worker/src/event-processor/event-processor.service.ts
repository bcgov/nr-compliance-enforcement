import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, NatsConnection, StorageType, StringCodec } from "nats";
import { NATS_DURABLE_EVENTS, STREAMS, STREAM_TOPICS } from "../common/constants";

interface EventData {
  id?: string;
  [key: string]: any;
}

@Injectable()
export class EventProcessorService implements OnModuleInit {
  private readonly logger = new Logger(EventProcessorService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null;

  constructor() {}

  async onModuleInit() {
    try {
      this.logger.log("Initializing EventProcessorService...");

      // Use default NATS connection if NATS_HOST is not set
      const natsHost = process.env.NATS_HOST || "nats://nats:4222";
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
        STREAM_TOPICS.CASE_CREATED,
        STREAM_TOPICS.CASE_CLOSED,
        STREAM_TOPICS.COMPLAINT_ADDED_TO_CASE,
        STREAM_TOPICS.COMPLAINT_REMOVED_FROM_CASE,
        STREAM_TOPICS.INVESTIGATION_CREATED,
        STREAM_TOPICS.INVESTIGATION_CLOSED,
        STREAM_TOPICS.INSPECTION_CREATED,
        STREAM_TOPICS.INSPECTION_CLOSED,
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
          durable_name: NATS_DURABLE_EVENTS,
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
      const consumer = await this.natsConnection.jetstream().consumers.get(STREAMS.EVENTS, NATS_DURABLE_EVENTS);
      const iter = await consumer.consume({ max_messages: 1 });

      this.logger.log("Subscription started, waiting for messages...");

      for await (const message of iter) {
        const decodedData = sc.decode(message.data);
        try {
          this.logger.debug(`Received message on subject: ${message.subject}`);

          if (message.subject === STREAM_TOPICS.CASE_CREATED) {
            await this.handleCaseCreated(message, JSON.parse(decodedData));
          } else if (message.subject === STREAM_TOPICS.CASE_CLOSED) {
            await this.handleCaseClosed(message, JSON.parse(decodedData));
          } else if (message.subject === STREAM_TOPICS.COMPLAINT_ADDED_TO_CASE) {
            await this.handleComplaintAddedToCase(message, JSON.parse(decodedData));
          } else if (message.subject === STREAM_TOPICS.COMPLAINT_REMOVED_FROM_CASE) {
            await this.handleComplaintRemovedFromCase(message, JSON.parse(decodedData));
          } else if (message.subject === STREAM_TOPICS.INVESTIGATION_CREATED) {
            await this.handleInvestigationCreated(message, JSON.parse(decodedData));
          } else if (message.subject === STREAM_TOPICS.INVESTIGATION_CLOSED) {
            await this.handleInvestigationClosed(message, JSON.parse(decodedData));
          } else if (message.subject === STREAM_TOPICS.INSPECTION_CREATED) {
            await this.handleInspectionCreated(message, JSON.parse(decodedData));
          } else if (message.subject === STREAM_TOPICS.INSPECTION_CLOSED) {
            await this.handleInspectionClosed(message, JSON.parse(decodedData));
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

  private async handleCaseCreated(message: any, eventData: EventData) {
    console.log(`CASE CREATED: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing case created: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }

  private async handleCaseClosed(message: any, eventData: EventData) {
    console.log(`CASE CLOSED: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing case closed: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }

  private async handleComplaintAddedToCase(message: any, eventData: EventData) {
    console.log(`COMPLAINT ADDED TO CASE: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing complaint added to case: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }

  private async handleComplaintRemovedFromCase(message: any, eventData: EventData) {
    console.log(`COMPLAINT REMOVED FROM CASE: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing complaint removed from case: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }

  private async handleInvestigationCreated(message: any, eventData: EventData) {
    console.log(`INVESTIGATION CREATED: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing investigation created: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }

  private async handleInvestigationClosed(message: any, eventData: EventData) {
    console.log(`INVESTIGATION CLOSED: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing investigation closed: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }

  private async handleInspectionCreated(message: any, eventData: EventData) {
    console.log(`INSPECTION CREATED: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing inspection created: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }

  private async handleInspectionClosed(message: any, eventData: EventData) {
    console.log(`INSPECTION CLOSED: ${JSON.stringify(eventData)}`);
    this.logger.debug(`Processing inspection closed: ${eventData?.id || "unknown"}`);
    await message.ackAck();
  }
}
