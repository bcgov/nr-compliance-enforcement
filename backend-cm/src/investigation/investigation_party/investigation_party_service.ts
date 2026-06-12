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
import {
  CreateInvestigationAddressInput,
  InvestigationAddress,
} from "../investigation_address/dto/investigation_address";
import { withRlsTransaction } from "src/pg-session-extension/with-rls-transaction";
import {
  InvestigationPersonFacialHairStyleCodeRef,
  InvestigationPersonFacialHairStyleCodeRefInput,
} from "../investigation_person_facial_hair_style_code_ref/dto/InvestigationPersonFacialHairStyleCodeRef";

@Injectable()
export class InvestigationPartyService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly user: UserService,
    private readonly investigationService: InvestigationService,
  ) {}

  private readonly logger = new Logger(InvestigationPartyService.name);

  private _validateBusinessInput(business: { name?: string; addresses?: CreateInvestigationAddressInput[] }): void {
    for (const address of business.addresses ?? []) {
      if (!address.addressName?.trim()) {
        throw new Error("Address name is required.");
      }
    }
  }

  private _sortAddressesPrimaryLast<T extends { isPrimary?: boolean }>(addresses: T[]): T[] {
    const nonPrimary = addresses.filter((a) => !a.isPrimary);
    const primary = addresses.filter((a) => a.isPrimary);
    return [...nonPrimary, ...primary];
  }

  private _mapAddressCreateData(partyGuid: string, address: CreateInvestigationAddressInput) {
    return {
      investigation_party_guid: partyGuid,
      address_name: address.addressName.trim(),
      address: address.address?.trim() || null,
      city: address.city?.trim() || null,
      country_subdivision_code_ref: address.province?.trim() || null,
      postal_code: address.postalCode?.trim() || null,
      country_code_ref: address.country?.trim() || null,
      is_primary: address.isPrimary ?? false,
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
    };
  }

  async create(investigationGuid: string, inputs: CreateInvestigationPartyInput[]): Promise<Investigation> {
    for (const input of inputs) {
      if (!input.person && !input.business) {
        throw new Error("Each party input must include either a person or a business.");
      }

      if (input.business) {
        this._validateBusinessInput(input.business);
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
              ...(input.addresses?.length
                ? {
                    investigation_address: {
                      create: input.addresses.map((a) => ({
                        address_name: a.addressName.trim(),
                        address: a.address?.trim() || null,
                        city: a.city?.trim() || null,
                        country_subdivision_code_ref: a.province?.trim() || null,
                        postal_code: a.postalCode?.trim() || null,
                        country_code_ref: a.country?.trim() || null,
                        is_primary: a.isPrimary ?? false,
                        create_user_id: this.user.getIdirUsername(),
                        create_utc_timestamp: new Date(),
                      })),
                    },
                  }
                : {}),
              ...(input.contactMethods?.length
                ? {
                    investigation_contact_method: {
                      create: input.contactMethods.map((c) => ({
                        contact_method_type_code_ref: c.typeCode,
                        contact_value: c.value,
                        is_primary: c.isPrimary,
                        create_user_id: this.user.getIdirUsername(),
                        create_utc_timestamp: new Date(),
                      })),
                    },
                  }
                : {}),
              ...(input.aliases?.length
                ? {
                    investigation_alias: {
                      create: input.aliases.map((a) => ({
                        name: a.name,
                        create_user_id: this.user.getIdirUsername(),
                        create_utc_timestamp: new Date(),
                      })),
                    },
                  }
                : {}),
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
    await tx.investigation_person.create({
      data: {
        person_guid_ref: input.personReference,
        investigation_party_guid: investigationPartyGuid,
        first_name: input.firstName,
        middle_names: input.middleNames,
        last_name: input.lastName,
        date_of_birth: input.dateOfBirth,
        approximate_age_code_ref: this._resolveApproximateAgeCode(input.dateOfBirth, input.approximateAgeCode),
        drivers_license_number: input.driversLicenseNumber,
        drivers_license_class: input.driversLicenseClass,
        drivers_license_country_code_ref: input.driversLicenseCountryCode,
        drivers_license_country_subdivision_code_ref: input.driversLicenseCountrySubdivisionCode,
        gender_code_ref: input.genderCode,
        height_cm: input.heightInCm,
        weight_kg: input.weightInKg,
        complexion_code_ref: input.complexionCode,
        build_code_ref: input.buildCode,
        hair_colour_code_ref: input.hairColourCode,
        hair_length_code_ref: input.hairLengthCode,
        hair_colour_other: input.hairColourOther,
        eye_colour_code_ref: input.eyeColourCode,
        eye_colour_other: input.eyeColourOther,
        facial_hair_ind: input.facialHairIndicator,
        ...(input.facialHairStyleCodes?.length
          ? {
              investigation_person_facial_hair_style_code_ref: {
                create: input.facialHairStyleCodes.map((fhs) => ({
                  facial_hair_style_code_ref: fhs.facialHairStyleCodeRef,
                  create_user_id: this.user.getIdirUsername(),
                  create_utc_timestamp: new Date(),
                })),
              },
            }
          : {}),
        additional_hair_descriptors: input.additionalHairDescriptors,
        tattoo_ind: input.tattooIndicator,
        tattoo_description: input.tattooDescription,
        additional_descriptors: input.additionalDescriptors,
        comments: input.comments,
        bolo_ind: input.boloIndicator,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      },
    });
  }

  // if Date of birth is provided discard the approximate age code
  private _resolveApproximateAgeCode(
    dateOfBirth?: Date | null,
    approximateAgeCode?: string | null,
  ): string | null | undefined {
    return dateOfBirth ? null : approximateAgeCode;
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

    if (input.businessIdentifiers?.length) {
      await tx.investigation_business_identifier.createMany({
        data: input.businessIdentifiers.map((bi) => ({
          investigation_business_guid: investigationBusiness.investigation_business_guid,
          business_identifier_code_ref: bi.identifierCode,
          identifier_value: bi.identifierValue,
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

    if (input.business) {
      this._validateBusinessInput(input.business);
    }

    await this.prisma.$transaction(async (tx) => {
      const aliasOperations = this._buildInvestigationAliasOperations(input.aliases ?? [], existingParty.aliases ?? []);

      const addressOperations = this._buildInvestigationAddressOperations(
        input.addresses ?? [],
        existingParty.addresses ?? [],
      );

      const contactMethodOperations = this._buildInvestigationContactMethodOperations(
        input.contactMethods ?? [],
        existingParty.contactMethods ?? [],
      );

      try {
        // Update the party role
        await tx.investigation_party.update({
          where: { investigation_party_guid: input.partyIdentifier },
          data: {
            ...(Object.keys(aliasOperations).length ? { investigation_alias: aliasOperations } : {}),
            ...(Object.keys(addressOperations).length ? { investigation_address: addressOperations } : {}),
            ...(Object.keys(contactMethodOperations).length
              ? { investigation_contact_method: contactMethodOperations }
              : {}),
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
    const facialHairStyleOperations = this._buildFacialHairStyleOperations(
      input.facialHairStyleCodes ?? [],
      existingPerson.facialHairStyleCodes ?? [],
    );

    await tx.investigation_person.update({
      where: { investigation_person_guid: existingPerson.personGuid },
      data: {
        first_name: input.firstName,
        middle_names: input.middleNames,
        last_name: input.lastName,
        date_of_birth: input.dateOfBirth,
        approximate_age_code_ref: this._resolveApproximateAgeCode(input.dateOfBirth, input.approximateAgeCode),
        drivers_license_number: input.driversLicenseNumber,
        drivers_license_class: input.driversLicenseClass,
        drivers_license_country_code_ref: input.driversLicenseCountryCode,
        drivers_license_country_subdivision_code_ref: input.driversLicenseCountrySubdivisionCode,
        gender_code_ref: input.genderCode,
        height_cm: input.heightInCm,
        weight_kg: input.weightInKg,
        complexion_code_ref: input.complexionCode,
        build_code_ref: input.buildCode,
        hair_colour_code_ref: input.hairColourCode,
        hair_length_code_ref: input.hairLengthCode,
        hair_colour_other: input.hairColourOther,
        eye_colour_code_ref: input.eyeColourCode,
        eye_colour_other: input.eyeColourOther,
        facial_hair_ind: input.facialHairIndicator,
        ...(Object.keys(facialHairStyleOperations).length
          ? { investigation_person_facial_hair_style_code_ref: facialHairStyleOperations }
          : {}),
        additional_hair_descriptors: input.additionalHairDescriptors,
        tattoo_ind: input.tattooIndicator,
        tattoo_description: input.tattooDescription,
        additional_descriptors: input.additionalDescriptors,
        comments: input.comments,
        bolo_ind: input.boloIndicator,
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      },
    });
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

    if (input.businessIdentifiers) {
      const identifierOps = this._buildInvestigationBusinessIdentifierOperations(
        tx,
        existingBusiness.businessGuid,
        input.businessIdentifiers,
        existingBusiness.businessIdentifiers ?? [],
      );
      await Promise.all(identifierOps);
    }
  }

  /**
   * Sort contact methods so that the primary contact methods are last to preven updates
   * from violating the unique constraint in the database.
   */
  private _sortContactMethodsPrimaryLast(
    contactMethods: UpdateInvestigationContactMethodInput[],
  ): UpdateInvestigationContactMethodInput[] {
    const nonPrimary = contactMethods.filter((m) => !m.isPrimary);
    const primary = contactMethods.filter((m) => m.isPrimary);
    return [...nonPrimary, ...primary];
  }

  private _buildInvestigationContactMethodOperations(
    incoming: UpdateInvestigationContactMethodInput[],
    existing: InvestigationContactMethod[],
  ) {
    const toCreate = incoming.filter((cm) => !cm.contactMethodGuid);
    const toUpdate = this._sortContactMethodsPrimaryLast(incoming.filter((cm) => cm.contactMethodGuid));
    const existingGuids = new Set(incoming.map((cm) => cm.contactMethodGuid).filter(Boolean));
    const toDelete = existing.filter((cm) => !existingGuids.has(cm.contactMethodGuid));

    const operations: any = {};

    if (toCreate.length) {
      operations.create = this._sortContactMethodsPrimaryLast(toCreate).map((cm) => ({
        contact_method_type_code_ref: cm.typeCode,
        contact_value: cm.value,
        is_primary: cm.isPrimary,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (toUpdate.length || toDelete.length) {
      operations.update = [
        ...toDelete.map((cm) => ({
          where: { investigation_contact_method_guid: cm.contactMethodGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...toUpdate.map((cm) => ({
          where: { investigation_contact_method_guid: cm.contactMethodGuid },
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

  private _buildInvestigationBusinessIdentifierOperations(
    tx: any,
    investigationBusinessGuid: string,
    incoming: UpdateInvestigationBusinessIdentifierInput[],
    existing: InvestigationBusinessIdentifier[],
  ) {
    const toCreate = incoming.filter((bi) => !bi.businessIdentifierGuid);
    const toUpdate = incoming.filter((bi) => bi.businessIdentifierGuid);
    const existingGuids = new Set(incoming.map((bi) => bi.businessIdentifierGuid).filter(Boolean));
    const toDelete = existing.filter((bi) => !existingGuids.has(bi.identifierCode));

    const operations: Promise<any>[] = [];

    for (const bi of toCreate) {
      operations.push(
        tx.investigation_business_identifier.create({
          data: {
            investigation_business_guid: investigationBusinessGuid,
            business_identifier_code_ref: bi.identifierCode,
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
            business_identifier_code_ref: bi.identifierCode,
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
    incoming: UpdateInvestigationAliasInput[],
    existing: InvestigationAlias[],
  ) {
    const toCreate = incoming.filter((a) => !a.aliasGuid);
    const toUpdate = incoming.filter((a) => a.aliasGuid);
    const existingGuids = new Set(incoming.map((a) => a.aliasGuid).filter(Boolean));
    const toDelete = existing.filter((a) => !existingGuids.has(a.aliasGuid));

    const operations: any = {};

    if (toCreate.length) {
      operations.create = toCreate.map((a) => ({
        name: a.name,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (toUpdate.length || toDelete.length) {
      operations.update = [
        ...toUpdate.map((a) => ({
          where: { investigation_alias_guid: a.aliasGuid },
          data: {
            name: a.name,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...toDelete.map((a) => ({
          where: { investigation_alias_guid: a.aliasGuid },
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

  private _buildInvestigationAddressOperations(
    incoming: CreateInvestigationAddressInput[],
    existing: InvestigationAddress[],
  ) {
    const toCreate = incoming.filter((a) => !a.addressGuid);
    const toUpdate = this._sortAddressesPrimaryLast(incoming.filter((a) => a.addressGuid));
    const existingGuids = new Set(incoming.map((a) => a.addressGuid).filter(Boolean));
    const toDelete = existing.filter((a) => !existingGuids.has(a.addressGuid));

    const operations: any = {};

    if (toCreate.length) {
      operations.create = this._sortAddressesPrimaryLast(toCreate).map((a) => ({
        address_name: a.addressName.trim(),
        address: a.address?.trim() || null,
        city: a.city?.trim() || null,
        country_subdivision_code_ref: a.province?.trim() || null,
        postal_code: a.postalCode?.trim() || null,
        country_code_ref: a.country?.trim() || null,
        is_primary: a.isPrimary ?? false,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (toUpdate.length || toDelete.length) {
      operations.update = [
        // Deactivations must come before primary-flag updates to avoid violating the
        // unique-active-primary-per-business constraint when the deleted address is primary.
        ...toDelete.map((a) => ({
          where: { investigation_address_guid: a.addressGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...toUpdate.map((a) => ({
          where: { investigation_address_guid: a.addressGuid },
          data: {
            address_name: a.addressName.trim(),
            address: a.address?.trim() || null,
            city: a.city?.trim() || null,
            country_subdivision_code_ref: a.province?.trim() || null,
            postal_code: a.postalCode?.trim() || null,
            country_code_ref: a.country?.trim() || null,
            is_primary: a.isPrimary ?? false,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...toDelete.map((a) => ({
          where: { investigation_address_guid: a.addressGuid },
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

  private _buildFacialHairStyleOperations(
    incomingFacialHairStyles: InvestigationPersonFacialHairStyleCodeRefInput[],
    existingFacialHairStyles: InvestigationPersonFacialHairStyleCodeRef[],
  ): any {
    const fhsToCreate = incomingFacialHairStyles.filter((fhs) => !fhs.investigationPersonFacialStyleHairCodeRefGuid);
    const fhsToUpdate = incomingFacialHairStyles.filter((fhs) => fhs.investigationPersonFacialStyleHairCodeRefGuid);
    const fhsToDelete = existingFacialHairStyles.filter(
      (fhs) =>
        !new Set(incomingFacialHairStyles.map((fhs) => fhs.investigationPersonFacialStyleHairCodeRefGuid)).has(
          fhs.investigationPersonFacialStyleHairCodeRefGuid,
        ),
    );

    const operations: any = {};

    if (fhsToCreate.length) {
      operations.create = fhsToCreate.map((fhs) => ({
        facial_hair_style_code_ref: fhs.facialHairStyleCodeRef,
        investigation_person_guid: fhs.investigationPersonGuid,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (fhsToUpdate.length || fhsToDelete.length) {
      operations.update = [
        ...fhsToUpdate.map((fhs) => ({
          where: {
            investigation_person_facial_hair_style_code_ref_guid: fhs.investigationPersonFacialStyleHairCodeRefGuid,
          },
          data: {
            facial_hair_style_code_ref: fhs.facialHairStyleCodeRef,
            investigation_person_guid: fhs.investigationPersonGuid,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...fhsToDelete.map((fhs) => ({
          where: {
            investigation_person_facial_hair_style_code_ref_guid: fhs.investigationPersonFacialStyleHairCodeRefGuid,
          },
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
}
