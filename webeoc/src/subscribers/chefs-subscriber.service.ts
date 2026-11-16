import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  AckPolicy,
  connect,
  ConnectionOptions,
  JetStreamManager,
  JsMsg,
  NatsConnection,
  nkeyAuthenticator,
  StringCodec,
} from "nats";
import { connect as connectWebSocket } from "nats.ws";
import Cryptr = require("cryptr");
import { CHEFS_DURABLE_FORMS, STREAM_TOPICS, STREAMS } from "../common/constants";
import { ChefsEventMessage } from "src/types/chefs/chefs-event-type";
import { ComplaintsPublisherService } from "src/publishers/complaints-publisher.service";
import { Complaint } from "src/types/complaint-type";

@Injectable()
export class ChefsSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ChefsSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null;

  constructor(private readonly complaintsPublisherService: ComplaintsPublisherService) {}

  async onModuleInit() {
    try {
      this.natsConnection = await this.connectToChefs();
      // TODO: remove temp debugging
      console.log("Attempting to connect to NATS");
      this.jsm = await this.natsConnection.jetstreamManager();
      console.log("Connected to NATS");
      await this.setupConsumer();
      await this.subscribeToTopics();
    } catch (error) {
      this.logger.error("Failed to connect to CHEFS NATS or set up consumer:", error);
    }
  }

  // Hosted ESS only accepts websocket connections with nkey auth; local CHEFS uses NATS protocol with user/password.
  private async connectToChefs(): Promise<NatsConnection> {
    const options: ConnectionOptions = {
      servers: process.env.CHEFS_NATS_HOST,
      waitOnFirstConnect: true,
    };

    if (process.env.CHEFS_NATS_NKEY_SEED) {
      options.authenticator = nkeyAuthenticator(new TextEncoder().encode(process.env.CHEFS_NATS_NKEY_SEED));
    } else {
      options.user = process.env.CHEFS_NATS_USER;
      options.pass = process.env.CHEFS_NATS_PASSWORD;
    }

    if (process.env.CHEFS_NATS_WEBSOCKETS === "true") {
      return connectWebSocket(options);
    }
    return connect(options);
  }

  private async setupConsumer(): Promise<void> {
    this.logger.debug(`setting up consumer`);
    if (!this.jsm) throw new Error("JetStream Management client is not initialized.");

    this.logger.debug(`Using CHEFS stream "${STREAMS.CHEFS}" with durable "${CHEFS_DURABLE_FORMS}"`);

    // The CHEFS stream is owned by CHEFS, so only a durable consumer is created here.
    try {
      await this.jsm.consumers.add(STREAMS.CHEFS, {
        ack_policy: AckPolicy.Explicit,
        durable_name: CHEFS_DURABLE_FORMS,
        filter_subject: STREAM_TOPICS.CHEFS_PRIVATE_FORMS,
      });
      this.logger.debug("CHEFS consumer set up successfully");
    } catch (error) {
      this.logger.error("Unable to setup CHEFS consumer", error);
    }
  }

  private async subscribeToTopics() {
    const sc = StringCodec();
    const consumer = await this.natsConnection.jetstream().consumers.get(STREAMS.CHEFS, CHEFS_DURABLE_FORMS);
    const iter = await consumer.consume({ max_messages: 1 });

    for await (const message of iter) {
      try {
        await this.handleFormEvent(message, JSON.parse(sc.decode(message.data)));
      } catch (error) {
        this.logger.error(`Error processing message from ${message.subject}`, error);
        message.nak(60_000); // retry in 60 seconds
      }
    }
  }

  private async handleFormEvent(message: JsMsg, eventMessage: ChefsEventMessage) {
    const { meta, payload } = eventMessage;
    this.logger.debug(`CHEFS ${meta.class} ${meta.type} event for form ${meta.formId}`);

    // Only completed new submissions become complaints; schema events and drafts are skipped.
    const isNewSubmission = meta.class === "submission" && meta.type === "created" && !meta.draft;

    if (isNewSubmission && payload?.data) {
      const cryptr = new Cryptr(process.env.CHEFS_FORM_ENCRYPTION_KEY);
      const decrypted = JSON.parse(cryptr.decrypt(payload.data));
      // TODO: Don't forget to remove this debug line - helpful for now, wasteful when live
      this.logger.debug(decrypted);
      const complaint: Complaint = decrypted.submission.data;
      await this.complaintsPublisherService.publishComplaintsFromWebEOC(complaint);
    }

    await message.ackAck();
  }
}
