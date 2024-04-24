import { Injectable, Logger } from "@nestjs/common";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
import { NATS_NEW_COMPLAINTS_TOPIC_NAME, NEW_STAGING_COMPLAINTS_TOPIC_NAME } from "../common/constants";
import { Complaint } from "src/types/Complaints";

@Injectable()
export class ComplaintsPublisherService {
  private jsClient: JetStreamClient;
  private readonly logger = new Logger(ComplaintsPublisherService.name);

  constructor() {
    this.initializeNATS();
  }

  private async initializeNATS() {
    const nc = await connect({
      servers: [process.env.NATS_HOST],
    });
    this.jsClient = nc.jetstream();
  }

  private codec = JSONCodec<Complaint>();

  /**
   * Publish message to JetStream to indicate that a new complaint is available from webeoc
   * @param complaint
   */
  async publishComplaintsFromWebEOC(complaint: Complaint): Promise<void> {
    try {
      const msg = this.codec.encode(complaint);
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", complaint.incident_number);
      const ack = await this.jsClient.publish(NATS_NEW_COMPLAINTS_TOPIC_NAME, msg, { headers: natsHeaders });
      if (ack.duplicate) {
        this.logger.debug(
          `Complaint ${complaint.incident_number} has already been published to ${NATS_NEW_COMPLAINTS_TOPIC_NAME}`,
        );
      } else {
        this.logger.debug(`Complaint published: ${complaint.incident_number}`);
      }
    } catch (error) {
      this.logger.error(`Error publishing complaint: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Publish message to JetStream to indicate that a new complaint was added to the staging table
   * @param incident_number
   */
  async publishStagingComplaintInserted(incident_number: string): Promise<void> {
    try {
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", incident_number);
      const ack = await this.jsClient.publish(NEW_STAGING_COMPLAINTS_TOPIC_NAME, incident_number, {
        headers: natsHeaders,
      });

      if (ack.duplicate) {
        this.logger.debug(
          `Complaint ${incident_number} has already been published to ${NEW_STAGING_COMPLAINTS_TOPIC_NAME}`,
        );
      } else {
        this.logger.log(`Complaint ready to be moved to operational tables: ${incident_number}`);
      }
    } catch (error) {
      this.logger.error(`Error saving complaint to staging: ${error.message}`, error.stack);
      throw error;
    }
  }
}
