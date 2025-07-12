import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { STAGING_API_ENDPOINT_CREATES, STAGING_API_ENDPOINT_UPDATES } from "../common/constants";
import { Complaint } from "../types/complaint-type";
import { ComplaintUpdate } from "src/types/complaint-update-type";

@Injectable()
export class StagingComplaintsApiService {
  private readonly logger = new Logger(StagingComplaintsApiService.name);
  private readonly _apiConfig = {
    headers: {
      "x-api-key": process.env.COMPLAINTS_API_KEY,
    },
  };

  // add complaint data to staging table
  async createNewComplaintInStaging(complaintData: Complaint): Promise<void> {
    try {
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${STAGING_API_ENDPOINT_CREATES}`;
      this.logger.debug(`Posting new complaint ${complaintData.incident_number} to staging. API URL: ${apiUrl}`);

      await axios.post(apiUrl, complaintData, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling Staging Complaint API:", error);
      throw error;
    }
  }

  // add complaint update data to staging table
  async createUpdateComplaintInStaging(complaintData: ComplaintUpdate): Promise<void> {
    try {
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${STAGING_API_ENDPOINT_UPDATES}`;
      this.logger.debug(
        `Posting new complaint update ${complaintData.parent_incident_number} to staging. API URL: ${apiUrl}`,
      );

      await axios.post(apiUrl, complaintData, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling Staging Complaint Update API:", error);
      throw error;
    }
  }

  // create complaint based on complaint data in the staging table
  async createComplaintFromStaging(complaint_identifier: string): Promise<void> {
    try {
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/staging-complaint/process/${complaint_identifier}`;
      this.logger.debug(`Moving complaint ${complaint_identifier} from staging to live tables. API URL: ${apiUrl}`);

      await axios.post(apiUrl, {}, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling Complaint API:", error);
      throw error;
    }
  }

  // create complaint update based on complaint data in the staging table
  async createComplaintUpdateFromStaging(complaint_identifier: string, update_number: string): Promise<void> {
    try {
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/staging-complaint/process/${complaint_identifier}/${update_number}`;
      this.logger.debug(`Moving complaint ${complaint_identifier} from staging to live tables. API URL: ${apiUrl}`);

      await axios.post(apiUrl, {}, this._apiConfig);
    } catch (error) {
      this.logger.error("Error calling Complaint API:", error);
      throw error;
    }
  }
}
