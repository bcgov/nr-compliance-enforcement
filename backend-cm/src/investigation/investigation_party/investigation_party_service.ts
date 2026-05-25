import { Injectable, Logger } from "@nestjs/common";
import {
  CreateInvestigationPartyInput,
  InvestigationParty,
  UpdateInvestigationPartyInput,
} from "../investigation_party/dto/investigation_party";
import { Investigation } from "../../investigation/investigation/dto/investigation";
import { investigation_party } from "../../../prisma/investigation/generated/investigation_party";
import { InvestigationPrismaService } from "../../prisma/investigation/prisma.investigation.service";
import { UserService } from "../../common/user.service";
import { InvestigationService } from "../investigation/investigation.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import {
  CreateInvestigationPersonInput,
  InvestigationPerson,
  UpdateInvestigationPersonInput,
} from "../investigation_person/dto/investigation_person";
import {
  CreateInvestigationBusinessInput,
  InvestigationBusiness,
  UpdateInvestigationBusinessInput,
} from "../investigation_business/dto/investigation_business";
import { InvestigationAlias, UpdateInvestigationAliasInput } from "../investigation_alias/dto/investigation_alias";
import {
  InvestigationBusinessIdentifier,
  UpdateInvestigationBusinessIdentifierInput,
} from "../investigation_business_identifier/dto/investigation_business_identifier";
import {
  InvestigationContactMethod,
  UpdateInvestigationContactMethodInput,
} from "../investigation_contact_method/dto/investigation_contact_method";
import { withRlsTransaction } from "src/pg-session-extension/with-rls-transaction";

