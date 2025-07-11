import { Injectable, Logger } from "@nestjs/common";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
import { STREAM_TOPICS } from "../common/constants";
import { Complaint } from "src/types/complaint-type";
import { ComplaintUpdate } from "src/types/complaint-update-type";

@Injectable()
export class ComplaintsPublisherService {
  private jsClient: JetStreamClient;
  private readonly logger = new Logger(ComplaintsPublisherService.name);

  constructor() {
    this.initializeNATS();
  }

  private async initializeNATS() {
    try {
      const nc = await connect({
        servers: [process.env.NATS_HOST],
        waitOnFirstConnect: true,
      });
      this.jsClient = nc.jetstream();
      this.logger.debug("jetstream client created", this.jsClient);
    } catch (error) {
      this.logger.error(`Error connecting to NATS: ${error.message}`, error);
    }
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
      natsHeaders.set("Nats-Msg-Id", `staged-${complaint.incident_number}-${complaint.created_by_datetime}`);
      const ack = await this.jsClient.publish(STREAM_TOPICS.COMPLAINTS, msg, { headers: natsHeaders });
      if (!ack.duplicate) {
        this.logger.debug(`Publishing new complaint for staging: ${complaint.incident_number}`);
      } else {
        this.logger.debug(`Complaint already published: ${complaint.incident_number}`);
      }
    } catch (error) {
      this.logger.error(`Error publishing complaint: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Publish message to JetStream to indicate that a complaint update is available from webeoc
   * @param complaint
   */
  async publishComplaintUpdatesFromWebEOC(complaintUpdate: ComplaintUpdate): Promise<void> {
    try {
      const jsonData = JSON.stringify(complaintUpdate);
      const incidentNumber = complaintUpdate.parent_incident_number;
      const updateNumber = complaintUpdate.update_number;
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set(
        "Nats-Msg-Id",
        `staged-update-${incidentNumber}-${updateNumber}-${complaintUpdate.back_number_of_days}-${complaintUpdate.back_number_of_hours}-${complaintUpdate.back_number_of_minutes}`,
      );
      const ack = await this.jsClient.publish(STREAM_TOPICS.COMPLAINT_UPDATE, jsonData, { headers: natsHeaders });
      if (!ack.duplicate) {
        this.logger.debug(`Publishing new complaint update for staging: ${incidentNumber} ${updateNumber}`);
      } else {
        this.logger.debug(`Complaint update already published: ${incidentNumber}`);
      }
    } catch (error) {
      this.logger.error(`Error publishing complaint update: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Publish message to JetStream to indicate that a new complaint was added to the staging table
   * @param incident_number
   */
  async publishStagingComplaintInsertedMessage(incident_number: string): Promise<void> {
    try {
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", `complaint-${incident_number}`);
      const ack = await this.jsClient.publish(STREAM_TOPICS.STAGING_COMPLAINTS, incident_number, {
        headers: natsHeaders,
      });

      if (!ack?.duplicate) {
        this.logger.debug(`Complaint ready to be moved to operational tables: ${incident_number}`);
      } else {
        this.logger.debug(`Complaint already moved to operational tables: ${incident_number}`);
      }
    } catch (error) {
      this.logger.error(`Error saving complaint to staging: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Publish message to JetStream to indicate that a new complaint update was added to the staging table
   * @param incident_number
   */
  async publishStagingComplaintUpdateInsertedMessage(complaintUpdate: ComplaintUpdate): Promise<void> {
    const jsonData = JSON.stringify(complaintUpdate);
    const incidentNumber = complaintUpdate.parent_incident_number;
    const updateNumber = complaintUpdate.update_number;
    const backNumberOfDays = complaintUpdate.back_number_of_days;
    const backNumberOfHours = complaintUpdate.back_number_of_hours;
    const backNumberOfMinutes = complaintUpdate.back_number_of_minutes;

    try {
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set(
        "Nats-Msg-Id",
        `complaint-${incidentNumber}-update-${updateNumber}-${backNumberOfDays}-${backNumberOfHours}-${backNumberOfMinutes}`,
      );
      const ack = await this.jsClient.publish(STREAM_TOPICS.STAGING_COMPLAINT_UPDATE, jsonData, {
        headers: natsHeaders,
      });

      if (!ack?.duplicate) {
        this.logger.debug(
          `Complaint update ready to be moved to operational tables: ${incidentNumber} ${updateNumber}`,
        );
      } else {
        this.logger.debug(`Complaint update already moved to operational tables: ${incidentNumber} ${updateNumber}`);
      }
    } catch (error) {
      this.logger.error(`Error saving complaint update to staging: ${error.message}`, error.stack);
      throw error;
    }
  }
}
