import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party } from "../../../prisma/shared/generated/party";
import { Party, PartyCreateInput, PartyFilters, PartyResult, PartyUpdateInput } from "./dto/party";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";
import { PageInfo } from "../case_file/dto/case_file";

@Injectable()
export class PartyService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
  ) {}

  private readonly logger = new Logger(PartyService.name);

  async findOne(id: string) {
    const prismaParty = await this.prisma.party.findUnique({
      where: {
        party_guid: id,
      },
      select: {
        party_guid: true,
        party_type: true,
        create_utc_timestamp: true,
        party_type_code: {
          select: {
            party_type_code: true,
            short_description: true,
            long_description: true,
          },
        },
        business: {
          select: {
            business_guid: true,
            name: true,
          },
        },
        person: {
          select: {
            person_guid: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    try {
      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error mapping party of interest", error);
    }
  }

  async findMany(ids: string[]): Promise<Party[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const prismaParties = await this.prisma.party.findMany({
      where: {
        party_guid: {
          in: ids,
        },
      },
      select: {
        party_guid: true,
        party_type: true,
        create_utc_timestamp: true,
        person: {
          select: {
            person_guid: true,
            first_name: true,
            last_name: true,
          },
        },
        business: {
          select: {
            business_guid: true,
            name: true,
          },
        },
        party_type_code: {
          select: {
            party_type_code: true,
            short_description: true,
            long_description: true,
          },
        },
      },
    });

    try {
      return this.mapper.mapArray<party, Party>(prismaParties as Array<party>, "party", "Party");
    } catch (error) {
      this.logger.error("Error fetching parties by IDs:", error);
      throw error;
    }
  }

  async create(input: PartyCreateInput): Promise<Party> {
    const prismaParty = await this.prisma.party.create({
      data: {
        party_type: input.partyTypeCode,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        // Conditionally insert data into person or business table
        ...(input.partyTypeCode === "PRS"
          ? {
              person: {
                create: {
                  first_name: input.person?.firstName,
                  last_name: input.person?.lastName,
                  create_user_id: this.user.getIdirUsername(),
                  create_utc_timestamp: new Date(),
                },
              },
            }
          : {
              business: {
                create: {
                  name: input.business?.name,
                  create_user_id: this.user.getIdirUsername(),
                  create_utc_timestamp: new Date(),
                },
              },
            }),
      },
      include: {
        party_type_code: true,
        person: true,
        business: true,
      },
    });

    try {
      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error creating party:", error);
      throw error;
    }
  }

  async update(partyIdentifier: string, input: PartyUpdateInput): Promise<Party> {
    const existingParty = await this.prisma.party.findUnique({
      where: { party_guid: partyIdentifier },
    });
    if (!existingParty) throw new Error("Party not found");

    const prismaParty = await this.prisma.party.update({
      where: { party_guid: partyIdentifier },
      data: {
        party_type: input.partyTypeCode,
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
        // Conditionally update data in person or business table
        ...(input.partyTypeCode === "PRS"
          ? {
              person: {
                update: {
                  first_name: input.person?.firstName,
                  last_name: input.person?.lastName,
                  update_user_id: this.user.getIdirUsername(),
                  update_utc_timestamp: new Date(),
                },
              },
            }
          : {
              business: {
                update: {
                  name: input.business?.name,
                  update_user_id: this.user.getIdirUsername(),
                  update_utc_timestamp: new Date(),
                },
              },
            }),
      },
      include: {
        party_type_code: true,
        person: true,
        business: true,
      },
    });

    try {
      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error updating party:", error);
      throw error;
    }
  }

  async search(page: number = 1, pageSize: number = 25, filters?: PartyFilters): Promise<PartyResult> {
    const where: any = {};

    if (filters?.search) {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(filters.search)) {
        where.OR = [{ party_guid: { equals: filters.search } }];
      } else {
        where.OR = [
          { party_type: { equals: filters.search } },
          { business: { name: { contains: filters.search, mode: "insensitive" } } },
          { person: { first_name: { contains: filters.search, mode: "insensitive" } } },
          { person: { last_name: { contains: filters.search, mode: "insensitive" } } },
        ];
      }
    }

    if (filters?.partyTypeCode) {
      where.party_type = filters.partyTypeCode;
    }

    const sortFieldMap: Record<string, string> = {
      partyIdentifier: "party_guid",
      partyType: "party_type",
    };

    let orderBy: any = { party_guid: "desc" }; // Default sort

    if (filters?.sortBy && filters?.sortOrder) {
      const validSortOrder = filters.sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      switch (filters?.sortBy) {
        case "firstName":
          orderBy = { person: { first_name: validSortOrder } };
          break;
        case "lastName":
          orderBy = { person: { last_name: validSortOrder } };
          break;
        case "name":
          orderBy = { business: { name: validSortOrder } };
          break;
        default:
          const dbField = sortFieldMap[filters.sortBy];
          if (dbField) {
            orderBy = { [dbField]: validSortOrder };
          }
      }
    }

    // Use the pagination utility to handle pagination logic and return pageInfo meta
    const result = await this.paginationUtility.paginate<party, Party>(
      { page, pageSize },
      {
        prismaService: this.prisma,
        modelName: "party",
        sourceTypeName: "party",
        destinationTypeName: "Party",
        mapper: this.mapper,
        whereClause: where,
        includeClause: {
          party_type_code: {
            select: {
              party_type_code: true,
              short_description: true,
              long_description: true,
            },
          },
          business: {
            select: {
              business_guid: true,
              name: true,
            },
          },
          person: {
            select: {
              person_guid: true,
              first_name: true,
              last_name: true,
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
