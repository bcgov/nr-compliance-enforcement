import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party } from "../../../prisma/shared/generated/party";
import { Party, PartyCreateInput, PartyFilters, PartyResult, PartyUpdateInput } from "./dto/party";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";
import { Alias } from "src/shared/alias/dto/alias";
import { BusinessIdentifier } from "src/shared/business_identifier/dto/business_identifier";
import { BusinessPersonXref } from "src/shared/business_person_xref/dto/business_person_xref";
import { ContactMethod } from "src/shared/contact_method/dto/contact_method";
import { Address } from "src/shared/address/dto/address";
import { PARTY_TYPES } from "src/common/party";
import { PersonFacialHairStyleCode } from "src/shared/person_facial_hair_style_code/dto/person_facial_hair_style_code";
import { AppUserService } from "src/shared/app_user/app_user.service";
import { EventPublisherService } from "../../event_publisher/event_publisher.service";
import { EventCreateInput } from "../event/dto/event";
import { STREAM_TOPICS } from "../../common/nats_constants";
import { Person } from "src/shared/person/dto/person";

const BUSINESS_NUMBER_CODE = "BNUM";

type AddEventFn = (verb: string, field: string, oldValue: any, newValue: any, extra?: Record<string, any>) => void;

@Injectable()
export class PartyService {
  constructor(
    private readonly user: UserService,
    private readonly appUser: AppUserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  private readonly logger = new Logger(PartyService.name);

  private _getBusinessNumberValue(identifiers?: BusinessIdentifier[]): string | undefined {
    const businessNumber = identifiers?.find((i) => i.identifierCode === BUSINESS_NUMBER_CODE);
    return businessNumber?.identifierValue;
  }

  private _validateBusinessInput(business: {
    name?: string;
    identifiers?: BusinessIdentifier[];
    addresses?: Address[];
  }): void {
    if (!business.name?.trim()) {
      throw new Error("Name is required.");
    }

    const businessNumberValue = this._getBusinessNumberValue(business.identifiers);

    if (!businessNumberValue?.trim()) {
      throw new Error("Business number is required.");
    }

    for (const address of business.addresses ?? []) {
      if (!address.addressName?.trim()) {
        throw new Error("Address name is required.");
      }
    }
  }

  private _normalizeIdentifierValue(value?: string): string {
    return value?.trim() ?? "";
  }

  private _isBusinessNumberUniqueViolation(error: unknown): boolean {
    if (!error || typeof error !== "object" || (error as { code?: string }).code !== "P2002") {
      return false;
    }

    const target = (error as { meta?: { target?: string[] } }).meta?.target;
    return Array.isArray(target) && target.includes("identifier_value");
  }

  private _rethrowIfBusinessNumberConflict(error: unknown): never {
    if (this._isBusinessNumberUniqueViolation(error)) {
      throw new Error("This business number is already in use.");
    }

    throw error;
  }

  // if Date of birth is provided discard the approximate age code
  private _resolveApproximateAgeCode(
    dateOfBirth?: Date | null,
    approximateAgeCode?: string | null,
  ): string | null | undefined {
    return dateOfBirth ? null : approximateAgeCode;
  }

  async findOne(id: string) {
    const prismaParty: any = await this.prisma.party.findUnique({
      where: {
        party_guid: id,
      },
      select: {
        party_guid: true,
        party_type: true,
        create_utc_timestamp: true,
        update_utc_timestamp: true,
        created_by_app_user_guid: true,
        party_type_code: {
          select: {
            party_type_code: true,
            short_description: true,
            long_description: true,
          },
        },
        address: {
          select: {
            address_guid: true,
            party_guid: true,
            address_name: true,
            address: true,
            city: true,
            country_subdivision_code: true,
            postal_code: true,
            country_code: true,
            is_primary: true,
          },
          where: {
            active_ind: true,
          },
        },
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
        alias: {
          select: {
            alias_guid: true,
            name: true,
          },
          where: {
            active_ind: true,
          },
        },
        business: {
          include: {
            business_identifier: {
              select: {
                business_identifier_guid: true,
                business_guid: true,
                identifier_value: true,
                business_identifier_code: true,
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
                    party: {
                      select: {
                        contact_method: {
                          where: { active_ind: true },
                          select: {
                            contact_method_guid: true,
                            contact_method_type: true,
                            contact_value: true,
                            is_primary: true,
                            contact_method_type_code: true,
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
          },
        },
        person: {
          select: {
            person_guid: true,
            first_name: true,
            middle_names: true,
            last_name: true,
            date_of_birth: true,
            drivers_license_number: true,
            drivers_license_class: true,
            drivers_license_country_code: true,
            drivers_license_country_subdivision_code: true,
            gender_code: true,
            complexion_code: true,
            build_code: true,
            hair_colour_code: true,
            hair_length_code: true,
            hair_colour_other: true,
            eye_colour_code: true,
            eye_colour_other: true,
            facial_hair_ind: true,
            person_facial_hair_style_code: {
              select: {
                person_facial_hair_style_code_guid: true,
                facial_hair_style_code: true,
              },
              where: { active_ind: true },
            },
            additional_hair_descriptors: true,
            tattoo_ind: true,
            tattoo_description: true,
            additional_descriptors: true,
            comments: true,
            bolo_ind: true,
            approximate_age_code: true,
            height_cm: true,
            weight_kg: true,
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

  async create(input: PartyCreateInput): Promise<Party> {
    let data: any;

    try {
      if (input.partyTypeCode === PARTY_TYPES.Company && input.business) {
        this._validateBusinessInput(input.business);
      }

      if (input.partyTypeCode === PARTY_TYPES.Person || input.partyTypeCode === PARTY_TYPES.Contact) {
        data = await this._buildPersonCreateData(input);
      } else {
        data = await this._buildBusinessCreateData(input);
      }

      const prismaParty: any = await this.prisma.party.create({
        data,
        include: {
          party_type_code: true,
          person: true,
          business: true,
          address: true,
          alias: true,
          contact_method: true,
        },
      });

      const createdParty = this.mapper.map<party, Party>(prismaParty as party, "party", "Party");

      this.eventPublisher.publishEvent(
        {
          eventVerbTypeCode: "CREATED",
          sourceId: createdParty.partyIdentifier,
          sourceEntityTypeCode: "PARTY",
          actorId: this.user.getUserGuid(),
          actorEntityTypeCode: "USER",
          targetId: createdParty.partyIdentifier,
          targetEntityTypeCode: "PARTY",
        },
        STREAM_TOPICS.PARTY_CREATED,
      );

      return createdParty;
    } catch (error) {
      this.logger.error("Error creating party:", (error as Error)?.message);
      this._rethrowIfBusinessNumberConflict(error);
    }
  }

  private async _buildCommonPartyCreateData(input: PartyCreateInput): Promise<any> {
    const createdByUser = await this.appUser.findOne(undefined, this.user.getUserGuid());

    return {
      party_type: input.partyTypeCode,
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
      created_by_app_user_guid: createdByUser.appUserGuid,
      ...(input.addresses?.length
        ? {
            address: {
              create: input.addresses.map((a) => ({
                address_name: a.addressName.trim(),
                address: a.address?.trim() || null,
                city: a.city?.trim() || null,
                country_subdivision_code: a.province?.trim() || null,
                postal_code: a.postalCode?.trim() || null,
                country_code: a.country?.trim() || null,
                is_primary: a.isPrimary ?? false,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              })),
            },
          }
        : {}),
      ...(input.contactMethods?.length
        ? {
            contact_method: {
              create: input.contactMethods.map((c) => ({
                contact_method_type: c.typeCode,
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
            alias: {
              create: input.aliases.map((a) => ({
                name: a.name,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              })),
            },
          }
        : {}),
    };
  }

  private _buildPersonFieldData(person?: Person): any {
    return {
      first_name: person?.firstName,
      middle_names: person?.middleNames,
      last_name: person?.lastName,
      date_of_birth: person?.dateOfBirth,
      approximate_age_code: this._resolveApproximateAgeCode(person?.dateOfBirth, person?.approximateAgeCode),
      drivers_license_number: person?.driversLicenseNumber,
      drivers_license_class: person?.driversLicenseClass,
      drivers_license_country_code: person?.driversLicenseCountryCode,
      drivers_license_country_subdivision_code: person?.driversLicenseCountrySubdivisionCode,
      gender_code: person?.genderCode,
      height_cm: person?.heightInCm,
      weight_kg: person?.weightInKg,
      complexion_code: person?.complexionCode,
      build_code: person?.buildCode,
      hair_colour_code: person?.hairColourCode,
      hair_length_code: person?.hairLengthCode,
      hair_colour_other: person?.hairColourOther,
      eye_colour_code: person?.eyeColourCode,
      eye_colour_other: person?.eyeColourOther,
      facial_hair_ind: person?.facialHairIndicator,
      additional_hair_descriptors: person?.additionalHairDescriptors,
      tattoo_ind: person?.tattooIndicator,
      tattoo_description: person?.tattooDescription,
      additional_descriptors: person?.additionalDescriptors,
      comments: person?.comments,
      bolo_ind: person?.boloIndicator,
    };
  }

  private async _buildPersonCreateData(input: PartyCreateInput): Promise<any> {
    const common = await this._buildCommonPartyCreateData(input);

    return {
      ...common,
      person: {
        create: {
          ...this._buildPersonFieldData(input.person),
          ...(input.person?.facialHairStyleCodes?.length
            ? {
                person_facial_hair_style_code: {
                  create: input.person.facialHairStyleCodes.map((fhs) => ({
                    facial_hair_style_code: fhs.facialHairStyleCode,
                    create_user_id: this.user.getIdirUsername(),
                    create_utc_timestamp: new Date(),
                  })),
                },
              }
            : {}),
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      },
    };
  }

  private async _buildBusinessCreateData(input: PartyCreateInput): Promise<any> {
    const businessPersonXrefOperations = this._buildBusinessPersonXrefOperations(
      input.business?.contactPeople ?? [],
      null,
    );

    const common = await this._buildCommonPartyCreateData(input);

    return {
      ...common,
      business: {
        create: {
          name: input.business?.name,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
          ...(input.business?.identifiers?.length
            ? {
                business_identifier: {
                  create: input.business.identifiers.map((i) => ({
                    business_identifier_code: i.identifierCode,
                    identifier_value: this._normalizeIdentifierValue(i.identifierValue),
                    create_user_id: this.user.getIdirUsername(),
                    create_utc_timestamp: new Date(),
                  })),
                },
              }
            : {}),
          ...(Object.keys(businessPersonXrefOperations).length
            ? { business_person_xref: businessPersonXrefOperations }
            : {}),
        },
      },
    };
  }

  private _buildPersonUpdateData(input: PartyUpdateInput, existingPartyDto: Party): any {
    const personContactMethodOperations = this._buildContactMethodOperations(
      input.contactMethods ?? [],
      existingPartyDto.contactMethods ?? [],
    );

    const personAliasOperations = this._buildAliasOperations(input.aliases ?? [], existingPartyDto.aliases ?? []);

    const addressOperations = this._buildAddressOperations(input.addresses ?? [], existingPartyDto.addresses ?? []);

    const facialHairStyleOperations = this._buildFacialHairStyleOperations(
      input.person?.facialHairStyleCodes ?? [],
      existingPartyDto.person?.facialHairStyleCodes ?? [],
    );

    return {
      party_type: input.partyTypeCode,
      update_user_id: this.user.getIdirUsername(),
      update_utc_timestamp: new Date(),
      ...(Object.keys(addressOperations).length ? { address: addressOperations } : {}),
      ...(Object.keys(personContactMethodOperations).length ? { contact_method: personContactMethodOperations } : {}),
      ...(Object.keys(personAliasOperations).length ? { alias: personAliasOperations } : {}),
      person: {
        update: {
          ...this._buildPersonFieldData(input.person),
          ...(Object.keys(facialHairStyleOperations).length
            ? { person_facial_hair_style_code: facialHairStyleOperations }
            : {}),
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
        },
      },
    };
  }

  private _buildBusinessUpdateData(input: PartyUpdateInput, existingPartyDto: Party): any {
    const aliasOperations = this._buildAliasOperations(input.aliases ?? [], existingPartyDto.aliases ?? []);

    const contactMethodOperations = this._buildContactMethodOperations(
      input.contactMethods ?? [],
      existingPartyDto.contactMethods ?? [],
    );

    const businessIdentifierOperations = this._buildBusinessIdentifierOperations(
      input.business?.identifiers ?? [],
      existingPartyDto.business?.identifiers ?? [],
    );

    const addressOperations = this._buildAddressOperations(input.addresses ?? [], existingPartyDto.addresses ?? []);

    const businessPersonXrefOperations = this._buildBusinessPersonXrefOperations(
      input.business?.contactPeople ?? [],
      existingPartyDto.business?.contactPeople ?? [],
    );

    return {
      ...(Object.keys(addressOperations).length ? { address: addressOperations } : {}),
      ...(Object.keys(contactMethodOperations).length ? { contact_method: contactMethodOperations } : {}),
      ...(Object.keys(aliasOperations).length ? { alias: aliasOperations } : {}),
      update_user_id: this.user.getIdirUsername(),
      update_utc_timestamp: new Date(),
      business: {
        update: {
          name: input.business?.name,
          update_user_id: this.user.getIdirUsername(),
          update_utc_timestamp: new Date(),
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

  private _buildAliasOperations(incomingAliases: Alias[], existingAliases: Alias[]): any {
    const existingAliasGuids = new Set(existingAliases.map((a) => a.aliasGuid));
    const aliasesToCreate = incomingAliases.filter((a) => !a.aliasGuid || !existingAliasGuids.has(a.aliasGuid));
    const aliasesToUpdate = incomingAliases.filter((a) => a.aliasGuid && existingAliasGuids.has(a.aliasGuid));
    const aliasesToDelete = existingAliases.filter((a) => !incomingAliases.some((ia) => ia.aliasGuid === a.aliasGuid));

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
        identifier_value: this._normalizeIdentifierValue(i.identifierValue),
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
            identifier_value: this._normalizeIdentifierValue(i.identifierValue),
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

  private _sortAddressesPrimaryLast(addresses: Address[]): Address[] {
    const nonPrimary = addresses.filter((a) => !a.isPrimary);
    const primary = addresses.filter((a) => a.isPrimary);
    return [...nonPrimary, ...primary];
  }

  private _buildAddressOperations(incomingAddresses: Address[], existingAddresses: Address[]): any {
    const addressesToCreate = incomingAddresses.filter((a) => !a.addressGuid);
    const addressesToUpdate = this._sortAddressesPrimaryLast(incomingAddresses.filter((a) => a.addressGuid));
    const addressesToDelete = existingAddresses.filter(
      (a) => !new Set(incomingAddresses.map((ea) => ea.addressGuid)).has(a.addressGuid),
    );

    const operations: any = {};

    if (addressesToCreate.length) {
      operations.create = this._sortAddressesPrimaryLast(addressesToCreate).map((a) => ({
        address_name: a.addressName.trim(),
        address: a.address?.trim() || null,
        city: a.city?.trim() || null,
        country_subdivision_code: a.province?.trim() || null,
        postal_code: a.postalCode?.trim() || null,
        country_code: a.country?.trim() || null,
        is_primary: a.isPrimary ?? false,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (addressesToUpdate.length || addressesToDelete.length) {
      operations.update = [
        // Deactivations must come before primary-flag updates to avoid violating the
        // unique-active-primary-per-business constraint when the deleted address is primary.
        ...addressesToDelete.map((a) => ({
          where: { address_guid: a.addressGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...addressesToUpdate.map((a) => ({
          where: { address_guid: a.addressGuid },
          data: {
            address_name: a.addressName.trim(),
            address: a.address?.trim() || null,
            city: a.city?.trim() || null,
            country_subdivision_code: a.province?.trim() || null,
            postal_code: a.postalCode?.trim() || null,
            country_code: a.country?.trim() || null,
            is_primary: a.isPrimary ?? false,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
      ];
    }

    return operations;
  }

  private _buildFacialHairStyleOperations(
    incomingFacialHairStyles: PersonFacialHairStyleCode[],
    existingFacialHairStyles: PersonFacialHairStyleCode[],
  ): any {
    const fhsToCreate = incomingFacialHairStyles.filter((fhs) => !fhs.personFacialStyleHairCodeGuid);
    const fhsToUpdate = incomingFacialHairStyles.filter((fhs) => fhs.personFacialStyleHairCodeGuid);
    const fhsToDelete = existingFacialHairStyles.filter(
      (fhs) =>
        !new Set(incomingFacialHairStyles.map((fhs) => fhs.personFacialStyleHairCodeGuid)).has(
          fhs.personFacialStyleHairCodeGuid,
        ),
    );

    const operations: any = {};

    if (fhsToCreate.length) {
      operations.create = fhsToCreate.map((fhs) => ({
        facial_hair_style_code: fhs.facialHairStyleCode,
        person_guid: fhs.personGuid,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (fhsToUpdate.length || fhsToDelete.length) {
      operations.update = [
        ...fhsToUpdate.map((fhs) => ({
          where: { person_facial_hair_style_code_guid: fhs.personFacialStyleHairCodeGuid },
          data: {
            facial_hair_style_code: fhs.facialHairStyleCode,
            person_guid: fhs.personGuid,
            active_ind: true,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        })),
        ...fhsToDelete.map((fhs) => ({
          where: { person_facial_hair_style_code_guid: fhs.personFacialStyleHairCodeGuid },
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

  /**
   * Sort contact methods so that the primary contact methods are last to preven updates
   * from violating the unique constraint in the database.
   */
  private _sortContactMethodsPrimaryLast(contactMethods: ContactMethod[]): ContactMethod[] {
    const nonPrimary = contactMethods.filter((m) => !m.isPrimary);
    const primary = contactMethods.filter((m) => m.isPrimary);
    return [...nonPrimary, ...primary];
  }

  private _buildContactMethodOperations(incomingMethods: ContactMethod[], existingMethods: ContactMethod[]): any {
    const methodsToCreate = incomingMethods.filter((cm) => !cm.contactMethodGuid);
    const methodsToUpdate = this._sortContactMethodsPrimaryLast(incomingMethods.filter((cm) => cm.contactMethodGuid));
    const methodsToDelete = existingMethods.filter(
      (cm) => !new Set(incomingMethods.map((im) => im.contactMethodGuid)).has(cm.contactMethodGuid),
    );
    const operations: any = {};

    if (methodsToCreate.length) {
      operations.create = this._sortContactMethodsPrimaryLast(methodsToCreate).map((cm) => ({
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
    const xrefsToDelete = existingXrefs?.filter(
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
            middle_names: bpx.person.middleNames,
            last_name: bpx.person.lastName,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            party: {
              create: {
                party_type: PARTY_TYPES.Contact,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
                ...(bpx.contactMethods?.length && {
                  contact_method: {
                    create: bpx.contactMethods.map((cm) => ({
                      contact_method_type_code: {
                        connect: { contact_method_type_code: cm.typeCode },
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
          },
        },
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (xrefsToUpdate?.length || xrefsToDelete?.length) {
      operations.update = [
        ...xrefsToUpdate.map((bpx) => {
          // Find the corresponding existing xref to get existing contact methods
          const existingXref = existingXrefs?.find((ex) => ex.businessPersonXrefGuid === bpx.businessPersonXrefGuid);
          const existingContactMethods = existingXref?.contactMethods || [];

          // Build contact method operations if there are any
          const contactMethodOps =
            bpx.contactMethods?.length || existingContactMethods.length
              ? this._buildContactMethodOperations(bpx.contactMethods || [], existingContactMethods)
              : undefined;

          return {
            where: { business_person_xref_guid: bpx.businessPersonXrefGuid },
            data: {
              person: {
                update: {
                  first_name: bpx.person.firstName,
                  middle_names: bpx.person.middleNames,
                  last_name: bpx.person.lastName,
                  update_user_id: this.user.getIdirUsername(),
                  update_utc_timestamp: new Date(),
                  party: {
                    update: {
                      ...(contactMethodOps && {
                        contact_method: contactMethodOps,
                      }),
                    },
                  },
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

  /** Maps a contact method type code to a readable label for history records. */
  private _contactMethodLabel(typeCode: string): string {
    if (typeCode === "PHONE") return "phone number";
    if (typeCode === "EMAILADDR") return "email address";
    return `contact method (${typeCode})`;
  }

  /**
   * Compares two sets of contact methods and emits events for any differences.
   *
   * @param labelFn - Returns the party history field label for a given type code e.g. "business phone number" or
   *   "phone number in business contact John Doe".
   */
  private _compareContactMethods(
    existingMethods: ContactMethod[],
    incomingMethods: ContactMethod[],
    labelFn: (typeCode: string) => string,
    addEvent: AddEventFn,
  ): void {
    // Detect added and edited contact methods
    for (const incoming of incomingMethods) {
      if (incoming.contactMethodGuid) {
        const existing = existingMethods.find((m) => m.contactMethodGuid === incoming.contactMethodGuid);
        if (existing && existing.value !== incoming.value) {
          addEvent("EDITED", labelFn(incoming.typeCode), existing.value, incoming.value);
        }
      } else if (incoming.value) {
        addEvent("ADDED", labelFn(incoming.typeCode), null, incoming.value);
      }
    }

    // Detect removed contact methods (present in existing but absent in incoming)
    const incomingGuids = new Set(incomingMethods.map((m) => m.contactMethodGuid));
    existingMethods
      .filter((m) => !incomingGuids.has(m.contactMethodGuid))
      .forEach((m) => addEvent("REMOVED", labelFn(m.typeCode), m.value, null));

    // Detect primary contact method changes (e.g. user switched which phone number is primary)
    const typeCodes = new Set([...existingMethods.map((m) => m.typeCode), ...incomingMethods.map((m) => m.typeCode)]);
    for (const typeCode of typeCodes) {
      const oldPrimary = existingMethods.find((m) => m.isPrimary && m.typeCode === typeCode);
      const newPrimary = incomingMethods.find((m) => m.isPrimary && m.typeCode === typeCode);
      if (oldPrimary && newPrimary && oldPrimary.contactMethodGuid !== newPrimary.contactMethodGuid) {
        addEvent("EDITED", `primary ${labelFn(typeCode)}`, oldPrimary.value, newPrimary.value);
      }
    }
  }

  /** Compares a single scalar field and emits an ADDED/REMOVED/EDITED event for any change. */
  private _compareField(field: string, oldVal: any, newVal: any, addEvent: AddEventFn): void {
    const oldStr = oldVal != null && oldVal !== "" ? String(oldVal) : null;
    const newStr = newVal != null && newVal !== "" ? String(newVal) : null;
    if (oldStr === newStr) return;
    if (oldStr && newStr) {
      addEvent("EDITED", field, oldVal, newVal);
    } else if (oldStr) {
      addEvent("REMOVED", field, oldVal, null);
    } else {
      addEvent("ADDED", field, null, newVal);
    }
  }

  private _diffAliases(existingAliases: Alias[], incomingAliases: Alias[], addEvent: AddEventFn): void {
    for (const incoming of incomingAliases) {
      if (incoming.aliasGuid) {
        const existing = existingAliases.find((a) => a.aliasGuid === incoming.aliasGuid);
        if (existing && existing.name !== incoming.name) {
          addEvent("EDITED", "alias", existing.name, incoming.name);
        }
      } else {
        addEvent("ADDED", "alias", null, incoming.name);
      }
    }
    const incomingGuids = new Set(incomingAliases.map((a) => a.aliasGuid));
    existingAliases
      .filter((a) => !incomingGuids.has(a.aliasGuid))
      .forEach((a) => addEvent("REMOVED", "alias", a.name, null));
  }

  private _diffBusinessIdentifiers(
    existingIdentifiers: BusinessIdentifier[],
    incomingIdentifiers: BusinessIdentifier[],
    addEvent: AddEventFn,
  ): void {
    for (const incoming of incomingIdentifiers) {
      if (incoming.businessIdentifierGuid) {
        const existing = existingIdentifiers.find((i) => i.businessIdentifierGuid === incoming.businessIdentifierGuid);
        if (existing && existing.identifierValue !== incoming.identifierValue) {
          addEvent(
            "EDITED",
            `identifier (${incoming.identifierCode})`,
            existing.identifierValue,
            incoming.identifierValue,
          );
        }
      } else {
        addEvent("ADDED", `identifier (${incoming.identifierCode})`, null, incoming.identifierValue);
      }
    }
    const incomingGuids = new Set(incomingIdentifiers.map((i) => i.businessIdentifierGuid));
    existingIdentifiers
      .filter((i) => !incomingGuids.has(i.businessIdentifierGuid))
      .forEach((i) => {
        addEvent("REMOVED", `identifier (${i.identifierCode})`, i.identifierValue, null);
      });
  }

  private _diffAddresses(existingAddresses: Address[], incomingAddresses: Address[], addEvent: AddEventFn): void {
    for (const incoming of incomingAddresses) {
      if (incoming.addressGuid) {
        const existing = existingAddresses.find((a) => a.addressGuid === incoming.addressGuid);
        if (!existing) continue;
        const label = incoming.addressName || existing.addressName;
        this._compareField("address name", existing.addressName, incoming.addressName, addEvent);
        this._compareField(`street address in address "${label}"`, existing.address, incoming.address, addEvent);
        this._compareField(`city in address "${label}"`, existing.city, incoming.city, addEvent);
        this._compareField(`province in address "${label}"`, existing.province, incoming.province, addEvent);
        this._compareField(`postal code in address "${label}"`, existing.postalCode, incoming.postalCode, addEvent);
        this._compareField(`country in address "${label}"`, existing.country, incoming.country, addEvent);
      } else if (incoming.addressName) {
        addEvent("ADDED", "address", null, incoming.addressName, {
          streetAddress: incoming.address ?? null,
          city: incoming.city ?? null,
          province: incoming.province ?? null,
          postalCode: incoming.postalCode ?? null,
          country: incoming.country ?? null,
        });
      }
    }
    const incomingGuids = new Set(incomingAddresses.map((a) => a.addressGuid));
    existingAddresses
      .filter((a) => !incomingGuids.has(a.addressGuid))
      .forEach((a) =>
        addEvent("REMOVED", "address", a.addressName, null, {
          streetAddress: a.address ?? null,
          city: a.city ?? null,
          province: a.province ?? null,
          postalCode: a.postalCode ?? null,
          country: a.country ?? null,
        }),
      );
    // Detect when the primary address switches from one address to another
    const oldPrimary = existingAddresses.find((a) => a.isPrimary);
    const newPrimary = incomingAddresses.find((a) => a.isPrimary);
    if (oldPrimary && newPrimary && oldPrimary.addressGuid !== newPrimary.addressGuid) {
      addEvent("EDITED", "primary address", oldPrimary.addressName, newPrimary.addressName);
    }
  }

  private _diffNewContact(incoming: BusinessPersonXref, addEvent: AddEventFn): void {
    const name = [incoming.person?.firstName, incoming.person?.lastName].filter(Boolean).join(" ");
    addEvent("ADDED", "business contact", null, name);
    for (const cm of incoming.contactMethods ?? []) {
      if (cm?.value) {
        const contactLabel = name
          ? `${this._contactMethodLabel(cm.typeCode)} in business contact ${name}`
          : `contact ${this._contactMethodLabel(cm.typeCode)}`;
        addEvent("ADDED", contactLabel, null, cm.value);
      }
    }
  }

  private _diffExistingContact(
    existingXrefs: BusinessPersonXref[],
    incoming: BusinessPersonXref,
    addEvent: AddEventFn,
  ): void {
    const existingXref = existingXrefs.find((x) => x.businessPersonXrefGuid === incoming.businessPersonXrefGuid);
    if (!existingXref) return;

    const existingName = [existingXref.person?.firstName, existingXref.person?.lastName].filter(Boolean).join(" ");
    const incomingName = [incoming.person?.firstName, incoming.person?.lastName].filter(Boolean).join(" ");
    const contactLabel = incomingName || existingName;

    if (
      existingXref.person?.firstName !== incoming.person?.firstName ||
      existingXref.person?.lastName !== incoming.person?.lastName
    ) {
      addEvent("EDITED", "business contact name", existingName || null, incomingName || null);
    }

    this._compareContactMethods(
      existingXref.contactMethods ?? [],
      incoming.contactMethods ?? [],
      (tc) => `${this._contactMethodLabel(tc)} in business contact ${contactLabel}`,
      addEvent,
    );
  }

  private _diffContactPeople(
    existingXrefs: BusinessPersonXref[],
    incomingXrefs: BusinessPersonXref[],
    addEvent: AddEventFn,
  ): void {
    for (const incoming of incomingXrefs) {
      if (incoming.businessPersonXrefGuid) {
        this._diffExistingContact(existingXrefs, incoming, addEvent);
      } else {
        this._diffNewContact(incoming, addEvent);
      }
    }
    const incomingGuids = new Set(incomingXrefs.map((x) => x.businessPersonXrefGuid));
    existingXrefs
      .filter((x) => !incomingGuids.has(x.businessPersonXrefGuid))
      .forEach((x) => {
        const name = [x.person?.firstName, x.person?.lastName].filter(Boolean).join(" ");
        addEvent("REMOVED", "business contact", name, null);
      });
  }

  private _diffFacialHairTypes(
    existingFacialHairStyles: PersonFacialHairStyleCode[],
    incomingFacialHairStyles: PersonFacialHairStyleCode[],
    addEvent: AddEventFn,
  ): void {
    for (const incoming of incomingFacialHairStyles) {
      if (incoming.personFacialStyleHairCodeGuid) {
        const existing = existingFacialHairStyles.find(
          (fhs) => fhs.personFacialStyleHairCodeGuid === incoming.personFacialStyleHairCodeGuid,
        );
        if (existing && existing.facialHairStyleCode !== incoming.facialHairStyleCode) {
          addEvent("EDITED", "facial hair style", existing.facialHairStyleCode, incoming.facialHairStyleCode);
        }
      } else {
        addEvent("ADDED", "facial hair style", null, incoming.facialHairStyleCode);
      }
    }
    const incomingGuids = new Set(incomingFacialHairStyles.map((fhs) => fhs.personFacialStyleHairCodeGuid));
    existingFacialHairStyles
      .filter((fhs) => !incomingGuids.has(fhs.personFacialStyleHairCodeGuid))
      .forEach((fhs) => addEvent("REMOVED", "facial hair style", fhs.facialHairStyleCode, null));
  }

  private _diffPartyChanges(oldParty: Party, newParty: PartyUpdateInput, addEvent: AddEventFn): void {
    this._diffAliases(oldParty.aliases ?? [], newParty.aliases ?? [], addEvent);
    this._compareContactMethods(
      oldParty.contactMethods ?? [],
      newParty.contactMethods ?? [],
      (tc) => this._contactMethodLabel(tc),
      addEvent,
    );
    this._diffAddresses(oldParty.addresses ?? [], newParty.addresses ?? [], addEvent);
  }

  private _diffPersonChanges(
    oldPerson: Party["person"],
    newPerson: PartyUpdateInput["person"],
    addEvent: AddEventFn,
  ): void {
    if (!oldPerson || !newPerson) return;
    this._compareField("Caution / BOLO", oldPerson.boloIndicator, newPerson.boloIndicator, addEvent);
    this._compareField("first name", oldPerson.firstName, newPerson.firstName, addEvent);
    this._compareField("middle name", oldPerson.middleNames, newPerson.middleNames, addEvent);
    this._compareField("last name", oldPerson.lastName, newPerson.lastName, addEvent);
    this._compareField(
      "date of birth",
      oldPerson.dateOfBirth ? oldPerson.dateOfBirth.toISOString().split("T")[0] : null,
      newPerson.dateOfBirth ? newPerson.dateOfBirth.toISOString().split("T")[0] : null,
      addEvent,
    );
    this._compareField("approximate age", oldPerson.approximateAgeCode, newPerson.approximateAgeCode, addEvent);
    this._compareField(
      "driver's licence number",
      oldPerson.driversLicenseNumber,
      newPerson.driversLicenseNumber,
      addEvent,
    );
    this._compareField(
      "driver's licence class",
      oldPerson.driversLicenseClass,
      newPerson.driversLicenseClass,
      addEvent,
    );
    this._compareField(
      "driver's licence country",
      oldPerson.driversLicenseCountryCode,
      newPerson.driversLicenseCountryCode,
      addEvent,
    );
    this._compareField(
      "driver's licence province",
      oldPerson.driversLicenseCountrySubdivisionCode,
      newPerson.driversLicenseCountrySubdivisionCode,
      addEvent,
    );
    this._compareField("gender", oldPerson.genderCode, newPerson.genderCode, addEvent);
    this._compareField("height", oldPerson.heightInCm, newPerson.heightInCm, addEvent);
    this._compareField("weight", oldPerson.weightInKg, newPerson.weightInKg, addEvent);
    this._compareField("complexion", oldPerson.complexionCode, newPerson.complexionCode, addEvent);
    this._compareField("build", oldPerson.buildCode, newPerson.buildCode, addEvent);
    this._compareField("eye colour", oldPerson.eyeColourCode, newPerson.eyeColourCode, addEvent);
    this._compareField("other eye colour", oldPerson.eyeColourOther, newPerson.eyeColourOther, addEvent);
    this._compareField("hair colour", oldPerson.hairColourCode, newPerson.hairColourCode, addEvent);
    this._compareField("other hair colour", oldPerson.hairColourOther, newPerson.hairColourOther, addEvent);
    this._compareField("hair length", oldPerson.hairLengthCode, newPerson.hairLengthCode, addEvent);
    this._compareField("has facial hair", oldPerson.facialHairIndicator, newPerson.facialHairIndicator, addEvent);
    this._diffFacialHairTypes(oldPerson.facialHairStyleCodes ?? [], newPerson.facialHairStyleCodes ?? [], addEvent);
    this._compareField(
      "additional hair descriptors",
      oldPerson.additionalHairDescriptors,
      newPerson.additionalHairDescriptors,
      addEvent,
    );
    this._compareField("has tattoos", oldPerson.tattooIndicator, newPerson.tattooIndicator, addEvent);
    this._compareField("tattoos", oldPerson.tattooDescription, newPerson.tattooDescription, addEvent);
    this._compareField(
      "additional descriptors",
      oldPerson.additionalDescriptors,
      newPerson.additionalDescriptors,
      addEvent,
    );
    this._compareField("comments", oldPerson.comments, newPerson.comments, addEvent);
  }

  private _diffBusinessChanges(
    oldBusiness: Party["business"],
    newBusiness: PartyUpdateInput["business"],
    addEvent: AddEventFn,
  ): void {
    if (!oldBusiness || !newBusiness) return;
    this._compareField("business name", oldBusiness.name, newBusiness.name, addEvent);
    this._diffBusinessIdentifiers(oldBusiness.identifiers ?? [], newBusiness.identifiers ?? [], addEvent);
    this._diffContactPeople(oldBusiness.contactPeople ?? [], newBusiness.contactPeople ?? [], addEvent);
  }

  /**
   * Builds the list of party history events describing what changed between the existing party
   * state and the incoming update input.
   */
  private _partyChangeEvents(partyIdentifier: string, oldParty: Party, input: PartyUpdateInput): EventCreateInput[] {
    const events: EventCreateInput[] = [];
    const actorId = this.user.getUserGuid();

    const addEvent: AddEventFn = (verb, field, oldValue, newValue, extraContent) => {
      events.push({
        eventVerbTypeCode: verb,
        sourceId: partyIdentifier,
        sourceEntityTypeCode: "PARTY",
        actorId,
        actorEntityTypeCode: "USER",
        targetId: partyIdentifier,
        targetEntityTypeCode: "PARTY",
        content: { field, oldValue: oldValue ?? null, newValue: newValue ?? null, ...extraContent },
      });
    };

    // Detect Party level changes
    this._diffPartyChanges(oldParty, input, addEvent);

    if (input.partyTypeCode === PARTY_TYPES.Person) {
      // Detect person level changes
      this._diffPersonChanges(oldParty.person, input.person, addEvent);
    } else {
      // Detect business level changes
      this._diffBusinessChanges(oldParty.business, input.business, addEvent);
    }

    return events;
  }

  async update(partyIdentifier: string, input: PartyUpdateInput): Promise<Party> {
    const existingParty: any = await this.prisma.party.findUnique({
      include: {
        address: { where: { active_ind: true } },
        contact_method: { where: { active_ind: true } },
        alias: { where: { active_ind: true } },
        person: {
          include: {
            person_facial_hair_style_code: { where: { active_ind: true } },
          },
        },
        business: {
          include: {
            business_identifier: {
              where: { active_ind: true },
              include: {
                business_identifier_code_business_identifier_business_identifier_codeTobusiness_identifier_code: true,
              },
            },
            business_person_xref: {
              where: { active_ind: true },
              include: {
                person: true,
              },
            },
          },
        },
      },
      where: { party_guid: partyIdentifier },
    });
    if (!existingParty) throw new Error("Party not found");

    const existingPartyDto = this.mapper.map<party, Party>(existingParty as party, "party", "Party");

    if (input.partyTypeCode === PARTY_TYPES.Company && input.business) {
      this._validateBusinessInput(input.business);
    }

    let data: any;

    if (input.partyTypeCode === PARTY_TYPES.Person) {
      data = this._buildPersonUpdateData(input, existingPartyDto);
    } else {
      data = this._buildBusinessUpdateData(input, existingPartyDto);
    }
    try {
      const changeEvents = this._partyChangeEvents(partyIdentifier, existingPartyDto, input);

      const prismaParty: any = await this.prisma.party.update({
        where: { party_guid: partyIdentifier },
        data: data,
        include: {
          party_type_code: true,
          person: true,
          business: true,
        },
      });

      for (const event of changeEvents) {
        this.eventPublisher.publishEvent(event, STREAM_TOPICS.PARTY_UPDATED);
      }

      return this.mapper.map<party, Party>(prismaParty as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error updating party:", (error as Error)?.message);
      this._rethrowIfBusinessNumberConflict(error);
    }
  }

  async search(page: number = 1, pageSize: number = 25, filters?: PartyFilters): Promise<PartyResult> {
    const where: any = {
      party_type: {
        in: [PARTY_TYPES.Person, PARTY_TYPES.Company],
      },
    };

    if (filters?.search) {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(filters.search)) {
        where.OR = [{ party_guid: { equals: filters.search } }];
      } else {
        const terms = filters.search.trim().split(/\s+/);
        where.AND = terms.map((term) => ({
          OR: [
            { party_type: { equals: term } },
            { business: { name: { contains: term, mode: "insensitive" } } },
            { person: { first_name: { contains: term, mode: "insensitive" } } },
            { person: { last_name: { contains: term, mode: "insensitive" } } },
          ],
        }));
      }
    }

    if (filters?.partyTypeCode) {
      where.party_type = {
        in: [filters.partyTypeCode],
      };
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
        case "dateOfBirth": {
          orderBy = { person: { date_of_birth: validSortOrder } };
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
          contact_method: {
            where: { active_ind: true },
            select: {
              contact_method_guid: true,
              contact_method_type: true,
              contact_value: true,
              is_primary: true,
              contact_method_type_code: {
                select: {
                  contact_method_type_code: true,
                  short_description: true,
                  long_description: true,
                },
              },
            },
          },
          business: {
            select: {
              business_guid: true,
              name: true,
              business_identifier: {
                where: { active_ind: true },
                select: {
                  business_identifier_guid: true,
                  identifier_value: true,
                  business_identifier_code_business_identifier_business_identifier_codeTobusiness_identifier_code: {
                    select: {
                      business_identifier_code: true,
                      short_description: true,
                      long_description: true,
                    },
                  },
                },
              },
            },
          },
          person: {
            select: {
              person_guid: true,
              first_name: true,
              last_name: true,
              date_of_birth: true,
            },
          },
        },
        orderByClause: orderBy,
      },
    );

    return {
      items: result.items,
      pageInfo: result.pageInfo,
    };
  }
}
