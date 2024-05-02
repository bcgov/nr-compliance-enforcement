import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, NatsConnection, StorageType, StringCodec } from "nats";
import {
  NATS_DURABLE_COMPLAINTS,
  NATS_NEW_COMPLAINTS_TOPIC_CONSUMER,
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NATS_STREAM_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
} from "../common/constants";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { Complaint } from "../types/Complaints";

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ComplaintsSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null; // For managing streams

  constructor(private readonly service: StagingComplaintsApiService) {
    this.natsConnection = null;
  }

  async onModuleInit() {
    try {
      // Connect to NATS server using environment variable for the server address
      this.natsConnection = await connect({
        servers: process.env.NATS_HOST,
      });

      // Set up JetStream context
      this.jsm = await this.natsConnection.jetstreamManager();

      // Set up or validate the stream configuration
      await this.setupStream();

      // Subscribe to topics after ensuring the stream is correctly configured
      await this.subscribeToNewComplaintsFromWebEOC();

      this.logger.debug((await this.jsm.streams.info(NATS_STREAM_NAME)).state);
    } catch (error) {
      this.logger.error("Failed to connect to NATS or set up stream:", error);
    }
  }

  async setupStream(): Promise<void> {
    const streamConfig = {
      name: NATS_STREAM_NAME,
      subjects: [NATS_NEW_COMPLAINTS_TOPIC_NAME, NEW_STAGING_COMPLAINTS_TOPIC_NAME],
      storage: StorageType.Memory,
      duplicateWindow: 10 * 60 * 1000000000, // 10 minutes in nanoseconds,
    };

    try {
      if (!this.jsm) {
        throw new Error("JetStream Management client is not initialized.");
      }

      const streamInfo = await this.jsm.streams.add(streamConfig);
      console.log("Stream created or updated:", streamInfo);

      try {
        await this.jsm.consumers.info(NATS_STREAM_NAME, NATS_DURABLE_COMPLAINTS);
        console.log(`Consumer already exists. No need to create.`);
      } catch (error) {
        await this.jsm.consumers.add(NATS_STREAM_NAME, {
          ack_policy: AckPolicy.Explicit,
          durable_name: NATS_DURABLE_COMPLAINTS,
        });
        this.logger.debug(`Consumer created`);
      }
    } catch (error) {
      this.logger.error(`Unable to setup streams and consumers`, error);
    }
  }

  // subscribe to new nats to listen for new complaints from webeoc.  These will be moved to the staging table.
  private async subscribeToNewComplaintsFromWebEOC() {
    const sc = StringCodec();
    const consumer = await this.natsConnection.jetstream().consumers.get(NATS_STREAM_NAME);

    const iter = await consumer.consume({ max_messages: 3 });

    for await (const message of iter) {
      // listen for messages indicating that a new complaint was found from webeoc
      if (message.subject === NATS_NEW_COMPLAINTS_TOPIC_NAME) {
        const complaintMessage: Complaint = JSON.parse(sc.decode(message.data));
        this.logger.debug("Received complaint:", complaintMessage?.incident_number);
        try {
          await this.service.postComplaintToStaging(complaintMessage);
          message.ack();
        } catch (error) {
          this.logger.error(`Message not processed from ${NATS_NEW_COMPLAINTS_TOPIC_CONSUMER}`);
        }
      } else {
        // listen for messages indicating that a new complaint was staged
        const stagingData = new TextDecoder().decode(message.data);
        this.logger.debug("Received staged complaint:", stagingData);
        try {
          await this.service.postComplaint(stagingData);
          message.ack();
        } catch (error) {
          this.logger.error(`Message not processed from ${NEW_STAGING_COMPLAINTS_TOPIC_NAME}`);
        }
      }
    }
  }
}
