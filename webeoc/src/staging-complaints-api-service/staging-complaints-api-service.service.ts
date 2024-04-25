import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { STAGING_API_ENDPOINT } from "../common/constants";
import { ComplaintsPublisherService } from "../complaints-publisher/complaints-publisher.service";
import { Complaint } from "../types/Complaints";

@Injectable()
export class StagingComplaintsApiService {
  private readonly logger = new Logger(StagingComplaintsApiService.name);
  private readonly _apiConfig = {
    headers: {
      "x-api-key": process.env.COMPLAINTS_API_KEY,
    },
  };

  constructor(private readonly complaintsPublisherService: ComplaintsPublisherService) {}

  // add complaint data to staging table
  async postComplaintToStaging(complaintData: Complaint): Promise<void> {
    try {
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${STAGING_API_ENDPOINT}`;
      this.logger.debug(`Posting new complaint to staging. API URL: ${apiUrl}`);

      const response = await axios.post(apiUrl, complaintData, this._apiConfig);
      this.logger.debug(`Staging Complaint API Response: ${response.data}`);
      this.complaintsPublisherService.publishStagingComplaintInserted(complaintData.incident_number);
    } catch (error) {
      this.logger.error("Error calling Staging Complaint API:", error);
    }
  }

  // create complaint based on complaint data in the staging table
  async postComplaint(complaint_identifier: string): Promise<void> {
    try {
      this.logger.debug("Creating new complaint based on new complaint from webeoc.");
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/staging-complaint/process/${complaint_identifier}`;
      this.logger.debug(`Posting new complaint. API URL: ${apiUrl}`);

      await axios.post(apiUrl, {}, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling Complaint API:", error);
    }
  }
}
