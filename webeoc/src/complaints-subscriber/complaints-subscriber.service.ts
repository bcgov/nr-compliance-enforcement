import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { connect, NatsConnection, StringCodec, createInbox, AckPolicy, RetentionPolicy, StorageType } from "nats";
import {
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NATS_STREAM_NAME,
  NATS_UPDATED_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
} from "../common/constants";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { ComplaintMessage } from "../types/Complaints";

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private natsConnection: NatsConnection;
  private readonly logger = new Logger(ComplaintsSubscriberService.name);

  constructor(private readonly service: StagingComplaintsApiService) {}

  async onModuleInit() {
    try {
      this.natsConnection = await connect({
        servers: process.env.NATS_HOST,
      });

      console.log("Connected to NATS at:", process.env.NATS_HOST);
      console.log("Connecting to jetstream");
      const jsm = await this.natsConnection.jetstreamManager();

      // Create or update a stream with deduplication window

      console.log(jsm.streams.info);
      const streamInfo = await jsm.streams.add({
        name: NATS_STREAM_NAME,
        subjects: [
          NATS_NEW_COMPLAINTS_TOPIC_NAME,
          NATS_UPDATED_COMPLAINTS_TOPIC_NAME,
          NEW_STAGING_COMPLAINTS_TOPIC_NAME,
        ],
        retention: RetentionPolicy.Workqueue,
        storage: StorageType.Memory,
      });
      console.log("Stream configured successfully:", streamInfo);
      this.logger.debug(`Connected to NATS ${process.env.NATS_HOST}`);
      this.subscribeToNewComplaintsFromWebEOC();
      this.subscribeToNewStagingComplaints();
    } catch (error) {
      this.logger.error("Failed to connect to NATS:", error);
    }
  }

  private async subscribeToNewComplaintsFromWebEOC() {
    const sc = StringCodec();
    const subject = NATS_NEW_COMPLAINTS_TOPIC_NAME;
    const durableName = "complaints-service-durable";
    const opts = {
      stream: NATS_STREAM_NAME,
      consumer: durableName,
      config: {
        durable_name: durableName,
        ack_policy: AckPolicy.Explicit,
        deliver_subject: createInbox(),
        deliver_group: "complaintsQueueGroup",
      },
    };

    const sub = await this.natsConnection.jetstream().subscribe(subject, opts);

    (async () => {
      for await (const msg of sub) {
        try {
          const complaintMessage: ComplaintMessage = JSON.parse(sc.decode(msg.data));
          this.logger.debug(`Received complaint: ${complaintMessage.data.incident_number}`);
          await this.service.postComplaintToStaging(complaintMessage.data);
          msg.ack();
        } catch (error) {
          this.logger.error("Error processing received complaint:", error);
          msg.term(); // Terminate message if there's a processing error
        }
      }
    })().catch((error) => {
      this.logger.error("Error in NATS subscription:", error);
    });
  }

  private async subscribeToNewStagingComplaints() {
    const sc = StringCodec();
    const subject = NEW_STAGING_COMPLAINTS_TOPIC_NAME;
    const durableName = "staging-complaints-service-durable";
    const opts = {
      stream: NATS_STREAM_NAME,
      consumer: durableName,
      config: {
        durable_name: durableName,
        ack_policy: AckPolicy.Explicit,
        deliver_subject: createInbox(),
        deliver_group: "stagingQueueGroup",
      },
    };

    const sub = await this.natsConnection.jetstream().subscribe(subject, opts);

    (async () => {
      for await (const msg of sub) {
        try {
          const stagingData = sc.decode(msg.data);
          this.logger.debug(`New complaint in staging: ${stagingData}`);
          await this.service.postComplaint(stagingData);
          msg.ack();
        } catch (error) {
          this.logger.error("Error processing complaint in staging:", error);
          msg.term();
        }
      }
    })().catch((error) => {
      this.logger.error("Error in NATS subscription:", error);
    });
  }
}
