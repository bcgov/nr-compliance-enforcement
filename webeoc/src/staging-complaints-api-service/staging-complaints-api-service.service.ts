import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Complaint } from 'src/types/Complaints';

@Injectable()
export class StagingComplaintsApiService {
  private readonly logger = new Logger(StagingComplaintsApiService.name);

  async postComplaint(complaintData: Complaint): Promise<void> {
    try {
      const response = await axios.post(
        process.env.COMPLAINTS_MANAGEMENT_API_URL,
        complaintData,
      );
      this.logger.debug(`Staging Complaint API Response: ${response.data}`);
    } catch (error) {
      this.logger.error('Error calling Staging Complaint API:', error);
    }
  }
}
