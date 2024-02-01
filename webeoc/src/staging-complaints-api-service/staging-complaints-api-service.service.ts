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
      this.logger.debug(`API URL: ${apiUrl}`);
      const response = await axios.post(apiUrl, complaintData);
      this.logger.debug(`Staging Complaint API Response: ${response.data}`);
      this.complaintsPublisherService.publishStagingComplaintInserted(
        complaintData.incident_number,
      );
    } catch (error) {
      this.logger.error('Error calling Staging Complaint API:', error);
    }
  }

  async postComplaint(complaintData: Complaint): Promise<void> {
    try {
      const apiUrl = `${process.env.COMPLAINTS_MANAGEMENT_API_URL$}/{COMPLAINT_API_ENDPOINT}`;
      this.logger.debug(`API URL: ${apiUrl}`);
      const response = await axios.post(
        `process.env.COMPLAINTS_MANAGEMENT_API_URL${COMPLAINT_API_ENDPOINT}`,
        complaintData,
      );
      this.logger.debug(`Staging Complaint API Response: ${response.data}`);
    } catch (error) {
      this.logger.error('Error calling Complaint API:', error);
    }
  }
}
