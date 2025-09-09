import { Injectable, Logger } from "@nestjs/common";
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
import { CaseActivityTypeCode } from "src/shared/case_activity_type_code/dto/case_activity_type_code";

@Injectable()
export class CaseFileService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
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

  async findCaseFileByActivityId(activityType: string, activityIdentifier: string) {
    const caseActivityXrefRecord = await this.prisma.case_activity.findFirst({
      where: {
        activity_type: activityType,
        activity_identifier_ref: activityIdentifier,
      },
    });

    if (!caseActivityXrefRecord) {
      throw new Error(`No case activity found for activity type ${activityType} with identifier ${activityIdentifier}`);
    }
    return await this.findOne(caseActivityXrefRecord.case_file_guid);
  }

  async create(input: CaseFileCreateInput): Promise<CaseFile> {
    const caseFile = await this.prisma.case_file.create({
      data: {
        lead_agency: input.leadAgency,
        case_status: input.caseStatus,
        description: input.description,
        opened_utc_timestamp: new Date(),
        create_user_id: this.user.getIdirUsername(),
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

    try {
      return this.mapper.map<case_file, CaseFile>(caseFile as case_file, "case_file", "CaseFile");
    } catch (error) {
      this.logger.error("Error updating case file:", error);
      throw error;
    }
  }

  async search(page: number = 1, pageSize: number = 25, filters?: CaseFileFilters): Promise<CaseFileResult> {
    const where: any = {};

    if (filters?.search) {
      // UUID column only supports exact matching
      where.OR = [{ case_file_guid: { equals: filters.search } }];
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
