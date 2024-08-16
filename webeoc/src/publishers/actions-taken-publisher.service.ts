import { Injectable, Logger } from "@nestjs/common";
import { UUID } from "crypto";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
import { STREAM_TOPICS } from "src/common/constants";
import { ActionTaken } from "src/types/actions-taken/action-taken";

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
    });
    this.jsClient = nc.jetstream();
  }

  private codec = JSONCodec<ActionTaken>();

  //--
  //-- Adds a message to nats to send an action taken to the
  //-- NatCom backend in order to stage an action-taken
  //-- The action-taken is the payload that will be sent to the NatCom backend
  //--
  publishStagedActionTaken = async (action: ActionTaken): Promise<void> => {
    try {
      const msg = this.codec.encode(action);
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", `action-taken-staging-${action.action_taken_guid}-${action.action_datetime}`);
      const ack = await this.jsClient.publish(STREAM_TOPICS.STAGE_ACTION_TAKEN, msg, { headers: natsHeaders });
      if (!ack.duplicate) {
        this.logger.debug(`Action-taken ready to be added to staging table: ${action.action_taken_guid}`);
      } else {
        this.logger.debug(`Action-taken already added to staging table: ${action.action_taken_guid}`);
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };

  publishStagedActionTakenUpdate = async (action: ActionTaken): Promise<void> => {
    try {
      const msg = this.codec.encode(action);
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set(
        "Nats-Msg-Id",
        `action-taken-update-staging-${action.action_taken_guid}-${action.action_datetime}`,
      );
      const ack = await this.jsClient.publish(STREAM_TOPICS.STAGE_UPDATE_ACTION_TAKEN, msg, { headers: natsHeaders });
      if (!ack.duplicate) {
        this.logger.debug(`Action-taken-update ready to be added to staging table: ${action.action_taken_guid}`);
      } else {
        this.logger.debug(`Action-taken-update already added to staging table: ${action.action_taken_guid}`);
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
  publishActionTaken = async (guid: UUID, id: string): Promise<void> => {
    try {
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", `action-taken-process-${guid}-${id}`);
      const ack = await this.jsClient.publish(STREAM_TOPICS.ACTION_TAKEN, id, {
        headers: natsHeaders,
      });

      if (!ack?.duplicate) {
        this.logger.debug(`Action-taken ready to be moved to action-taken table: ${id}`);
      } else {
        this.logger.debug(`Action-taken already added to action-taken table: ${id}`);
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };

  publishActionTakenUpdate = async (guid: UUID, id: string): Promise<void> => {
    try {
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", `action-taken-update-process-${guid}-${id}`);
      const ack = await this.jsClient.publish(STREAM_TOPICS.UPDATE_ACTION_TAKEN, id, {
        headers: natsHeaders,
      });

      if (!ack?.duplicate) {
        this.logger.debug(`Action-taken-update ready to be moved to action-taken table: ${id}`);
      } else {
        this.logger.debug(`Action-taken-update already added to action-taken table: ${id}`);
      }
    } catch (error) {
      this.logger.error(`Unable to process request: ${error.message}`, error.stack);
      throw error;
    }
  };
}
