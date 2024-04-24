import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  connect,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  RetentionPolicy,
  StorageType,
  StringCodec,
} from "nats";
import {
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
  private js: JetStreamClient | null = null;
  private jsm: JetStreamManager | null = null; // For managing streams
  private processedComplaintIds = new Set();

  constructor(private readonly service: StagingComplaintsApiService) {
    this.natsConnection = null;
    this.js = null;
  }

  async onModuleInit() {
    try {
      // Connect to NATS server using environment variable for the server address
      this.natsConnection = await connect({
        servers: process.env.NATS_HOST,
      });

      // Set up JetStream context
      this.js = this.natsConnection.jetstream();
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
      duplicateWindow: 10 * 60 * 1000000000, // 10 minutes in nanoseconds
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

    const sub = await this.natsConnection.subscribe(NATS_NEW_COMPLAINTS_TOPIC_NAME);

    (async () => {
      for await (const msg of sub) {
        try {
          const complaintMessage: Complaint = JSON.parse(sc.decode(msg.data));
          const incidentNumber = complaintMessage.incident_number;
          // do not process the complaint if it already has been processed
          if (this.processedComplaintIds.has(incidentNumber)) {
            this.logger.debug(`Ignoring duplicate complaint: ${incidentNumber}`);
            continue; // Skip this iteration if we've already processed this incident_number
          }
          this.processedComplaintIds.add(incidentNumber);
          this.logger.debug(`Received complaint, adding to staging table: ${complaintMessage.incident_number}`);
          await this.service.postComplaintToStaging(complaintMessage);
        } catch (error) {
          this.logger.error("Error processing received complaint:", error);
        }
      }
    })().catch((error) => {
      this.logger.error("Error in NATS subscription:", error);
    });
  }

  // subscribe to new nats to listen for new complaints added to the staging table.  These will be moved to the operational Complaints table.
  private async subscribeToNewStagingComplaints() {
    const sc = StringCodec();

    const sub = await this.natsConnection.subscribe(NEW_STAGING_COMPLAINTS_TOPIC_NAME);

    (async () => {
      for await (const msg of sub) {
        try {
          const stagingData = sc.decode(msg.data);
          this.logger.debug(`New complaint in staging: ${stagingData}`);
          await this.service.postComplaint(stagingData);
        } catch (error) {
          this.logger.error("Error processing complaint in staging:", error);
        }
      }
    })().catch((error) => {
      this.logger.error("Error in NATS subscription:", error);
    });
  }
}
