import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { investigation } from "../../../prisma/investigation/investigation.unsupported_types";
import {
  CreateInvestigationInput,
  Investigation,
  UpdateInvestigationInput,
  InvestigationFilters,
  InvestigationResult,
} from "./dto/investigation";
import { InvestigationPrismaService, ExtendedPrismaClient } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { PaginationUtility } from "src/common/pagination.utility";
import { PageInfo } from "src/shared/case_file/dto/case_file";
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { Point } from "src/common/custom_scalars";
import { Prisma } from ".prisma/investigation";

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
    const PostGISPrismaClient = this.prisma as unknown as ExtendedPrismaClient;
    const prismaInvestigation = await PostGISPrismaClient.findUnique({
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
    const PostGISPrismaClient = this.prisma as unknown as ExtendedPrismaClient;
    const prismaInvestigations = await PostGISPrismaClient.findMany(
      ids,
      { investigation_status_code: true }
    );

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
      const PostGISPrismaClient = this.prisma as unknown as ExtendedPrismaClient;
      investigation = await PostGISPrismaClient.create({
        investigation_status: input.investigationStatus,
        investigation_description: input.description,
        owned_by_agency_ref: input.leadAgency,
        investigation_opened_utc_timestamp: new Date(),
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        location_geometry_point: input.locationGeometry,
        location_address: input.locationAddress,
        location_description: input.locationDescription,
      });

      // Fetch the investigation_status_code relation
      const statusCode = await this.prisma.investigation_status_code.findUnique({
        where: { investigation_status_code: investigation.investigation_status },
      });
      // Add the relation to the investigation object
      Object.assign(investigation, { investigation_status_code: statusCode });
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
    const PostGISPrismaClient = this.prisma as unknown as ExtendedPrismaClient;
    const existingInvestigation = await PostGISPrismaClient.investigation.findUnique({
      where: { investigation_guid: investigationGuid },
    });

    if (!existingInvestigation) {
      throw new Error(`Investigation with guid ${investigationGuid} not found.`);
    }
    let updatedInvestigation: investigation;
    try {
      const updateData: {
        update_user_id: string;
        update_utc_timestamp: Date;
        owned_by_agency_ref?: string;
        investigation_status?: string;
        investigation_description?: string;
        location_geometry_point?: Point | null;
        location_address?: string;
        location_description?: string;
      } = {
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
      if (input.locationGeometry !== undefined) {
        updateData.location_geometry_point = input.locationGeometry;
      }
      if (input.locationAddress !== undefined) {
        updateData.location_address = input.locationAddress;
      }
      if (input.locationDescription !== undefined) {
        updateData.location_description = input.locationDescription;
      }
      // Perform the update

      updatedInvestigation = await PostGISPrismaClient.updateInvestigation(
        investigationGuid,
        updateData
      );

      // Fetch the investigation_status_code relation
      const statusCode = await this.prisma.investigation_status_code.findUnique({
        where: { investigation_status_code: updatedInvestigation.investigation_status },
      });
      // Add the relation to the investigation object
      Object.assign(updatedInvestigation, { investigation_status_code: statusCode });
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
    // Validate pagination params
    const validatedPage = Math.max(1, page);
    const validatedPageSize = Math.min(Math.max(1, pageSize), 100);
    const skip = (validatedPage - 1) * validatedPageSize;

    const where: Prisma.investigationWhereInput = {};
    const PostGISPrismaClient = this.prisma as unknown as ExtendedPrismaClient;

    if (filters?.search) {
      // UUID column only supports exact matching
      where.investigation_guid = { in: [filters.search] };
    }

    if (filters?.leadAgency) {
      where.owned_by_agency_ref = filters.leadAgency;
    }

    if (filters?.investigationStatus) {
      where.investigation_status = filters.investigationStatus;
    }

    // Get total count for pagination
    const totalCount = await this.prisma.investigation.count({ where });

    // Query with raw SQL to get geometry as GeoJSON
    let investigationsList: investigation[];
    investigationsList = await PostGISPrismaClient.getMany(
      validatedPageSize,
      skip,
    );

    // Manually fetch related investigation_status_code for each investigation
    for (const inv of investigationsList) {
      const statusCode = await this.prisma.investigation_status_code.findUnique({
        where: { investigation_status_code: inv.investigation_status },
      });
      Object.assign(inv, { investigation_status_code: statusCode });
    }

    // Map to Investigation DTOs
    const investigations = this.mapper.mapArray<investigation, Investigation>(
      investigationsList,
      "investigation",
      "Investigation",
    );

    // Add case identifiers
    const res = await Promise.all(
      investigations.map(async (inv) => {
        const caseFile = await this.caseFileService.findCaseFileByActivityId("INVSTGTN", inv.investigationGuid);
        return { ...inv, caseIdentifier: caseFile.caseIdentifier };
      }),
    );

    if (filters?.sortBy === "caseIdentifier") {
      if (filters?.sortOrder?.toLowerCase() === "desc") {
        res.sort((a, b) => b.caseIdentifier.localeCompare(a.caseIdentifier));
      } else res.sort((a, b) => a.caseIdentifier.localeCompare(b.caseIdentifier));
    }

    // Calculate page info
    const totalPages = Math.ceil(totalCount / validatedPageSize);
    const pageInfo: PageInfo = {
      hasNextPage: validatedPage < totalPages,
      hasPreviousPage: validatedPage > 1,
      totalCount,
      totalPages,
      currentPage: validatedPage,
      pageSize: validatedPageSize,
    };

    return {
      items: res,
      pageInfo,
    };
  }
}
