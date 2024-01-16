import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Complaint } from 'src/types/Complaints';

@Injectable()
export class ComplaintsService {
  private client: ClientProxy;

  private readonly logger = new Logger(ComplaintsService.name);

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: ['nats://localhost:4222'],
      },
    });
  }

  async publishComplaint(complaint: Complaint): Promise<void> {
    const topic = 'complaint';
    try {
      const message = {
        id: complaint.incident_number, // Generate a unique identifier
        data: complaint,
      };

      this.client.emit(topic, message);
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
