import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, Subscription } from 'nats';
import {
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
} from 'src/common/constants';
import { StagingComplaintsApiService } from 'src/staging-complaints-api-service/staging-complaints-api-service.service';
import { ComplaintMessage } from 'src/types/Complaints';

@Injectable()
/**
 * Used to subscribe to topics.
 */
export class ComplaintsSubscriberService implements OnModuleInit {
  private natsConnection: NatsConnection;
  private readonly logger = new Logger(ComplaintsSubscriberService.name);
  constructor(private readonly service: StagingComplaintsApiService) {}
  async onModuleInit() {
    try {
      this.natsConnection = await connect({
        servers: process.env.NATS_HOST,
      });
      this.logger.debug(`Connected to NATS ${process.env.NATS_HOST}`);
    } catch (error) {
      this.logger.error('Failed to connect to NATS:', error);
    }
    this.subscribeToNewComplaintsFromWebEOC();
    this.subscribeToNewStagingComplaints();
  }

  /**
   * Listen for new messages on topics indicating that a new complaint was added in WebEOC
   * @returns
   */
  private subscribeToNewComplaintsFromWebEOC(): Subscription {
    const subscription: Subscription = this.natsConnection.subscribe(
      NATS_NEW_COMPLAINTS_TOPIC_NAME,
    );

    (async () => {
      for await (const msg of subscription) {
        try {
          const messageData =
            msg.data instanceof Uint8Array
              ? this.decodeMessage(msg.data)
              : msg.data;
          const messageJson = JSON.parse(messageData);

          const complaintMessage = messageJson as ComplaintMessage;
          this.logger.debug(
            `Received complaint: ${complaintMessage.data.incident_number}`,
          );
          this.service.postComplaintToStaging(complaintMessage.data);
        } catch (error) {
          this.logger.error('Error processing received complaint:', error);
        }
      }
    })().catch((error) => {
      this.logger.error('Error in NATS subscription:', error);
    });
    return subscription;
  }

  /**
   * Listen for new messages to indicate that a new complaint has been added to the staging tables
   * @returns
   */
  private subscribeToNewStagingComplaints(): Subscription {
    const subscription: Subscription = this.natsConnection.subscribe(
      NEW_STAGING_COMPLAINTS_TOPIC_NAME,
    );

    (async () => {
      for await (const msg of subscription) {
        try {
          const messageData =
            msg.data instanceof Uint8Array
              ? this.decodeMessage(msg.data)
              : msg.data;

          const messageJson = JSON.parse(messageData);

          this.logger.debug(`New complaint in staging: ${messageJson.data}`);
          this.service.postComplaint(messageJson.data);
        } catch (error) {
          this.logger.error('Error processing complaint in staging:', error);
        }
      }
    })().catch((error) => {
      this.logger.error('Error in NATS subscription:', error);
    });
    return subscription;
  }

  private decodeMessage(data: Uint8Array): string {
    return new TextDecoder().decode(data);
  }
}
