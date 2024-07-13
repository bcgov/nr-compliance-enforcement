import { Injectable, Logger } from "@nestjs/common";
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

  publishAction = async (action: ActionTaken): Promise<void> => {
    try {
      const msg = this.codec.encode(action);
      const natsHeaders = headers(); // used to look for complaints that have already been submitted
      natsHeaders.set("Nats-Msg-Id", `staged-${action.action_taken_guid}-${action.action_datetime}`);
      const ack = await this.jsClient.publish(STREAM_TOPICS.ACTION_TAKEN, msg, { headers: natsHeaders });
      if (!ack.duplicate) {
        this.logger.debug(`New action-taken: ${action.action_taken_guid}`);
      } else {
        this.logger.debug(`Action-taken already published: ${action.action_taken_guid}`);
      }
    } catch (error) {
      this.logger.error(`Error publishing action-taken: ${error.message}`, error.stack);
      throw error;
    }
  };
}
