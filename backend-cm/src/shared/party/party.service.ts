import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party } from "../../../prisma/shared/generated/party";
import { Party, PartyCreateInput, PartyFilters, PartyResult, PartyUpdateInput } from "./dto/party";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";
import { PageInfo } from "../case_file/dto/case_file";
import { Person } from "src/shared/person/dto/person";
import { Alias } from "src/shared/alias/dto/alias";
import { alias } from "prisma/shared/generated/alias";
import { BusinessIdentifier } from "src/shared/business_identifier/dto/business_identifier";
import { business_identifier } from "prisma/shared/generated/business_identifier";

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
          include: {
            alias: {
              select: {
                alias_guid: true,
                name: true,
              },
              where: {
                active_ind: true,
              },
            },
            business_identifier: {
              select: {
                business_identifier_guid: true,
                business_guid: true,
                identifier_value: true,
                business_identifier_code_business_identifier_business_identifier_codeTobusiness_identifier_code: {
                  select: {
                    business_identifier_code: true,
                    short_description: true,
                  },
                },
              },
              where: {
                active_ind: true,
              },
            },
            contact_method: {
              select: {
                contact_method_type: true,
                contact_method_type_code: true,
                contact_value: true,
                is_primary: true,
              },
            },
            business_person_xref: {
              include: {
                person: {
                  select: {
                    person_guid: true,
                    first_name: true,
                    last_name: true,
                    contact_method: {
                      select: {
                        contact_method_type: true,
                        contact_method_type_code: true,
                        contact_value: true,
                        is_primary: true,
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
          include: {
            alias: {
              select: {
                alias_guid: true,
                name: true,
              },
              where: {
                active_ind: true,
              },
            },
            business_identifier: {
              select: {
                business_identifier_guid: true,
                business_guid: true,
                identifier_value: true,
                business_identifier_code_business_identifier_business_identifier_codeTobusiness_identifier_code: {
                  select: {
                    business_identifier_code: true,
                    short_description: true,
                  },
                },
              },
              where: {
                active_ind: true,
              },
            },
            contact_method: {
              select: {
                contact_method_type: true,
                contact_method_type_code: true,
                contact_value: true,
                is_primary: true,
              },
            },
            business_person_xref: {
              include: {
                person: {
                  select: {
                    person_guid: true,
                    first_name: true,
                    last_name: true,
                    contact_method: {
                      select: {
                        contact_method_type: true,
                        contact_method_type_code: true,
                        contact_value: true,
                        is_primary: true,
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

  private async createContactPeople(contactPeople: Person[]): Promise<string[]> {
    const contactPersonGuids: string[] = [];

    for (const person of contactPeople) {
      const personInput: PartyCreateInput = {
        partyTypeCode: "PRS",
        person: person,
      };
      const createdParty = await this.create(personInput);
      contactPersonGuids.push(createdParty.person.personGuid);
    }

    return contactPersonGuids;
  }

  async create(input: PartyCreateInput): Promise<Party> {
    let data: any;
    let contactPersonGuids = [];

    if (input.business?.contactPeople) {
      contactPersonGuids = await this.createContactPeople(input.business.contactPeople);
    }

    if (input.partyTypeCode === "PRS") {
      data = {
        party_type: input.partyTypeCode,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),

        person: {
          create: {
            first_name: input.person?.firstName,
            last_name: input.person?.lastName,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            ...(input.person?.contactMethods?.length
              ? {
                  contact_method: {
                    create: input.person.contactMethods.map((c) => ({
                      contact_method_type: c.typeCode,
                      contact_value: c.value,
                      is_primary: c.isPrimary,
                      create_user_id: this.user.getIdirUsername(),
                      create_utc_timestamp: new Date(),
                    })),
                  },
                }
              : {}),
          },
        },
      };
    } else {
      data = {
        party_type: input.partyTypeCode,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        business: {
          create: {
            name: input.business?.name,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            ...(input.business?.aliases?.length
              ? {
                  alias: {
                    create: input.business.aliases.map((a) => ({
                      name: a.name,
                      create_user_id: this.user.getIdirUsername(),
                      create_utc_timestamp: new Date(),
                    })),
                  },
                }
              : {}),
            ...(input.business?.identifiers?.length
              ? {
                  business_identifier: {
                    create: input.business.identifiers.map((i) => ({
                      business_identifier_code: i.identifierCode,
                      identifier_value: i.identifierValue,
                      create_user_id: this.user.getIdirUsername(),
                      create_utc_timestamp: new Date(),
                    })),
                  },
                }
              : {}),
            ...(input.business?.contactMethods?.length
              ? {
                  contact_method: {
                    create: input.business.contactMethods.map((c) => ({
                      contact_method_type: c.typeCode,
                      contact_value: c.value,
                      is_primary: c.isPrimary,
                      create_user_id: this.user.getIdirUsername(),
                      create_utc_timestamp: new Date(),
                    })),
                  },
                }
              : {}),
            ...(contactPersonGuids?.length
              ? {
                  business_person_xref: {
                    create: contactPersonGuids.map((g) => ({
                      person_guid: g,
                      business_person_xref_code: "CONT",
                      create_user_id: this.user.getIdirUsername(),
                      create_utc_timestamp: new Date(),
                    })),
                  },
                }
              : {}),
          },
        },
      };
    }

    const prismaParty = await this.prisma.party.create({
      data,
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

  private _buildAliasOperations(incomingAliases: Alias[], existingAliases: Partial<alias>[]): any {
    const aliasesToCreate = incomingAliases.filter((a) => !a.aliasGuid);
    const aliasesToUpdate = incomingAliases.filter((a) => a.aliasGuid);
    const aliasesToDelete = existingAliases.filter(
      (a) => !new Set(incomingAliases.map((a) => a.aliasGuid)).has(a.alias_guid),
    );

    const operations: any = {};

    if (aliasesToCreate.length) {
      operations.create = aliasesToCreate.map((a) => ({
        name: a.name,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (aliasesToUpdate.length || aliasesToDelete.length) {
      operations.update = [
        ...aliasesToUpdate.map((a) => ({
          where: { alias_guid: a.aliasGuid },
          data: {
            name: a.name,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...aliasesToDelete.map((a) => ({
          where: { alias_guid: a.alias_guid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
      ];
    }

    return operations;
  }

  private _buildBusinessIdentifierOperations(
    incomingIdentifiers: BusinessIdentifier[],
    existingIdentifiers: Partial<business_identifier>[],
  ): any {
    const identifiersToCreate = incomingIdentifiers.filter((i) => !i.businessIdentifierGuid);
    const identifiersToUpdate = incomingIdentifiers.filter((i) => i.businessIdentifierGuid);
    const identifiersToDelete = existingIdentifiers.filter(
      (i) => !new Set(incomingIdentifiers.map((ei) => ei.businessIdentifierGuid)).has(i.business_identifier_guid),
    );

    const operations: any = {};

    if (identifiersToCreate.length) {
      operations.create = identifiersToCreate.map((i) => ({
        business_identifier_code: i.identifierCode,
        identifier_value: i.identifierValue,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (identifiersToUpdate.length || identifiersToDelete.length) {
      operations.update = [
        ...identifiersToUpdate.map((i) => ({
          where: { business_identifier_guid: i.businessIdentifierGuid },
          data: {
            business_identifier_code: i.identifierCode,
            identifier_value: i.identifierValue,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...identifiersToDelete.map((i) => ({
          where: { business_identifier_guid: i.business_identifier_guid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
      ];
    }

    return operations;
  }

  async update(partyIdentifier: string, input: PartyUpdateInput): Promise<Party> {
    const existingParty = await this.prisma.party.findUnique({
      include: {
        business: {
          include: {
            alias: true,
            business_identifier: true,
          },
        },
      },
      where: { party_guid: partyIdentifier },
    });
    if (!existingParty) throw new Error("Party not found");

    let data: any;

    const aliasOperations = this._buildAliasOperations(
      input.business?.aliases ?? [],
      existingParty.business?.alias ?? [],
    );

    const businessIdentifierOperations = this._buildBusinessIdentifierOperations(
      input.business?.identifiers ?? [],
      existingParty.business?.business_identifier ?? [],
    );

    if (input.partyTypeCode === "PRS") {
      data = {
        party_type: input.partyTypeCode,
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
        person: {
          update: {
            first_name: input.person?.firstName,
            last_name: input.person?.lastName,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        },
      };
    } else {
      data = {
        business: {
          update: {
            name: input.business?.name,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
            ...(Object.keys(aliasOperations).length ? { alias: aliasOperations } : {}),
            ...(Object.keys(businessIdentifierOperations).length
              ? { business_identifier: businessIdentifierOperations }
              : {}),
          },
        },
      };
    }

    const prismaParty = await this.prisma.party.update({
      where: { party_guid: partyIdentifier },
      data: data,
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
        case "firstName": {
          orderBy = { person: { first_name: validSortOrder } };
          break;
        }
        case "lastName": {
          orderBy = { person: { last_name: validSortOrder } };
          break;
        }
        case "name": {
          orderBy = { business: { name: validSortOrder } };
          break;
        }
        default: {
          const dbField = sortFieldMap[filters.sortBy];
          if (dbField) {
            orderBy = { [dbField]: validSortOrder };
          }
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
