import { Injectable, Logger } from "@nestjs/common";
import { UUID } from "node:crypto";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
import { STREAM_TOPICS } from "src/common/constants";
import { ActionTaken } from "src/types/actions-taken/action-taken";
import { ActionTakenPayload } from "src/types/actions-taken/action-taken-payload";

@Injectable()
export class ActionsTakenPublisherService {
  private jsClient: JetStreamClient;
  private readonly logger = new Logger(ActionsTakenPublisherService.name);

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

  private _generateHeader = (intro: string, action: ActionTaken, type: string): string => {
    const { action_taken_guid, dataid, fk_table_345, fk_table_346, action_datetime } = action;
    const webeocId = type === "ACTION-TAKEN" ? fk_table_345 : fk_table_346;
    const header = `${intro}: [${action_taken_guid}] - dataid-${dataid} webeocid-${webeocId} created-${action_datetime}`;

    return header;
  };

  //--
  //-- Adds a message to nats to send an action taken to the
  //-- NatCom backend in order to stage an action-taken
  //-- The action-taken is the payload that will be sent to the NatCom backend
  //--
  publishStagedActionTaken = async (action: ActionTaken): Promise<void> => {
    const codec = JSONCodec<ActionTaken>();

    try {
      const msg = codec.encode(action);
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", this._generateHeader("stage-new-action-taken", action, "ACTION-TAKEN"));

      const ack = await this.jsClient.publish(STREAM_TOPICS.STAGE_ACTION_TAKEN, msg, { headers: natsHeaders });
      if (!ack.duplicate) {
        this.logger.debug(
          `Publishing new action taken for staging: ${this._generateHeader(
            "stage-new-action-taken",
            action,
            "ACTION-TAKEN",
          )}`,
        );
      } else {
        this.logger.debug(
          `Action taken already published: ${this._generateHeader("stage-new-action-taken", action, "ACTION-TAKEN")}`,
        );
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };

  publishStagedActionTakenUpdate = async (action: ActionTaken): Promise<void> => {
    const codec = JSONCodec<ActionTaken>();

    try {
      const msg = codec.encode(action);
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set(
        "Nats-Msg-Id",
        `${this._generateHeader("stage-new-action-taken-update", action, "ACTION-TAKEN-UPDATE")}`,
      );
      const ack = await this.jsClient.publish(STREAM_TOPICS.STAGE_UPDATE_ACTION_TAKEN, msg, { headers: natsHeaders });

      if (!ack.duplicate) {
        this.logger.debug(
          `Publishing new action taken update for staging: ${this._generateHeader(
            "stage-new-action-taken-update",
            action,
            "ACTION-TAKEN-UPDATE",
          )}`,
        );
      } else {
        this.logger.debug(
          `Action taken already published: ${this._generateHeader(
            "stage-new-action-taken-update",
            action,
            "ACTION-TAKEN-UPDATE",
          )}`,
        );
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };

  //--
  //-- Adds a message to the nats message queue to send a request to the
  //-- NatCom backend to convert a staged action-taken to an actual action-taken
  //-- the id thats used is the unique identifier for the action-taken due to the lack of
  //-- complaint-id at this point
  //--
  publishActionTaken = async (guid: UUID, id: string, action: ActionTaken): Promise<void> => {
    const codec = JSONCodec<ActionTakenPayload>();

    try {
      const { dataid } = action;
      const payload: ActionTakenPayload = { dataid, webeocId: id };

      const msg = codec.encode(payload);

      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", `${this._generateHeader("promote-action-taken", action, "ACTION-TAKEN")}`);

      const ack = await this.jsClient.publish(STREAM_TOPICS.ACTION_TAKEN, msg, {
        headers: natsHeaders,
      });

      if (!ack.duplicate) {
        this.logger.debug(
          `Action taken ready to be moved to operational tables: ${this._generateHeader(
            "promote-action-taken",
            action,
            "ACTION-TAKEN",
          )}`,
        );
      } else {
        this.logger.debug(
          `Action taken already moved to operational tables: ${this._generateHeader(
            "promote-action-taken",
            action,
            "ACTION-TAKEN",
          )}`,
        );
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };

  publishActionTakenUpdate = async (guid: UUID, id: string, action: ActionTaken): Promise<void> => {
    const codec = JSONCodec<ActionTakenPayload>();

    try {
      const { dataid } = action;
      const payload: ActionTakenPayload = { dataid, webeocId: id };

      const msg = codec.encode(payload);

      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set(
        "Nats-Msg-Id",
        `${this._generateHeader("promote-action-taken-update", action, "ACTION-TAKEN-UPDATE")}`,
      );
      const ack = await this.jsClient.publish(STREAM_TOPICS.UPDATE_ACTION_TAKEN, msg, {
        headers: natsHeaders,
      });

      if (!ack.duplicate) {
        this.logger.debug(
          `Action taken update ready to be moved to operational tables: ${this._generateHeader(
            "promote-action-taken-update",
            action,
            "ACTION-TAKEN-UPDATE",
          )}`,
        );
      } else {
        this.logger.debug(
          `Action taken already moved to operational tables: ${this._generateHeader(
            "promote-action-taken-update",
            action,
            "ACTION-TAKEN-UPDATE",
          )}`,
        );
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };
}
