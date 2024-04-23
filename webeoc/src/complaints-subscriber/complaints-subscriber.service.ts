import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { connect, NatsConnection, StringCodec } from "nats";
import { NATS_NEW_COMPLAINTS_TOPIC_NAME, NEW_STAGING_COMPLAINTS_TOPIC_NAME } from "../common/constants";
import { StagingComplaintsApiService } from "../staging-complaints-api-service/staging-complaints-api-service.service";
import { Complaint } from "../types/Complaints";

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

      this.subscribeToNewComplaintsFromWebEOC();
      this.subscribeToNewStagingComplaints();
    } catch (error) {
      this.logger.error("Failed to connect to NATS:", error);
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
          this.logger.debug(`Received complaint: ${complaintMessage.incident_number}`);
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
