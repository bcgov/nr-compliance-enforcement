import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
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
import { CaseFileService } from "src/shared/case_file/case_file.service";
import { Point } from "src/common/custom_scalars";
import { EventPublisherService } from "src/event_publisher/event_publisher.service";
import { CaseActivityService } from "src/shared/case_activity/case_activity.service";
import { PointFeature } from "supercluster";
import { GeoJsonProperties } from "geojson";
import { InvestigationSearchMapParameters } from "./dto/search-map-parameters";
import { SearchMapResults } from "./dto/search-map-results";
import { MapSearchUtility } from "../../common/map_search.utility";
import { generateInvestigationIdentifier } from "src/common/sequence.utility";
import { PARTY_TYPES } from "src/common/party";
import { withRlsTransaction } from "../../pg-session-extension/with-rls-transaction";
import { Prisma } from ".prisma/investigation";

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
    const prismaInvestigation = await withRlsTransaction(this.prisma, async (db) => {
      const found = await db.investigation.findUnique({
        where: {
          investigation_guid: investigationGuid,
        },
        include: {
          investigation_status_code: true,
          investigation_party: {
            include: {
              investigation_contact_method: {
                where: {
                  active_ind: true,
                },
              },
              investigation_alias: {
                where: {
                  active_ind: true,
                },
              },
              investigation_attachment_reference: {
                where: {
                  active_ind: true,
                },
              },
              investigation_address: {
                include: {
                  investigation_contact_method: true,
                },
                where: {
                  active_ind: true,
                },
              },
              investigation_person: {
                include: {
                  investigation_person_facial_hair_style_code_ref: {
                    where: {
                      active_ind: true,
                    },
                  },
                },
                where: {
                  active_ind: true,
                },
              },
              investigation_business: {
                where: {
                  active_ind: true,
                },
                include: {
                  investigation_business_person_xref: {
                    include: {
                      investigation_business_person_address_xref: {
                        where: {
                          active_ind: true,
                        },
                        include: {
                          investigation_address: true,
                        },
                      },
                      investigation_person: {
                        include: {
                          investigation_party: {
                            include: {
                              investigation_contact_method: {
                                where: {
                                  active_ind: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    where: {
                      active_ind: true,
                    },
                  },
                  investigation_business_identifier: {
                    where: {
                      active_ind: true,
                    },
                  },
                },
              },
            },
            where: {
              active_ind: true,
              // filter business contacts
              NOT: { party_type_code_ref: PARTY_TYPES.Contact },
            },
          },
          task: {
            where: {
              active_ind: true,
            },
            orderBy: {
              create_utc_timestamp: "asc",
            },
          },
          contravention: {
            include: {
              contravention_party_xref: {
                include: {
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
                  },
                  enforcement_action: {
                    where: {
                      active_ind: true,
                    },
                    orderBy: {
                      create_utc_timestamp: "asc",
                    },
                    include: {
                      ticket: {
                        where: {
                          active_ind: true,
                        },
                      },
                      enforcement_action_code_enforcement_action_enforcement_action_codeToenforcement_action_code: true,
                      contravention_party_xref: {
                        include: {
                          contravention: true,
                          enforcement_action: true,
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
            orderBy: {
              create_utc_timestamp: "asc",
            },
          },
        },
      });
      if (!found) {
        return null;
      }
      (found as investigation).location_geometry_point =
        (await this.fetchLocationGeometryPoints([investigationGuid], db)).get(investigationGuid) ?? null;
      return found;
    });
    if (!prismaInvestigation) {
      throw new NotFoundException();
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

    const prismaInvestigations = await withRlsTransaction(this.prisma, async (db) => {
      const found = await db.investigation.findMany({
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

      const guids = found.map((inv) => inv.investigation_guid);
      const geometryByGuid = await this.fetchLocationGeometryPoints(guids, db);
      for (const inv of found) {
        (inv as investigation).location_geometry_point = geometryByGuid.get(inv.investigation_guid) ?? null;
      }
      return found;
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

  async findManyByParty(partyId: string, partyType: string): Promise<Investigation[]> {
    if (!partyId || !partyType) {
      return [];
    }

    let prismaParties = null;

    const include = Prisma.validator<Prisma.investigation_personInclude>()({
      investigation_party: {
        include: {
          investigation: {
            include: {
              contravention: {
                include: {
                  contravention_party_xref: {
                    include: {
                      investigation_party: {
                        select: {
                          party_guid_ref: true,
                        },
                      },
                      enforcement_action: {
                        include: {
                          ticket: true,
                          contravention_party_xref: true,
                          enforcement_action_code_enforcement_action_enforcement_action_codeToenforcement_action_code:
                            true,
                        },
                        where: { active_ind: true },
                      },
                    },
                    where: { active_ind: true },
                  },
                },
                where: { active_ind: true },
              },
              investigation_status_code: true,
            },
          },
        },
        where: {
          active_ind: true,
        },
      },
    });

    if (partyType == "PRS") {
      prismaParties = await this.prisma.investigation_person.findMany({
        where: {
          person_guid_ref: partyId,
          active_ind: true,
          investigation_party: { is: { active_ind: true } },
        },
        include,
      });
    } else if (partyType == "CMP") {
      prismaParties = await this.prisma.investigation_business.findMany({
        where: {
          business_guid_ref: partyId,
          active_ind: true,
          investigation_party: { is: { active_ind: true } },
        },
        include,
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
      const mappingError = error as Error;
      this.logger.error(`Error mapping investigations by Party IDs: ${mappingError.message}`, mappingError.stack);
      throw error;
    }
  }

  async create(input: CreateInvestigationInput): Promise<Investigation> {
    let caseIdentifier = input.caseIdentifier;
    const leadAgency = input.leadAgency;
    const investigationStatus = input.investigationStatus ?? "OPEN";

    // Automatically open a case file if one is not provided
    if (!caseIdentifier) {
      const newCase = await this.caseFileService.create({
        leadAgency,
        caseStatus: "OPEN",
        description: "Auto-generated case file for investigation",
        createdByAppUserGuid: input.createdByAppUserGuid,
      });
      caseIdentifier = newCase.caseIdentifier;
    }

    // Verify case file exists
    const caseFile = await this.shared.case_file.findUnique({
      where: {
        case_file_guid: caseIdentifier,
      },
    });

    if (!caseFile) {
      throw new Error(`Case file with guid ${caseIdentifier} not found`);
    }

    const existingInvestigationCount = await this.caseActivityService.countByActivityType(caseIdentifier, "INVSTGTN");
    const generatedName = generateInvestigationIdentifier(caseFile.name, existingInvestigationCount);

    // Create the investigation
    let investigation;
    await withRlsTransaction(this.prisma, async (db) => {
      try {
        investigation = await db.investigation.create({
          data: {
            investigation_status: investigationStatus,
            investigation_description: input.description,
            owned_by_agency_ref: leadAgency,
            name: generatedName,
            investigation_opened_utc_timestamp: new Date(),
            location_address: input.locationAddress || null,
            location_description: input.locationDescription || null,
            primary_investigator_guid_ref: input.primaryInvestigatorGuid || null,
            supervisor_guid_ref: input.supervisorGuid || null,
            file_coordinator_guid_ref: input.fileCoordinatorGuid || null,
            discovery_date_utc_date: input.discoveryDate,
            discovery_date_utc_time: input.discoveryTime,
            geo_organization_unit_code_ref: input.community || null,
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
      await this.updateLocationGeometryPoint(db, investigation.investigation_guid, input.locationGeometry);
      investigation.location_geometry_point =
        (await this.fetchLocationGeometryPoints([investigation.investigation_guid], db)).get(
          investigation.investigation_guid,
        ) ?? null;
    });
    // Try to create case activity record, and if it fails, delete the investigation
    try {
      await this.caseActivityService.create({
        caseFileGuid: caseIdentifier,
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

    if (input.complaintIdentifier) {
      try {
        await this.caseActivityService.create({
          caseFileGuid: caseIdentifier,
          activityType: "COMP",
          activityIdentifier: input.complaintIdentifier,
        });
      } catch (error) {
        this.logger.error("Error creating case activity for complaint association with investigation:", error);
        throw new Error(`Failed to create case activity for complaint association. Error: ${error}`);
      }
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
    await withRlsTransaction(this.prisma, async (db) => {
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
        if (input.locationAddress !== undefined) {
          updateData.location_address = input.locationAddress;
        }
        if (input.locationDescription !== undefined) {
          updateData.location_description = input.locationDescription;
        }
        if (input.primaryInvestigatorGuid !== undefined) {
          updateData.primary_investigator_guid_ref = input.primaryInvestigatorGuid;
        }
        if (input.supervisorGuid !== undefined) {
          updateData.supervisor_guid_ref = input.supervisorGuid;
        }

        if (input.fileCoordinatorGuid === "") {
          updateData.file_coordinator_guid_ref = null;
        } else {
          updateData.file_coordinator_guid_ref = input.fileCoordinatorGuid;
        }

        if (input.discoveryDate !== undefined) {
          updateData.discovery_date_utc_date = input.discoveryDate;
        }
        if (input.discoveryTime !== undefined) {
          updateData.discovery_date_utc_time = input.discoveryTime;
        }
        if (input.community !== undefined) {
          updateData.geo_organization_unit_code_ref = input.community || null;
        }
        // Perform the update
        updatedInvestigation = await db.investigation.update({
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
        await this.updateLocationGeometryPoint(db, investigationGuid, input.locationGeometry);
        updatedInvestigation.location_geometry_point =
          (await this.fetchLocationGeometryPoints([investigationGuid], db)).get(investigationGuid) ?? null;
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
    updatedTimestamp: "update_utc_timestamp",
    leadAgency: "owned_by_agency_ref",
    investigationStatus: "investigation_status",
    name: "name",
    community: "geo_organization_unit_code_ref",
    locationAddress: "location_address",
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

    if (filters?.community) {
      where.geo_organization_unit_code_ref = filters.community;
    }

    if (filters?.primaryInvestigator) {
      where.primary_investigator_guid_ref = filters.primaryInvestigator;
    }

    if (filters?.fileCoordinator) {
      where.file_coordinator_guid_ref = filters.fileCoordinator;
    }

    if (filters?.supervisor) {
      where.supervisor_guid_ref = filters.supervisor;
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
      pageInfo: result.pageInfo,
    };
  }

  async searchMap(model: InvestigationSearchMapParameters): Promise<SearchMapResults> {
    try {
      const { bboxArray, isGlobalSearch } = MapSearchUtility.getBoundingBoxParameters(model.bbox);
      const where = this._buildInvestigationWhereClause(model.filters);

      return await withRlsTransaction(this.prisma, async (db) => {
        const investigations = await db.investigation.findMany({
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
        const unmappedResult = await db.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*) as count
          FROM investigation.investigation
          WHERE investigation_guid = ANY(${investigationGuids}::uuid[])
            AND (
              location_geometry_point IS NULL OR
              public.ST_X(location_geometry_point) = 0 OR
              public.ST_Y(location_geometry_point) = 0
            )
        `;

        // Get mappable results
        const mappedInvestigations = await db.$queryRaw<
          Array<{ investigation_guid: string; location_geometry_point: any }>
        >`
          SELECT
            investigation_guid,
            public.ST_AsGeoJSON(location_geometry_point)::json as location_geometry_point
          FROM investigation.investigation
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
      });
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

  // Get geometry points for many investigations. Accepts an optional transaction client so the read can reuse the connection.
  private async fetchLocationGeometryPoints(investigationGuids: string[], tx?: any): Promise<Map<string, any>> {
    const map = new Map<string, any>();
    if (investigationGuids.length === 0) return map;
    const client = tx ?? this.prisma;
    try {
      const rows = await client.$queryRaw<Array<{ investigation_guid: string; location_geometry_point: any }>>`
        SELECT investigation_guid,
               public.ST_AsGeoJSON(location_geometry_point)::json AS location_geometry_point
        FROM investigation.investigation
        WHERE investigation_guid = ANY(${investigationGuids}::uuid[])
      `;
      for (const row of rows) {
        map.set(row.investigation_guid, row.location_geometry_point);
      }
      return map;
    } catch (error) {
      this.logger.error("Error batch-fetching investigation location geometry points:", error);
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
        UPDATE investigation.investigation
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

  async updateInvestigationTimestamp(investigationGuid: string): Promise<void> {
    try {
      await this.prisma.investigation.update({
        where: { investigation_guid: investigationGuid },
        data: {
          update_utc_timestamp: new Date(),
          update_user_id: this.user.getIdirUsername(),
        },
      });
    } catch (error) {
      this.logger.error(
        `Error updating investigation timestamp for investigation with guid ${investigationGuid}:`,
        error,
      );
      throw error;
    }
  }
}
