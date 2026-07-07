import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { party } from "../../../prisma/shared/generated/party";
import {
  ImageUpdate,
  Party,
  PartyCreateInput,
  PartyFilters,
  PartyMatchInput,
  PartyResult,
  PartyUpdateInput,
} from "./dto/party";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";
import { Alias } from "src/shared/alias/dto/alias";
import { BusinessIdentifier } from "src/shared/business_identifier/dto/business_identifier";
import { BusinessPersonXref } from "src/shared/business_person_xref/dto/business_person_xref";
import { BusinessPersonAddressXref } from "src/shared/business_person_address_xref/dto/business_person_address_xref";
import { ContactMethod } from "src/shared/contact_method/dto/contact_method";
import { Address, AddressInput } from "src/shared/address/dto/address";
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
    businessIdentifiers?: BusinessIdentifier[];
    addresses?: Address[];
  }): void {
    if (!business.name?.trim()) {
      throw new Error("Name is required.");
    }

    const businessNumberValue = this._getBusinessNumberValue(business.businessIdentifiers);

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
            contact_method: {
              select: {
                contact_method_guid: true,
                contact_method_type: true,
                contact_value: true,
                is_primary: true,
              },
            },
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
                business_person_address_xref: {
                  include: {
                    address: {
                      select: {
                        address_guid: true,
                        address_name: true,
                      },
                    },
                  },
                },
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
      const mappingError = error as Error;
      this.logger.error(`Error mapping party: ${mappingError.message}`, mappingError.stack);
      throw error;
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

      const prismaParty: any = await this.prisma.$transaction(async (tx) => {
        const created: any = await tx.party.create({
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

        await this._createPartyAddresses(tx, created.party_guid, input.addresses ?? []);

        if (created.business) {
          for (const contact of input.business?.contactPeople ?? []) {
            await this._createBusinessContact(tx, created.business.business_guid, contact);
          }
        }

        return created;
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

    // addresses are created after the party so contact office links can reference them
    return {
      party_type: input.partyTypeCode,
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
      created_by_app_user_guid: createdByUser.appUserGuid,
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
    // contact people are created after the party so office links can reference the addresses
    const common = await this._buildCommonPartyCreateData(input);

    return {
      ...common,
      business: {
        create: {
          name: input.business?.name,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
          ...(input.business?.businessIdentifiers?.length
            ? {
                business_identifier: {
                  create: input.business.businessIdentifiers.map((i) => ({
                    business_identifier_code: i.identifierCode,
                    identifier_value: this._normalizeIdentifierValue(i.identifierValue),
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
      input.business?.businessIdentifiers ?? [],
      existingPartyDto.business?.businessIdentifiers ?? [],
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

  private _sortAddressesPrimaryLast(addresses: AddressInput[]): AddressInput[] {
    const nonPrimary = addresses.filter((a) => !a.isPrimary);
    const primary = addresses.filter((a) => a.isPrimary);
    return [...nonPrimary, ...primary];
  }

  private _buildAddressOperations(incomingAddresses: AddressInput[], existingAddresses: Address[]): any {
    // addresses may now include client-generated ids so existing are updated and new ones are created
    const existingGuids = new Set(existingAddresses.map((a) => a.addressGuid));
    const addressesToCreate = incomingAddresses.filter((a) => !a.addressGuid || !existingGuids.has(a.addressGuid));
    const addressesToUpdate = this._sortAddressesPrimaryLast(
      incomingAddresses.filter((a) => a.addressGuid && existingGuids.has(a.addressGuid)),
    );
    const addressesToDelete = existingAddresses.filter(
      (a) => !new Set(incomingAddresses.map((ea) => ea.addressGuid)).has(a.addressGuid),
    );

    const operations: any = {};

    if (addressesToCreate.length) {
      operations.create = this._sortAddressesPrimaryLast(addressesToCreate).map((a) => ({
        ...(a.addressGuid ? { address_guid: a.addressGuid } : {}),
        address_name: a.addressName.trim(),
        address: a.address?.trim() || null,
        city: a.city?.trim() || null,
        country_subdivision_code: a.province?.trim() || null,
        postal_code: a.postalCode?.trim() || null,
        country_code: a.country?.trim() || null,
        is_primary: a.isPrimary ?? false,
        display_in_investigation_ind: a.displayInInvestigation ?? true,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        ...(a.contactMethods?.length
          ? { contact_method: { create: a.contactMethods.map((cm) => this._contactMethodCreateData(cm)) } }
          : {}),
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
        ...addressesToUpdate.map((a) => {
          const existingAddress = existingAddresses.find((e) => e.addressGuid === a.addressGuid);
          const contactMethodOps = this._buildContactMethodOperations(
            (a.contactMethods as ContactMethod[] | undefined) ?? [],
            (existingAddress?.contactMethods as ContactMethod[] | undefined) ?? [],
          );

          return {
            where: { address_guid: a.addressGuid },
            data: {
              address_name: a.addressName.trim(),
              address: a.address?.trim() || null,
              city: a.city?.trim() || null,
              country_subdivision_code: a.province?.trim() || null,
              postal_code: a.postalCode?.trim() || null,
              country_code: a.country?.trim() || null,
              is_primary: a.isPrimary ?? false,
              display_in_investigation_ind: a.displayInInvestigation ?? true,
              active_ind: true,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
              ...(Object.keys(contactMethodOps).length ? { contact_method: contactMethodOps } : {}),
            },
          };
        }),
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

  private _contactMethodCreateData(cm: { typeCode: string; value: string; isPrimary?: boolean }) {
    return {
      contact_method_type: cm.typeCode,
      contact_value: cm.value,
      is_primary: cm.isPrimary ?? false,
      active_ind: true,
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
    };
  }

  private async _createPartyAddresses(tx: any, partyGuid: string, addresses: AddressInput[]): Promise<void> {
    for (const a of this._sortAddressesPrimaryLast(addresses)) {
      await tx.address.create({
        data: {
          ...(a.addressGuid ? { address_guid: a.addressGuid } : {}),
          party_guid: partyGuid,
          address_name: a.addressName.trim(),
          address: a.address?.trim() || null,
          city: a.city?.trim() || null,
          country_subdivision_code: a.province?.trim() || null,
          postal_code: a.postalCode?.trim() || null,
          country_code: a.country?.trim() || null,
          is_primary: a.isPrimary ?? false,
          display_in_investigation_ind: a.displayInInvestigation ?? true,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
          ...(a.contactMethods?.length
            ? { contact_method: { create: a.contactMethods.map((cm) => this._contactMethodCreateData(cm)) } }
            : {}),
        },
      });
    }
  }

  private async _createBusinessContact(tx: any, businessGuid: string, contact: BusinessPersonXref): Promise<void> {
    const xref = await tx.business_person_xref.create({
      data: {
        business: { connect: { business_guid: businessGuid } },
        business_person_xref_code_business_person_xref_business_person_xref_codeTobusiness_person_xref_code: {
          connect: { business_person_xref_code: "CONT" },
        },
        title_role: contact.title ?? null,
        display_in_investigation_ind: contact.displayInInvestigation ?? true,
        is_primary: contact.isPrimary ?? false,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        person: {
          create: {
            first_name: contact.person?.firstName,
            middle_names: contact.person?.middleNames,
            last_name: contact.person?.lastName,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
            party: {
              create: {
                party_type: PARTY_TYPES.Contact,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
                ...(contact.contactMethods?.length
                  ? {
                      contact_method: {
                        create: contact.contactMethods.map((cm) => ({
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
                    }
                  : {}),
              },
            },
          },
        },
      },
    });

    await this._createOfficeLinks(tx, xref.business_person_xref_guid, contact.officeAddressGuids ?? []);
  }

  private async _createOfficeLinks(tx: any, xrefGuid: string, officeAddressGuids: string[]): Promise<void> {
    const uniqueAddressGuids = [...new Set(officeAddressGuids)];
    if (!uniqueAddressGuids.length) return;

    await tx.business_person_address_xref.createMany({
      data: uniqueAddressGuids.map((addressGuid) => ({
        business_person_xref_guid: xrefGuid,
        address_guid: addressGuid,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      })),
    });
  }

  // map a contact's office links against the any new addresses
  private async _mapOfficeLinks(
    tx: any,
    xrefGuid: string,
    officeAddressGuids: string[],
    existingLinks: BusinessPersonAddressXref[],
  ): Promise<void> {
    const incoming = new Set(officeAddressGuids);
    const existingAddressGuids = new Set(existingLinks.map((l) => l.address?.addressGuid).filter(Boolean));

    for (const link of existingLinks) {
      if (link.address?.addressGuid && !incoming.has(link.address.addressGuid)) {
        await tx.business_person_address_xref.update({
          where: { business_person_address_xref_guid: link.businessPersonAddressXrefGuid },
          data: {
            active_ind: false,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      }
    }

    const toAdd = [...incoming].filter((guid) => !existingAddressGuids.has(guid));
    await this._createOfficeLinks(tx, xrefGuid, toAdd);
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
        title_role: bpx.title ?? null,
        display_in_investigation_ind: bpx.displayInInvestigation ?? true,
        is_primary: bpx.isPrimary ?? false,
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
              title_role: bpx.title ?? null,
              display_in_investigation_ind: bpx.displayInInvestigation ?? true,
              is_primary: bpx.isPrimary ?? false,
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

  private _diffAddresses(existingAddresses: Address[], incomingAddresses: AddressInput[], addEvent: AddEventFn): void {
    for (const incoming of incomingAddresses) {
      const existing = incoming.addressGuid
        ? existingAddresses.find((a) => a.addressGuid === incoming.addressGuid)
        : undefined;
      if (existing) {
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

  private _diffImageChanges(input: ImageUpdate[], addEvent: AddEventFn): void {
    input.forEach((image) => {
      addEvent(image.verb, "Image", image.fileName, image.fileName);
    });
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
    this._diffBusinessIdentifiers(
      oldBusiness.businessIdentifiers ?? [],
      newBusiness.businessIdentifiers ?? [],
      addEvent,
    );
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

    // Detect Image changes -- nothing to compare as they are all sent via the frontend
    this._diffImageChanges(input.images, addEvent);

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
        address: {
          where: { active_ind: true },
          include: {
            contact_method: { where: { active_ind: true } },
          },
        },
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
                person: {
                  include: {
                    party: {
                      include: {
                        contact_method: { where: { active_ind: true } },
                      },
                    },
                  },
                },
                business_person_address_xref: {
                  where: { active_ind: true },
                  include: {
                    address: true,
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

    if (input.partyTypeCode === PARTY_TYPES.Company && input.business) {
      this._validateBusinessInput(input.business);
    }

    const isBusiness = input.partyTypeCode !== PARTY_TYPES.Person;

    const existingAddressGuids = new Set((existingPartyDto.addresses ?? []).map((a) => a.addressGuid));
    const newAddresses = isBusiness
      ? (input.addresses ?? []).filter((a) => !a.addressGuid || !existingAddressGuids.has(a.addressGuid))
      : [];
    const newContacts = isBusiness
      ? (input.business?.contactPeople ?? []).filter((c) => !c.businessPersonXrefGuid)
      : [];
    const builderInput = isBusiness
      ? {
          ...input,
          addresses: (input.addresses ?? []).filter((a) => a.addressGuid && existingAddressGuids.has(a.addressGuid)),
          business: input.business
            ? {
                ...input.business,
                contactPeople: (input.business.contactPeople ?? []).filter((c) => c.businessPersonXrefGuid),
              }
            : input.business,
        }
      : input;

    let data: any;

    if (input.partyTypeCode === PARTY_TYPES.Person) {
      data = this._buildPersonUpdateData(input, existingPartyDto);
    } else {
      data = this._buildBusinessUpdateData(builderInput, existingPartyDto);
    }
    try {
      const changeEvents = this._partyChangeEvents(partyIdentifier, existingPartyDto, input);

      const prismaParty: any = await this.prisma.$transaction(async (tx) => {
        const updated: any = await tx.party.update({
          where: { party_guid: partyIdentifier },
          data: data,
          include: {
            party_type_code: true,
            person: true,
            business: true,
          },
        });

        if (isBusiness && updated.business) {
          await this._createPartyAddresses(tx, partyIdentifier, newAddresses);

          for (const contact of newContacts) {
            await this._createBusinessContact(tx, updated.business.business_guid, contact);
          }

          for (const contact of (input.business?.contactPeople ?? []).filter((c) => c.businessPersonXrefGuid)) {
            if (contact.officeAddressGuids === undefined) continue;
            const existingXref = existingPartyDto.business?.contactPeople?.find(
              (x) => x.businessPersonXrefGuid === contact.businessPersonXrefGuid,
            );
            await this._mapOfficeLinks(
              tx,
              contact.businessPersonXrefGuid!,
              contact.officeAddressGuids ?? [],
              (existingXref?.associatedAddresses as BusinessPersonAddressXref[] | undefined) ?? [],
            );
          }
        }

        return updated;
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
      const terms = filters.search
        .trim()
        .split(/[\s,()-]+/) // Get rid of any user typed whitespace or special chars , ( ) -
        .filter(Boolean); // Toss any thing that is just whitespace
      where.AND = terms.map((term) => ({
        OR: [
          { party_type: { equals: term } },
          { business: { name: { contains: term, mode: "insensitive" } } },
          {
            business: {
              business_identifier: {
                some: {
                  identifier_value: {
                    contains: term,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            contact_method: {
              some: {
                contact_value: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            address: {
              some: {
                address: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            address: {
              some: {
                city: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
          },
          { person: { first_name: { contains: term, mode: "insensitive" } } },
          { person: { last_name: { contains: term, mode: "insensitive" } } },
        ],
      }));
    }

    // Required to maintain tab seperation
    if (filters?.partyTypeCode) {
      where.party_type = {
        in: [filters.partyTypeCode],
      };
    }

    let orderBy: any = { party_guid: "desc" }; // Default sort

    if (filters?.sortBy && filters?.sortOrder) {
      const validSortOrder = filters.sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

      if (filters.partyTypeCode === PARTY_TYPES.Company) {
        orderBy = { business: { name: validSortOrder } };
      } else {
        orderBy = [{ person: { last_name: validSortOrder } }, { person: { first_name: validSortOrder } }];
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
          address: {
            select: {
              address: true,
              city: true,
              country_subdivision_code: true,
              is_primary: true,
            },
            where: { active_ind: true },
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
                  business_identifier_code: true,
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
              gender_code: true,
              approximate_age_code: true,
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

  /**
   * Counts how many of the entered match fields a candidate party actually satisfies.
   * Each matched field is worth 1.
   *
   * Will likely be replaced / enhanced in the future.
   */
  private _scoreMatch(input: PartyMatchInput, party: party): number {
    let score = 0;

    if (input.person?.firstName && party.person?.first_name === input.person.firstName) {
      score += 1;
    }
    if (input.person?.lastName && party.person?.last_name === input.person.lastName) {
      score += 1;
    }
    if (input.person?.dateOfBirth && party.person?.date_of_birth) {
      const candidateDob = party.person.date_of_birth;
      const inputDob = input.person.dateOfBirth;
      const sameDate =
        candidateDob.getUTCFullYear() === inputDob.getUTCFullYear() &&
        candidateDob.getUTCMonth() === inputDob.getUTCMonth() &&
        candidateDob.getUTCDate() === inputDob.getUTCDate();
      if (sameDate) {
        score += 1;
      }
    }
    if (input.person?.genderCode && party.person?.gender_code === input.person.genderCode) {
      score += 1;
    }
    if (
      input.person?.driversLicenseNumber &&
      party.person?.drivers_license_number === input.person.driversLicenseNumber
    ) {
      score += 1;
    }

    if (input.business?.name && party.business?.name === input.business.name) {
      score += 1;
    }

    const businessNumber = input.business?.businessIdentifiers?.find(
      (i) => i.identifierCode === BUSINESS_NUMBER_CODE,
    )?.identifierValue;
    if (
      businessNumber &&
      party.business?.business_identifier?.some(
        (bi: any) => bi.business_identifier_code === BUSINESS_NUMBER_CODE && bi.identifier_value === businessNumber,
      )
    ) {
      score += 1;
    }

    const phoneValue = input.contactMethods?.find((c) => c.value)?.value;
    if (
      phoneValue &&
      party.contact_method?.some(
        (cm: any) => cm.contact_method_type === "PHONE" && cm.contact_value === `+${phoneValue.replace(/\D/g, "")}`,
      )
    ) {
      score += 1;
    }

    const addressLine = input.addresses?.find((a) => a.address)?.address;
    if (addressLine && party.address?.some((a: any) => a.address === addressLine)) {
      score += 1;
    }

    return score;
  }

  private _buildMatchWhere(input: PartyMatchInput): any {
    const conditions: any[] = [];

    if (input.person?.firstName) {
      conditions.push({ person: { first_name: { equals: input.person.firstName } } });
    }
    if (input.person?.lastName) {
      conditions.push({ person: { last_name: { equals: input.person.lastName } } });
    }
    if (input.person?.dateOfBirth) {
      conditions.push({ person: { date_of_birth: { equals: input.person.dateOfBirth } } });
    }
    if (input.person?.genderCode) {
      conditions.push({ person: { gender_code: { equals: input.person.genderCode } } });
    }
    if (input.person?.driversLicenseNumber) {
      conditions.push({ person: { drivers_license_number: { equals: input.person.driversLicenseNumber } } });
    }

    if (input.business?.name) {
      conditions.push({ business: { name: { equals: input.business.name } } });
    }

    const businessNumber = input.business?.businessIdentifiers?.find(
      (i) => i.identifierCode === BUSINESS_NUMBER_CODE,
    )?.identifierValue;
    if (businessNumber) {
      conditions.push({
        business: {
          business_identifier: {
            some: {
              business_identifier_code: BUSINESS_NUMBER_CODE,
              identifier_value: { equals: businessNumber },
            },
          },
        },
      });
    }

    for (const phone of input.contactMethods ?? []) {
      if (phone.value) {
        const normalized = `+${phone.value.replace(/\D/g, "")}`;
        conditions.push({
          contact_method: {
            some: {
              contact_method_type: "PHONE",
              contact_value: { equals: normalized },
            },
          },
        });
      }
    }

    for (const addr of input.addresses ?? []) {
      if (addr.address) {
        conditions.push({
          address: {
            some: { address: { equals: addr.address } },
          },
        });
      }
    }

    return {
      party_type: { in: [PARTY_TYPES.Person, PARTY_TYPES.Company] },
      OR: conditions,
    };
  }

  async matchParty(input: PartyMatchInput): Promise<Party[]> {
    const where = this._buildMatchWhere(input);

    // Guard: with no usable conditions the AND clause would match every party.
    // The frontend enforces the minimum-two-fields rule, but we defend here so a
    // zero-condition call can never return the entire party table.
    if (!where.OR.length) {
      return [];
    }

    const prismaParties: any = await this.prisma.party.findMany({
      where,
      take: 50, // arbitrary number... 10 times the amount displayed before scoring
      include: {
        party_type_code: {
          select: {
            party_type_code: true,
            short_description: true,
            long_description: true,
          },
        },
        address: {
          select: {
            address: true,
            city: true,
            country_subdivision_code: true,
            is_primary: true,
          },
          where: { active_ind: true },
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
                business_identifier_code: true,
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
            gender_code: true,
            approximate_age_code: true,
          },
        },
      },
    });

    // Rank by number of matched fields (more matches = higher), then return the top 5.
    const topParties = prismaParties
      .map((party: any) => ({ party, score: this._scoreMatch(input, party) }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 5)
      .map((scored: { party: any }) => scored.party);

    return this.mapper.mapArray<party, Party>(topParties as party[], "party", "Party");
  }
}
