import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, NatsConnection, StorageType, StringCodec } from "nats";
import { ActionsTakenPublisherService } from "src/publishers/actions-taken-publisher.service";
import { NATS_DURABLE_COMPLAINTS, STREAM_TOPICS, STREAMS } from "src/common/constants";
import { ActionTaken } from "src/types/actions-taken/action-taken";

@Injectable()
export class ActionsTakenSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ActionsTakenSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null;

  constructor(
    // private readonly service: StagingComplaintsApiService,
    // private readonly complaintsPublisherService: ComplaintsPublisherService,
    private readonly _publisher: ActionsTakenPublisherService,
  ) {}

  async onModuleInit() {
    try {
      this.natsConnection = await connect({ servers: process.env.NATS_HOST });
      this.jsm = await this.natsConnection.jetstreamManager();
      await this.setupStream();
      await this.subscribeToTopics();
      this.logger.debug((await this.jsm.streams.info(STREAMS.ACTIONS_TAKEN)).state);
    } catch (error) {
      this.logger.error("Failed to connect to NATS or set up stream:", error);
    }
  }

  private async setupStream(): Promise<void> {
    if (!this.jsm) throw new Error("JetStream Management client is not initialized.");

    const streamConfig = {
      name: STREAMS.ACTIONS_TAKEN,
      subjects: [STREAM_TOPICS.ACTION_TAKEN, STREAM_TOPICS.UPDATE_ACTION_TAKEN],
      storage: StorageType.Memory,
      max_age: 10 * 60 * 60 * 1e9, // 10 minutes in nanoseconds
      duplicateWindow: 10 * 60 * 1e9, // 10 minutes in nanoseconds
    };

    try {
      await this.jsm.streams.add(streamConfig);
      await this.jsm.consumers.add(STREAMS.ACTIONS_TAKEN, {
        ack_policy: AckPolicy.Explicit,
        durable_name: NATS_DURABLE_COMPLAINTS,
      });
      this.logger.debug("Stream and consumer set up successfully");
    } catch (error) {
      this.logger.error("Unable to setup streams and consumers", error);
    }
  }

  private async subscribeToTopics() {
    const sc = StringCodec();
    const consumer = await this.natsConnection
      .jetstream()
      .consumers.get(STREAMS.ACTIONS_TAKEN, NATS_DURABLE_COMPLAINTS);
    const iter = await consumer.consume({ max_messages: 1 });

    for await (const message of iter) {
      const decodedData = sc.decode(message.data);
      try {
        if (message.subject === STREAM_TOPICS.ACTION_TAKEN) {
          await this.handleNewComplaint(message, JSON.parse(decodedData));
        } else if (message.subject === STREAM_TOPICS.UPDATE_ACTION_TAKEN) {
          await this.handleNewComplaint(message, JSON.parse(decodedData));
        }
      } catch (error) {
        this.logger.error(`Error processing message from ${message.subject}`, error);
        message.nak(10_000); // retry in 10 seconds
      }
    }
  }

  private async handleNewComplaint(message, action: ActionTaken) {
    this.logger.debug("Received action-taken:", action?.action_taken_guid);
    const success = await message.ackAck();
    if (success) {
      console.log(success);
      // await this.service.createNewComplaintInStaging(complaintMessage);
      // this.complaintsPublisherService.publishStagingComplaintInsertedMessage(complaintMessage.incident_number);
    }
  }
}
