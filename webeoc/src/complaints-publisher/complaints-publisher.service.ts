import { Injectable, Logger } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { connect, StringCodec } from 'nats';
import {
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
} from '../common/constants';
import { Complaint } from 'src/types/Complaints';

@Injectable()
export class ComplaintsPublisherService {
  private client: any; // Use `any` or the specific type for JetStream clients
  private readonly logger = new Logger(ComplaintsPublisherService.name);
  private js: any; // JetStream client
  private sc = StringCodec();

  constructor() {
    this.initializeJetStream().catch((error) =>
      this.logger.error('Error initializing JetStream:', error),
    );
  }

  private async initializeJetStream() {
    const nc = await connect({
      servers: [process.env.NATS_HOST],
    });
    this.js = nc.jetstream();

    this.client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_HOST],
      },
    });
  }

  /**
   * Publish message to topic to indicate that a new complaint is available from webeoc
   * @param complaint
   */
  async publishComplaintsFromWebEOC(complaint: Complaint): Promise<void> {
    try {
      const message = this.sc.encode(JSON.stringify(complaint));
      await this.js.publish(NATS_NEW_COMPLAINTS_TOPIC_NAME, message);
      this.logger.log(`Complaint published: ${complaint.incident_number}`);
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
    complaint_identifier: string,
  ): Promise<void> {
    try {
      await this.js.publish(
        NEW_STAGING_COMPLAINTS_TOPIC_NAME,
        complaint_identifier,
      );
      this.logger.log(
        `Complaint ready to be moved to operational tables: ${complaint_identifier}`,
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
