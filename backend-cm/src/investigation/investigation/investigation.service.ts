import { Dictionary, Mapper } from "@automapper/core";
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
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
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

  private templateData(
        this: any,
        data: Dictionary<any>
      ): string[] {
        const timestamp_pattern = /timestamp$/;
        const geometry_pattern = /geometry_point$/;
        const queryData: string[] = [];
        Object.keys(data).forEach((key) => {
          let value = (data as any)[key];
          if (key.match(geometry_pattern)) {
            if (value !== null && value !== undefined) {
              value = `public.ST_GeomFromGeoJSON('${JSON.stringify(data.location_geometry_point)}')`;
            } else {
              value = 'NULL';
            }
          } else if (key.match(timestamp_pattern)) {
            if (value !== null && value !== undefined) {
              value = `'${(value as Date).toISOString()}'`;
            } else {
              value = 'NULL';
            }
          } else {
            value = `'${value}'`;
          }
          queryData.push(`${key} = ${value}`);
        });
        return queryData;
      }

  async findOne(investigationGuid: string): Promise<Investigation | null> {
    const queryString = `
      SELECT
        investigation_guid,
        investigation_description,
        owned_by_agency_ref,
        investigation_status,
        investigation_opened_utc_timestamp,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        location_address,
        location_description,
        public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
      FROM investigation.investigation
      WHERE investigation_guid = '${investigationGuid}'::uuid
      LIMIT 1
    `;
    const result = (await this.prisma.$queryRawUnsafe(queryString)) as investigation[];
    if (result.length === 0) return null;
    const prismaInvestigation = result[0];
    // Handle includes manually
    const statusCode = await this.prisma.investigation_status_code.findUnique({
      where: { investigation_status_code: prismaInvestigation.investigation_status }
    });
    Object.assign(prismaInvestigation, { investigation_status_code: statusCode });

    const parties = await this.prisma.investigation_party.findMany({
      where: { investigation_guid: prismaInvestigation.investigation_guid, active_ind: true },
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
    });
    Object.assign(prismaInvestigation, { investigation_party: parties });
    
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

  async findMany(ids: string[],
    include?: {
      investigation_status_code?: boolean;
    }
  ): Promise<Investigation[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const guidList = ids.map(id => `'${id}'::uuid`).join(', ');
    const queryString = `
      SELECT
        investigation_guid,
        investigation_description,
        owned_by_agency_ref,
        investigation_status,
        investigation_opened_utc_timestamp,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        location_address,
        location_description,
        public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
      FROM investigation.investigation
      WHERE investigation_guid IN (${guidList})
    `;
    const prismaInvestigations = (await this.prisma.$queryRawUnsafe(queryString)) as investigation[];
    for (const inv of prismaInvestigations) {
      const statusCode = await this.prisma.investigation_status_code.findUnique({
        where: { investigation_status_code: inv.investigation_status },
      });
      Object.assign(inv, { investigation_status_code: statusCode });
      const xrefs = await this.prisma.officer_investigation_xref.findMany({
        where: { investigation_guid: inv.investigation_guid }
      });
      Object.assign(inv, { officer_investigation_xref: xrefs });
      const parties = await this.prisma.investigation_party.findMany({
        where: { investigation_guid: inv.investigation_guid, active_ind: true },
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
      });
      Object.assign(inv, { investigation_party: parties });
    }

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
    const data = {...input}
    Object.assign(data, {
      investigation_opened_utc_timestamp: new Date(),
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
    });
    let investigation: investigation;
    try {
      const result = (await this.prisma.$queryRaw`
        INSERT INTO investigation.investigation (
          investigation_status,
          investigation_description,
          owned_by_agency_ref,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          location_geometry_point
        )
        VALUES (
          ${this.templateData({...data}).join(', ')}
        )
        RETURNING
          investigation_guid,
          investigation_description,
          owned_by_agency_ref,
          investigation_status,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
      `) as investigation[];
      if (result.length === 0) {
        throw new Error('Failed to create investigation');
      }
      investigation = result[0];

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


  async findUnique(
      where: { investigation_guid: string },
      include: {
        investigation_status_code?: any;
        investigation_party?: any;
      }
    ): Promise<Investigation | null> {
      const queryString = `
        SELECT
          investigation_guid,
          investigation_description,
          owned_by_agency_ref,
          investigation_status,
          investigation_opened_utc_timestamp,
          create_user_id,
          create_utc_timestamp,
          update_user_id,
          update_utc_timestamp,
          location_address,
          location_description,
          public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
        FROM investigation.investigation
        WHERE investigation_guid = '${where.investigation_guid}'::uuid
        LIMIT 1
      `;
      const result = (await this.prisma.$queryRawUnsafe(queryString)) as investigation[];
      if (result.length === 0) return null;
      const inv = result[0];

      // Handle includes manually
      if (include?.investigation_status_code) {
        const statusCode = await this.prisma.investigation_status_code.findUnique({
          where: { investigation_status_code: inv.investigation_status }
        });
        Object.assign(inv, { investigation_status_code: statusCode });
      }
      if (include?.investigation_party) {
        const parties = await this.prisma.investigation_party.findMany({
          where: { investigation_guid: inv.investigation_guid },
          include: {
            investigation_person: include?.investigation_party?.investigation_person,
            investigation_business: include?.investigation_party?.investigation_business,
          },
        });
        Object.assign(inv, { investigation_party: parties });
      }
      const investigation = this.mapper.map<investigation, Investigation>(inv as investigation, "investigation", "Investigation");
      return investigation;
    }

  async update(investigationGuid: string, input: UpdateInvestigationInput): Promise<Investigation> {
    // Check if the investigation exists
    const existingInvestigation = await this.prisma.investigation.findUnique({
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
      const queryString = `
        UPDATE investigation.investigation
        SET ${this.templateData({...updateData}).join(', ')}
        WHERE investigation_guid = '${investigationGuid}'::uuid
        RETURNING
        investigation_guid,
        investigation_description,
        owned_by_agency_ref,
        investigation_status,
        investigation_opened_utc_timestamp,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        location_address,
        location_description,
        public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
      `;
      console.log('Update Query:', queryString); // Debug log
      const result = await this.prisma.$queryRawUnsafe(queryString) as investigation[];
      updatedInvestigation = result.length > 0 ? result[0] : null;
      console.log('Raw Updated Investigation:', updatedInvestigation); // Debug log
      const statusCode = await this.prisma.investigation_status_code.findUnique({
        where: { investigation_status_code: updatedInvestigation.investigation_status }
      });
      Object.assign(updatedInvestigation, { investigation_status_code: statusCode });
      const parties = await this.prisma.investigation_party.findMany({
        where: { investigation_guid: updatedInvestigation.investigation_guid, active_ind: true },
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
      });
      Object.assign(updatedInvestigation, { investigation_party: parties });
      
      console.log('Updated Investigation with Relations:', updatedInvestigation); // Debug log
  
    } catch (error) {
      console.log("update error:", error); // Debug log
      this.logger.error(`Error updating investigation with guid ${investigationGuid}:`, error);
      throw error;
    }
    try {
      console.log('Mapped Updated Investigation:', updatedInvestigation); // Debug log
      const mappedInvestigation = this.mapper.map<investigation, Investigation>(updatedInvestigation as investigation, "investigation", "Investigation");
      console.log('Mapped Updated Investigation:', mappedInvestigation); // Debug log
      return mappedInvestigation;
    } catch (error) {
      console.log("mapping error:", error); // Debug log
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
    const queryString = `
      SELECT
        investigation_guid,
        investigation_description,
        owned_by_agency_ref,
        investigation_status,
        investigation_opened_utc_timestamp,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp,
        location_address,
        location_description,
        public.ST_AsGeoJSON(location_geometry_point)::json AS location_geometry_point
      FROM investigation.investigation
      ORDER BY investigation_opened_utc_timestamp DESC
      LIMIT ${validatedPageSize}
      OFFSET ${skip}
    `;
    investigationsList = (await this.prisma.$queryRawUnsafe(queryString)) as investigation[];
    // Manually fetch related investigation_status_code, officers, parties for each investigation
    for (const inv of investigationsList) {
      const statusCode = await this.prisma.investigation_status_code.findUnique({
        where: { investigation_status_code: inv.investigation_status },
      });
      Object.assign(inv, { investigation_status_code: statusCode });
      const xrefs = await this.prisma.officer_investigation_xref.findMany({
        where: { investigation_guid: inv.investigation_guid }
      });
      Object.assign(inv, { officer_investigation_xref: xrefs });
      const parties = await this.prisma.investigation_party.findMany({
        where: { investigation_guid: inv.investigation_guid, active_ind: true },
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
      });
      Object.assign(inv, { investigation_party: parties });
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
