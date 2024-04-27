import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  AckPolicy,
  connect,
  JetStreamManager,
  Msg,
  NatsConnection,
  RetentionPolicy,
  StorageType,
  StringCodec,
} from "nats";
import {
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NATS_NEW_COMPLAINTS_TOPIC_NAME_DELIVERED,
  NATS_QUEUE_GROUP,
  NATS_STREAM_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME_DELIVERED,
} from "../common/constants";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { Complaint } from "../types/Complaints";

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ComplaintsSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null; // For managing streams
  private _queue_group_config = {
    queue: NATS_QUEUE_GROUP,
  };

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
      duplicateWindow: 5 * 60 * 1000000000, // 5 minutes in nanoseconds
    };

    try {
      if (!this.jsm) {
        throw new Error("JetStream Management client is not initialized.");
      }
      const streamInfo = await this.jsm.streams.add(streamConfig);
      this.logger.debug("Stream created or updated:", streamInfo);
    } catch (error) {
      this.logger.error("Failed to create or update stream:", error);
      throw error;
    }
  }

  // subscribe to new nats to listen for new complaints from webeoc.  These will be moved to the staging table.
  private async subscribeToNewComplaintsFromWebEOC() {
    const sc = StringCodec();

    // Consumer configuration
    const consumerConfig = {
      filter_subject: NATS_NEW_COMPLAINTS_TOPIC_NAME,
      deliver_subject: NATS_NEW_COMPLAINTS_TOPIC_NAME_DELIVERED,
      ack_policy: AckPolicy.Explicit,
    };

    await this.jsm.consumers.add(NATS_STREAM_NAME, consumerConfig);

    const sub = this.natsConnection.subscribe(NEW_STAGING_COMPLAINTS_TOPIC_NAME_DELIVERED, this._queue_group_config);

    const processMessage = async (msg: Msg) => {
      const complaintMessage: Complaint = JSON.parse(sc.decode(msg.data));
      try {
        this.logger.debug(`Received ${complaintMessage?.incident_number} from NATS topic`);
        await this.service.postComplaintToStaging(complaintMessage);
      } catch (error) {
        this.logger.error(`Complaint not processed ${complaintMessage?.incident_number}`);
      }
    };

    this.logger.debug("Listening for messages...");
    for await (const message of await sub) {
      await processMessage(message);
    }

    this.logger.error("No longer listening for new webeoc complaints");
  }

  // subscribe to new nats to listen for new complaints added to the staging table.  These will be moved to the operational Complaints table.
  private async subscribeToNewStagingComplaints() {
    const sc = StringCodec();

    // Consumer configuration
    const consumerConfig = {
      filter_subject: NEW_STAGING_COMPLAINTS_TOPIC_NAME,
      deliver_subject: NEW_STAGING_COMPLAINTS_TOPIC_NAME_DELIVERED,
    };

    this.jsm.consumers.add(NATS_STREAM_NAME, consumerConfig);

    const sub = this.natsConnection.subscribe(NEW_STAGING_COMPLAINTS_TOPIC_NAME_DELIVERED, this._queue_group_config);

    const processMessage = async (msg: Msg) => {
      const stagingData = sc.decode(msg.data);
      await this.service.postComplaint(stagingData);
    };

    for await (const message of await sub) {
      await processMessage(message);
    }
    this.logger.error("No longer listening for new staged complaints");
  }
}
