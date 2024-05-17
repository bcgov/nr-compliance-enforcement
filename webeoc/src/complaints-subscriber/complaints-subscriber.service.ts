import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, NatsConnection, StorageType, StringCodec } from "nats";
import {
  NATS_DURABLE_COMPLAINTS,
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NATS_STREAM_NAME,
  NATS_UPDATED_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINT_UPDATE_TOPIC_NAME,
} from "../common/constants";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { Complaint } from "../types/complaint-type";
import { ComplaintsPublisherService } from "src/complaints-publisher/complaints-publisher.service";
import { ComplaintUpdate } from "src/types/complaint-update-type";

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ComplaintsSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null;

  constructor(
    private readonly service: StagingComplaintsApiService,
    private readonly complaintsPublisherService: ComplaintsPublisherService,
  ) {}

  async onModuleInit() {
    try {
      this.natsConnection = await connect({ servers: process.env.NATS_HOST });
      this.jsm = await this.natsConnection.jetstreamManager();
      await this.setupStream();
      await this.subscribeToTopics();
      this.logger.debug((await this.jsm.streams.info(NATS_STREAM_NAME)).state);
    } catch (error) {
      this.logger.error("Failed to connect to NATS or set up stream:", error);
    }
  }

  private async setupStream(): Promise<void> {
    if (!this.jsm) throw new Error("JetStream Management client is not initialized.");

    const streamConfig = {
      name: NATS_STREAM_NAME,
      subjects: [
        NATS_NEW_COMPLAINTS_TOPIC_NAME,
        NEW_STAGING_COMPLAINTS_TOPIC_NAME,
        NATS_UPDATED_COMPLAINTS_TOPIC_NAME,
        NEW_STAGING_COMPLAINT_UPDATE_TOPIC_NAME,
      ],
      storage: StorageType.Memory,
      duplicateWindow: 10 * 60 * 1e9, // 10 minutes in nanoseconds
    };

    try {
      await this.jsm.streams.add(streamConfig);
      await this.jsm.consumers.add(NATS_STREAM_NAME, {
        ack_policy: AckPolicy.Explicit,
        durable_name: NATS_DURABLE_COMPLAINTS,
      });
      this.logger.debug("Stream and consumer set up successfully");
    } catch (error) {
      this.logger.error("Unable to setup streams and consumers", error);
    }
  }

  private async subscribeToTopics() {
    const sc = StringCodec();
    const consumer = await this.natsConnection.jetstream().consumers.get(NATS_STREAM_NAME, NATS_DURABLE_COMPLAINTS);
    const iter = await consumer.consume({ max_messages: 1 });

    for await (const message of iter) {
      const decodedData = sc.decode(message.data);
      try {
        if (message.subject === NATS_NEW_COMPLAINTS_TOPIC_NAME) {
          await this.handleNewComplaint(message, JSON.parse(decodedData));
        } else if (message.subject === NATS_UPDATED_COMPLAINTS_TOPIC_NAME) {
          await this.handleUpdatedComplaint(message, JSON.parse(decodedData));
        } else if (message.subject === NEW_STAGING_COMPLAINTS_TOPIC_NAME) {
          await this.handleStagedComplaint(message, decodedData);
        } else if (message.subject === NEW_STAGING_COMPLAINT_UPDATE_TOPIC_NAME) {
          await this.handleStagedComplaintUpdate(message, JSON.parse(decodedData));
        }
      } catch (error) {
        this.logger.error(`Error processing message from ${message.subject}`, error);
        message.nak(10_000); // retry in 10 seconds
      }
    }
  }

  private async handleNewComplaint(message, complaintMessage: Complaint) {
    this.logger.debug("Received complaint:", complaintMessage?.incident_number);
    const success = await message.ackAck();
    if (success) {
      await this.service.createNewComplaintInStaging(complaintMessage);
      this.complaintsPublisherService.publishStagingComplaintInsertedMessage(complaintMessage.incident_number);
    }
  }

  private async handleUpdatedComplaint(message, complaintMessage: ComplaintUpdate) {
    this.logger.debug("Received complaint update:", complaintMessage?.parent_incident_number);
    const success = await message.ackAck();
    if (success) {
      await this.service.createUpdateComplaintInStaging(complaintMessage);
      this.complaintsPublisherService.publishStagingComplaintUpdateInsertedMessage(complaintMessage);
    }
  }

  private async handleStagedComplaint(message, stagingData: string) {
    this.logger.debug("Received staged complaint:", stagingData);
    await this.service.createComplaintFromStaging(stagingData);
    message.ackAck();
  }

  private async handleStagedComplaintUpdate(message, complaintUpdate: ComplaintUpdate) {
    const { parent_incident_number, update_number } = complaintUpdate;
    this.logger.debug("Received staged complaint update:", parent_incident_number);
    await this.service.createComplaintUpdateFromStaging(parent_incident_number, update_number);
    message.ackAck();
  }
}
