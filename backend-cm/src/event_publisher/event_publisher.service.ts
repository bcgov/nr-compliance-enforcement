import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
import {
  EventEntityTypeCodes,
  StreamTopic,
  EventVerbType,
  eventVerbs,
  EVENT_STREAM_NAME,
} from "../common/nats_constants";
import { EventCreateInput } from "../shared/event/dto/event";
import { CaseFileService } from "../shared/case_file/case_file.service";
import { UserService } from "../common/user.service";

@Injectable()
export class EventPublisherService {
  private jsClient: JetStreamClient;
  private readonly logger = new Logger(EventPublisherService.name);

  constructor(
    @Inject(forwardRef(() => CaseFileService))
    private readonly caseFileService: CaseFileService,
    private readonly userService: UserService,
  ) {}

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
  publishEvent = async (event: EventCreateInput, eventType: StreamTopic): Promise<void> => {
    if (!this.jsClient) {
      await this.initializeNATS();
    }

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
      if (ack.duplicate) {
        this.logger.debug(`Event already published: ${header}`);
      } else {
        this.logger.debug(`Publishing new event: ${header}}`);
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
    }
  };

  publishActivityStatusChangeEvents = async (
    sourceEntityType: EventEntityTypeCodes,
    sourceId: string,
    status: string,
  ): Promise<void> => {
    // Ensure NATS connection is initialized before publishing
    if (!this.jsClient) {
      await this.initializeNATS();
    }

    let eventStatus = status === "OPEN" ? "OPENED" : status;

    if (eventVerbs.includes(eventStatus.toUpperCase() as EventVerbType)) {
      try {
        const eventTopic = `${EVENT_STREAM_NAME}.${sourceEntityType.toLowerCase()}.${eventStatus.toLowerCase()}`;

        /**
         * Some activities can be a part of multiple cases, so when opening or closing an activity,
         * fetch all cases it is a part of and create the events for each of them.
         */
        const caseFiles = await this.caseFileService.findCaseFilesByActivityIds([sourceId]);

        for (const caseFile of caseFiles) {
          const event: EventCreateInput = {
            eventVerbTypeCode: eventStatus,
            sourceId: sourceId,
            sourceEntityTypeCode: sourceEntityType,
            actorId: this.userService.getUserGuid(),
            actorEntityTypeCode: "USER",
            targetId: caseFile.caseIdentifier,
            targetEntityTypeCode: "CASE",
          };
          this.publishEvent(event, eventTopic);
        }
      } catch (error) {
        this.logger.error(
          `An error occurred while publishing the status change for ${sourceEntityType} ${sourceId}`,
          error,
        );
      }
    }
  };
}
