import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  AckPolicy,
  connect,
  ConsumerConfig,
  JetStreamManager,
  NatsConnection,
  RetentionPolicy,
  StorageType,
  StringCodec,
  SubscriptionOptions,
} from "nats";
import {
  NATS_NEW_COMPLAINTS_TOPIC_CONSUMER,
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NATS_QUEUE_GROUP_COMPLAINTS,
  NATS_QUEUE_GROUP_STAGING,
  NATS_STREAM_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_CONSUMER,
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
      this.subscribeToNewComplaintsFromWebEOC();
      this.subscribeToNewStagingComplaints();
    } catch (error) {
      this.logger.error("Failed to connect to NATS or set up stream:", error);
    }
  }

  async setupStream(): Promise<void> {
    const streamConfig = {
      name: NATS_STREAM_NAME,
      subjects: [NATS_NEW_COMPLAINTS_TOPIC_NAME, NEW_STAGING_COMPLAINTS_TOPIC_NAME],
      retention: RetentionPolicy.Limits,
      maxAge: 0,
      storage: StorageType.Memory,
      duplicateWindow: 10 * 60 * 1000000000, // 10 minutes in nanoseconds,
    };

    try {
      if (!this.jsm) {
        throw new Error("JetStream Management client is not initialized.");
      }

      const streamInfo = await this.jsm.streams.add(streamConfig);
      console.log("Stream created or updated:", streamInfo);
    } catch (error) {
      console.error("Failed to create or update stream:", error);
      throw error;
    }
  }

  // subscribe to new nats to listen for new complaints from webeoc.  These will be moved to the staging table.
  private async subscribeToNewComplaintsFromWebEOC() {
    const sc = StringCodec();

    // Consumer configuration
    const consumerConfig = {
      name: NATS_NEW_COMPLAINTS_TOPIC_CONSUMER,
      ack_policy: AckPolicy.Explicit,
      filter_subject: NATS_NEW_COMPLAINTS_TOPIC_NAME,
      deliver_group: NATS_QUEUE_GROUP_STAGING,
    } as Partial<ConsumerConfig>;

    try {
      // Add consumer configuration to JetStream Manager
      let consumer = null;

      // delete the existing consumer in case we've made a configuation change (this will be recreated)
      try {
        await this.jsm.consumers.delete(NATS_STREAM_NAME, NATS_NEW_COMPLAINTS_TOPIC_CONSUMER);
      } catch (error) {
        this.logger.debug("Consumer not deleted since it doesn't exist");
      }
      await this.jsm.consumers.add(NATS_STREAM_NAME, consumerConfig).then(async (info) => {
        consumer = await this.natsConnection.jetstream().consumers.get(NATS_STREAM_NAME, info.name);
      });

      (async () => {
        try {
          for await (const message of await consumer.consume()) {
            const complaintMessage: Complaint = JSON.parse(sc.decode(message.data));
            this.logger.debug("Received complaint:", complaintMessage?.incident_number);
            try {
              await this.service.postComplaintToStaging(complaintMessage);
              message.ack();
            } catch (error) {
              this.logger.error("Message not processed");
            }
          }
        } catch (error) {
          this.logger.error("Error consuming messages:", error);
        }
      })();
    } catch (error) {
      this.logger.error("Failed to subscribe or process messages:", error);
    }
  }

  // subscribe to new nats to listen for new complaints added to the staging table.  These will be moved to the operational Complaints table.
  private async subscribeToNewStagingComplaints() {
    const sc = StringCodec();
    // Consumer configuration
    const consumerConfig = {
      name: NEW_STAGING_COMPLAINTS_TOPIC_CONSUMER,
      ack_policy: AckPolicy.Explicit,
      filter_subject: NEW_STAGING_COMPLAINTS_TOPIC_NAME,
      deliver_group: NATS_QUEUE_GROUP_COMPLAINTS,
    } as Partial<ConsumerConfig>;

    try {
      // Add consumer configuration to JetStream Manager
      let consumer = null;
      // delete the existing consumer in case we've made a configuation change (this will be recreated)
      try {
        await this.jsm.consumers.delete(NATS_STREAM_NAME, NEW_STAGING_COMPLAINTS_TOPIC_CONSUMER);
      } catch (error) {
        this.logger.debug("Consumer not deleted since it doesn't exist");
      }
      await this.jsm.consumers.add(NATS_STREAM_NAME, consumerConfig).then(async (info) => {
        consumer = await this.natsConnection.jetstream().consumers.get(NATS_STREAM_NAME, info.name);
      });

      (async () => {
        try {
          for await (const message of await consumer.consume()) {
            const stagingData = sc.decode(message.data);
            this.logger.debug("Received complaint:", stagingData);
            try {
              await this.service.postComplaint(stagingData);
              message.ack();
            } catch (error) {
              this.logger.error("Message not processed");
            }
          }
        } catch (error) {
          this.logger.error("Error consuming messages:", error);
        }
      })();
    } catch (error) {
      this.logger.error("Failed to subscribe or process messages:", error);
    }
  }

  // This function checks if a specific consumer exists in a stream
  private async checkConsumerExists(stream: string, consumerName: string): Promise<boolean> {
    const consumerLister = await this.jsm.consumers.list(stream);

    let result;
    while (true) {
      result = await consumerLister.next();
      if (result === null || result === undefined || Object.keys(result).length === 0) {
        // No more consumers, or signal of end of list
        break;
      }
      if (result.consumer && result.consumer.name === consumerName) {
        return true; // Return true if the consumer is found
      }
    }
    return false; // Return false if the consumer was not found
  }
}
