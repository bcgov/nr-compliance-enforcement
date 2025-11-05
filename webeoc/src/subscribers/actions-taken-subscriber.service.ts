import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AckPolicy, connect, JetStreamManager, JsMsg, NatsConnection, StorageType, StringCodec } from "nats";
import { ActionsTakenPublisherService } from "src/publishers/actions-taken-publisher.service";
import { NATS_DURABLE_COMPLAINTS, STREAM_TOPICS, STREAMS } from "src/common/constants";
import { ActionTaken } from "src/types/actions-taken/action-taken";
import { ComplaintApiService } from "src/complaint-api-service/complaint-api.service";
import { ActionTakenDto } from "src/types/actions-taken/action-taken-dto";

@Injectable()
export class ActionsTakenSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(ActionsTakenSubscriberService.name);
  private natsConnection: NatsConnection | null = null;
  private jsm: JetStreamManager | null = null;

  constructor(
    private readonly service: ComplaintApiService,
    private readonly publisher: ActionsTakenPublisherService,
  ) {}

  async onModuleInit() {
    try {
      this.natsConnection = await connect({ servers: process.env.NATS_HOST, waitOnFirstConnect: true });
      this.jsm = await this.natsConnection.jetstreamManager();
      await this.setupStream();
      await this.subscribeToTopics();
      this.logger.debug((await this.jsm.streams.info(STREAMS.ACTIONS_TAKEN)).state);
    } catch (error) {
      this.logger.error("Failed to connect to NATS or set up stream:", error);
    }
  }

  private async setupStream(): Promise<void> {
    if (!this.jsm) throw new Error("JetStream Management client is not initialized.");

    const streamConfig = {
      name: STREAMS.ACTIONS_TAKEN,
      subjects: [
        STREAM_TOPICS.ACTION_TAKEN,
        STREAM_TOPICS.UPDATE_ACTION_TAKEN,
        STREAM_TOPICS.STAGE_ACTION_TAKEN,
        STREAM_TOPICS.STAGE_UPDATE_ACTION_TAKEN,
      ],
      storage: StorageType.Memory,
      max_age: 10 * 60 * 60 * 1e9, // 10 minutes in nanoseconds
      duplicate_window: 10 * 60 * 1e9, // 10 minutes in nanoseconds
    };

    try {
      await this.jsm.streams.add(streamConfig);
      await this.jsm.consumers.add(STREAMS.ACTIONS_TAKEN, {
        ack_policy: AckPolicy.Explicit,
        durable_name: NATS_DURABLE_COMPLAINTS,
      });
      this.logger.debug("Stream and consumer set up successfully");
    } catch (error) {
      this.logger.error("Unable to setup streams and consumers", error);
    }
  }

  private async subscribeToTopics() {
    const sc = StringCodec();
    const consumer = await this.natsConnection
      .jetstream()
      .consumers.get(STREAMS.ACTIONS_TAKEN, NATS_DURABLE_COMPLAINTS);
    const iter = await consumer.consume({ max_messages: 1 });

    for await (const message of iter) {
      const decodedData = sc.decode(message.data);
      try {
        //-- push a new message to add the action-taken to the staging table
        if (message.subject === STREAM_TOPICS.ACTION_TAKEN) {
          await this.publishActionTaken(message, decodedData);
        } else if (message.subject === STREAM_TOPICS.STAGE_ACTION_TAKEN) {
          await this.stageActionTaken(message, JSON.parse(decodedData));
        } else if (message.subject === STREAM_TOPICS.UPDATE_ACTION_TAKEN) {
          await this.publishActionTakenUpdate(message, decodedData);
        } else if (message.subject === STREAM_TOPICS.STAGE_UPDATE_ACTION_TAKEN) {
          await this.stageActionTakenUpdate(message, JSON.parse(decodedData));
        } else {
          this.logger.warn("should this happen?");
        }
      } catch (error) {
        this.logger.error(`Error processing message from ${message.subject}`, error);
        message.nak(10_000); // retry in 10 seconds
      }
    }
  }

  //--
  //-- sends the the action-taken to the NatCom backend to be
  //-- added to the staging table
  //--
  private stageActionTaken = async (message, action: ActionTaken) => {
    this.logger.debug(`Received action-taken: ${action?.action_taken_guid}`);
    //-- reshape the action taken, only send the required data
    const {
      action_taken_guid: actionTakenId,
      action_logged_by: loggedBy,
      action_datetime: actionTimestamp,
      action_details: details,
      fk_table_345: webeocId,
      dataid,
    } = action;

    const record: ActionTakenDto = {
      actionTakenId,
      webeocId,
      loggedBy,
      actionTimestamp,
      details,
      isUpdate: false,
      dataid,
    };

    await this.service.stageActionTaken(record);
    await message.ackAck(); //Message has been loaded into NatCom no need to retry.  If NATS is unavailable there will be 'PENDING' row to process manually.
    //-- this shouldn't happen here, it should be happening in the backend
    await this.publisher.publishActionTaken(actionTakenId, webeocId, action);
  };

  private stageActionTakenUpdate = async (message, action: ActionTaken) => {
    this.logger.debug(`Received action-taken-update: ${action?.action_taken_guid}`);

    //-- reshape the action taken, only send the required data
    const {
      action_taken_guid: actionTakenId,
      action_logged_by: loggedBy,
      action_datetime: actionTimestamp,
      action_details: details,
      fk_table_346: webeocId,
      dataid,
    } = action;

    const record: ActionTakenDto = {
      actionTakenId,
      webeocId,
      loggedBy,
      actionTimestamp,
      details,
      isUpdate: true,
      dataid,
    };

    await this.service.stageActionTakenUpdate(record);
    await message.ackAck(); //Message has been loaded into NatCom no need to retry.  If NATS is unavailable there will be 'PENDING' row to process manually.
    //-- this shouldn't happen here, it should be happening in the backend
    await this.publisher.publishActionTakenUpdate(actionTakenId, webeocId, action);
  };

  //--
  //-- sends staged action-taken id to the NatCom backend to be
  //-- published to the action-taken table
  //--
  private publishActionTaken = async (message: JsMsg, payload: string) => {
    this.logger.debug(`Process Staged action-taken: ${payload}`);
    this.service.publishActionTaken(JSON.parse(payload));
    message.ackAck();
  };

  //--
  //-- sends staged action-taken-update id to the NatCom backend to be
  //-- published to the action-taken table
  //--
  private publishActionTakenUpdate = async (message: JsMsg, payload: string) => {
    this.logger.debug(`Process Staged action-taken-update: ${payload}`);
    this.service.publishActionTakenUpdate(JSON.parse(payload));
    message.ackAck();
  };
}
