import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  COMPLAINT_API_ENDPOINT,
  STAGING_API_ENDPOINT,
} from 'src/common/constants';
import { ComplaintsPublisherService } from 'src/complaints-publisher/complaints-publisher.service';
import { Complaint } from 'src/types/Complaints';

@Injectable()
export class StagingComplaintsApiService {
  private readonly logger = new Logger(StagingComplaintsApiService.name);
  constructor(
    private readonly complaintsPublisherService: ComplaintsPublisherService,
  ) {}

  async postComplaintToStaging(complaintData: Complaint): Promise<void> {
    try {
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/${STAGING_API_ENDPOINT}`;
      this.logger.debug(`Posting new complaint to staging. API URL: ${apiUrl}`);

      // Include the API key in the request headers
      const config = {
        headers: {
          'x-api-key': process.env.COMPLAINTS_API_KEY, // Ensure this environment variable is set
        },
      };

      const response = await axios.post(apiUrl, complaintData, config);
      this.logger.debug(`Staging Complaint API Response: ${response.data}`);
      this.complaintsPublisherService.publishStagingComplaintInserted(
        complaintData.incident_number,
      );
    } catch (error) {
      this.logger.error('Error calling Staging Complaint API:', error);
    }
  }

  async postComplaint(complaint_identifier: string): Promise<void> {
    try {
      this.logger.debug(
        'Creating new complaint based on new complaint from webeoc.',
      );
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL}/staging-complaint/process/${complaint_identifier}`;
      this.logger.debug(`Posting new complaint. API URL: ${apiUrl}`);

      // Include the API key in the request headers
      const config = {
        headers: {
          'x-api-key': process.env.COMPLAINTS_API_KEY, // Ensure this environment variable is set
        },
      };

      const response = await axios.post(apiUrl, {}, config);
      this.logger.debug(`Staging Complaint API Response: ${response.data}`);
    } catch (error) {
      this.logger.error('Error calling Complaint API:', error);
    }
  }
}
