import { Inject, Injectable, Logger } from "@nestjs/common";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
import { StreamTopic, EventVerbType, eventVerbs, EVENT_STREAM_NAME } from "../../common/nats_constants";
import { REQUEST } from "@nestjs/core";
import { getUserAuthGuidFromRequest } from "../../common/get-idir-from-request";
import { get } from "src/external_api/shared_data";
import { FeatureFlagService } from "../feature_flag/feature_flag.service";

interface EventCreateInput {
  eventVerbTypeCode: string;
  sourceId?: string;
  sourceEntityTypeCode?: string;
  actorId: string;
  actorEntityTypeCode: string;
  targetId: string;
  targetEntityTypeCode: string;
  content?: any;
}

@Injectable()
export class EventPublisherService {
  private jsClient: JetStreamClient;
  private readonly logger = new Logger(EventPublisherService.name);

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  private async initializeNATS() {
    const nc = await connect({
      servers: [process.env.NATS_HOST],
      waitOnFirstConnect: true,
    });
    this.jsClient = nc.jetstream();
  }

  private readonly _getAllCaseFilesByComplaint = async (id: string, token: string) => {
    try {
      //-- Get the Outcome Data, this is done via a GQL call to prevent
      //-- a circular dependency between the complaint and case_file modules
      const { data, errors } = await get(token, {
        query: `{caseFilesByActivityIds (activityIdentifiers: ["${id}"]) {
        caseIdentifier
      }}`,
      });
      if (errors) {
        this.logger.error(`GraphQL errors for complaint ${id}:`, JSON.stringify(errors, null, 2));
        throw new Error("GraphQL errors occurred while fetching case files for the complaint.");
      }
      const { caseFilesByActivityIds } = data;
      return caseFilesByActivityIds || [];
    } catch (error) {
      this.logger.error(
        `An error occurred while getting case files for complaint ${id}`,
        JSON.stringify(error, null, 2),
      );
    }
  };

  /**
   * Publish an event to NATS, if it has not already been published.
   * The logic of handling the event is handled in the subscribers to the NATS topic.
   */
  _publishEvent = async (event: EventCreateInput, eventTopic: StreamTopic): Promise<void> => {
    // Ensure NATS connection is initialized before publishing
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
      const header = `[${eventTopic}]: ${sourceEntityTypeCode} ${sourceId} ${eventVerbTypeCode} ${targetEntityTypeCode} ${targetId} by ${actorEntityTypeCode} ${actorId}`;

      const payload = codec.encode(event);
      const natsHeaders = headers();
      natsHeaders.set("Nats-Msg-Id", header);
      const ack = await this.jsClient.publish(eventTopic, payload, { headers: natsHeaders });
      if (ack.duplicate) {
        this.logger.debug(`Event already published: ${header}`);
      } else {
        this.logger.debug(`Publishing new event: ${header}}`);
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
    }
  };

  publishComplaintStatusChangeEvents = async (
    sourceId: string,
    status: string,
    complaintType: string,
    token: string,
  ): Promise<void> => {
    // Only publish if cases are active
    const casesActive = await this.featureFlagService.checkActiveForAnyAgency("CASES");
    if (!casesActive) {
      // Don't publish if cases are not active
      return;
    }
    if (!this.jsClient) {
      await this.initializeNATS();
    }
    let eventStatus = status === "OPEN" ? "OPENED" : status;

    if (eventVerbs.includes(eventStatus.toUpperCase() as EventVerbType)) {
      try {
        const eventTopic = `${EVENT_STREAM_NAME}.complaint.${eventStatus.toLowerCase()}`;

        /**
         * Complaints can be a part of multiple cases, so when opening or closing a complaint,
         * fetch all cases it is a part of and create the events for each of them.
         */
        const caseFiles = await this._getAllCaseFilesByComplaint(sourceId, token);

        for (const caseFile of caseFiles) {
          const event: EventCreateInput = {
            eventVerbTypeCode: eventStatus,
            sourceId: sourceId,
            sourceEntityTypeCode: "COMPLAINT",
            actorId: getUserAuthGuidFromRequest(this.request),
            actorEntityTypeCode: "USER",
            targetId: caseFile.caseIdentifier,
            targetEntityTypeCode: "CASE",
            content: { complaintType },
          };
          this._publishEvent(event, eventTopic);
        }
      } catch (error) {
        this.logger.error(`An error occurred while publishing the status change for complaint ${sourceId}`, error);
      }
    }
  };
}
