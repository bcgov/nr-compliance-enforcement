import { Injectable, Logger } from "@nestjs/common";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";
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

  publishAction = async (action: ActionTaken): Promise<void> => {
    console.log("PUBLISH_ACTION: ", action);
  };
}
