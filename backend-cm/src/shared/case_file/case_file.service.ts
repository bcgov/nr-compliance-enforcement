import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { case_file } from "../../../prisma/shared/generated/case_file";
import {
  CaseFile,
  CaseFileFilters,
  CaseFileResult,
  CaseFileCreateInput,
  CaseFileUpdateInput,
  PageInfo,
} from "./dto/case_file";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";
import { EventCreateInput } from "../../shared/event/dto/event";
import { ActivityTypeToEventEntity, EVENT_STREAM_NAME, STREAM_TOPICS } from "../../common/nats_constants";
import { EventPublisherService } from "../../event_publisher/event_publisher.service";

@Injectable()
export class CaseFileService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
    @Inject(forwardRef(() => EventPublisherService))
    private readonly eventPublisher: EventPublisherService,
  ) {}

  private readonly logger = new Logger(CaseFileService.name);

  async findOne(id: string) {
    const prismaCaseFile = await this.prisma.case_file.findUnique({
      where: {
        case_file_guid: id,
      },
      include: {
        agency_code: true,
        case_status_code: true,
        case_activity: {
          include: {
            case_activity_type_code: true,
          },
        },
      },
    });

    try {
      return this.mapper.map<case_file, CaseFile>(prismaCaseFile as case_file, "case_file", "CaseFile");
    } catch (error) {
      this.logger.error("Error mapping case file:", error);
    }
  }

  async findMany(ids: string[]): Promise<CaseFile[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const prismaCaseFiles = await this.prisma.case_file.findMany({
      where: {
        case_file_guid: {
          in: ids,
        },
      },
      include: {
        agency_code: true,
        case_status_code: true,
        case_activity: {
          include: {
            case_activity_type_code: true,
          },
        },
      },
    });

    try {
      return this.mapper.mapArray<case_file, CaseFile>(prismaCaseFiles as Array<case_file>, "case_file", "CaseFile");
    } catch (error) {
      this.logger.error("Error fetching case files by IDs:", error);
      throw error;
    }
  }

  async findCaseFilesByActivityIds(activityIdentifiers: string[]): Promise<CaseFile[]> {
    if (!activityIdentifiers || activityIdentifiers.length === 0) {
      return [];
    }

    const caseActivityXrefRecords = await this.prisma.case_activity.findMany({
      where: {
        activity_identifier_ref: {
          in: activityIdentifiers,
        },
      },
    });

    if (!caseActivityXrefRecords || caseActivityXrefRecords.length === 0) {
      return [];
    }

    const caseFileGuids = caseActivityXrefRecords.map((record) => record.case_file_guid);
    const uniqueCaseFileGuids = [...new Set(caseFileGuids)];

    return await this.findMany(uniqueCaseFileGuids);
  }

  async create(input: CaseFileCreateInput): Promise<CaseFile> {
    const caseFile = await this.prisma.case_file.create({
      data: {
        lead_agency: input.leadAgency,
        case_status: input.caseStatus,
        description: input.description,
        name: input.name,
        opened_utc_timestamp: new Date(),
        create_user_id: this.user.getIdirUsername(),
        created_by_app_user_guid_ref: input.createdByAppUserGuid,
      },
      include: {
        agency_code: true,
        case_status_code: true,
        case_activity: {
          include: {
            case_activity_type_code: true,
          },
        },
      },
    });
    const event: EventCreateInput = {
      eventVerbTypeCode: "OPENED",
      sourceId: caseFile.case_file_guid,
      sourceEntityTypeCode: "CASE",
      actorId: this.user.getUserGuid(),
      actorEntityTypeCode: "USER",
      targetId: caseFile.case_file_guid,
      targetEntityTypeCode: "CASE",
    };
    this.eventPublisher.publishEvent(event, STREAM_TOPICS.CASE_OPENED);
    // If activityType and activityIdentifier are provided, create the case activity
    if (input.activityType && input.activityIdentifier) {
      await this.prisma.case_activity.create({
        data: {
          case_file_guid: caseFile.case_file_guid,
          activity_type: input.activityType,
          activity_identifier_ref: input.activityIdentifier,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      });
      const sourceEntityType = ActivityTypeToEventEntity[input.activityType];
      const event: EventCreateInput = {
        eventVerbTypeCode: "ADDED",
        sourceId: input.activityIdentifier,
        sourceEntityTypeCode: sourceEntityType,
        actorId: this.user.getUserGuid(),
        actorEntityTypeCode: "USER",
        targetId: caseFile.case_file_guid,
        targetEntityTypeCode: "CASE",
      };
      const eventTopic = `${EVENT_STREAM_NAME}.${sourceEntityType}.ADDED_TO_CASE`;
      this.eventPublisher.publishEvent(event, eventTopic);
    }

    try {
      return this.mapper.map<case_file, CaseFile>(caseFile as case_file, "case_file", "CaseFile");
    } catch (error) {
      this.logger.error("Error creating case file:", error);
      throw error;
    }
  }

  async update(caseIdentifier: string, input: CaseFileUpdateInput): Promise<CaseFile> {
    const existingCaseFile = await this.prisma.case_file.findUnique({
      where: { case_file_guid: caseIdentifier },
    });
    if (!existingCaseFile) throw new Error("Case file not found");

    const updateData: any = {
      update_user_id: this.user.getIdirUsername(),
      update_utc_timestamp: new Date(),
    };

    if (input.leadAgency !== undefined) {
      updateData.lead_agency = input.leadAgency;
    }
    if (input.caseStatus !== undefined) {
      updateData.case_status = input.caseStatus;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    const caseFile = await this.prisma.case_file.update({
      where: { case_file_guid: caseIdentifier },
      data: updateData,
      include: {
        agency_code: true,
        case_status_code: true,
        case_activity: {
          include: {
            case_activity_type_code: true,
          },
        },
      },
    });

    if (input.caseStatus !== undefined) {
      let eventStatus = input.caseStatus === "OPEN" ? "OPENED" : input.caseStatus;
      const eventTopic = `${EVENT_STREAM_NAME}.case.${eventStatus.toLowerCase()}`;
      const event: EventCreateInput = {
        eventVerbTypeCode: eventStatus,
        sourceId: caseFile.case_file_guid,
        sourceEntityTypeCode: "CASE",
        actorId: this.user.getUserGuid(),
        actorEntityTypeCode: "USER",
        targetId: caseFile.case_file_guid,
        targetEntityTypeCode: "CASE",
      };
      this.eventPublisher.publishEvent(event, eventTopic);
    }

    try {
      return this.mapper.map<case_file, CaseFile>(caseFile as case_file, "case_file", "CaseFile");
    } catch (error) {
      this.logger.error("Error updating case file:", error);
      throw error;
    }
  }

  async checkNameExists(name: string, leadAgency: string, excludeCaseIdentifier?: string): Promise<boolean> {
    const where: any = {
      name: {
        equals: name,
        mode: "insensitive",
      },
      lead_agency: leadAgency,
    };

    if (excludeCaseIdentifier) {
      where.case_file_guid = {
        not: excludeCaseIdentifier,
      };
    }

    const existingCase = await this.prisma.case_file.findFirst({
      where,
    });

    return !!existingCase;
  }

  async search(page: number = 1, pageSize: number = 25, filters?: CaseFileFilters): Promise<CaseFileResult> {
    const where: any = {};

    if (filters?.search) {
      where.OR = [{ name: { contains: filters.search, mode: "insensitive" } }];
    }

    if (filters?.leadAgency) {
      where.lead_agency = filters.leadAgency;
    }

    if (filters?.caseStatus) {
      where.case_status = filters.caseStatus;
    }

    if (filters?.startDate || filters?.endDate) {
      where.opened_utc_timestamp = {};

      if (filters?.startDate) {
        where.opened_utc_timestamp.gte = filters.startDate;
      }

      if (filters?.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.opened_utc_timestamp.lte = endOfDay;
      }
    }

    // map filters to db columns
    const sortFieldMap: Record<string, string> = {
      caseIdentifier: "case_file_guid",
      openedTimestamp: "opened_utc_timestamp",
      leadAgency: "lead_agency",
      caseStatus: "case_status",
      name: "name",
    };

    let orderBy: any = { opened_utc_timestamp: "desc" }; // Default sort

    if (filters?.sortBy && filters?.sortOrder) {
      const dbField = sortFieldMap[filters.sortBy];
      const validSortOrder = filters.sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      if (dbField) {
        orderBy = { [dbField]: validSortOrder };
      }
    }

    // Use the pagination utility to handle pagination logic and return pageInfo meta
    const result = await this.paginationUtility.paginate<case_file, CaseFile>(
      { page, pageSize },
      {
        prismaService: this.prisma,
        modelName: "case_file",
        sourceTypeName: "case_file",
        destinationTypeName: "CaseFile",
        mapper: this.mapper,
        whereClause: where,
        includeClause: {
          agency_code: true,
          case_status_code: true,
          case_activity: {
            include: {
              case_activity_type_code: true,
            },
          },
        },
        orderByClause: orderBy,
      },
    );

    return {
      items: result.items,
      pageInfo: result.pageInfo as PageInfo,
    };
  }
}
