import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { inspection } from "../../../prisma/inspection/inspection.unsupported_types";
import {
  CreateInspectionInput,
  Inspection,
  InspectionFilters,
  InspectionResult,
  UpdateInspectionInput,
} from "./dto/inspection";
import { InspectionPrismaService } from "../../prisma/inspection/prisma.inspection.service";
import { PaginationUtility } from "../../common/pagination.utility";
import { PageInfo } from "../../shared/case_file/dto/case_file";
import { CaseFileService } from "../../shared/case_file/case_file.service";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { UserService } from "../../common/user.service";
import { EventPublisherService } from "../../event_publisher/event_publisher.service";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";
import { Point } from "src/common/custom_scalars";

@Injectable()
export class InspectionService {
  constructor(
    private readonly prisma: InspectionPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
    private readonly caseFileService: CaseFileService,
    private readonly shared: SharedPrismaService,
    private readonly user: UserService,
    private readonly eventPublisher: EventPublisherService,
    private readonly caseActivityService: CaseActivityService,
  ) {}

  private readonly logger = new Logger(InspectionService.name);

  async findOne(inspectionGuid: string) {
    const prismaInspection = await this.prisma.inspection.findUnique({
      where: {
        inspection_guid: inspectionGuid,
      },
      include: {
        inspection_status_code: true,
        inspection_party: {
          include: {
            inspection_person: {
              where: {
                active_ind: true,
              },
            },
            inspection_business: {
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

    if (!prismaInspection) {
      throw new Error(`Inspection with guid ${inspectionGuid} not found`);
    }
    await this.getLocationGeometryPoint(prismaInspection as inspection);

    try {
      return this.mapper.map<inspection, Inspection>(prismaInspection as inspection, "inspection", "Inspection");
    } catch (error) {
      this.logger.error("Error mapping inspection:", error);
      throw error;
    }
  }

  async findMany(ids: string[]): Promise<Inspection[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const prismaInspections = await this.prisma.inspection.findMany({
      where: {
        inspection_guid: {
          in: ids,
        },
      },
      include: {
        inspection_status_code: true,
      },
    });
    for (const inv of prismaInspections) {
      await this.getLocationGeometryPoint(inv as inspection);
    }

    try {
      return this.mapper.mapArray<inspection, Inspection>(
        prismaInspections as Array<inspection>,
        "inspection",
        "Inspection",
      );
    } catch (error) {
      this.logger.error("Error fetching inspections by IDs:", error);
      throw error;
    }
  }

  async findManyByParty(partyId: string, partyType: string): Promise<Inspection[]> {
    if (!partyId || !partyType) {
      return [];
    }

    let prismaParties = null;

    if (partyType == "Person") {
      prismaParties = await this.prisma.inspection_person.findMany({
        where: {
          person_guid_ref: partyId,
          active_ind: true,
        },
        include: {
          inspection_party: {
            include: {
              inspection: true,
            },
          },
        },
      });
    } else if (partyType == "Business") {
      prismaParties = await this.prisma.inspection_business.findMany({
        where: {
          business_guid_ref: partyId,
          active_ind: true,
        },
        include: {
          inspection_party: {
            include: {
              inspection: true,
            },
            where: {
              active_ind: true,
            },
          },
        },
      });
    }
    const prismaInspections = prismaParties.map((party) => {
      return party.inspection_party?.inspection;
    });

    try {
      return this.mapper.mapArray<inspection, Inspection>(
        prismaInspections as Array<inspection>,
        "inspection",
        "Inspection",
      );
    } catch (error) {
      this.logger.error("Error fetching inspections by Party IDs:", error);
      throw error;
    }
  }

  async search(page: number = 1, pageSize: number = 25, filters?: InspectionFilters): Promise<InspectionResult> {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { display_name: { contains: filters.search, mode: "insensitive" } },
        { inspection_guid: { equals: filters.search } },
      ];
    }

    if (filters?.leadAgency) {
      where.owned_by_agency_ref = filters.leadAgency;
    }

    if (filters?.inspectionStatus) {
      where.inspection_status = filters.inspectionStatus;
    }

    if (filters?.startDate || filters?.endDate) {
      where.inspection_opened_utc_timestamp = {};

      if (filters?.startDate) {
        where.inspection_opened_utc_timestamp.gte = filters.startDate;
      }

      if (filters?.endDate) {
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.inspection_opened_utc_timestamp.lte = endOfDay;
      }
    }

    // map filters to db columns
    const sortFieldMap: Record<string, string> = {
      inspectionGuid: "inspection_guid",
      openedTimestamp: "inspection_opened_utc_timestamp",
      leadAgency: "owned_by_agency_ref",
      inspectionStatus: "inspection_status",
      name: "name",
    };

    let orderBy: any = { inspection_opened_utc_timestamp: "desc" }; // Default sort

    if (filters?.sortBy && filters?.sortOrder) {
      const dbField = sortFieldMap[filters.sortBy];
      const validSortOrder = filters.sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      if (dbField) {
        orderBy = { [dbField]: validSortOrder };
      }
    }

    // Use the pagination utility to handle pagination logic and return pageInfo meta
    const result = await this.paginationUtility.paginate<inspection, Inspection>(
      { page, pageSize },
      {
        prismaService: this.prisma,
        modelName: "inspection",
        sourceTypeName: "inspection",
        destinationTypeName: "Inspection",
        mapper: this.mapper,
        whereClause: where,
        includeClause: {
          officer_inspection_xref: true,
          inspection_status_code: true,
        },
        orderByClause: orderBy,
      },
    );
    return {
      items: result.items,
      pageInfo: result.pageInfo as PageInfo,
    };
  }

  async create(input: CreateInspectionInput): Promise<Inspection> {
    // Verify case file exists
    const caseFile = await this.shared.case_file.findUnique({
      where: {
        case_file_guid: input.caseIdentifier,
      },
    });

    if (!caseFile) {
      throw new Error(`Case file with guid ${input.caseIdentifier} not found`);
    }

    // Create the inspection
    let inspection;
    await this.prisma.$transaction(async (tx) => {
      try {
        inspection = await this.prisma.inspection.create({
          data: {
            inspection_status: input.inspectionStatus,
            inspection_description: input.description,
            owned_by_agency_ref: input.leadAgency,
            location_address: input.locationAddress,
            location_description: input.locationDescription,
            name: input.name,
            inspection_opened_utc_timestamp: new Date(),
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
          include: {
            inspection_status_code: true,
          },
        });
      } catch (error) {
        this.logger.error("Error creating inspection:", error);
        throw error;
      }
      await this.updateLocationGeometryPoint(tx, inspection.inspection_guid, input.locationGeometry);
    });
    await this.getLocationGeometryPoint(inspection as inspection);
    // Try to create case activity record, and if it fails, delete the inspection
    try {
      await this.caseActivityService.create({
        caseFileGuid: input.caseIdentifier,
        activityType: "INSPECTION",
        activityIdentifier: inspection.inspection_guid,
      });
    } catch (activityError) {
      // Attempt to delete the inspection that was just created since the case activity creation failed
      // This is done to prevent orphaned inspections as this violates the current understanding of the business rules
      try {
        await this.prisma.inspection.delete({
          where: { inspection_guid: inspection.inspection_guid },
        });
      } catch (deleteError) {
        this.logger.error(
          `Error creating case activity, cleanup deletion of inspection with guid ${inspection.inspection_guid} failed:`,
          deleteError,
        );
        // Throw a combined error
        throw new Error(
          `Error deleting inspection record after case activity creation failed. Activity error: ${activityError}. Cleanup error: ${deleteError}`,
        );
      }
      // Successfully deleted the inspection record
      this.logger.error("Error creating case activity, inspection record deleted:", activityError);
      throw new Error(
        `Failed to create case activity for inspection. The inspection was rolled back. Error: ${activityError}`,
      );
    }

    try {
      return this.mapper.map<inspection, Inspection>(inspection as inspection, "inspection", "Inspection");
    } catch (error) {
      this.logger.error("Error mapping inspection:", error);
      throw error;
    }
  }

  async update(inspectionGuid: string, input: UpdateInspectionInput): Promise<Inspection> {
    // Check if the inspection exists
    const existingInspection = await this.prisma.inspection.findUnique({
      where: { inspection_guid: inspectionGuid },
    });

    if (!existingInspection) {
      throw new Error(`Inspection with guid ${inspectionGuid} not found.`);
    }
    let updatedInspection;
    await this.prisma.$transaction(async (tx) => {
      try {
        const updateData: any = {
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        };

        if (input.leadAgency !== undefined) {
          updateData.owned_by_agency_ref = input.leadAgency;
        }
        if (input.inspectionStatus !== undefined) {
          updateData.inspection_status = input.inspectionStatus;
        }
        if (input.description !== undefined) {
          updateData.inspection_description = input.description;
        }
        if (input.name !== undefined) {
          updateData.name = input.name;
        }
        if (input.locationAddress !== undefined) {
          updateData.location_address = input.locationAddress;
        }
        if (input.locationDescription !== undefined) {
          updateData.location_description = input.locationDescription;
        }
        // Perform the update
        updatedInspection = await this.prisma.inspection.update({
          where: { inspection_guid: inspectionGuid },
          data: updateData,
          include: {
            inspection_status_code: true,
          },
        });
        await this.updateLocationGeometryPoint(tx, inspectionGuid, input.locationGeometry);
      } catch (error) {
        this.logger.error(`Error updating inspection with guid ${inspectionGuid}:`, error);
        throw error;
      }
    });
    if (input.inspectionStatus !== undefined) {
      this.eventPublisher.publishActivityStatusChangeEvents("INSPECTION", inspectionGuid, input.inspectionStatus);
    }
    await this.getLocationGeometryPoint(updatedInspection as inspection);
    try {
      return this.mapper.map<inspection, Inspection>(updatedInspection as inspection, "inspection", "Inspection");
    } catch (error) {
      this.logger.error(`Error mapping inspection with guid ${inspectionGuid}:`, error);
      throw error;
    }
  }

  async checkNameExists(name: string, leadAgency: string, excludeInspectionGuid?: string): Promise<boolean> {
    const where: any = {
      name: {
        equals: name,
        mode: "insensitive",
      },
      owned_by_agency_ref: leadAgency,
    };

    if (excludeInspectionGuid) {
      where.inspection_guid = {
        not: excludeInspectionGuid,
      };
    }

    const existingInspection = await this.prisma.inspection.findFirst({
      where,
    });

    return !!existingInspection;
  }

  async getLocationGeometryPoint(inspection: inspection): Promise<void> {
    try {
      let result: inspection[];
      const query = `
        SELECT
            public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
        FROM inspection
        WHERE inspection_guid = '${inspection.inspection_guid}'::uuid
      `;
      result = await this.prisma.$queryRawUnsafe(query);
      if (result.length === 0) {
        throw new Error(`Inspection with guid ${inspection.inspection_guid} not found.`);
      }
      inspection.location_geometry_point = result[0].location_geometry_point;
    } catch (error) {
      this.logger.error(
        `Error fetching location geometry point for inspection with guid ${inspection.inspection_guid}:`,
        error,
      );
      throw error;
    }
  }

  async updateLocationGeometryPoint(tx: any, inspectionGuid: string, point: Point): Promise<void> {
    let point_data = null;
    if (point) {
      point_data = `public.ST_GeomFromGeoJSON('${JSON.stringify(point)}')`;
    }
    try {
      const query = `
        UPDATE inspection
        SET location_geometry_point = ${point_data}
        WHERE inspection_guid = '${inspectionGuid}'::uuid
      `;
      if (tx) {
        await tx.$executeRawUnsafe(query);
      } else {
        await this.prisma.$executeRawUnsafe(query);
      }
    } catch (error) {
      this.logger.error(`Error updating location geometry point for inspection with guid ${inspectionGuid}:`, error);
      throw error;
    }
  }
}
