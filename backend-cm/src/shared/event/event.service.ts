import { Injectable, Logger } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { Event, EventCreateInput, EventFilters, EventResult, PageInfo } from "./dto/event";
import { event } from "../../../prisma/shared/generated/event";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";

@Injectable()
export class EventService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
  ) {}
  private readonly logger = new Logger(EventService.name);

  async create(input: EventCreateInput): Promise<Event> {
    try {
      // Validate that source_entity_type_code is provided if source_id is provided
      if (input.sourceId && !input.sourceEntityTypeCode) {
        throw new Error("sourceEntityTypeCode is required when sourceId is provided");
      }

      const createdEvent = await this.prisma.event.create({
        data: {
          event_verb_type_code: input.eventVerbTypeCode,
          source_id: input.sourceId,
          source_entity_type_code: input.sourceEntityTypeCode,
          actor_id: input.actorId,
          actor_entity_type_code: input.actorEntityTypeCode,
          target_id: input.targetId,
          target_entity_type_code: input.targetEntityTypeCode,
          content: input.content,
          create_user_id: this.user.getIdirUsername(),
        },
        include: {
          event_verb_type_code_event_event_verb_type_codeToevent_verb_type_code: true,
          event_entity_type_code_event_actor_entity_type_codeToevent_entity_type_code: true,
          event_entity_type_code_event_target_entity_type_codeToevent_entity_type_code: true,
          event_entity_type_code_event_source_entity_type_codeToevent_entity_type_code: true,
        },
      });

      return this.mapper.map(createdEvent, "event", "Event");
    } catch (error) {
      this.logger.error(`Error creating event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async search(page: number = 1, pageSize: number = 25, filters?: EventFilters): Promise<EventResult> {
    try {
      const where: any = {};

      // Apply filters
      if (filters?.eventVerbTypeCode) {
        where.event_verb_type_code = filters.eventVerbTypeCode;
      }

      if (filters?.sourceId) {
        where.source_id = filters.sourceId;
      }

      if (filters?.actorId) {
        where.actor_id = filters.actorId;
      }

      if (filters?.targetId) {
        where.target_id = filters.targetId;
      }

      // Date range filter
      if (filters?.startDate || filters?.endDate) {
        where.published_utc_timestamp = {};
        if (filters.startDate) {
          where.published_utc_timestamp.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.published_utc_timestamp.lte = filters.endDate;
        }
      }

      // Build order by clause
      let orderBy: any = { published_utc_timestamp: "desc" }; // Default sort

      if (filters?.sortBy) {
        const sortField = filters.sortBy;
        const sortOrder = filters.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

        // Map GraphQL field names to Prisma field names
        const fieldMap: { [key: string]: string } = {
          eventGuid: "event_guid",
          eventVerbTypeCode: "event_verb_type_code",
          publishedTimestamp: "published_utc_timestamp",
          sourceId: "source_id",
          actorId: "actor_id",
          targetId: "target_id",
        };

        const prismaField = fieldMap[sortField] || sortField;
        orderBy = { [prismaField]: sortOrder };
      }

      // Use the pagination utility to handle pagination logic
      const result = await this.paginationUtility.paginate<event, Event>(
        { page, pageSize },
        {
          prismaService: this.prisma,
          modelName: "event",
          sourceTypeName: "event",
          destinationTypeName: "Event",
          mapper: this.mapper,
          whereClause: where,
          includeClause: {
            event_verb_type_code_event_event_verb_type_codeToevent_verb_type_code: true,
            event_entity_type_code_event_actor_entity_type_codeToevent_entity_type_code: true,
            event_entity_type_code_event_target_entity_type_codeToevent_entity_type_code: true,
            event_entity_type_code_event_source_entity_type_codeToevent_entity_type_code: true,
          },
          orderByClause: orderBy,
        },
      );

      return {
        items: result.items,
        pageInfo: result.pageInfo as PageInfo,
      };
    } catch (error) {
      this.logger.error(`Error searching events: ${error.message}`, error.stack);
      throw error;
    }
  }
}
