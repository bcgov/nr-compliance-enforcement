import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import {
  CaseActivity,
  CaseActivityCreateInput,
  CaseActivityRemoveInput,
} from "src/shared/case_activity/dto/case_activity";
import { UserService } from "src/common/user.service";
import { case_activity } from "prisma/shared/generated/case_activity";
import { ActivityTypeToEventEntity, EVENT_STREAM_NAME } from "src/common/nats_constants";
import { EventCreateInput } from "src/shared/event/dto/event";
import { EventPublisherService } from "src/event_publisher/event_publisher.service";

@Injectable()
export class CaseActivityService {
  constructor(
    private readonly prisma: SharedPrismaService,
    private readonly user: UserService,
    private readonly eventPublisher: EventPublisherService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(CaseActivityService.name);

  async create(input: CaseActivityCreateInput): Promise<CaseActivity | any> {
    const result = await this.prisma.case_activity.create({
      data: {
        case_file_guid: input.caseFileGuid,
        activity_type: input.activityType,
        activity_identifier_ref: input.activityIdentifier,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      },
    });
    // Publish the event
    const sourceEntityType = ActivityTypeToEventEntity[input.activityType];
    const eventTopic = `${EVENT_STREAM_NAME}.${sourceEntityType.toLowerCase()}.added_to_case`;
    try {
      const event: EventCreateInput = {
        eventVerbTypeCode: "ADDED",
        sourceId: input.activityIdentifier,
        sourceEntityTypeCode: sourceEntityType,
        actorId: this.user.getUserGuid(),
        actorEntityTypeCode: "USER",
        targetId: input.caseFileGuid,
        targetEntityTypeCode: "CASE",
        content: input.eventContent ?? null,
      };
      this.eventPublisher.publishEvent(event, eventTopic);
    } catch (error) {
      this.logger.error(`Error publishing event ${eventTopic}`, error);
    }
    try {
      return this.mapper.map<case_activity, CaseActivity>(result as case_activity, "case_activity", "CaseActivity");
    } catch (activityError) {
      this.logger.error("Error creating case activity:", activityError);
      throw new Error(`Failed to create case activity. Error: ${activityError}`);
    }
  }

  async remove(input: CaseActivityRemoveInput): Promise<CaseActivity | null> {
    const utc_expiry_timestamp = new Date();
    const activityToExpire = await this.prisma.case_activity.findFirst({
      where: {
        case_file_guid: input.caseFileGuid,
        activity_identifier_ref: input.activityIdentifier,
        expiry_utc_timestamp: null,
      },
    });

    if (!activityToExpire) {
      throw new Error("Activity not found in case");
    }
    await this.prisma.case_activity.update({
      where: {
        case_activity_guid: activityToExpire.case_activity_guid,
      },
      data: {
        expiry_utc_timestamp: utc_expiry_timestamp,
      },
    });

    // Publish the event
    const sourceEntityType = ActivityTypeToEventEntity[activityToExpire.activity_type];
    const eventTopic = `${EVENT_STREAM_NAME}.${sourceEntityType.toLowerCase()}.removed_from_case`;
    try {
      const event: EventCreateInput = {
        eventVerbTypeCode: "REMOVED",
        sourceId: input.activityIdentifier,
        sourceEntityTypeCode: sourceEntityType,
        actorId: this.user.getUserGuid(),
        actorEntityTypeCode: "USER",
        targetId: input.caseFileGuid,
        targetEntityTypeCode: "CASE",
        content: null,
      };
      this.eventPublisher.publishEvent(event, eventTopic);
    } catch (error) {
      this.logger.error(`Error publishing event ${eventTopic}`, error);
    }

    try {
      return this.mapper.map<case_activity, CaseActivity>(
        activityToExpire as case_activity,
        "case_activity",
        "CaseActivity",
      );
    } catch (activityError) {
      this.logger.error("Error removing case activity:", activityError);
      throw new Error(`Failed to remove case activity. Error: ${activityError}`);
    }
  }
}
