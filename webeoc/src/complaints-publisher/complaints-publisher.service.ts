import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { NATS_NEW_COMPLAINTS_TOPIC_NAME } from 'src/common/constants';
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

  async publishComplaint(complaint: Complaint): Promise<void> {
    try {
      const message = {
        id: complaint.incident_number, // complaint identifier - we use this as the id so that we don't get the same complaint added to the topic multiple times
        data: complaint,
      };

      this.client.emit(NATS_NEW_COMPLAINTS_TOPIC_NAME, message);
      this.logger.log(`Complaint published: ${JSON.stringify(complaint)}`);
    } catch (error) {
      this.logger.error(
        `Error publishing complaint: ${error.message}`,
        error.stack,
      );
      throw error; // Re-throw the error for further handling if necessary
    }
  }
}
