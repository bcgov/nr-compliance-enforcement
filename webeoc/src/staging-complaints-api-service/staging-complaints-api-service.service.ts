import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Complaint } from 'src/types/Complaints';

@Injectable()
export class StagingComplaintsApiClientService {
  private readonly logger = new Logger(StagingComplaintsApiClientService.name);

  async postComplaint(complaintData: Complaint): Promise<void> {
    try {
      const response = await axios.post('http://<staging-complaint-service-url>/staging-complaint', complaintData);
      this.logger.debug(`Staging Complaint API Response: ${response.data}`);
    } catch (error) {
      this.logger.error('Error calling Staging Complaint API:', error);
    }
  }
}
