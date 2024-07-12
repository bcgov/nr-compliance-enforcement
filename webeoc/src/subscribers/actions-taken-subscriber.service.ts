import { Injectable, Logger } from "@nestjs/common";
import { connect, headers, JetStreamClient, JSONCodec } from "nats";

@Injectable()
export class ActionsTakenSubscriberService {
  private jsClient: JetStreamClient;
  private readonly logger = new Logger(ActionsTakenSubscriberService.name);

  constructor() {
    this.initializeNATS();
  }

  private async initializeNATS() {
    const nc = await connect({
      servers: [process.env.NATS_HOST],
    });
    this.jsClient = nc.jetstream();
  }
}
