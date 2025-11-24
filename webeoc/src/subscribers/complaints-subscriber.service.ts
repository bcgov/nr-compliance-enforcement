import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, NatsConnection, StorageType, StringCodec } from "nats";
import { NATS_DURABLE_COMPLAINTS, STREAMS, STREAM_TOPICS } from "../common/constants";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { Complaint } from "../types/complaint-type";
import { ComplaintsPublisherService } from "src/publishers/complaints-publisher.service";
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
      this.natsConnection = await connect({ servers: process.env.NATS_HOST, waitOnFirstConnect: true });
      this.jsm = await this.natsConnection.jetstreamManager();
      await this.setupStream();
      await this.subscribeToTopics();
      this.logger.debug((await this.jsm.streams.info(STREAMS.COMPLAINTS)).state);
    } catch (error) {
      this.logger.error("Failed to connect to NATS or set up stream:", error);
    }
  }

  private async setupStream(): Promise<void> {
    if (!this.jsm) throw new Error("JetStream Management client is not initialized.");

    const streamConfig = {
      name: STREAMS.COMPLAINTS,
      subjects: [
        STREAM_TOPICS.COMPLAINTS,
        STREAM_TOPICS.STAGING_COMPLAINTS,
        STREAM_TOPICS.COMPLAINT_UPDATE,
        STREAM_TOPICS.STAGING_COMPLAINT_UPDATE,
      ],
      storage: StorageType.Memory,
      max_age: 10 * 60 * 60 * 1e9, // 10 minutes in nanoseconds
      duplicate_window: 10 * 60 * 1e9, // 10 minutes in nanoseconds
    };

    try {
      await this.jsm.streams.add(streamConfig);
      await this.jsm.consumers.add(STREAMS.COMPLAINTS, {
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
    const consumer = await this.natsConnection.jetstream().consumers.get(STREAMS.COMPLAINTS, NATS_DURABLE_COMPLAINTS);
    const iter = await consumer.consume({ max_messages: 1 });

    for await (const message of iter) {
      const decodedData = sc.decode(message.data);
      try {
        if (message.subject === STREAM_TOPICS.COMPLAINTS) {
          await this.handleNewComplaint(message, JSON.parse(decodedData));
        } else if (message.subject === STREAM_TOPICS.COMPLAINT_UPDATE) {
          await this.handleUpdatedComplaint(message, JSON.parse(decodedData));
        } else if (message.subject === STREAM_TOPICS.STAGING_COMPLAINTS) {
          await this.handleStagedComplaint(message, decodedData);
        } else if (message.subject === STREAM_TOPICS.STAGING_COMPLAINT_UPDATE) {
          await this.handleStagedComplaintUpdate(message, JSON.parse(decodedData));
        }
      } catch (error) {
        this.logger.error(`Error processing message from ${message.subject}`, error);
        message.nak(60_000); // retry in 60 seconds
      }
    }
  }

  private async handleNewComplaint(message, complaintMessage: Complaint) {
    this.logger.debug(`Staging complaint: ${complaintMessage?.incident_number}`);
    await this.service.createNewComplaintInStaging(complaintMessage);
    await message.ackAck(); //Message has been loaded into NatCom no need to retry.  If NATS is unavailable there will be 'PENDING' row to process manually.
    this.complaintsPublisherService.publishStagingComplaintInsertedMessage(complaintMessage);
  }

  private async handleUpdatedComplaint(message, complaintMessage: ComplaintUpdate) {
    this.logger.debug(`Staging complaint update: ${complaintMessage?.parent_incident_number}`);
    await this.service.createUpdateComplaintInStaging(complaintMessage);
    await message.ackAck(); //Message has been loaded into NatCom no need to retry.  If NATS is unavailable there will be 'PENDING' row to process manually.
    this.complaintsPublisherService.publishStagingComplaintUpdateInsertedMessage(complaintMessage);
  }

  private async handleStagedComplaint(message, stagingData: string) {
    this.logger.debug(`Processing Staging complaint: ${stagingData}`);
    await this.service.createComplaintFromStaging(stagingData);
    message.ackAck();
  }

  private async handleStagedComplaintUpdate(message, complaintUpdate: ComplaintUpdate) {
    const { parent_incident_number, update_number } = complaintUpdate;
    this.logger.debug(`Processing staged complaint update: ${parent_incident_number}`);
    await this.service.createComplaintUpdateFromStaging(parent_incident_number, update_number);
    message.ackAck();
  }
}
