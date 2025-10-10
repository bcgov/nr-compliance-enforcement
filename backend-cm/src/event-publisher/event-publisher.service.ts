import { Injectable, Logger } from "@nestjs/common";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
import { StreamTopics } from "../common/nats_constants";
import { EventCreateInput } from "../shared/event/dto/event";

@Injectable()
export class EventPublisherService {
  private jsClient: JetStreamClient;
  private readonly logger = new Logger(EventPublisherService.name);

  constructor() {
    this.initializeNATS();
  }

  private async initializeNATS() {
    const nc = await connect({
      servers: [process.env.NATS_HOST],
      waitOnFirstConnect: true,
    });
    this.jsClient = nc.jetstream();
  }

  /**
   * Publish an event to NATS, if it has not already been published.
   * The logic of handling the event is handled in the subscribers to the NATS topic.
   */
  publishEvent = async (event: EventCreateInput, eventType: StreamTopics): Promise<void> => {
    const codec = JSONCodec<EventCreateInput>();

    try {
      const {
        eventVerbTypeCode,
        sourceId,
        sourceEntityTypeCode,
        actorId,
        actorEntityTypeCode,
        targetId,
        targetEntityTypeCode,
      } = event;
      const header = `[${eventType}]: ${sourceEntityTypeCode} ${sourceId} ${eventVerbTypeCode} ${targetEntityTypeCode} ${targetId} by ${actorEntityTypeCode} ${actorId}`;

      const payload = codec.encode(event);
      const natsHeaders = headers();
      natsHeaders.set("Nats-Msg-Id", header);

      const ack = await this.jsClient.publish(eventType, payload, { headers: natsHeaders });
      if (!ack.duplicate) {
        this.logger.debug(`Publishing new event: ${header}}`);
      } else {
        this.logger.debug(`Event already published: ${header}`);
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };
}
