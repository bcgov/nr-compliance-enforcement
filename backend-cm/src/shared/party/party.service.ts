import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party } from "../../../prisma/shared/generated/party";
import { Party, PartyCreateInput, PartyFilters, PartyResult, PartyUpdateInput } from "./dto/party";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";
import { PageInfo } from "../case_file/dto/case_file";
import { Alias } from "src/shared/alias/dto/alias";
import { alias } from "prisma/shared/generated/alias";
import { BusinessIdentifier } from "src/shared/business_identifier/dto/business_identifier";
import { business_identifier } from "prisma/shared/generated/business_identifier";
import { BusinessPersonXref } from "src/shared/business_person_xref/dto/business_person_xref";
import { ContactMethod } from "src/shared/contact_method/dto/contact_method";

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
              where: {
                active_ind: true,
              },
            },
            business_person_xref: {
              include: {
                business: {
                  select: {
                    business_guid: true,
                  },
                },
                person: {
                  select: {
                    person_guid: true,
                    first_name: true,
                    last_name: true,
                    contact_method: {
                      select: {
                        contact_method_guid: true,
                        contact_method_type: true,
                        contact_method_type_code: true,
                        contact_value: true,
                        is_primary: true,
                      },
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

  private async createContactPeople(contactPeople: BusinessPersonXref[]): Promise<string[]> {
    const contactPersonGuids: string[] = [];

    for (const person of contactPeople) {
      const personInput: PartyCreateInput = {
        partyTypeCode: "PRS",
        person: person.person,
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

  private _buildAliasOperations(incomingAliases: Alias[], existingAliases: Alias[]): any {
    const aliasesToCreate = incomingAliases.filter((a) => !a.aliasGuid);
    const aliasesToUpdate = incomingAliases.filter((a) => a.aliasGuid);
    const aliasesToDelete = existingAliases.filter(
      (a) => !new Set(incomingAliases.map((a) => a.aliasGuid)).has(a.aliasGuid),
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
          where: { alias_guid: a.aliasGuid },
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
    existingIdentifiers: BusinessIdentifier[],
  ): any {
    const identifiersToCreate = incomingIdentifiers.filter((i) => !i.businessIdentifierGuid);
    const identifiersToUpdate = incomingIdentifiers.filter((i) => i.businessIdentifierGuid);
    const identifiersToDelete = existingIdentifiers.filter(
      (i) => !new Set(incomingIdentifiers.map((ei) => ei.businessIdentifierGuid)).has(i.businessIdentifierGuid),
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
          where: { business_identifier_guid: i.businessIdentifierGuid },
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

  private _buildContactMethodOperations(incomingMethods: ContactMethod[], existingMethods: ContactMethod[]): any {
    const methodsToCreate = incomingMethods.filter((cm) => !cm.contactMethodGuid);
    const methodsToUpdate = incomingMethods.filter((cm) => cm.contactMethodGuid);
    const methodsToDelete = existingMethods.filter(
      (cm) => !new Set(incomingMethods.map((im) => im.contactMethodGuid)).has(cm.contactMethodGuid),
    );
    const operations: any = {};

    if (methodsToCreate.length) {
      operations.create = methodsToCreate.map((cm) => ({
        contact_method_type_code: {
          connect: {
            contact_method_type_code: cm.typeCode,
          },
        },
        contact_value: cm.value,
        is_primary: cm.isPrimary,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (methodsToUpdate.length || methodsToDelete.length) {
      operations.update = [
        ...methodsToDelete.map((cm) => ({
          where: { contact_method_guid: cm.contactMethodGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...methodsToUpdate.map((cm) => ({
          where: { contact_method_guid: cm.contactMethodGuid },
          data: {
            contact_value: cm.value,
            is_primary: cm.isPrimary,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
      ];
    }

    return operations;
  }

  private _buildBusinessPersonXrefOperations(
    incomingXrefs: BusinessPersonXref[],
    existingXrefs: BusinessPersonXref[],
  ): any {
    const xrefsToCreate = incomingXrefs.filter((bpx) => !bpx.businessPersonXrefGuid);
    const xrefsToUpdate = incomingXrefs.filter((bpx) => bpx.businessPersonXrefGuid);
    const xrefsToDelete = existingXrefs.filter(
      (bpx) => !new Set(incomingXrefs.map((ei) => ei.businessPersonXrefGuid)).has(bpx.businessPersonXrefGuid),
    );
    const operations: any = {};

    if (xrefsToCreate.length) {
      operations.create = xrefsToCreate.map((bpx) => ({
        business_person_xref_code_business_person_xref_business_person_xref_codeTobusiness_person_xref_code: {
          connect: {
            business_person_xref_code: "CONT",
          },
        },
        person: {
          create: {
            first_name: bpx.person.firstName,
            last_name: bpx.person.lastName,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            ...(bpx.person.contactMethods?.length && {
              contact_method: {
                create: bpx.person.contactMethods.map((cm) => ({
                  contact_method_type_code: {
                    connect: {
                      contact_method_type_code: cm.typeCode,
                    },
                  },
                  contact_value: cm.value,
                  is_primary: cm.isPrimary,
                  active_ind: true,
                  create_user_id: this.user.getIdirUsername(),
                  create_utc_timestamp: new Date(),
                })),
              },
            }),
          },
        },
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (xrefsToUpdate.length || xrefsToDelete.length) {
      operations.update = [
        ...xrefsToUpdate.map((bpx) => {
          // Find the corresponding existing xref to get existing contact methods
          const existingXref = existingXrefs.find((ex) => ex.businessPersonXrefGuid === bpx.businessPersonXrefGuid);
          const existingContactMethods = existingXref?.person?.contactMethods || [];

          // Build contact method operations if there are any
          const contactMethodOps =
            bpx.person.contactMethods?.length || existingContactMethods.length
              ? this._buildContactMethodOperations(bpx.person.contactMethods || [], existingContactMethods)
              : undefined;

          return {
            where: { business_person_xref_guid: bpx.businessPersonXrefGuid },
            data: {
              person: {
                update: {
                  first_name: bpx.person.firstName,
                  last_name: bpx.person.lastName,
                  update_user_id: this.user.getIdirUsername(),
                  update_utc_timestamp: new Date(),
                  ...(contactMethodOps && {
                    contact_method: contactMethodOps,
                  }),
                },
              },
              active_ind: true,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          };
        }),
        ...xrefsToDelete.map((bpx) => ({
          where: { business_person_xref_guid: bpx.businessPersonXrefGuid },
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
    try {
      const existingParty = await this.prisma.party.findUnique({
        include: {
          business: {
            include: {
              alias: true,
              business_identifier: true,
              business_person_xref: {
                include: {
                  person: {
                    include: {
                      contact_method: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: { party_guid: partyIdentifier },
      });
      if (!existingParty) throw new Error("Party not found");
      const existingPartyDto = this.mapper.map<party, Party>(existingParty as party, "party", "Party");

      let data: any;

      const aliasOperations = this._buildAliasOperations(
        input.business?.aliases ?? [],
        existingPartyDto.business.aliases ?? [],
      );

      const businessIdentifierOperations = this._buildBusinessIdentifierOperations(
        input.business?.identifiers ?? [],
        existingPartyDto.business.identifiers ?? [],
      );

      const businessPersonXrefOperations = this._buildBusinessPersonXrefOperations(
        input.business?.contactPeople ?? [],
        existingPartyDto.business.contactPeople ?? [],
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
              ...(Object.keys(businessPersonXrefOperations).length
                ? { business_person_xref: businessPersonXrefOperations }
                : {}),
            },
          },
        };
      }

      console.dir(data, { depth: null });

      const prismaParty = await this.prisma.party.update({
        where: { party_guid: partyIdentifier },
        data: data,
        include: {
          party_type_code: true,
          person: true,
          business: true,
        },
      });

      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      console.error("Full Prisma error:", error);
      console.error("Error message:", error.message);
      if (error.meta) {
        console.error("Error meta:", error.meta);
      }
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
