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

const BUSINESS_NUMBER_CODE = "BNUM";

@Injectable()
export class PartyService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly paginationUtility: PaginationUtility,
  ) {}

  private readonly logger = new Logger(PartyService.name);

  private _getBusinessNumberValue(identifiers?: BusinessIdentifier[]): string | undefined {
    const businessNumber = identifiers?.find((i) => {
      const code = typeof i.identifierCode === "string" ? i.identifierCode : i.identifierCode?.businessIdentifierCode;
      return code === BUSINESS_NUMBER_CODE;
    });

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
                    middle_names: true,
                    last_name: true,
                    date_of_birth: true,
                    drivers_license_number: true,
                    drivers_license_class: true,
                    drivers_license_country_code: true,
                    drivers_license_country_subdivision_code: true,
                    gender_code: true,
                    approximate_age_code: true,
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
            approximate_age_code: true,
            height_cm: true,
            weight_kg: true,
          },
        },
      },
    });

    try {
      return this.mapper.map<party, Party>(prismaParty as unknown as party, "party", "Party");
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
        data = this._buildPersonCreateData(input);
      } else {
        data = this._buildBusinessCreateData(input);
      }

      const prismaParty = await this.prisma.party.create({
        data,
        include: {
          party_type_code: true,
          person: true,
          business: true,
        },
      });

      return this.mapper.map<party, Party>(prismaParty as unknown as party, "party", "Party");
    } catch (error) {
      this.logger.error("Error creating party:", (error as Error)?.message);
      this._rethrowIfBusinessNumberConflict(error);
    }
  }

  private _buildPersonCreateData(input: PartyCreateInput): any {
    return {
      party_type: input.partyTypeCode,
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
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
      person: {
        create: {
          first_name: input.person?.firstName,
          middle_names: input.person?.middleNames,
          last_name: input.person?.lastName,
          date_of_birth: input.person?.dateOfBirth,
          approximate_age_code: this._resolveApproximateAgeCode(
            input.person?.dateOfBirth,
            input.person?.approximateAgeCode,
          ),
          drivers_license_number: input.person?.driversLicenseNumber,
          drivers_license_class: input.person?.driversLicenseClass,
          drivers_license_country_code: input.person?.driversLicenseCountryCode,
          drivers_license_country_subdivision_code: input.person?.driversLicenseCountrySubdivisionCode,
          gender_code: input.person?.genderCode,
          height_cm: input.person?.heightInCm,
          weight_kg: input.person?.weightInKg,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
        },
      },
    };
  }

  private _buildBusinessCreateData(input: PartyCreateInput): any {
    const businessPersonXrefOperations = this._buildBusinessPersonXrefOperations(
      input.business?.contactPeople ?? [],
      null,
    );

    return {
      party_type: input.partyTypeCode,
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
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

    return {
      party_type: input.partyTypeCode,
      update_user_id: this.user.getIdirUsername(),
      update_utc_timestamp: new Date(),
      ...(Object.keys(addressOperations).length ? { address: addressOperations } : {}),
      ...(Object.keys(personContactMethodOperations).length ? { contact_method: personContactMethodOperations } : {}),
      ...(Object.keys(personAliasOperations).length ? { alias: personAliasOperations } : {}),
      person: {
        update: {
          first_name: input.person?.firstName,
          middle_names: input.person?.middleNames,
          last_name: input.person?.lastName,
          date_of_birth: input.person?.dateOfBirth,
          approximate_age_code: this._resolveApproximateAgeCode(
            input.person?.dateOfBirth,
            input.person?.approximateAgeCode,
          ),
          drivers_license_number: input.person?.driversLicenseNumber,
          drivers_license_class: input.person?.driversLicenseClass,
          drivers_license_country_code: input.person?.driversLicenseCountryCode,
          drivers_license_country_subdivision_code: input.person?.driversLicenseCountrySubdivisionCode,
          gender_code: input.person?.genderCode,
          height_cm: input.person?.heightInCm,
          weight_kg: input.person?.weightInKg,
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
        ...addressesToDelete.map((a) => ({
          where: { address_guid: a.addressGuid },
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

  async update(partyIdentifier: string, input: PartyUpdateInput): Promise<Party> {
    const existingParty = await this.prisma.party.findUnique({
      include: {
        address: true,
        contact_method: true,
        alias: true,
        person: true,
        business: {
          include: {
            business_identifier: true,
            business_person_xref: {
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

    const existingPartyDto = this.mapper.map<party, Party>(existingParty as unknown as party, "party", "Party");

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
      const prismaParty = await this.prisma.party.update({
        where: { party_guid: partyIdentifier },
        data: data,
        include: {
          party_type_code: true,
          person: true,
          business: true,
        },
      });

      return this.mapper.map<party, Party>(prismaParty as unknown as party, "party", "Party");
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
          alias: {
            where: { active_ind: true },
            select: {
              name: true,
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
              middle_names: true,
              last_name: true,
              date_of_birth: true,
              drivers_license_number: true,
              drivers_license_class: true,
              drivers_license_country_code: true,
              drivers_license_country_subdivision_code: true,
              gender_code: true,
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
