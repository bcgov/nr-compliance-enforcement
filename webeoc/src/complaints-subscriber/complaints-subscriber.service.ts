import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, Subscription } from 'nats';
import { NATS_NEW_COMPLAINTS_TOPIC_NAME } from 'src/common/constants';

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private natsConnection: NatsConnection;

  async onModuleInit() {
    try {
      this.natsConnection = await connect({
        servers: 'nats://localhost:4222',
      });
      console.log('Connected to NATS');
    } catch (error) {
      console.error('Failed to connect to NATS:', error);
    }
    this.subscribeToComplaints();
  }

  private subscribeToComplaints(): Subscription {
    const subscription: Subscription = this.natsConnection.subscribe(
      NATS_NEW_COMPLAINTS_TOPIC_NAME,
    );

    (async () => {
      for await (const msg of subscription) {
        console.log(`Received complaint: ${msg}`);
      }
    })().catch((error) => {
      console.error('Error in NATS subscription:', error);
    });

    return subscription;
  }
}
