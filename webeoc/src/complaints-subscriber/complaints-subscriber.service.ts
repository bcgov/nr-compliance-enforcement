import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, NatsConnection, StorageType, StringCodec } from "nats";
import {
  NATS_DURABLE_COMPLAINTS,
  NATS_NEW_COMPLAINTS_TOPIC_CONSUMER,
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NATS_STREAM_NAME,
  NATS_UPDATED_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINT_UPDATE_TOPIC_NAME,
} from "../common/constants";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { Complaint } from "../types/Complaints";
import { ComplaintsPublisherService } from "src/complaints-publisher/complaints-publisher.service";
import { ComplaintUpdate } from "src/types/ComplaintUpdate";

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ComplaintsSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null; // For managing streams

  constructor(
    private readonly service: StagingComplaintsApiService,
    private readonly complaintsPublisherService: ComplaintsPublisherService,
  ) {
    this.natsConnection = null;
  }

  async onModuleInit() {
    try {
      this.natsConnection = await connect({ servers: process.env.NATS_HOST });
      this.jsm = await this.natsConnection.jetstreamManager();

      await this.setupStream();
      await this.subscribeToNewComplaintsFromWebEOC();

      this.logger.debug((await this.jsm.streams.info(NATS_STREAM_NAME)).state);
    } catch (error) {
      this.logger.error("Failed to connect to NATS or set up stream:", error);
    }
  }

  private async setupStream(): Promise<void> {
    const streamConfig = {
      name: NATS_STREAM_NAME,
      subjects: [
        NATS_NEW_COMPLAINTS_TOPIC_NAME,
        NEW_STAGING_COMPLAINTS_TOPIC_NAME,
        NATS_UPDATED_COMPLAINTS_TOPIC_NAME,
        NEW_STAGING_COMPLAINT_UPDATE_TOPIC_NAME,
      ],
      storage: StorageType.Memory,
      duplicateWindow: 10 * 60 * 1000000000, // 10 minutes in nanoseconds
    };

    try {
      if (!this.jsm) throw new Error("JetStream Management client is not initialized.");

      await this.jsm.streams.add(streamConfig);
      await this.ensureConsumer(NATS_DURABLE_COMPLAINTS);
    } catch (error) {
      this.logger.error(`Unable to setup streams and consumers`, error);
    }
  }

  private async ensureConsumer(consumerName: string): Promise<void> {
    try {
      await this.jsm.consumers.info(NATS_STREAM_NAME, consumerName);
      this.logger.debug(`Consumer ${consumerName} already exists.`);
    } catch (error) {
      await this.jsm.consumers.add(NATS_STREAM_NAME, {
        ack_policy: AckPolicy.Explicit,
        durable_name: consumerName,
      });
      this.logger.debug(`Consumer ${consumerName} created`);
    }
  }

  private async subscribeToNewComplaintsFromWebEOC() {
    const sc = StringCodec();
    const consumer = await this.natsConnection.jetstream().consumers.get(NATS_STREAM_NAME, NATS_DURABLE_COMPLAINTS);
    const iter = await consumer.consume({ max_messages: 1 });

    for await (const message of iter) {
      await this.processMessage(message, sc);
    }
  }

  private async processMessage(message: any, sc: any) {
    switch (message.subject) {
      case NATS_NEW_COMPLAINTS_TOPIC_NAME:
        await this.handleNewComplaintMessage(message, sc);
        break;
      case NATS_UPDATED_COMPLAINTS_TOPIC_NAME:
        await this.handleUpdatedComplaintMessage(message, sc);
        break;
      case NEW_STAGING_COMPLAINTS_TOPIC_NAME:
        await this.handleNewStagingComplaintMessage(message);
        break;
      case NEW_STAGING_COMPLAINT_UPDATE_TOPIC_NAME:
        await this.handleNewStagingComplaintUpdateMessage(message, sc);
        break;
      default:
        this.logger.warn(`Unhandled message subject: ${message.subject}`);
    }
  }

  private async handleNewComplaintMessage(message: any, sc: any) {
    const complaintMessage: Complaint = JSON.parse(sc.decode(message.data));
    this.logger.debug("Received complaint:", complaintMessage?.incident_number);
    await this.processComplaintMessage(
      message,
      async () => await this.service.createNewComplaintInStaging(complaintMessage),
      complaintMessage.incident_number,
      NATS_NEW_COMPLAINTS_TOPIC_CONSUMER,
    );
  }

  private async handleUpdatedComplaintMessage(message: any, sc: any) {
    const complaintMessage: ComplaintUpdate = JSON.parse(sc.decode(message.data));
    this.logger.debug("Received complaint update:", complaintMessage?.parent_incident_number);
    await this.processComplaintMessage(
      message,
      async () => await this.service.createUpdateComplaintInStaging(complaintMessage),
      complaintMessage.parent_incident_number,
      NATS_UPDATED_COMPLAINTS_TOPIC_NAME,
    );
  }

  private async handleNewStagingComplaintMessage(message: any) {
    const stagingData = new TextDecoder().decode(message.data);
    this.logger.debug("Received staged complaint:", stagingData);
    await this.processComplaintMessage(
      message,
      async () => await this.service.createComplaintFromStaging(stagingData),
      stagingData,
      NEW_STAGING_COMPLAINTS_TOPIC_NAME,
    );
  }

  private async handleNewStagingComplaintUpdateMessage(message: any, sc: any) {
    const complaintUpdate: ComplaintUpdate = JSON.parse(sc.decode(message.data));
    const incident_number = complaintUpdate.parent_incident_number;
    const update_number = complaintUpdate.update_number;
    this.logger.debug("Received staged complaint update:", incident_number);
    await this.processComplaintMessage(
      message,
      async () => await this.service.createComplaintUpdateFromStaging(incident_number, update_number),
      incident_number,
      NEW_STAGING_COMPLAINT_UPDATE_TOPIC_NAME,
    );
  }

  private async processComplaintMessage(
    message: any,
    action: () => Promise<void>,
    identifier: string,
    topicName: string,
  ) {
    try {
      const success = await message.ackAck();
      if (success) {
        await action();
        this.complaintsPublisherService.publishStagingComplaintInsertedMessage(identifier);
      }
    } catch (error) {
      message.nak(10_000); // retry in 10 seconds
      this.logger.error(`Message ${identifier} not processed from ${topicName}`, error);
    }
  }
}
