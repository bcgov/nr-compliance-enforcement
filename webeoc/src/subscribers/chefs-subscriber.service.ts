import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  AckPolicy,
  ConnectionOptions,
  DeliverPolicy,
  JetStreamManager,
  JsMsg,
  NatsConnection,
  nkeyAuthenticator,
  StringCodec,
} from "nats";
import { connect as connectWebSocket } from "nats.ws";
import { CHEFS_DURABLE_FORMS, CHEFS_MAX_DELIVER, STREAM_TOPICS, STREAMS } from "../common/constants";
import { ChefsEventMessage } from "src/types/chefs/chefs-event-type";
import { ComplaintsPublisherService } from "src/publishers/complaints-publisher.service";
import { ChefsApiService } from "src/chefs/chefs-api.service";
import { transformChefsSubmission } from "src/chefs/transforms";

@Injectable()
export class ChefsSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ChefsSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null;

  constructor(
    private readonly complaintsPublisherService: ComplaintsPublisherService,
    private readonly chefsApiService: ChefsApiService,
  ) {}

  async onModuleInit() {
    try {
      this.natsConnection = await this.connectToChefs();
      // If reconnect attempts run out log an error
      this.natsConnection
        .closed()
        .then((error) => this.logger.error("CHEFS_INTAKE_ERROR CHEFS NATS connection closed", error));
      this.jsm = await this.natsConnection.jetstreamManager();
      await this.setupConsumer();
      await this.subscribeToTopics();
    } catch (error) {
      this.logger.error("CHEFS_INTAKE_ERROR Failed to connect to CHEFS NATS or set up consumer:", error);
    }
  }

  // Hosted ESS only accepts websocket connections with nkey auth; local CHEFS uses NATS protocol with user/password.
  private connectToChefs(): Promise<NatsConnection> {
    const options: ConnectionOptions = {
      servers: process.env.CHEFS_NATS_HOST,
      waitOnFirstConnect: true,
    };

    options.authenticator = nkeyAuthenticator(new TextEncoder().encode(process.env.CHEFS_NATS_NKEY_SEED));

    return connectWebSocket(options);
  }

  private async setupConsumer(): Promise<void> {
    this.logger.debug(`setting up consumer`);
    if (!this.jsm) throw new Error("JetStream Management client is not initialized.");

    this.logger.debug(`Using CHEFS stream "${STREAMS.CHEFS}" with durable "${CHEFS_DURABLE_FORMS}"`);

    // The CHEFS stream is owned by CHEFS, so only a durable consumer is created here.
    try {
      // consumers.add doesn't change an existing durable, so apply config changes (e.g. max_deliver) with update first.
      await this.jsm.consumers.update(STREAMS.CHEFS, CHEFS_DURABLE_FORMS, {
        filter_subject: STREAM_TOPICS.CHEFS_SUBMISSIONS_CREATED,
        max_deliver: CHEFS_MAX_DELIVER,
      });
      this.logger.debug("CHEFS consumer updated successfully");
    } catch {
      this.logger.debug("CHEFS consumer not found, creating it");
      try {
        await this.jsm.consumers.add(STREAMS.CHEFS, {
          ack_policy: AckPolicy.Explicit,
          durable_name: CHEFS_DURABLE_FORMS,
          filter_subject: STREAM_TOPICS.CHEFS_SUBMISSIONS_CREATED,
          max_deliver: CHEFS_MAX_DELIVER,
          deliver_policy: DeliverPolicy.New,
        });
        this.logger.debug("CHEFS consumer set up successfully");
      } catch (error) {
        this.logger.error("Unable to setup CHEFS consumer", error);
      }
    }
  }

  private async subscribeToTopics() {
    const sc = StringCodec();
    const consumer = await this.natsConnection.jetstream().consumers.get(STREAMS.CHEFS, CHEFS_DURABLE_FORMS);
    const iter = await consumer.consume({ max_messages: 1 });

    for await (const message of iter) {
      let eventMessage: ChefsEventMessage;
      try {
        eventMessage = JSON.parse(sc.decode(message.data));
      } catch (error) {
        // Unreadable messages will never succeed, so stop redelivery.
        this.logger.error(`CHEFS_INTAKE_ERROR Unreadable message from ${message.subject}, not retrying`, error);
        message.term();
        continue;
      }

      try {
        await this.handleFormEvent(message, eventMessage);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`CHEFS_INTAKE_ERROR Submission ${eventMessage?.meta?.submissionId}: ${errorMessage}`, error);
        message.nak(60_000); // retry in 60 seconds, up to CHEFS_MAX_DELIVER attempts
      }
    }
  }

  private async handleFormEvent(message: JsMsg, eventMessage: ChefsEventMessage) {
    const { meta } = eventMessage;
    this.logger.debug(`CHEFS ${meta.class} ${meta.type} event for form ${meta.formId}`);

    // Only completed new submissions become complaints; drafts are skipped.
    const isNewSubmission = meta.class === "submission" && meta.type === "created" && !meta.draft;

    if (isNewSubmission) {
      if (!meta.submissionId) {
        // Without a submission id there is nothing to fetch, and retrying won't change that.
        this.logger.error(`CHEFS_INTAKE_ERROR No submission id in message from ${message.subject}, not retrying`);
        message.term();
        return;
      }
      // Always fetch from the API so submissions are never limited by the event stream's message size.
      const submissionData = await this.chefsApiService.getSubmissionData(meta.submissionId);
      const complaint = transformChefsSubmission(submissionData);
      console.dir(complaint, { depth: null });
      await this.complaintsPublisherService.publishComplaintToNatsuite(complaint, meta.submissionId);
    }

    await message.ackAck();
  }
}
