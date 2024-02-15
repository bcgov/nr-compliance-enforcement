import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect, StringCodec, JetStreamClient, consumerOpts } from 'nats';
import { StagingComplaintsApiService } from '../staging-complaints-api-service/staging-complaints-api-service.service';
import {
  NATS_NEW_COMPLAINTS_TOPIC_NAME,
  NEW_STAGING_COMPLAINTS_TOPIC_NAME,
} from '../common/constants';

@Injectable()
export class ComplaintsSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ComplaintsSubscriberService.name);
  private sc = StringCodec();
  private js: JetStreamClient;

  constructor(private readonly service: StagingComplaintsApiService) {}

  async onModuleInit() {
    const nc = await connect({
      servers: [process.env.NATS_HOST],
    });
    this.js = nc.jetstream();

    await this.setupSubscription(NATS_NEW_COMPLAINTS_TOPIC_NAME);
    await this.setupSubscription(NEW_STAGING_COMPLAINTS_TOPIC_NAME);
  }

  private async setupSubscription(subject: string): Promise<void> {
    // Configure consumer options for a push-based subscription
    const opts = consumerOpts();
    opts.durable(subject.replace('.', '_') + '_durable');
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverAll();
    opts.filterSubject(subject);

    // Subscribe to the subject using the configured options
    const sub = await this.js.subscribe(subject, opts);

    (async () => {
      for await (const msg of sub) {
        try {
          const data = this.sc.decode(msg.data);
          const parsedData = JSON.parse(data);
          this.logger.debug(`Received message: ${parsedData}`);
          // Process the message here
          msg.ack(); // Acknowledge the message
        } catch (error) {
          this.logger.error(`Error processing message from ${subject}:`, error);
          // Optionally negatively acknowledge the message here if needed
        }
      }
    })().catch((error) => {
      this.logger.error('Subscription error:', error);
    });
  }
}
