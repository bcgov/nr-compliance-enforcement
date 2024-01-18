import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, Subscription } from 'nats';
import { NATS_NEW_COMPLAINTS_TOPIC_NAME } from 'src/common/constants';

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private natsConnection: NatsConnection;
  private readonly logger = new Logger(ComplaintsSubscriberService.name);

  async onModuleInit() {
    try {
      this.natsConnection = await connect({
        servers: process.env.NATS_HOST,
      });
      this.logger.debug(`Connected to NATS ${process.env.NATS_HOST}`);
    } catch (error) {
      this.logger.error('Failed to connect to NATS:', error);
    }
    this.subscribeToComplaints();
  }

  private subscribeToComplaints(): Subscription {
    const subscription: Subscription = this.natsConnection.subscribe(
      NATS_NEW_COMPLAINTS_TOPIC_NAME,
    );

    (async () => {
      for await (const msg of subscription) {
        this.logger.debug(`Received complaint: ${msg}`);
      }
    })().catch((error) => {
      this.logger.error('Error in NATS subscription:', error);
    });

    return subscription;
  }
}
