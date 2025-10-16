import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { investigation } from "../../../prisma/investigation/generated/investigation";
import {
  CreateInvestigationInput,
  Investigation,
  UpdateInvestigationInput,
  InvestigationFilters,
  InvestigationResult,
} from "./dto/investigation";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { PaginationUtility } from "src/common/pagination.utility";
import { PageInfo } from "src/shared/case_file/dto/case_file";
import { CaseFileService } from "src/shared/case_file/case_file.service";

@Injectable()
export class InvestigationService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
    private readonly shared: SharedPrismaService,
    private readonly paginationUtility: PaginationUtility,
    private readonly caseFileService: CaseFileService,
  ) {}

  private readonly logger = new Logger(InvestigationService.name);

  async findOne(investigationGuid: string) {
    const prismaInvestigation = await this.prisma.investigation.findUnique({
      where: {
        investigation_guid: investigationGuid,
      },
      include: {
        investigation_status_code: true,
        investigation_party: {
          include: {
            investigation_person: {
              where: {
                active_ind: true,
              },
            },
            investigation_business: {
              where: {
                active_ind: true,
              },
            },
          },
          where: {
            active_ind: true,
          },
        },
      },
    });
    if (!prismaInvestigation) {
      throw new Error(`Investigation with guid ${investigationGuid} not found`);
    }

    try {
      return this.mapper.map<investigation, Investigation>(
        prismaInvestigation as investigation,
        "investigation",
        "Investigation",
      );
    } catch (error) {
      this.logger.error("Error mapping investigation:", error);
      throw error;
    }
  }

  async findMany(ids: string[]): Promise<Investigation[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const prismaInvestigations = await this.prisma.investigation.findMany({
      where: {
        investigation_guid: {
          in: ids,
        },
      },
      include: {
        investigation_status_code: true,
      },
    });

    try {
      return this.mapper.mapArray<investigation, Investigation>(
        prismaInvestigations as Array<investigation>,
        "investigation",
        "Investigation",
      );
    } catch (error) {
      this.logger.error("Error fetching investigations by IDs:", error);
      throw error;
    }
  }

  async create(input: CreateInvestigationInput): Promise<Investigation> {
    // Verify case file exists
    const caseFile = await this.shared.case_file.findUnique({
      where: {
        case_file_guid: input.caseIdentifier,
      },
    });

    if (!caseFile) {
      throw new Error(`Case file with guid ${input.caseIdentifier} not found`);
    }

    // Create the investigation
    let investigation;
    try {
      investigation = await this.prisma.investigation.create({
        data: {
          investigation_status: input.investigationStatus,
          investigation_description: input.description,
          owned_by_agency_ref: input.leadAgency,
          name: input.name,
          investigation_opened_utc_timestamp: new Date(),
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
        include: {
          investigation_status_code: true,
        },
      });
    } catch (error) {
      this.logger.error("Error creating investigation:", error);
      throw error;
    }

    // Try to create case activity record, and if it fails, delete the investigation
    try {
      await this.shared.case_activity.create({
        data: {
          case_file_guid: input.caseIdentifier,
          activity_type: "INVSTGTN",
          activity_identifier_ref: investigation.investigation_guid,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      });
    } catch (activityError) {
      // Attempt to delete the investigation that was just created since the case activity creation failed
      // This is done to prevent orphaned investigations as this violates the current understanding of the business rules
      try {
        await this.prisma.investigation.delete({
          where: { investigation_guid: investigation.investigation_guid },
        });
      } catch (deleteError) {
        this.logger.error(
          `Error creating case activity, cleanup deletion of investigation with guid ${investigation.investigation_guid} failed:`,
          deleteError,
        );
        // Throw a combined error
        throw new Error(
          `Error deleting investigation record after case activity creation failed. Activity error: ${activityError}. Cleanup error: ${deleteError}`,
        );
      }
      // Successfully deleted the investigation record
      this.logger.error("Error creating case activity, investigation record deleted:", activityError);
      throw new Error(
        `Failed to create case activity for investigation. The investigation was rolled back. Error: ${activityError}`,
      );
    }

    try {
      return this.mapper.map<investigation, Investigation>(
        investigation as investigation,
        "investigation",
        "Investigation",
      );
    } catch (error) {
      this.logger.error("Error mapping investigation:", error);
      throw error;
    }
  }

  async update(investigationGuid: string, input: UpdateInvestigationInput): Promise<Investigation> {
    // Check if the investigation exists
    const existingInvestigation = await this.prisma.investigation.findUnique({
      where: { investigation_guid: investigationGuid },
    });

    if (!existingInvestigation) {
      throw new Error(`Investigation with guid ${investigationGuid} not found.`);
    }
    let updatedInvestigation;
    try {
      const updateData: any = {
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      };

      if (input.leadAgency !== undefined) {
        updateData.owned_by_agency_ref = input.leadAgency;
      }
      if (input.investigationStatus !== undefined) {
        updateData.investigation_status = input.investigationStatus;
      }
      if (input.description !== undefined) {
        updateData.investigation_description = input.description;
      }
      if (input.name !== undefined) {
        updateData.name = input.name;
      }
      // Perform the update
      updatedInvestigation = await this.prisma.investigation.update({
        where: { investigation_guid: investigationGuid },
        data: updateData,
        include: {
          investigation_status_code: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error updating investigation with guid ${investigationGuid}:`, error);
      throw error;
    }
    try {
      return this.mapper.map<investigation, Investigation>(
        updatedInvestigation as investigation,
        "investigation",
        "Investigation",
      );
    } catch (error) {
      this.logger.error(`Error mapping investigation with guid ${investigationGuid}:`, error);
      throw error;
    }
  }

  async search(page: number = 1, pageSize: number = 25, filters?: InvestigationFilters): Promise<InvestigationResult> {
    const where: any = {};

    if (filters?.search) {
      // Search by name (partial match) or investigation_guid (exact match)
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { investigation_guid: { equals: filters.search } },
      ];
    }

    if (filters?.leadAgency) {
      where.owned_by_agency_ref = filters.leadAgency;
    }

    if (filters?.investigationStatus) {
      where.investigation_status = filters.investigationStatus;
    }

    if (filters?.startDate || filters?.endDate) {
      where.investigation_opened_utc_timestamp = {};

      if (filters?.startDate) {
        where.investigation_opened_utc_timestamp.gte = filters.startDate;
      }

      if (filters?.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.investigation_opened_utc_timestamp.lte = endOfDay;
      }
    }

    // map filters to db columns
    const sortFieldMap: Record<string, string> = {
      investigationGuid: "investigation_guid",
      openedTimestamp: "investigation_opened_utc_timestamp",
      leadAgency: "owned_by_agency_ref",
      investigationStatus: "investigation_status",
      name: "name",
    };

    let orderBy: any = { investigation_opened_utc_timestamp: "desc" }; // Default sort

    if (filters?.sortBy && filters?.sortOrder) {
      const dbField = sortFieldMap[filters.sortBy];
      const validSortOrder = filters.sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      if (dbField) {
        orderBy = { [dbField]: validSortOrder };
      }
    }

    // Use the pagination utility to handle pagination logic and return pageInfo meta
    const result = await this.paginationUtility.paginate<investigation, Investigation>(
      { page, pageSize },
      {
        prismaService: this.prisma,
        modelName: "investigation",
        sourceTypeName: "investigation",
        destinationTypeName: "Investigation",
        mapper: this.mapper,
        whereClause: where,
        includeClause: {
          officer_investigation_xref: true,
          investigation_status_code: true,
        },
        orderByClause: orderBy,
      },
    );
    return {
      items: result.items,
      pageInfo: result.pageInfo as PageInfo,
    };
  }

  async checkNameExists(name: string, leadAgency: string, excludeInvestigationGuid?: string): Promise<boolean> {
    const where: any = {
      name: {
        equals: name,
        mode: "insensitive",
      },
      owned_by_agency_ref: leadAgency,
    };

    if (excludeInvestigationGuid) {
      where.investigation_guid = {
        not: excludeInvestigationGuid,
      };
    }

    const existingInvestigation = await this.prisma.investigation.findFirst({
      where,
    });

    return !!existingInvestigation;
  }
}
