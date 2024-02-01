import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
} from 'src/common/constants';
import { Complaint } from 'src/types/Complaints';

@Injectable()
export class ComplaintsPublisherService {
  private client: ClientProxy;

  private readonly logger = new Logger(ComplaintsPublisherService.name);

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_HOST],
      },
    });
  }

  /**
   * Publish meessage to topic to indicate that a new complaint is available from webeoc
   * @param complaint
   */
  async publishComplaintsFromWebEOC(complaint: Complaint): Promise<void> {
    try {
      const message = {
        id: complaint.incident_number, // complaint identifier - we use this as the id so that we don't get the same complaint added to the topic multiple times
        complaintData: complaint,
      };

      this.client.emit(NATS_NEW_COMPLAINTS_TOPIC_NAME, message);
      this.logger.log(`Complaint published: ${JSON.stringify(complaint)}`);
    } catch (error) {
      this.logger.error(
        `Error publishing complaint: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   *
   * @param incident_number Publish message to topic to indicate that a new complaint was added to the staging table and is ready to be moved to the operation complaints tables
   */
  async publishStagingComplaintInserted(
    incident_number: string,
  ): Promise<void> {
    try {
      this.client.emit(NEW_STAGING_COMPLAINTS_TOPIC_NAME, incident_number);
      this.logger.log(
        `Complaint ready to be moved to operational tables: ${incident_number}`,
      );
    } catch (error) {
      this.logger.error(
        `Error saving complaint to staging: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