@Injectable()
export class InvestigationPartyService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
    private readonly investigationService: InvestigationService,
  ) {}

  private readonly logger = new Logger(InvestigationPartyService.name);

  async create(investigationGuid: string, inputs: CreateInvestigationPartyInput[]): Promise<Investigation> {
    for (const input of inputs) {
      if (!input.person && !input.business) {
        throw new Error("Each party input must include either a person or a business.");
      }
    }

    const investigation = await this.investigationService.findOne(investigationGuid);

    await withRlsTransaction(this.prisma, async (db) => {
      for (const input of inputs) {
        try {
          const partyAlreadyExists = investigation.parties.some(
            (p) => p.isActive && p.partyReference && p.partyReference === input.partyReference,
          );

          if (partyAlreadyExists) {
            throw new Error("Record already exists on Investigation.");
          }

          const investigationParty = await db.investigation_party.create({
            data: {
              party_guid_ref: input.partyReference,
              party_type_code_ref: input.partyTypeCode,
              investigation_guid: investigationGuid,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
              party_association_role_ref: input.partyAssociationRole,
            },
          });

          if (input.business) {
            await this.createBusiness(db, investigationParty.investigation_party_guid, input.business);
          }

          if (input.person) {
            await this.createPerson(db, investigationParty.investigation_party_guid, input.person);
          }
        } catch (error) {
          this.logger.error("Error creating investigation party:", error);
          throw error;
        }
      }
    });

    await this.investigationService.updateInvestigationTimestamp(investigationGuid);

    return await this.investigationService.findOne(investigationGuid);
  }

  private async createPerson(tx: any, investigationPartyGuid: string, input: CreateInvestigationPersonInput) {
    const investigationPerson = await tx.investigation_person.create({
      data: {
        person_guid_ref: input.personReference,
        investigation_party_guid: investigationPartyGuid,
        first_name: input.firstName,
        middle_name: input.middleName,
        middle_name_2: input.middleName2,
        last_name: input.lastName,
        date_of_birth: input.dateOfBirth,
        drivers_license_number: input.driversLicenseNumber,
        drivers_license_jurisdiction: input.driversLicenseJurisdiction,
        sex_code_ref: input.sexCode,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      },
    });

    if (input.contactMethods?.length) {
      await tx.investigation_contact_method.createMany({
        data: input.contactMethods.map((cm) => ({
          investigation_person_guid: investigationPerson.investigation_person_guid,
          contact_method_type_code_ref: cm.contactMethodTypeCode,
          contact_value: cm.contactValue,
          is_primary: cm.isPrimary ?? false,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        })),
      });
    }
  }

  private async createBusiness(tx: any, investigationPartyGuid: string, input: CreateInvestigationBusinessInput) {
    const investigationBusiness = await tx.investigation_business.create({
      data: {
        business_guid_ref: input.businessReference,
        investigation_party_guid: investigationPartyGuid,
        name: input.name,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      },
    });

    if (input.contactMethods?.length) {
      await tx.investigation_contact_method.createMany({
        data: input.contactMethods.map((cm) => ({
          investigation_business_guid: investigationBusiness.investigation_business_guid,
          contact_method_type_code_ref: cm.contactMethodTypeCode,
          contact_value: cm.contactValue,
          is_primary: cm.isPrimary ?? false,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        })),
      });
    }

    if (input.businessIdentifiers?.length) {
      await tx.investigation_business_identifier.createMany({
        data: input.businessIdentifiers.map((bi) => ({
          investigation_business_guid: investigationBusiness.investigation_business_guid,
          business_identifier_code_ref: bi.businessIdentifierCode,
          identifier_value: bi.identifierValue,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        })),
      });
    }

    if (input.aliases?.length) {
      await tx.investigation_alias.createMany({
        data: input.aliases.map((a) => ({
          investigation_business_guid: investigationBusiness.investigation_business_guid,
          name: a.name,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        })),
      });
    }
  }

  async remove(investigationGuid: string, partyIdentifier: string): Promise<Investigation> {
    await withRlsTransaction(this.prisma, async (db) => {
      try {
        const investigationParty = await db.investigation_party.findFirst({
          where: {
            investigation_party_guid: partyIdentifier,
            investigation_guid: investigationGuid,
          },
        });

        if (!investigationParty) {
          throw new Error("Party not found for this investigation.");
        }

        await db.investigation_party.update({
          where: {
            investigation_party_guid: partyIdentifier,
          },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      } catch (error) {
        this.logger.error("Error removing investigation party:", error);
        throw error;
      }
    });

    await this.investigationService.updateInvestigationTimestamp(investigationGuid);

    return await this.investigationService.findOne(investigationGuid);
  }

  async findManyByRef(partyRefId: string): Promise<InvestigationParty[]> {
    if (!partyRefId || partyRefId.length === 0) {
      return [];
    }

    const prismaInvestigationParties = await this.prisma.investigation_party.findMany({
      where: {
        party_guid_ref: partyRefId,
        active_ind: true,
      },
    });

    try {
      return this.mapper.mapArray<investigation_party, InvestigationParty>(
        prismaInvestigationParties as Array<investigation_party>,
        "investigation_party",
        "InvestigationParty",
      );
    } catch (error) {
      this.logger.error("Error fetching investigations parties by Ref ID:", error);
      throw error;
    }
  }
  async editPartyRole(
    investigationGuid: string,
    partyIdentifier: string,
    partyAssociationRole: string,
  ): Promise<Investigation> {
    try {
      await this.prisma.investigation_party.update({
        where: {
          investigation_party_guid: partyIdentifier,
          investigation_guid: investigationGuid,
        },
        data: {
          party_association_role_ref: partyAssociationRole,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error("Error editing party role in investigation:", error);
      throw error;
    }

    await this.investigationService.updateInvestigationTimestamp(investigationGuid);

    return await this.investigationService.findOne(investigationGuid);
  }

  async update(investigationGuid: string, input: UpdateInvestigationPartyInput): Promise<Investigation> {
    const investigation = await this.investigationService.findOne(investigationGuid);
    const existingParty = investigation.parties.find((p) => p.partyIdentifier === input.partyIdentifier && p.isActive);

    if (!existingParty) {
      throw new Error("Party not found on this investigation.");
    }

    await this.prisma.$transaction(async (tx) => {
      try {
        // Update the party role
        await tx.investigation_party.update({
          where: { investigation_party_guid: input.partyIdentifier },
          data: {
            party_association_role_ref: input.partyAssociationRole,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });

        if (input.person && existingParty.person) {
          await this.updatePerson(tx, existingParty.person, input.person);
        }

        if (input.business && existingParty.business) {
          await this.updateBusiness(tx, existingParty.business, input.business);
        }
      } catch (error) {
        this.logger.error("Error updating investigation party:", error);
        throw error;
      }
    });

    return await this.investigationService.findOne(investigationGuid);
  }

  private async updatePerson(tx: any, existingPerson: InvestigationPerson, input: UpdateInvestigationPersonInput) {
    await tx.investigation_person.update({
      where: { investigation_person_guid: existingPerson.personGuid },
      data: {
        first_name: input.firstName,
        middle_name: input.middleName,
        middle_name_2: input.middleName2,
        last_name: input.lastName,
        date_of_birth: input.dateOfBirth,
        drivers_license_number: input.driversLicenseNumber,
        drivers_license_jurisdiction: input.driversLicenseJurisdiction,
        sex_code_ref: input.sexCode,
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      },
    });

    if (input.contactMethods) {
      const operations = this._buildInvestigationContactMethodOperations(
        tx,
        existingPerson.personGuid,
        "person",
        input.contactMethods,
        existingPerson.contactMethods ?? [],
      );
      await Promise.all(operations);
    }
  }

  private async updateBusiness(
    tx: any,
    existingBusiness: InvestigationBusiness,
    input: UpdateInvestigationBusinessInput,
  ) {
    await tx.investigation_business.update({
      where: { investigation_business_guid: existingBusiness.businessGuid },
      data: {
        name: input.name,
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      },
    });

    if (input.contactMethods) {
      const contactMethodOps = this._buildInvestigationContactMethodOperations(
        tx,
        existingBusiness.businessGuid,
        "business",
        input.contactMethods,
        existingBusiness.contactMethods ?? [],
      );
      await Promise.all(contactMethodOps);
    }

    if (input.businessIdentifiers) {
      const identifierOps = this._buildInvestigationBusinessIdentifierOperations(
        tx,
        existingBusiness.businessGuid,
        input.businessIdentifiers,
        existingBusiness.businessIdentifiers ?? [],
      );
      await Promise.all(identifierOps);
    }

    if (input.aliases) {
      const aliasOps = this._buildInvestigationAliasOperations(
        tx,
        existingBusiness.businessGuid,
        input.aliases,
        existingBusiness.aliases ?? [],
      );
      await Promise.all(aliasOps);
    }
  }

  private _buildInvestigationContactMethodOperations(
    tx: any,
    parentGuid: string,
    parentType: "person" | "business",
    incoming: UpdateInvestigationContactMethodInput[],
    existing: InvestigationContactMethod[],
  ) {
    const toCreate = incoming.filter((cm) => !cm.contactMethodGuid);
    const toUpdate = incoming.filter((cm) => cm.contactMethodGuid);
    const existingGuids = new Set(incoming.map((cm) => cm.contactMethodGuid).filter(Boolean));
    const toDelete = existing.filter((cm) => !existingGuids.has(cm.contactMethodGuid));

    const parentField = parentType === "person" ? "investigation_person_guid" : "investigation_business_guid";

    const operations: Promise<any>[] = [];

    for (const cm of toCreate) {
      operations.push(
        tx.investigation_contact_method.create({
          data: {
            [parentField]: parentGuid,
            contact_method_type_code_ref: cm.contactMethodTypeCode,
            contact_value: cm.contactValue,
            is_primary: cm.isPrimary ?? false,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        }),
      );
    }

    for (const cm of toUpdate) {
      operations.push(
        tx.investigation_contact_method.update({
          where: { investigation_contact_method_guid: cm.contactMethodGuid },
          data: {
            contact_method_type_code_ref: cm.contactMethodTypeCode,
            contact_value: cm.contactValue,
            is_primary: cm.isPrimary ?? false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        }),
      );
    }

    for (const cm of toDelete) {
      operations.push(
        tx.investigation_contact_method.update({
          where: { investigation_contact_method_guid: cm.contactMethodGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        }),
      );
    }

    return operations;
  }

  private _buildInvestigationBusinessIdentifierOperations(
    tx: any,
    investigationBusinessGuid: string,
    incoming: UpdateInvestigationBusinessIdentifierInput[],
    existing: InvestigationBusinessIdentifier[],
  ) {
    const toCreate = incoming.filter((bi) => !bi.businessIdentifierGuid);
    const toUpdate = incoming.filter((bi) => bi.businessIdentifierGuid);
    const existingGuids = new Set(incoming.map((bi) => bi.businessIdentifierGuid).filter(Boolean));
    const toDelete = existing.filter((bi) => !existingGuids.has(bi.businessIdentifierGuid));

    const operations: Promise<any>[] = [];

    for (const bi of toCreate) {
      operations.push(
        tx.investigation_business_identifier.create({
          data: {
            investigation_business_guid: investigationBusinessGuid,
            business_identifier_code_ref: bi.businessIdentifierCode,
            identifier_value: bi.identifierValue,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        }),
      );
    }

    for (const bi of toUpdate) {
      operations.push(
        tx.investigation_business_identifier.update({
          where: { investigation_business_identifier_guid: bi.businessIdentifierGuid },
          data: {
            business_identifier_code_ref: bi.businessIdentifierCode,
            identifier_value: bi.identifierValue,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        }),
      );
    }

    for (const bi of toDelete) {
      operations.push(
        tx.investigation_business_identifier.update({
          where: { investigation_business_identifier_guid: bi.businessIdentifierGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        }),
      );
    }

    return operations;
  }

  private _buildInvestigationAliasOperations(
    tx: any,
    investigationBusinessGuid: string,
    incoming: UpdateInvestigationAliasInput[],
    existing: InvestigationAlias[],
  ) {
    const toCreate = incoming.filter((a) => !a.aliasGuid);
    const toUpdate = incoming.filter((a) => a.aliasGuid);
    const existingGuids = new Set(incoming.map((a) => a.aliasGuid).filter(Boolean));
    const toDelete = existing.filter((a) => !existingGuids.has(a.aliasGuid));

    const operations: Promise<any>[] = [];

    for (const a of toCreate) {
      operations.push(
        tx.investigation_alias.create({
          data: {
            investigation_business_guid: investigationBusinessGuid,
            name: a.name,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        }),
      );
    }

    for (const a of toUpdate) {
      operations.push(
        tx.investigation_alias.update({
          where: { investigation_alias_guid: a.aliasGuid },
          data: {
            name: a.name,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        }),
      );
    }

    for (const a of toDelete) {
      operations.push(
        tx.investigation_alias.update({
          where: { investigation_alias_guid: a.aliasGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        }),
      );
    }

    return operations;
  }
}
