import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
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
import { EventPublisherService } from "src/event_publisher/event_publisher.service";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";
import { PointFeature } from "supercluster";
import { GeoJsonProperties } from "geojson";
import { InvestigationSearchMapParameters } from "./dto/search-map-parameters";
import { SearchMapResults } from "./dto/search-map-results";
import { MapSearchUtility } from "../../common/map_search.utility";

@Injectable()
export class InvestigationService {
  private readonly logger = new Logger(InvestigationService.name);

  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
    private readonly shared: SharedPrismaService,
    private readonly paginationUtility: PaginationUtility,
    private readonly caseFileService: CaseFileService,
    private readonly eventPublisher: EventPublisherService,
    private readonly caseActivityService: CaseActivityService,
  ) {}

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
        contravention: {
          include: {
            contravention_party_xref: {
              include: {
                investigation_party: {
                  // Allows the person info to be mapped on the contravention object directly
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
                },
              },
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
    await this.getLocationGeometryPoint(prismaInvestigation as investigation);

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
    for (const inv of prismaInvestigations) {
      await this.getLocationGeometryPoint(inv as investigation);
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

  async findManyByParty(partyId: string, partyType: string): Promise<Investigation[]> {
    if (!partyId || !partyType) {
      return [];
    }

    let prismaParties = null;

    if (partyType == "Person") {
      prismaParties = await this.prisma.investigation_person.findMany({
        where: {
          person_guid_ref: partyId,
          active_ind: true,
          investigation_party: {
            is: {
              active_ind: true,
            },
          },
        },
        include: {
          investigation_party: {
            include: {
              investigation: true,
            },
            where: {
              active_ind: true,
            },
          },
        },
      });
    } else if (partyType == "Business") {
      prismaParties = await this.prisma.investigation_business.findMany({
        where: {
          business_guid_ref: partyId,
          active_ind: true,
          investigation_party: {
            is: {
              active_ind: true,
            },
          },
        },
        include: {
          investigation_party: {
            include: {
              investigation: true,
            },
            where: {
              active_ind: true,
            },
          },
        },
      });
    }
    const prismaInvestigations = prismaParties.map((party) => {
      return party.investigation_party?.investigation;
    });

    try {
      return this.mapper.mapArray<investigation, Investigation>(
        prismaInvestigations as Array<investigation>,
        "investigation",
        "Investigation",
      );
    } catch (error) {
      this.logger.error("Error fetching investigations by Party IDs:", error);
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
    await this.prisma.$transaction(async (tx) => {
      try {
        investigation = await this.prisma.investigation.create({
          data: {
            investigation_status: input.investigationStatus,
            investigation_description: input.description,
            owned_by_agency_ref: input.leadAgency,
            name: input.name,
            investigation_opened_utc_timestamp: new Date(),
            create_user_id: this.user.getIdirUsername(),
            created_by_app_user_guid_ref: input.createdByAppUserGuid,
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
      await this.updateLocationGeometryPoint(tx, investigation.investigation_guid, input.locationGeometry);
    });
    await this.getLocationGeometryPoint(investigation as investigation);
    // Try to create case activity record, and if it fails, delete the investigation
    try {
      await this.caseActivityService.create({
        caseFileGuid: input.caseIdentifier,
        activityType: "INVSTGTN",
        activityIdentifier: investigation.investigation_guid,
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
    await this.prisma.$transaction(async (tx) => {
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
        if (input.locationAddress !== undefined) {
          updateData.location_address = input.locationAddress;
        }
        if (input.locationDescription !== undefined) {
          updateData.location_description = input.locationDescription;
        }
        // Perform the update
        updatedInvestigation = await tx.investigation.update({
          where: { investigation_guid: investigationGuid },
          data: updateData,
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
        await this.updateLocationGeometryPoint(tx, investigationGuid, input.locationGeometry);
      } catch (error) {
        this.logger.error(`Error updating investigation with guid ${investigationGuid}:`, error);
        throw error;
      }
    });
    if (input.investigationStatus !== undefined) {
      this.eventPublisher.publishActivityStatusChangeEvents(
        "INVESTIGATION",
        investigationGuid,
        input.investigationStatus,
      );
    }
    await this.getLocationGeometryPoint(updatedInvestigation as investigation);
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

  // ============================================================================
  // Search, Filter and Map Search
  // ============================================================================

  private readonly SORT_FIELD_MAP: Record<string, string> = {
    investigationGuid: "investigation_guid",
    openedTimestamp: "investigation_opened_utc_timestamp",
    leadAgency: "owned_by_agency_ref",
    investigationStatus: "investigation_status",
    name: "name",
  };

  private _buildInvestigationWhereClause(filters?: InvestigationFilters): any {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: "insensitive" };
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

    return where;
  }

  private _buildInvestigationOrderByClause(filters?: InvestigationFilters): any {
    let orderBy: any = { investigation_opened_utc_timestamp: "desc" };

    if (filters?.sortBy && filters?.sortOrder) {
      const dbField = this.SORT_FIELD_MAP[filters.sortBy];
      const validSortOrder = filters.sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      if (dbField) {
        orderBy = { [dbField]: validSortOrder };
      }
    }

    return orderBy;
  }

  async search(page: number = 1, pageSize: number = 25, filters?: InvestigationFilters): Promise<InvestigationResult> {
    const where = this._buildInvestigationWhereClause(filters);
    const orderBy = this._buildInvestigationOrderByClause(filters);

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

  async searchMap(model: InvestigationSearchMapParameters): Promise<SearchMapResults> {
    try {
      const { bboxArray, isGlobalSearch } = MapSearchUtility.getBoundingBoxParameters(model.bbox);

      const where = this._buildInvestigationWhereClause(model.filters);
      const investigations = await this.prisma.investigation.findMany({
        where,
        select: {
          investigation_guid: true,
        },
      });
      const investigationGuids = investigations.map((inv) => inv.investigation_guid);

      if (investigationGuids.length === 0) {
        // Pass false when there are no results to prevent unwanted reposition
        return MapSearchUtility.buildSearchMapResults([], 0, model.zoom, bboxArray, false);
      }

      // Get unmappable results. Raw SQL is required for PostGIS operations.
      const unmappedResult = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count
        FROM investigation
        WHERE investigation_guid = ANY(${investigationGuids}::uuid[])
          AND (
            location_geometry_point IS NULL OR
            public.ST_X(location_geometry_point) = 0 OR
            public.ST_Y(location_geometry_point) = 0
          )
      `;

      // Get mappable results
      const mappedInvestigations = await this.prisma.$queryRaw<
        Array<{ investigation_guid: string; location_geometry_point: any }>
      >`
        SELECT
          investigation_guid,
          public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
        FROM investigation
        WHERE investigation_guid = ANY(${investigationGuids}::uuid[])
          AND location_geometry_point IS NOT NULL
          AND public.ST_X(location_geometry_point) <> 0
          AND public.ST_Y(location_geometry_point) <> 0
          AND public.ST_Intersects(
            public.ST_SetSRID(location_geometry_point, 4326),
            public.ST_MakeEnvelope(${bboxArray[0]}, ${bboxArray[1]}, ${bboxArray[2]}, ${bboxArray[3]}, 4326)
          )
      `;

      const points: Array<PointFeature<GeoJsonProperties>> = mappedInvestigations.map((item) => ({
        type: "Feature",
        properties: {
          cluster: false,
          id: item.investigation_guid,
        },
        geometry: item.location_geometry_point,
      }));

      return MapSearchUtility.buildSearchMapResults(
        points,
        unmappedResult[0]?.count ? Number(unmappedResult[0].count) : 0,
        model.zoom,
        bboxArray,
        isGlobalSearch,
      );
    } catch (error) {
      this.logger.error("Error performing map search:", error);
      throw new HttpException("Unable to Perform Search", HttpStatus.BAD_REQUEST);
    }
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

  async getLocationGeometryPoint(investigation: investigation): Promise<void> {
    try {
      let result: investigation[];
      const query = `
        SELECT
            public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
        FROM investigation
        WHERE investigation_guid = '${investigation.investigation_guid}'::uuid
      `;
      result = await this.prisma.$queryRawUnsafe(query);
      if (result.length === 0) {
        throw new Error(`Investigation with guid ${investigation.investigation_guid} not found.`);
      }
      investigation.location_geometry_point = result[0].location_geometry_point;
    } catch (error) {
      this.logger.error(
        `Error fetching location geometry point for investigation with guid ${investigation.investigation_guid}:`,
        error,
      );
      throw error;
    }
  }

  async updateLocationGeometryPoint(tx: any, investigationGuid: string, point: Point): Promise<void> {
    let point_data = null;
    if (point) {
      point_data = `public.ST_GeomFromGeoJSON('${JSON.stringify(point)}')`;
    }
    try {
      const query = `
        UPDATE investigation
        SET location_geometry_point = ${point_data}
        WHERE investigation_guid = '${investigationGuid}'::uuid
      `;
      if (tx) {
        await tx.$executeRawUnsafe(query);
      } else {
        await this.prisma.$executeRawUnsafe(query);
      }
    } catch (error) {
      this.logger.error(
        `Error updating location geometry point for investigation with guid ${investigationGuid}:`,
        error,
      );
      throw error;
    }
  }
}
