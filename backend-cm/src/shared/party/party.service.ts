import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Prisma } from ".prisma/shared"; // NOSONAR
import { party } from "../../../prisma/shared/generated/party";
import {
  ImageUpdate,
  Party,
  PartyCreateInput,
  PartyFilters,
  PartyMatchedField,
  PartyMatchInput,
  PartyMatchResult,
  PartyResult,
  PartyUpdateInput,
} from "./dto/party";
import { PaginationUtility } from "../../common/pagination.utility";
import { UserService } from "../../common/user.service";
import { Alias, AliasInput } from "src/shared/alias/dto/alias";
import { BusinessIdentifier } from "src/shared/business_identifier/dto/business_identifier";
import { BusinessPersonXref, BusinessPersonXrefInput } from "src/shared/business_person_xref/dto/business_person_xref";
import { BusinessPersonAddressXref } from "src/shared/business_person_address_xref/dto/business_person_address_xref";
import { ContactMethod, ContactMethodInput } from "src/shared/contact_method/dto/contact_method";
import { Address, AddressInput } from "src/shared/address/dto/address";
import { PARTY_TYPES } from "src/common/party";
import {
  PersonFacialHairStyleCode,
  PersonFacialHairStyleCodeInput,
} from "src/shared/person_facial_hair_style_code/dto/person_facial_hair_style_code";
import { AppUserService } from "src/shared/app_user/app_user.service";
import { EventPublisherService } from "../../event_publisher/event_publisher.service";
import { EventCreateInput } from "../event/dto/event";
import { STREAM_TOPICS } from "../../common/nats_constants";
import { BusinessIdentifiers } from "src/enum/business-identifier.enum";
import { ContactMethods } from "src/enum/contact-method.enum";
import { toDateString } from "src/common/custom_scalars";
import { PersonInput } from "src/shared/person/dto/person.input";

type AddEventFn = (verb: string, field: string, oldValue: any, newValue: any, extra?: Record<string, any>) => void;

// Guids a caller can pin on create instead of letting the database generate them. Not exposed
// through GraphQL - the API must never let a client choose a party's identity.
export interface PartyIdentifiers {
  partyGuid?: string;
  personGuid?: string;
  businessGuid?: string;
}

// The shared guids generated for each investigation-local child row, keyed by the local guid.
// Only the investigation side needs these — the shared registry receives them on the input itself.
export interface PreparedPartyIdentifiers extends PartyIdentifiers {
  addressGuids: Map<string, string>;
  contactMethodGuids: Map<string, string>;
  aliasGuids: Map<string, string>;
  businessIdentifierGuids: Map<string, string>;
  businessPersonXrefGuids: Map<string, string>;
  facialHairStyleGuids: Map<string, string>;
}

const HIGH_POINTS = 1000;
const MEDIUM_POINTS = 50;
const LOW_POINTS = 10;

const MATCH_FIELD_WEIGHTS: Record<string, Record<string, number>> = {
  [PARTY_TYPES.Person]: {
    driversLicenseNumber: HIGH_POINTS,
    firstName: MEDIUM_POINTS,
    lastName: MEDIUM_POINTS,
    middleNames: MEDIUM_POINTS,
    alias: MEDIUM_POINTS,
    dateOfBirth: MEDIUM_POINTS,
    phone: MEDIUM_POINTS,
    email: MEDIUM_POINTS,
    addressLine: MEDIUM_POINTS,
    city: MEDIUM_POINTS,
    postalCode: MEDIUM_POINTS,
    approximateAgeCode: LOW_POINTS,
    buildCode: LOW_POINTS,
    complexionCode: LOW_POINTS,
    country: LOW_POINTS,
    eyeColourCode: LOW_POINTS,
    facialHairIndicator: LOW_POINTS,
    hairColourCode: LOW_POINTS,
    hairLengthCode: LOW_POINTS,
    heightInCm: LOW_POINTS,
    province: LOW_POINTS,
    sexCode: LOW_POINTS,
    tattooIndicator: LOW_POINTS,
    weightInKg: LOW_POINTS,
    youngPerson: LOW_POINTS,
  },
  [PARTY_TYPES.Company]: {
    businessName: HIGH_POINTS,
    businessNumber: HIGH_POINTS,
    worksafeBCNumber: HIGH_POINTS,
    contactPhone: HIGH_POINTS,
    contactEmail: HIGH_POINTS,
    addressLine: MEDIUM_POINTS,
    city: MEDIUM_POINTS,
    contactFirstName: MEDIUM_POINTS,
    contactLastName: MEDIUM_POINTS,
    email: MEDIUM_POINTS,
    phone: MEDIUM_POINTS,
    country: LOW_POINTS,
    province: LOW_POINTS,
  },
};

// Fields that are worth more together than they are individually
const MATCH_COMBINATIONS = [
  { fields: ["firstName", "lastName"], bonus: 100 },
  { fields: ["firstName", "lastName", "dateOfBirth"], bonus: 850 },
];

// Map identifier codes to fields
const MATCH_IDENTIFIER_FIELDS: [BusinessIdentifiers, string][] = [
  [BusinessIdentifiers.BUSINESS_NUMBER, "businessNumber"],
  [BusinessIdentifiers.WSBC_NUMBER, "worksafeBCNumber"],
];

const MATCH_CONTACT_FIELDS: Record<ContactMethods, { contactField: string; businessField: string }> = {
  [ContactMethods.PHONE]: { contactField: "contactPhone", businessField: "phone" },
  [ContactMethods.EMAIL]: { contactField: "contactEmail", businessField: "email" },
};

const FUZZY_MODIFIER = 0.5;
const FUZZY_MODIFIER_LEGAL_NAME = 0.25;
// A name similar to a different field is weaker evidence than the same field being similar
const FUZZY_MODIFIER_CROSS_FIELD = 0.25;
const MATCH_SIMILARITY_THRESHOLD = 0.3;
// An alias is compared whole name to whole name, where 0.3 passes on a single shared name part
const MATCH_SIMILARITY_THRESHOLD_ALIAS = 0.5;
const MATCH_SCORE_FLOOR = 50;
const MATCH_RESULT_LIMIT = 10;
const MATCH_SLOW_MS = 1000;
// Trigram similarity is meaningless under three letters
const MATCH_TRIGRAM_MIN_LENGTH = 3;
// A prefix under three letters is not evidence of anything
const MATCH_PREFIX_MIN_LENGTH = 3;
const YOUNG_PERSON_AGE_CODE = "18UNDER";

// The most rows a similar lookup returns - scoring ranks whatever the slice holds, so ordering the scan
// by similarity costs far more than it is worth
const MATCH_SIMILAR_LIMIT = 250;

// One sub-select of the UNION that gathers parties worth scoring
interface MatchLookup {
  name: string;
  sql: Prisma.Sql;
}

const personMatchLookup = (name: string, partyType: string, clause: Prisma.Sql, limit: number): MatchLookup => ({
  name,
  sql: Prisma.sql`SELECT p.party_guid
    FROM shared.person pe
    JOIN shared.party p ON p.party_guid = pe.party_guid AND p.party_type = ${partyType}
    WHERE ${clause}
      AND pe.party_guid IS NOT NULL
    LIMIT ${Prisma.raw(String(limit))}`,
});

interface MatchComparisons {
  party_guid: string;
  [column: string]: boolean | number | string | null;
}

// Names and addresses can carry accents, so those are normalized in Postgres
const normalizeMatchValue = (value?: string | null): string => (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

// For numbers only the trailing ten digits compare
const normalizeMatchPhone = (value?: string | null): string => normalizeMatchValue(value).slice(-10);

const normalizeMatchEmail = (value?: string | null): string => (value ?? "").trim().toLowerCase();

const contactMethodTypeSql = (typeCode: ContactMethods): Prisma.Sql => Prisma.raw(`'${typeCode}'`);

// Because we're pooling business phone and email we'll dedupe them
const distinctMatchValues = (
  values: (string | null | undefined)[],
  normalize: (value?: string | null) => string = normalizeMatchValue,
): string[] => {
  const normalizedValues = new Map<string, string>();
  for (const value of values) {
    const trimmed = value?.trim();
    if (!trimmed) {
      continue;
    }
    const normalized = normalize(trimmed);
    if (!normalizedValues.has(normalized)) {
      normalizedValues.set(normalized, trimmed);
    }
  }
  return [...normalizedValues.values()];
};

// The name a person search compares against: the first + middle + last string f_person_full_name builds
const personMatchName = (input: PartyMatchInput): string =>
  [input.person?.firstName ?? "", input.person?.middleNames ?? "", input.person?.lastName ?? ""]
    .map((part) => part.trim())
    .join(" ");

// The contact person a business search compares against
const businessMatchContact = (input: PartyMatchInput): { firstName?: string; lastName?: string } => {
  const contact = (input.business?.contactPeople ?? []).find(
    (person) => person.firstName?.trim() || person.lastName?.trim(),
  );
  return { firstName: contact?.firstName?.trim(), lastName: contact?.lastName?.trim() };
};

// For businesses, the heirarchy of business -> contact person is somewhat irrelevant. A contact person's email or phone matching
// is a strong indication that the business is the same.
const pooledContactValues = (input: PartyMatchInput, typeCode: ContactMethods): string[] => {
  const contactPeopleMethods = (input.business?.contactPeople ?? []).flatMap((person) => person.contactMethods ?? []);
  return distinctMatchValues(
    [...(input.contactMethods ?? []), ...contactPeopleMethods]
      .filter((cm) => cm?.typeCode === typeCode)
      .map((cm) => cm.value),
    typeCode === ContactMethods.PHONE ? normalizeMatchPhone : normalizeMatchEmail,
  );
};

const hasContactValue = (rows: any[] | undefined, typeCode: ContactMethods, value: string): boolean => {
  const normalize = typeCode === ContactMethods.PHONE ? normalizeMatchPhone : normalizeMatchEmail;
  return (rows ?? []).some(
    (cm) => cm.contact_method_type === typeCode && normalize(cm.contact_value) === normalize(value),
  );
};

const matchFlag = (comparisons: MatchComparisons | undefined, column: string): boolean =>
  comparisons?.[column] === true;

// An exact match scores the field's full points, a spelling difference or a prefix scores the fuzzy modifier's share, but not both
const scoreNameField = (
  field: string,
  points: number,
  comparisons: MatchComparisons | undefined,
  column: string,
  fuzzyModifier: number = FUZZY_MODIFIER,
  threshold: number = MATCH_SIMILARITY_THRESHOLD,
): PartyMatchedField | undefined => {
  if (matchFlag(comparisons, `${column}_norm_eq`)) {
    return { field, exact: true, points };
  }
  const similarity = Number(comparisons?.[`${column}_sim`] ?? 0);
  if (
    similarity >= threshold ||
    matchFlag(comparisons, `${column}_dmeta_eq`) ||
    matchFlag(comparisons, `${column}_prefix_eq`)
  ) {
    return { field, exact: false, points: Math.round(points * fuzzyModifier) };
  }
  return undefined;
};

const isSameUtcDate = (inputDate?: Date | null, partyDate?: Date | null): boolean =>
  !!inputDate && !!partyDate && toDateString(inputDate) === toDateString(partyDate);

// Same year and month, or a transposed day and month, is close enough to be evidence
const isCloseUtcDate = (inputDate?: Date | null, partyDate?: Date | null): boolean => {
  if (!inputDate || !partyDate) {
    return false;
  }
  const [year, month, day] = toDateString(inputDate).split("-");
  const [partyYear, partyMonth, partyDay] = toDateString(partyDate).split("-");
  return year === partyYear && (month === partyMonth || (month === partyDay && day === partyMonth));
};

// The form's imperial/metric toggle stores a converted value, so compare at the column's one decimal
const isSameMeasurement = (inputValue?: number | null, partyValue?: Prisma.Decimal | number | null): boolean =>
  inputValue != null &&
  partyValue != null &&
  new Prisma.Decimal(inputValue).toDecimalPlaces(1).equals(new Prisma.Decimal(partyValue).toDecimalPlaces(1));

const isYoungPerson = (dateOfBirth?: Date | null, approximateAgeCode?: string | null): boolean => {
  if (!dateOfBirth) {
    return approximateAgeCode === YOUNG_PERSON_AGE_CODE;
  }
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age <= 18;
};

// Rows removed from the shared party are deactivated rather than deleted, so a guid supplied from
// an activity may belong to an inactive row. Those are reactivated in place rather than
// created, which would violate the primary key.
interface InactiveGuids {
  address: Set<string>;
  contactMethod: Set<string>;
  alias: Set<string>;
  businessIdentifier: Set<string>;
  businessPersonXref: Set<string>;
  facialHairStyle: Set<string>;
  // Deactivating a business contact leaves the person's own contact methods active, since they
  // remain valid — only the link to the business is removed. Reactivating the xref therefore has
  // to match against those still-active rows, which the active-only party load doesn't carry.
  inactiveXrefContactMethods: Map<string, ContactMethod[]>;
}

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

  private _validateBusinessInput(business: {
    name?: string;
    businessIdentifiers?: BusinessIdentifier[];
    addresses?: Address[];
  }): void {
    if (!business.name?.trim()) {
      throw new Error("Name is required.");
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
              where: {
                active_ind: true,
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
            display_in_investigation_ind: true,
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
            sex_code: true,
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
            safety_concern_ind: true,
            safety_concern_reason: true,
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

  async create(input: PartyCreateInput, identifiers?: PartyIdentifiers): Promise<Party> {
    let data: any;

    try {
      if (input.partyTypeCode === PARTY_TYPES.Company && input.business) {
        this._validateBusinessInput(input.business);
      }

      if (input.partyTypeCode === PARTY_TYPES.Person || input.partyTypeCode === PARTY_TYPES.Contact) {
        data = await this._buildPersonCreateData(input, identifiers);
      } else {
        data = await this._buildBusinessCreateData(input, identifiers);
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

  private async _buildCommonPartyCreateData(input: PartyCreateInput, identifiers?: PartyIdentifiers): Promise<any> {
    const createdByUser = await this.appUser.findOne(undefined, this.user.getUserGuid());

    // addresses are created after the party so contact office links can reference them
    return {
      ...(identifiers?.partyGuid ? { party_guid: identifiers.partyGuid } : {}),
      party_type: input.partyTypeCode,
      create_user_id: this.user.getIdirUsername(),
      create_utc_timestamp: new Date(),
      created_by_app_user_guid: createdByUser.appUserGuid,
      ...(input.contactMethods?.length
        ? {
            contact_method: {
              create: input.contactMethods.map((c) => ({
                ...(c.contactMethodGuid ? { contact_method_guid: c.contactMethodGuid } : {}),
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
                ...(a.aliasGuid ? { alias_guid: a.aliasGuid } : {}),
                name: a.name,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              })),
            },
          }
        : {}),
    };
  }

  private _buildPersonFieldData(person?: PersonInput): any {
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
      sex_code: person?.sexCode,
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
      safety_concern_ind: person?.safetyConcernIndicator,
      safety_concern_reason: person?.safetyConcernReason,
    };
  }

  private async _buildPersonCreateData(input: PartyCreateInput, identifiers?: PartyIdentifiers): Promise<any> {
    const common = await this._buildCommonPartyCreateData(input, identifiers);

    return {
      ...common,
      person: {
        create: {
          ...(identifiers?.personGuid ? { person_guid: identifiers.personGuid } : {}),
          ...this._buildPersonFieldData(input.person),
          ...(input.person?.facialHairStyleCodes?.length
            ? {
                person_facial_hair_style_code: {
                  create: input.person.facialHairStyleCodes.map((fhs) => ({
                    ...(fhs.personFacialStyleHairCodeGuid
                      ? { person_facial_hair_style_code_guid: fhs.personFacialStyleHairCodeGuid }
                      : {}),
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

  private async _buildBusinessCreateData(input: PartyCreateInput, identifiers?: PartyIdentifiers): Promise<any> {
    // contact people are created after the party so office links can reference the addresses
    const common = await this._buildCommonPartyCreateData(input, identifiers);

    return {
      ...common,
      business: {
        create: {
          ...(identifiers?.businessGuid ? { business_guid: identifiers.businessGuid } : {}),
          name: input.business?.name,
          safety_concern_ind: input.business?.safetyConcernIndicator,
          safety_concern_reason: input.business?.safetyConcernReason,
          create_user_id: this.user.getIdirUsername(),
          create_utc_timestamp: new Date(),
          ...(input.business?.businessIdentifiers?.length
            ? {
                business_identifier: {
                  create: input.business.businessIdentifiers.map((i) => ({
                    ...(i.businessIdentifierGuid ? { business_identifier_guid: i.businessIdentifierGuid } : {}),
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

  private _buildPersonUpdateData(input: PartyUpdateInput, existingPartyDto: Party, inactiveGuids: InactiveGuids): any {
    const personContactMethodOperations = this._buildContactMethodOperations(
      input.contactMethods ?? [],
      existingPartyDto.contactMethods ?? [],
      inactiveGuids.contactMethod,
    );

    const personAliasOperations = this._buildAliasOperations(
      input.aliases ?? [],
      existingPartyDto.aliases ?? [],
      inactiveGuids.alias,
    );

    const addressOperations = this._buildAddressOperations(
      input.addresses ?? [],
      existingPartyDto.addresses ?? [],
      inactiveGuids.address,
      inactiveGuids.contactMethod,
    );

    const facialHairStyleOperations = this._buildFacialHairStyleOperations(
      input.person?.facialHairStyleCodes ?? [],
      existingPartyDto.person?.facialHairStyleCodes ?? [],
      inactiveGuids.facialHairStyle,
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

  private _buildBusinessUpdateData(
    input: PartyUpdateInput,
    existingPartyDto: Party,
    inactiveGuids: InactiveGuids,
  ): any {
    const aliasOperations = this._buildAliasOperations(
      input.aliases ?? [],
      existingPartyDto.aliases ?? [],
      inactiveGuids.alias,
    );

    const contactMethodOperations = this._buildContactMethodOperations(
      input.contactMethods ?? [],
      existingPartyDto.contactMethods ?? [],
      inactiveGuids.contactMethod,
    );

    const businessIdentifierOperations = this._buildBusinessIdentifierOperations(
      input.business?.businessIdentifiers ?? [],
      existingPartyDto.business?.businessIdentifiers ?? [],
      inactiveGuids.businessIdentifier,
    );

    const addressOperations = this._buildAddressOperations(
      input.addresses ?? [],
      existingPartyDto.addresses ?? [],
      inactiveGuids.address,
      inactiveGuids.contactMethod,
    );

    const businessPersonXrefOperations = this._buildBusinessPersonXrefOperations(
      input.business?.contactPeople ?? [],
      existingPartyDto.business?.contactPeople ?? [],
      inactiveGuids.businessPersonXref,
      inactiveGuids.contactMethod,
      inactiveGuids.inactiveXrefContactMethods,
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
          safety_concern_ind: input.business?.safetyConcernIndicator,
          safety_concern_reason: input.business?.safetyConcernReason,
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

  private _buildAliasOperations(
    incomingAliases: AliasInput[],
    existingAliases: Alias[],
    inactiveGuids: Set<string>,
  ): any {
    const existingAliasGuids = new Set(existingAliases.map((a) => a.aliasGuid));
    const aliasesToUpdate = incomingAliases.filter(
      (a) => a.aliasGuid && (existingAliasGuids.has(a.aliasGuid) || inactiveGuids.has(a.aliasGuid)),
    );
    const aliasesToCreate = incomingAliases.filter((a) => !aliasesToUpdate.includes(a));
    const aliasesToDelete = existingAliases.filter((a) => !incomingAliases.some((ia) => ia.aliasGuid === a.aliasGuid));

    const operations: any = {};

    if (aliasesToCreate.length) {
      operations.create = aliasesToCreate.map((a) => ({
        ...(a.aliasGuid ? { alias_guid: a.aliasGuid } : {}),
        name: a.name,
        active_ind: true,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
      }));
    }

    if (aliasesToUpdate.length || aliasesToDelete.length) {
      operations.update = [
        ...[...aliasesToUpdate].map((a) => ({
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
    inactiveBusinessIdentifierGuids: Set<string>,
  ): any {
    const existingGuids = new Set(existingIdentifiers.map((i) => i.businessIdentifierGuid));
    // A supplied guid may belong to a deactivated row, which is reactivated in place rather than
    // created, since creating it would violate the primary key.
    const identifiersToUpdate = incomingIdentifiers.filter(
      (i) =>
        i.businessIdentifierGuid &&
        (existingGuids.has(i.businessIdentifierGuid) || inactiveBusinessIdentifierGuids.has(i.businessIdentifierGuid)),
    );
    const identifiersToCreate = incomingIdentifiers.filter((i) => !identifiersToUpdate.includes(i));
    const identifiersToDelete = existingIdentifiers.filter(
      (i) => !new Set(incomingIdentifiers.map((ei) => ei.businessIdentifierGuid)).has(i.businessIdentifierGuid),
    );

    const operations: any = {};

    if (identifiersToCreate.length) {
      operations.create = identifiersToCreate.map((i) => ({
        ...(i.businessIdentifierGuid ? { business_identifier_guid: i.businessIdentifierGuid } : {}),
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

  private _buildAddressOperations(
    incomingAddresses: AddressInput[],
    existingAddresses: Address[],
    inactiveAddressGuids: Set<string>,
    inactiveContactMethodGuids: Set<string>,
  ): any {
    // addresses may now include client-generated ids so existing are updated and new ones are created
    const existingGuids = new Set(existingAddresses.map((a) => a.addressGuid));
    // A supplied guid may belong to a deactivated row, which is reactivated in place rather than
    // created, since creating it would violate the primary key.
    const addressesToUpdate = this._sortAddressesPrimaryLast(
      incomingAddresses.filter(
        (a) => a.addressGuid && (existingGuids.has(a.addressGuid) || inactiveAddressGuids.has(a.addressGuid)),
      ),
    );
    const addressesToCreate = incomingAddresses.filter((a) => !addressesToUpdate.includes(a));
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
            inactiveContactMethodGuids,
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
    incomingFacialHairStyles: PersonFacialHairStyleCodeInput[],
    existingFacialHairStyles: PersonFacialHairStyleCode[],
    inactiveFHSGuids: Set<string>,
  ): any {
    const existingGuids = new Set(existingFacialHairStyles.map((fhs) => fhs.personFacialStyleHairCodeGuid));
    // A supplied guid may belong to a deactivated row, which is reactivated in place rather than
    // created, since creating it would violate the primary key.
    const fhsToUpdate = incomingFacialHairStyles.filter(
      (fhs) =>
        fhs.personFacialStyleHairCodeGuid &&
        (existingGuids.has(fhs.personFacialStyleHairCodeGuid) ||
          inactiveFHSGuids.has(fhs.personFacialStyleHairCodeGuid)),
    );
    const fhsToCreate = incomingFacialHairStyles.filter((fhs) => !fhsToUpdate.includes(fhs));
    const fhsToDelete = existingFacialHairStyles.filter(
      (fhs) =>
        !new Set(incomingFacialHairStyles.map((fhs) => fhs.personFacialStyleHairCodeGuid)).has(
          fhs.personFacialStyleHairCodeGuid,
        ),
    );

    const operations: any = {};

    if (fhsToCreate.length) {
      operations.create = fhsToCreate.map((fhs) => ({
        ...(fhs.personFacialStyleHairCodeGuid
          ? { person_facial_hair_style_code_guid: fhs.personFacialStyleHairCodeGuid }
          : {}),
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
  private _sortContactMethodsPrimaryLast(contactMethods: ContactMethodInput[]): ContactMethodInput[] {
    const nonPrimary = contactMethods.filter((m) => !m.isPrimary);
    const primary = contactMethods.filter((m) => m.isPrimary);
    return [...nonPrimary, ...primary];
  }

  private _buildContactMethodOperations(
    incomingMethods: ContactMethodInput[],
    existingMethods: ContactMethod[],
    inactiveGuids: Set<string>,
  ): any {
    const existingGuids = new Set(existingMethods.map((cm) => cm.contactMethodGuid));
    const methodsToUpdate = this._sortContactMethodsPrimaryLast(
      incomingMethods.filter(
        (cm) =>
          cm.contactMethodGuid && (existingGuids.has(cm.contactMethodGuid) || inactiveGuids.has(cm.contactMethodGuid)),
      ),
    );
    const methodsToCreate = incomingMethods.filter((cm) => !methodsToUpdate.includes(cm));
    const methodsToDelete = existingMethods.filter(
      (cm) => !new Set(incomingMethods.map((im) => im.contactMethodGuid)).has(cm.contactMethodGuid),
    );
    const operations: any = {};

    if (methodsToCreate.length) {
      operations.create = this._sortContactMethodsPrimaryLast(methodsToCreate).map((cm) => ({
        ...(cm.contactMethodGuid ? { contact_method_guid: cm.contactMethodGuid } : {}),
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

  private _contactMethodCreateData(cm: {
    typeCode: string;
    value: string;
    isPrimary?: boolean;
    contactMethodGuid?: string;
  }) {
    return {
      ...(cm.contactMethodGuid ? { contact_method_guid: cm.contactMethodGuid } : {}),
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

  private async _createBusinessContact(tx: any, businessGuid: string, contact: BusinessPersonXrefInput): Promise<void> {
    const xref = await tx.business_person_xref.create({
      data: {
        ...(contact.businessPersonXrefGuid ? { business_person_xref_guid: contact.businessPersonXrefGuid } : {}),
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
                        create: contact.contactMethods.map((cm) => this._contactMethodCreateData(cm)),
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
    incomingXrefs: BusinessPersonXrefInput[],
    existingXrefs: BusinessPersonXref[],
    inactiveBusinessXREFGuids: Set<string>,
    inactiveContactMethodGuids: Set<string>,
    inactiveXrefContactMethods: Map<string, ContactMethod[]>,
  ): any {
    const existingGuids = new Set(existingXrefs?.map((bpx) => bpx.businessPersonXrefGuid));
    // A supplied guid may belong to a deactivated row, which is reactivated in place rather than
    // created, since creating it would violate the primary key.
    const xrefsToUpdate = incomingXrefs.filter(
      (bpx) =>
        bpx.businessPersonXrefGuid &&
        (existingGuids.has(bpx.businessPersonXrefGuid) || inactiveBusinessXREFGuids.has(bpx.businessPersonXrefGuid)),
    );
    const xrefsToCreate = incomingXrefs.filter((bpx) => !xrefsToUpdate.includes(bpx));
    const xrefsToDelete = existingXrefs?.filter(
      (bpx) => !new Set(incomingXrefs.map((ei) => ei.businessPersonXrefGuid)).has(bpx.businessPersonXrefGuid),
    );
    const operations: any = {};

    if (xrefsToCreate.length) {
      operations.create = xrefsToCreate.map((bpx) => ({
        ...(bpx.businessPersonXrefGuid ? { business_person_xref_guid: bpx.businessPersonXrefGuid } : {}),
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
          const existingContactMethods =
            existingXref?.contactMethods || inactiveXrefContactMethods.get(bpx.businessPersonXrefGuid ?? "") || [];

          // Build contact method operations if there are any
          const contactMethodOps =
            bpx.contactMethods?.length || existingContactMethods.length
              ? this._buildContactMethodOperations(
                  bpx.contactMethods || [],
                  existingContactMethods,
                  inactiveContactMethodGuids,
                )
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
    if (typeCode === ContactMethods.PHONE) return "phone number";
    if (typeCode === ContactMethods.EMAIL) return "email address";
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
    incomingMethods: ContactMethodInput[],
    labelFn: (typeCode: string) => string,
    addEvent: AddEventFn,
  ): void {
    // Detect added and edited contact methods
    for (const incoming of incomingMethods) {
      const existing = incoming.contactMethodGuid
        ? existingMethods.find((m) => m.contactMethodGuid === incoming.contactMethodGuid)
        : undefined;
      if (!existing) {
        if (incoming.value) {
          addEvent("ADDED", labelFn(incoming.typeCode), null, incoming.value);
        }
      } else if (existing.value !== incoming.value) {
        addEvent("EDITED", labelFn(incoming.typeCode), existing.value, incoming.value);
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

  private _diffAliases(existingAliases: Alias[], incomingAliases: AliasInput[], addEvent: AddEventFn): void {
    for (const incoming of incomingAliases) {
      const existing = incoming.aliasGuid ? existingAliases.find((a) => a.aliasGuid === incoming.aliasGuid) : undefined;
      if (!existing) {
        addEvent("ADDED", "alias", null, incoming.name);
      } else if (existing.name !== incoming.name) {
        addEvent("EDITED", "alias", existing.name, incoming.name);
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
      const existing = incoming.businessIdentifierGuid
        ? existingIdentifiers.find((i) => i.businessIdentifierGuid === incoming.businessIdentifierGuid)
        : undefined;
      if (!existing) {
        addEvent("ADDED", `identifier (${incoming.identifierCode})`, null, incoming.identifierValue);
      } else if (existing.identifierValue !== incoming.identifierValue) {
        addEvent(
          "EDITED",
          `identifier (${incoming.identifierCode})`,
          existing.identifierValue,
          incoming.identifierValue,
        );
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
        this._compareContactMethods(
          (existing.contactMethods as ContactMethod[] | undefined) ?? [],
          (incoming.contactMethods as ContactMethodInput[] | undefined) ?? [],
          (tc) => `${this._contactMethodLabel(tc)} in address "${label}"`,
          addEvent,
        );
      } else if (incoming.addressName) {
        const incomingMethods = (incoming.contactMethods as ContactMethodInput[] | undefined) ?? [];
        addEvent("ADDED", "address", null, incoming.addressName, {
          streetAddress: incoming.address ?? null,
          city: incoming.city ?? null,
          province: incoming.province ?? null,
          postalCode: incoming.postalCode ?? null,
          country: incoming.country ?? null,
          phoneNumber: incomingMethods.find((m) => m?.typeCode === ContactMethods.PHONE)?.value ?? null,
          emailAddress: incomingMethods.find((m) => m?.typeCode === ContactMethods.EMAIL)?.value ?? null,
        });
      }
    }
    const incomingGuids = new Set(incomingAddresses.map((a) => a.addressGuid));
    existingAddresses
      .filter((a) => !incomingGuids.has(a.addressGuid))
      .forEach((a) => {
        addEvent("REMOVED", "address", a.addressName, null, {
          streetAddress: a.address ?? null,
          city: a.city ?? null,
          province: a.province ?? null,
          postalCode: a.postalCode ?? null,
          country: a.country ?? null,
        });
        this._compareContactMethods(
          (a.contactMethods as ContactMethod[] | undefined) ?? [],
          [],
          (tc) => `${this._contactMethodLabel(tc)} in address "${a.addressName}"`,
          addEvent,
        );
      });
    // Detect when the primary address switches from one address to another
    const oldPrimary = existingAddresses.find((a) => a.isPrimary);
    const newPrimary = incomingAddresses.find((a) => a.isPrimary);
    if (oldPrimary && newPrimary && oldPrimary.addressGuid !== newPrimary.addressGuid) {
      addEvent("EDITED", "primary address", oldPrimary.addressName, newPrimary.addressName);
    }
  }

  private _diffNewContact(incoming: BusinessPersonXrefInput, addEvent: AddEventFn): void {
    const name = [incoming.person?.firstName, incoming.person?.lastName].filter(Boolean).join(" ");
    const methods = incoming.contactMethods ?? [];
    addEvent("ADDED", "business contact", null, name, {
      phoneNumber: methods.find((cm) => cm?.typeCode === ContactMethods.PHONE)?.value ?? null,
      emailAddress: methods.find((cm) => cm?.typeCode === ContactMethods.EMAIL)?.value ?? null,
    });
  }

  private _diffExistingContact(
    existingXrefs: BusinessPersonXref[],
    incoming: BusinessPersonXrefInput,
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
    incomingXrefs: BusinessPersonXrefInput[],
    addEvent: AddEventFn,
  ): void {
    for (const incoming of incomingXrefs) {
      const existing = incoming.businessPersonXrefGuid
        ? existingXrefs.find((x) => x.businessPersonXrefGuid === incoming.businessPersonXrefGuid)
        : undefined;
      if (existing) {
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
        const methods = (x.contactMethods as ContactMethod[] | undefined) ?? [];
        addEvent("REMOVED", "business contact", name, null, {
          phoneNumber: methods.find((cm) => cm?.typeCode === ContactMethods.PHONE)?.value ?? null,
          emailAddress: methods.find((cm) => cm?.typeCode === ContactMethods.EMAIL)?.value ?? null,
        });
      });
  }

  private _diffFacialHairTypes(
    existingFacialHairStyles: PersonFacialHairStyleCode[],
    incomingFacialHairStyles: PersonFacialHairStyleCodeInput[],
    addEvent: AddEventFn,
  ): void {
    for (const incoming of incomingFacialHairStyles) {
      const existing = incoming.personFacialStyleHairCodeGuid
        ? existingFacialHairStyles.find(
            (fhs) => fhs.personFacialStyleHairCodeGuid === incoming.personFacialStyleHairCodeGuid,
          )
        : undefined;
      if (!existing) {
        addEvent("ADDED", "facial hair style", null, incoming.facialHairStyleCode);
      } else if (existing.facialHairStyleCode !== incoming.facialHairStyleCode) {
        addEvent("EDITED", "facial hair style", existing.facialHairStyleCode, incoming.facialHairStyleCode);
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
    this._compareField("Safety concern", oldPerson.safetyConcernIndicator, newPerson.safetyConcernIndicator, addEvent);
    this._compareField("Safety concern reason", oldPerson.safetyConcernReason, newPerson.safetyConcernReason, addEvent);
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
    this._compareField("sex", oldPerson.sexCode, newPerson.sexCode, addEvent);
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
    this._compareField("legal name", oldBusiness.name, newBusiness.name, addEvent);
    this._compareField(
      "Safety concern",
      oldBusiness.safetyConcernIndicator,
      newBusiness.safetyConcernIndicator,
      addEvent,
    );
    this._compareField(
      "Safety concern reason",
      oldBusiness.safetyConcernReason,
      newBusiness.safetyConcernReason,
      addEvent,
    );
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
  private _partyChangeEvents(
    partyIdentifier: string,
    oldParty: Party,
    input: PartyUpdateInput,
    investigationContext?: string,
  ): EventCreateInput[] {
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
        content: {
          field,
          oldValue: oldValue ?? null,
          newValue: newValue ?? null,
          ...extraContent,
          ...(investigationContext ? { investigationContext } : {}),
        },
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

  private async _loadInactiveGuids(partyIdentifier: string): Promise<InactiveGuids> {
    const party: any = await this.prisma.party.findUnique({
      where: { party_guid: partyIdentifier },
      select: {
        address: {
          where: { active_ind: false },
          select: { address_guid: true },
        },
        contact_method: {
          where: { active_ind: false },
          select: { contact_method_guid: true },
        },
        alias: {
          where: { active_ind: false },
          select: { alias_guid: true },
        },
        person: {
          select: {
            person_facial_hair_style_code: {
              where: { active_ind: false },
              select: { person_facial_hair_style_code_guid: true },
            },
          },
        },
        business: {
          select: {
            business_identifier: {
              where: { active_ind: false },
              select: { business_identifier_guid: true },
            },
            business_person_xref: {
              where: { active_ind: false },
              select: {
                business_person_xref_guid: true,
                person: {
                  select: {
                    party: {
                      select: {
                        contact_method: {
                          where: { active_ind: true },
                          select: {
                            contact_method_guid: true,
                            contact_method_type: true,
                            contact_value: true,
                            is_primary: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Contact methods hang off the party, off each address, and off each business contact's own
    // party, so all three are collected into one set.
    const addressContactMethods = await this.prisma.contact_method.findMany({
      where: { active_ind: false, address: { party_guid: partyIdentifier } },
      select: { contact_method_guid: true },
    });

    const businessContactMethods = await this.prisma.contact_method.findMany({
      where: {
        active_ind: false,
        party: {
          person: {
            business_person_xref: {
              some: { business: { party_guid: partyIdentifier } },
            },
          },
        },
      },
      select: { contact_method_guid: true },
    });

    return {
      address: new Set<string>((party?.address ?? []).map((a: any) => a.address_guid)),
      contactMethod: new Set<string>([
        ...(party?.contact_method ?? []).map((cm: any) => cm.contact_method_guid),
        ...addressContactMethods.map((cm) => cm.contact_method_guid),
        ...businessContactMethods.map((cm) => cm.contact_method_guid),
      ]),
      alias: new Set<string>((party?.alias ?? []).map((a: any) => a.alias_guid)),
      businessIdentifier: new Set<string>(
        (party?.business?.business_identifier ?? []).map((bi: any) => bi.business_identifier_guid),
      ),
      businessPersonXref: new Set<string>(
        (party?.business?.business_person_xref ?? []).map((bpx: any) => bpx.business_person_xref_guid),
      ),
      facialHairStyle: new Set<string>(
        (party?.person?.person_facial_hair_style_code ?? []).map((fhs: any) => fhs.person_facial_hair_style_code_guid),
      ),
      inactiveXrefContactMethods: new Map<string, ContactMethod[]>(
        (party?.business?.business_person_xref ?? []).map((bpx: any) => [
          bpx.business_person_xref_guid,
          (bpx.person?.party?.contact_method ?? []).map((cm: any) => ({
            contactMethodGuid: cm.contact_method_guid,
            typeCode: cm.contact_method_type,
            value: cm.contact_value,
            isPrimary: cm.is_primary,
          })),
        ]),
      ),
    };
  }

  async update(partyIdentifier: string, input: PartyUpdateInput, investigationContext?: string): Promise<Party> {
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

    const inactiveGuids = await this._loadInactiveGuids(existingParty.party_guid);

    const existingPartyDto = this.mapper.map<party, Party>(existingParty as party, "party", "Party");

    if (input.partyTypeCode === PARTY_TYPES.Company && input.business) {
      this._validateBusinessInput(input.business);
    }

    const isBusiness = input.partyTypeCode !== PARTY_TYPES.Person;

    const existingAddressGuids = new Set((existingPartyDto.addresses ?? []).map((a) => a.addressGuid));
    const newAddresses = isBusiness
      ? (input.addresses ?? []).filter((a) => !a.addressGuid || !existingAddressGuids.has(a.addressGuid))
      : [];
    const existingXrefGuids = new Set(
      (existingPartyDto.business?.contactPeople ?? []).map((c) => c.businessPersonXrefGuid),
    );
    const newContacts = isBusiness
      ? (input.business?.contactPeople ?? []).filter(
          (c) =>
            !c.businessPersonXrefGuid ||
            !(
              existingXrefGuids.has(c.businessPersonXrefGuid) ||
              inactiveGuids.businessPersonXref.has(c.businessPersonXrefGuid)
            ),
        )
      : [];
    const builderInput = isBusiness
      ? {
          ...input,
          addresses: (input.addresses ?? []).filter((a) => a.addressGuid && existingAddressGuids.has(a.addressGuid)),
          business: input.business
            ? {
                ...input.business,
                contactPeople: (input.business.contactPeople ?? []).filter(
                  (c) =>
                    c.businessPersonXrefGuid &&
                    (existingXrefGuids.has(c.businessPersonXrefGuid) ||
                      inactiveGuids.businessPersonXref.has(c.businessPersonXrefGuid)),
                ),
              }
            : input.business,
        }
      : input;

    let data: any;

    if (input.partyTypeCode === PARTY_TYPES.Person) {
      data = this._buildPersonUpdateData(input, existingPartyDto, inactiveGuids);
    } else {
      data = this._buildBusinessUpdateData(builderInput, existingPartyDto, inactiveGuids);
    }

    try {
      const changeEvents = this._partyChangeEvents(partyIdentifier, existingPartyDto, input, investigationContext);

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

          for (const contact of (input.business?.contactPeople ?? []).filter(
            (c) => c.businessPersonXrefGuid && existingXrefGuids.has(c.businessPersonXrefGuid),
          )) {
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

  // Shared include to reduce duplication between the global party list and party matching function
  private readonly _partySummaryInclude = {
    party_type_code: {
      select: {
        party_type_code: true,
        short_description: true,
        long_description: true,
      },
    },
    address: {
      select: {
        address_name: true,
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
        middle_names: true,
        date_of_birth: true,
        gender_code: true,
        sex_code: true,
        approximate_age_code: true,
        drivers_license_number: true,
      },
    },
  };

  // The summary shape plus everything a score is calculated from
  private readonly _partyMatchInclude: Prisma.partyInclude = {
    ...this._partySummaryInclude,
    person: {
      select: {
        ...this._partySummaryInclude.person.select,
        height_cm: true,
        weight_kg: true,
        complexion_code: true,
        build_code: true,
        eye_colour_code: true,
        hair_colour_code: true,
        hair_length_code: true,
        facial_hair_ind: true,
        tattoo_ind: true,
      },
    },
    address: {
      ...this._partySummaryInclude.address,
      select: {
        ...this._partySummaryInclude.address.select,
        postal_code: true,
        country_code: true,
      },
      orderBy: [{ is_primary: "desc" }, { create_utc_timestamp: "asc" }],
    },
    alias: {
      where: { active_ind: true },
      orderBy: { create_utc_timestamp: "asc" },
      select: {
        alias_guid: true,
        name: true,
      },
    },
    business: {
      select: {
        ...this._partySummaryInclude.business.select,
        business_person_xref: {
          where: { active_ind: true },
          select: {
            person: {
              select: {
                first_name: true,
                last_name: true,
                party: {
                  select: {
                    contact_method: {
                      where: { active_ind: true },
                      select: {
                        contact_method_type: true,
                        contact_value: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

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
        includeClause: this._partySummaryInclude,
        orderByClause: orderBy,
      },
    );

    return {
      items: result.items,
      pageInfo: result.pageInfo,
    };
  }

  private _scoreAddressFields(
    input: PartyMatchInput,
    party: party,
    weights: Record<string, number>,
    comparisons?: MatchComparisons,
  ): PartyMatchedField[] {
    const addresses = input.addresses ?? [];
    const partyAddresses = (party.address as any[]) ?? [];
    const matched: PartyMatchedField[] = [];

    // Address line and city can carry accents, so Postgres compares them
    distinctMatchValues(addresses.map((address) => address.address)).forEach((_value, index) => {
      if (matchFlag(comparisons, `address_norm_eq_${index}`)) {
        matched.push({ field: "addressLine", exact: true, points: weights.addressLine });
      }
    });
    distinctMatchValues(addresses.map((address) => address.city)).forEach((_value, index) => {
      if (matchFlag(comparisons, `city_norm_eq_${index}`)) {
        matched.push({ field: "city", exact: true, points: weights.city });
      }
    });

    if (weights.postalCode) {
      for (const postalCode of distinctMatchValues(addresses.map((address) => address.postalCode))) {
        if (
          partyAddresses.some((address) => normalizeMatchValue(address.postal_code) === normalizeMatchValue(postalCode))
        ) {
          matched.push({ field: "postalCode", exact: true, points: weights.postalCode });
        }
      }
    }
    for (const province of distinctMatchValues(addresses.map((address) => address.province))) {
      if (partyAddresses.some((address) => address.country_subdivision_code === province)) {
        matched.push({ field: "province", exact: true, points: weights.province });
      }
    }
    for (const country of distinctMatchValues(addresses.map((address) => address.country))) {
      if (partyAddresses.some((address) => address.country_code === country)) {
        matched.push({ field: "country", exact: true, points: weights.country });
      }
    }

    return matched;
  }

  private _scorePersonFields(
    input: PartyMatchInput,
    party: party,
    comparisons?: MatchComparisons,
  ): PartyMatchedField[] {
    const weights = MATCH_FIELD_WEIGHTS[PARTY_TYPES.Person];
    const matched: PartyMatchedField[] = [];

    const driversLicenseNumber = normalizeMatchValue(input.person?.driversLicenseNumber);
    if (driversLicenseNumber && driversLicenseNumber === normalizeMatchValue(party.person?.drivers_license_number)) {
      matched.push({ field: "driversLicenseNumber", exact: true, points: weights.driversLicenseNumber });
    }

    matched.push(
      ...[
        scoreNameField("firstName", weights.firstName, comparisons, "first"),
        scoreNameField("lastName", weights.lastName, comparisons, "last"),
        scoreNameField("middleNames", weights.middleNames, comparisons, "middle"),
        scoreNameField(
          "alias",
          weights.alias,
          comparisons,
          "alias",
          FUZZY_MODIFIER_CROSS_FIELD,
          MATCH_SIMILARITY_THRESHOLD_ALIAS,
        ),
      ].filter(Boolean),
    );

    // A name matching in the other name slot, or half of a compound surname, is fuzzy evidence at best
    const nameFallbacks: [string, number, string, number][] = [
      ["firstName", weights.firstName, "first_middle_eq", FUZZY_MODIFIER_CROSS_FIELD],
      ["middleNames", weights.middleNames, "middle_first_eq", FUZZY_MODIFIER_CROSS_FIELD],
      ["lastName", weights.lastName, "last_part_eq", FUZZY_MODIFIER],
    ];
    for (const [field, points, column, modifier] of nameFallbacks) {
      if (!matched.some((matchedField) => matchedField.field === field) && matchFlag(comparisons, column)) {
        matched.push({ field, exact: false, points: Math.round(points * modifier) });
      }
    }

    const dateOfBirthExact = isSameUtcDate(input.person?.dateOfBirth, party.person?.date_of_birth);
    const dateOfBirthClose =
      !dateOfBirthExact && isCloseUtcDate(input.person?.dateOfBirth, party.person?.date_of_birth);
    if (dateOfBirthExact) {
      matched.push({ field: "dateOfBirth", exact: true, points: weights.dateOfBirth });
    } else if (dateOfBirthClose) {
      matched.push({ field: "dateOfBirth", exact: false, points: Math.round(weights.dateOfBirth * FUZZY_MODIFIER) });
    }

    matched.push(
      ...this._scoreContactFields(input, party, weights),
      ...this._scoreAddressFields(input, party, weights, comparisons),
      ...this._scoreDescriptorFields(input, party, weights),
    );

    // A young person flag derived from the date of birth or approximate age shouldn't score if its
    // source field is already a match
    if (
      !dateOfBirthExact &&
      !dateOfBirthClose &&
      !matched.some((matchedField) => matchedField.field === "approximateAgeCode") &&
      isYoungPerson(input.person?.dateOfBirth, input.person?.approximateAgeCode) &&
      isYoungPerson(party.person?.date_of_birth, party.person?.approximate_age_code)
    ) {
      matched.push({ field: "youngPerson", exact: true, points: weights.youngPerson });
    }

    return matched;
  }

  private _scoreContactFields(
    input: PartyMatchInput,
    party: party,
    weights: Record<string, number>,
  ): PartyMatchedField[] {
    const matched: PartyMatchedField[] = [];

    for (const phone of pooledContactValues(input, ContactMethods.PHONE)) {
      if (hasContactValue(party.contact_method, ContactMethods.PHONE, phone)) {
        matched.push({ field: "phone", exact: true, points: weights.phone });
      }
    }
    for (const email of pooledContactValues(input, ContactMethods.EMAIL)) {
      if (hasContactValue(party.contact_method, ContactMethods.EMAIL, email)) {
        matched.push({ field: "email", exact: true, points: weights.email });
      }
    }

    return matched;
  }

  private _scoreDescriptorFields(
    input: PartyMatchInput,
    party: party,
    weights: Record<string, number>,
  ): PartyMatchedField[] {
    const matched: PartyMatchedField[] = [];

    const codeFields: [string, string, string][] = [
      ["sexCode", input.person?.sexCode, party.person?.sex_code],
      ["approximateAgeCode", input.person?.approximateAgeCode, party.person?.approximate_age_code],
      ["complexionCode", input.person?.complexionCode, party.person?.complexion_code],
      ["buildCode", input.person?.buildCode, party.person?.build_code],
      ["eyeColourCode", input.person?.eyeColourCode, party.person?.eye_colour_code],
      ["hairColourCode", input.person?.hairColourCode, party.person?.hair_colour_code],
      ["hairLengthCode", input.person?.hairLengthCode, party.person?.hair_length_code],
    ];
    for (const [field, inputCode, partyCode] of codeFields) {
      if (inputCode && inputCode === partyCode) {
        matched.push({ field, exact: true, points: weights[field] });
      }
    }

    if (isSameMeasurement(input.person?.heightInCm, party.person?.height_cm)) {
      matched.push({ field: "heightInCm", exact: true, points: weights.heightInCm });
    }
    if (isSameMeasurement(input.person?.weightInKg, party.person?.weight_kg)) {
      matched.push({ field: "weightInKg", exact: true, points: weights.weightInKg });
    }

    // Two parties both lacking a trait is not a match, only score when true
    if (input.person?.facialHairIndicator && party.person?.facial_hair_ind) {
      matched.push({ field: "facialHairIndicator", exact: true, points: weights.facialHairIndicator });
    }
    if (input.person?.tattooIndicator && party.person?.tattoo_ind) {
      matched.push({ field: "tattooIndicator", exact: true, points: weights.tattooIndicator });
    }

    return matched;
  }

  private _scoreBusinessFields(
    input: PartyMatchInput,
    party: party,
    comparisons?: MatchComparisons,
  ): PartyMatchedField[] {
    const weights = MATCH_FIELD_WEIGHTS[PARTY_TYPES.Company];
    const matched: PartyMatchedField[] = [];

    const businessName = scoreNameField(
      "businessName",
      weights.businessName,
      comparisons,
      "business_name",
      FUZZY_MODIFIER_LEGAL_NAME,
    );
    if (businessName) {
      matched.push(businessName);
    }

    const identifiers = input.business?.businessIdentifiers ?? [];
    for (const [code, field] of MATCH_IDENTIFIER_FIELDS) {
      const values = identifiers.filter((identifier) => identifier.identifierCode === code);
      for (const value of distinctMatchValues(values.map((identifier) => identifier.identifierValue))) {
        const hasMatch = (party.business?.business_identifier ?? []).some(
          (identifier: any) =>
            identifier.business_identifier_code === code &&
            normalizeMatchValue(identifier.identifier_value) === normalizeMatchValue(value),
        );
        if (hasMatch) {
          matched.push({ field, exact: true, points: weights[field] });
        }
      }
    }

    matched.push(
      ...[
        scoreNameField("contactFirstName", weights.contactFirstName, comparisons, "contact_first"),
        scoreNameField("contactLastName", weights.contactLastName, comparisons, "contact_last"),
      ].filter(Boolean),
    );

    // A phone or email matching both a contact person's rows and the business's own scores once
    const contactMethods = ((party.business?.business_person_xref as any[]) ?? []).flatMap(
      (xref) => xref.person?.party?.contact_method ?? [],
    );
    for (const typeCode of Object.keys(MATCH_CONTACT_FIELDS) as ContactMethods[]) {
      const { contactField, businessField } = MATCH_CONTACT_FIELDS[typeCode];
      for (const value of pooledContactValues(input, typeCode)) {
        if (hasContactValue(contactMethods, typeCode, value)) {
          matched.push({ field: contactField, exact: true, points: weights[contactField] });
        } else if (hasContactValue(party.contact_method, typeCode, value)) {
          matched.push({ field: businessField, exact: true, points: weights[businessField] });
        }
      }
    }

    matched.push(...this._scoreAddressFields(input, party, weights, comparisons));

    return matched;
  }

  // Score combinations over single matched fields
  private _scoreCombinations(matchedFields: PartyMatchedField[]): PartyMatchedField[] {
    const exactFields = new Set(matchedFields.filter((matched) => matched.exact).map((matched) => matched.field));
    const granted = MATCH_COMBINATIONS.filter((combination) => combination.fields.every((f) => exactFields.has(f)));

    return granted
      .filter(
        (combination) =>
          !granted.some(
            (other) =>
              other.fields.length > combination.fields.length &&
              combination.fields.every((field) => other.fields.includes(field)),
          ),
      )
      .map((combination) => ({ field: combination.fields.join("+"), exact: true, points: combination.bonus }));
  }

  /**
   * Scores one party against the input.
   */
  private _scoreMatch(
    input: PartyMatchInput,
    party: party,
    comparisons?: MatchComparisons,
  ): { score: number; matchedFields: PartyMatchedField[] } {
    const matchedFields =
      input.partyTypeCode === PARTY_TYPES.Company
        ? this._scoreBusinessFields(input, party, comparisons)
        : this._scorePersonFields(input, party, comparisons);

    matchedFields.push(...this._scoreCombinations(matchedFields));

    return { score: matchedFields.reduce((total, matched) => total + matched.points, 0), matchedFields };
  }

  private _buildPersonMatchLookups(input: PartyMatchInput): MatchLookup[] {
    const partyType = input.partyTypeCode;
    const firstName = input.person?.firstName?.trim();
    const lastName = input.person?.lastName?.trim();
    const driversLicenseNumber = input.person?.driversLicenseNumber?.trim();
    const dateOfBirth = toDateString(input.person?.dateOfBirth);
    const fullName = personMatchName(input);
    const lookups: MatchLookup[] = [];

    if (driversLicenseNumber) {
      lookups.push(
        personMatchLookup(
          "driversLicense",
          partyType,
          Prisma.sql`shared.f_match_norm(pe.drivers_license_number) = shared.f_match_norm(${driversLicenseNumber})`,
          10,
        ),
      );
    }
    // A common surname and a common birthdate can each fill their own lookup, so the pairs behind
    // the combination bonuses get lookups of their own
    if (firstName && lastName) {
      lookups.push(
        personMatchLookup(
          "firstLastName",
          partyType,
          Prisma.sql`shared.f_match_norm(pe.first_name || pe.last_name) = shared.f_match_norm(${firstName + lastName})`,
          50,
        ),
      );
    }
    if (lastName && dateOfBirth) {
      lookups.push(
        personMatchLookup(
          "lastNameDateOfBirth",
          partyType,
          Prisma.sql`shared.f_match_norm(pe.last_name) = shared.f_match_norm(${lastName}) AND pe.date_of_birth = ${dateOfBirth}::date`,
          25,
        ),
      );
    }
    if (lastName) {
      lookups.push(
        personMatchLookup(
          "lastName",
          partyType,
          Prisma.sql`shared.f_match_norm(pe.last_name) = shared.f_match_norm(${lastName})`,
          50,
        ),
        personMatchLookup(
          "lastNameSoundsLike",
          partyType,
          Prisma.sql`public.dmetaphone(pe.last_name) = public.dmetaphone(${lastName})`,
          25,
        ),
      );
    }
    if (firstName) {
      lookups.push(
        personMatchLookup(
          "firstName",
          partyType,
          Prisma.sql`shared.f_match_norm(pe.first_name) = shared.f_match_norm(${firstName})`,
          25,
        ),
        personMatchLookup(
          "firstNameSoundsLike",
          partyType,
          Prisma.sql`public.dmetaphone(pe.first_name) = public.dmetaphone(${firstName})`,
          25,
        ),
      );
    }
    if (fullName.trim().length >= MATCH_TRIGRAM_MIN_LENGTH) {
      lookups.push(
        personMatchLookup(
          "personNameSimilar",
          partyType,
          Prisma.sql`shared.f_person_full_name(pe.first_name, pe.middle_names, pe.last_name)
                OPERATOR(public.%) shared.f_unaccent(lower(${fullName}))`,
          MATCH_SIMILAR_LIMIT,
        ),
      );
    }
    if (dateOfBirth) {
      lookups.push(
        personMatchLookup("dateOfBirth", partyType, Prisma.sql`pe.date_of_birth = ${dateOfBirth}::date`, 200),
      );
      // A transposed day and month is only a valid date when the day can be a month
      const [year, month, day] = dateOfBirth.split("-");
      const swappedDate = `${year}-${day}-${month}`;
      const monthStart = `${year}-${month}-01`;
      if (Number(day) <= 12 && day !== month) {
        lookups.push(
          personMatchLookup("dateOfBirthSwapped", partyType, Prisma.sql`pe.date_of_birth = ${swappedDate}::date`, 200),
        );
      }
      lookups.push(
        personMatchLookup(
          "dateOfBirthMonth",
          partyType,
          Prisma.sql`pe.date_of_birth >= ${monthStart}::date
            AND pe.date_of_birth < ${monthStart}::date + interval '1 month'`,
          50,
        ),
      );
    }

    // The sum of descriptors can also return high matching parties
    const descriptorConditions: Prisma.Sql[] = [];
    const descriptorCodes: [string | null | undefined, Prisma.Sql][] = [
      [input.person?.sexCode, Prisma.sql`pe.sex_code`],
      [input.person?.approximateAgeCode, Prisma.sql`pe.approximate_age_code`],
      [input.person?.buildCode, Prisma.sql`pe.build_code`],
      [input.person?.complexionCode, Prisma.sql`pe.complexion_code`],
      [input.person?.eyeColourCode, Prisma.sql`pe.eye_colour_code`],
      [input.person?.hairColourCode, Prisma.sql`pe.hair_colour_code`],
      [input.person?.hairLengthCode, Prisma.sql`pe.hair_length_code`],
    ];
    for (const [value, column] of descriptorCodes) {
      if (value) {
        descriptorConditions.push(Prisma.sql`${column} = ${value}`);
      }
    }
    if (input.person?.facialHairIndicator) {
      descriptorConditions.push(Prisma.sql`pe.facial_hair_ind = true`);
    }
    if (input.person?.tattooIndicator) {
      descriptorConditions.push(Prisma.sql`pe.tattoo_ind = true`);
    }
    if (input.person?.heightInCm != null) {
      descriptorConditions.push(Prisma.sql`round(pe.height_cm, 1) = round(${input.person.heightInCm}::numeric, 1)`);
    }
    if (input.person?.weightInKg != null) {
      descriptorConditions.push(Prisma.sql`round(pe.weight_kg, 1) = round(${input.person.weightInKg}::numeric, 1)`);
    }
    if (descriptorConditions.length) {
      const descriptorHits = Prisma.join(
        descriptorConditions.map((condition) => Prisma.sql`coalesce((${condition})::int, 0)`),
        " + ",
      );
      lookups.push({
        name: "descriptors",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.person pe
          JOIN shared.party p ON p.party_guid = pe.party_guid AND p.party_type = ${partyType}
          WHERE (${descriptorHits}) > 0
          ORDER BY (${descriptorHits}) DESC
          LIMIT ${Prisma.raw(String(MATCH_SIMILAR_LIMIT))}`,
      });
    }

    return [...lookups, ...this._buildAliasMatchLookups(partyType, fullName)];
  }

  private _buildBusinessMatchLookups(input: PartyMatchInput): MatchLookup[] {
    const partyType = input.partyTypeCode;
    const businessName = input.business?.name?.trim();
    const contact = businessMatchContact(input);
    const contactName = [contact.firstName ?? "", "", contact.lastName ?? ""].join(" ");
    const identifiers = input.business?.businessIdentifiers ?? [];
    const lookups: MatchLookup[] = [];

    for (const [code, name] of MATCH_IDENTIFIER_FIELDS) {
      const values = identifiers.filter((identifier) => identifier.identifierCode === code);
      for (const value of distinctMatchValues(values.map((identifier) => identifier.identifierValue))) {
        lookups.push({
          name,
          sql: Prisma.sql`SELECT p.party_guid
            FROM shared.business_identifier bi
            JOIN shared.business b ON b.business_guid = bi.business_guid
            JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
            WHERE bi.active_ind = true AND bi.business_identifier_code = ${code}
              AND shared.f_match_norm(bi.identifier_value) = shared.f_match_norm(${value})
              AND b.party_guid IS NOT NULL
            LIMIT 10`,
        });
      }
    }
    if (businessName) {
      lookups.push({
        name: "businessName",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.business b
          JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
          WHERE shared.f_match_norm(b.name) = shared.f_match_norm(${businessName})
            AND b.party_guid IS NOT NULL
          LIMIT 50`,
      });
      if (businessName.length >= MATCH_TRIGRAM_MIN_LENGTH) {
        lookups.push({
          name: "businessNameSimilar",
          sql: Prisma.sql`SELECT p.party_guid
            FROM shared.business b
            JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
            WHERE shared.f_unaccent(lower(b.name)) OPERATOR(public.%) shared.f_unaccent(lower(${businessName}))
              AND b.party_guid IS NOT NULL
            LIMIT ${Prisma.raw(String(MATCH_SIMILAR_LIMIT))}`,
        });
      }
    }
    if (contact.firstName) {
      lookups.push({
        name: "contactFirstName",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.person cpe
          JOIN shared.business_person_xref x ON x.person_guid = cpe.person_guid AND x.active_ind = true
          JOIN shared.business b ON b.business_guid = x.business_guid
          JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
          WHERE shared.f_match_norm(cpe.first_name) = shared.f_match_norm(${contact.firstName})
            AND b.party_guid IS NOT NULL
          LIMIT 25`,
      });
    }
    if (contact.lastName) {
      lookups.push({
        name: "contactLastName",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.person cpe
          JOIN shared.business_person_xref x ON x.person_guid = cpe.person_guid AND x.active_ind = true
          JOIN shared.business b ON b.business_guid = x.business_guid
          JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
          WHERE shared.f_match_norm(cpe.last_name) = shared.f_match_norm(${contact.lastName})
            AND b.party_guid IS NOT NULL
          LIMIT 25`,
      });
    }
    if (contactName.trim().length >= MATCH_TRIGRAM_MIN_LENGTH) {
      lookups.push({
        name: "contactNameSimilar",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.person cpe
          JOIN shared.business_person_xref x ON x.person_guid = cpe.person_guid AND x.active_ind = true
          JOIN shared.business b ON b.business_guid = x.business_guid
          JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
          WHERE shared.f_person_full_name(cpe.first_name, cpe.middle_names, cpe.last_name)
                OPERATOR(public.%) shared.f_unaccent(lower(${contactName}))
            AND b.party_guid IS NOT NULL
          LIMIT ${Prisma.raw(String(MATCH_SIMILAR_LIMIT))}`,
      });
    }
    // A business is also reachable through its contact people's own phones and emails
    for (const phone of pooledContactValues(input, ContactMethods.PHONE)) {
      lookups.push({
        name: "contactPhone",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.contact_method cm
          JOIN shared.person cpe ON cpe.party_guid = cm.party_guid
          JOIN shared.business_person_xref x ON x.person_guid = cpe.person_guid AND x.active_ind = true
          JOIN shared.business b ON b.business_guid = x.business_guid
          JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
          WHERE cm.active_ind = true AND cm.contact_method_type = ${contactMethodTypeSql(ContactMethods.PHONE)}
            AND right(shared.f_match_norm(cm.contact_value), 10) = right(shared.f_match_norm(${phone}), 10)
            AND b.party_guid IS NOT NULL
          LIMIT 25`,
      });
    }
    for (const email of pooledContactValues(input, ContactMethods.EMAIL)) {
      lookups.push({
        name: "contactEmail",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.contact_method cm
          JOIN shared.person cpe ON cpe.party_guid = cm.party_guid
          JOIN shared.business_person_xref x ON x.person_guid = cpe.person_guid AND x.active_ind = true
          JOIN shared.business b ON b.business_guid = x.business_guid
          JOIN shared.party p ON p.party_guid = b.party_guid AND p.party_type = ${partyType}
          WHERE cm.active_ind = true AND cm.contact_method_type = ${contactMethodTypeSql(ContactMethods.EMAIL)}
            AND lower(cm.contact_value) = lower(${email})
            AND b.party_guid IS NOT NULL
          LIMIT 25`,
      });
    }

    return lookups;
  }

  private _buildAliasMatchLookups(partyType: string, name: string): MatchLookup[] {
    if (!name.trim()) {
      return [];
    }

    const lookups: MatchLookup[] = [
      {
        name: "aliasName",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.alias a
          JOIN shared.party p ON p.party_guid = a.party_guid AND p.party_type = ${partyType}
          WHERE a.active_ind = true AND shared.f_match_norm(a.name) = shared.f_match_norm(${name})
          LIMIT 25`,
      },
    ];
    if (name.trim().length >= MATCH_TRIGRAM_MIN_LENGTH) {
      lookups.push({
        name: "aliasNameSimilar",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.alias a
          JOIN shared.party p ON p.party_guid = a.party_guid AND p.party_type = ${partyType}
          WHERE a.active_ind = true
            AND shared.f_unaccent(lower(a.name)) OPERATOR(public.%) shared.f_unaccent(lower(${name}))
            AND public.similarity(shared.f_unaccent(lower(a.name)), shared.f_unaccent(lower(${name}))) >= ${MATCH_SIMILARITY_THRESHOLD_ALIAS}
          LIMIT ${Prisma.raw(String(MATCH_SIMILAR_LIMIT))}`,
      });
    }

    return lookups;
  }

  private _buildContactMatchLookups(input: PartyMatchInput): MatchLookup[] {
    const partyType = input.partyTypeCode;
    const addresses = input.addresses ?? [];
    const lookups: MatchLookup[] = [];

    for (const phone of pooledContactValues(input, ContactMethods.PHONE)) {
      lookups.push({
        name: "phone",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.contact_method cm
          JOIN shared.party p ON p.party_guid = cm.party_guid AND p.party_type = ${partyType}
          WHERE cm.active_ind = true AND cm.contact_method_type = ${contactMethodTypeSql(ContactMethods.PHONE)}
            AND right(shared.f_match_norm(cm.contact_value), 10) = right(shared.f_match_norm(${phone}), 10)
            AND cm.party_guid IS NOT NULL
          LIMIT 25`,
      });
    }
    for (const email of pooledContactValues(input, ContactMethods.EMAIL)) {
      lookups.push({
        name: "email",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.contact_method cm
          JOIN shared.party p ON p.party_guid = cm.party_guid AND p.party_type = ${partyType}
          WHERE cm.active_ind = true AND cm.contact_method_type = ${contactMethodTypeSql(ContactMethods.EMAIL)}
            AND lower(cm.contact_value) = lower(${email})
            AND cm.party_guid IS NOT NULL
          LIMIT 25`,
      });
    }
    for (const addressLine of distinctMatchValues(addresses.map((address) => address.address))) {
      lookups.push({
        name: "addressLine",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.address ad
          JOIN shared.party p ON p.party_guid = ad.party_guid AND p.party_type = ${partyType}
          WHERE ad.active_ind = true AND shared.f_match_norm(ad.address) = shared.f_match_norm(${addressLine})
          LIMIT 25`,
      });
    }
    if (MATCH_FIELD_WEIGHTS[partyType]?.postalCode) {
      for (const postalCode of distinctMatchValues(addresses.map((address) => address.postalCode))) {
        lookups.push({
          name: "postalCode",
          sql: Prisma.sql`SELECT p.party_guid
            FROM shared.address ad
            JOIN shared.party p ON p.party_guid = ad.party_guid AND p.party_type = ${partyType}
            WHERE ad.active_ind = true AND shared.f_match_norm(ad.postal_code) = shared.f_match_norm(${postalCode})
            LIMIT 25`,
        });
      }
    }
    for (const city of distinctMatchValues(addresses.map((address) => address.city))) {
      lookups.push({
        name: "city",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.address ad
          JOIN shared.party p ON p.party_guid = ad.party_guid AND p.party_type = ${partyType}
          WHERE ad.active_ind = true AND shared.f_match_norm(ad.city) = shared.f_match_norm(${city})
          LIMIT 25`,
      });
    }
    for (const province of distinctMatchValues(addresses.map((address) => address.province))) {
      lookups.push({
        name: "province",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.address ad
          JOIN shared.party p ON p.party_guid = ad.party_guid AND p.party_type = ${partyType}
          WHERE ad.active_ind = true AND ad.country_subdivision_code = ${province}
          LIMIT 25`,
      });
    }
    for (const country of distinctMatchValues(addresses.map((address) => address.country))) {
      lookups.push({
        name: "country",
        sql: Prisma.sql`SELECT p.party_guid
          FROM shared.address ad
          JOIN shared.party p ON p.party_guid = ad.party_guid AND p.party_type = ${partyType}
          WHERE ad.active_ind = true AND ad.country_code = ${country}
          LIMIT 25`,
      });
    }

    return lookups;
  }

  /**
   * Every lookup worth running for what the officer entered. Each is narrow, index-backed and
   * limited on its own, so no one entered value can crowd the others out of the results.
   */
  private _buildMatchLookups(input: PartyMatchInput): MatchLookup[] {
    const typeLookups =
      input.partyTypeCode === PARTY_TYPES.Company
        ? this._buildBusinessMatchLookups(input)
        : this._buildPersonMatchLookups(input);

    return [...typeLookups, ...this._buildContactMatchLookups(input)];
  }

  /**
   * The accent-aware comparisons, computed once over the parties the lookups found. Only the columns the
   * entered fields can fill are selected; scoring reads a missing column as no match.
   */
  private _buildPersonComparisonColumns(input: PartyMatchInput): Prisma.Sql[] {
    const columns: Prisma.Sql[] = [];
    const firstName = input.person?.firstName?.trim();
    const middleNames = input.person?.middleNames?.trim();
    const lastName = input.person?.lastName?.trim();

    if (firstName) {
      columns.push(
        Prisma.sql`shared.f_match_norm(pe.first_name) = shared.f_match_norm(${firstName}) AS first_norm_eq`,
        Prisma.sql`public.similarity(shared.f_unaccent(lower(pe.first_name)), shared.f_unaccent(lower(${firstName}))) AS first_sim`,
        Prisma.sql`public.dmetaphone(pe.first_name) = public.dmetaphone(${firstName}) AS first_dmeta_eq`,
        Prisma.sql`least(char_length(shared.f_match_norm(pe.first_name)), char_length(shared.f_match_norm(${firstName}))) >= ${MATCH_PREFIX_MIN_LENGTH}
            AND (starts_with(shared.f_match_norm(pe.first_name), shared.f_match_norm(${firstName}))
              OR starts_with(shared.f_match_norm(${firstName}), shared.f_match_norm(pe.first_name))) AS first_prefix_eq`,
      );
    }
    if (lastName) {
      columns.push(
        Prisma.sql`shared.f_match_norm(pe.last_name) = shared.f_match_norm(${lastName}) AS last_norm_eq`,
        Prisma.sql`public.similarity(shared.f_unaccent(lower(pe.last_name)), shared.f_unaccent(lower(${lastName}))) AS last_sim`,
        Prisma.sql`public.dmetaphone(pe.last_name) = public.dmetaphone(${lastName}) AS last_dmeta_eq`,
        Prisma.sql`least(char_length(shared.f_match_norm(pe.last_name)), char_length(shared.f_match_norm(${lastName}))) >= ${MATCH_PREFIX_MIN_LENGTH}
            AND (starts_with(shared.f_match_norm(pe.last_name), shared.f_match_norm(${lastName}))
              OR starts_with(shared.f_match_norm(${lastName}), shared.f_match_norm(pe.last_name))) AS last_prefix_eq`,
      );
    }
    if (middleNames) {
      columns.push(
        Prisma.sql`shared.f_match_norm(pe.middle_names) = shared.f_match_norm(${middleNames}) AS middle_norm_eq`,
        Prisma.sql`public.similarity(shared.f_unaccent(lower(pe.middle_names)), shared.f_unaccent(lower(${middleNames}))) AS middle_sim`,
        Prisma.sql`least(char_length(shared.f_match_norm(pe.middle_names)), char_length(shared.f_match_norm(${middleNames}))) >= ${MATCH_PREFIX_MIN_LENGTH}
            AND (starts_with(shared.f_match_norm(pe.middle_names), shared.f_match_norm(${middleNames}))
              OR starts_with(shared.f_match_norm(${middleNames}), shared.f_match_norm(pe.middle_names))) AS middle_prefix_eq`,
      );
    }
    // People go by their middle name, so an entered name is also checked against the other slot
    if (firstName) {
      columns.push(
        Prisma.sql`EXISTS (SELECT 1 FROM regexp_split_to_table(coalesce(pe.middle_names, ''), '\\s+') AS middle_part
            WHERE middle_part <> '' AND shared.f_match_norm(middle_part) = shared.f_match_norm(${firstName})) AS first_middle_eq`,
      );
    }
    if (middleNames) {
      columns.push(
        Prisma.sql`(${Prisma.join(
          middleNames
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => Prisma.sql`shared.f_match_norm(pe.first_name) = shared.f_match_norm(${part})`),
          " OR ",
        )}) AS middle_first_eq`,
      );
    }
    // Compound surnames match on either half, entered or stored
    if (lastName) {
      columns.push(
        Prisma.sql`(EXISTS (SELECT 1 FROM regexp_split_to_table(coalesce(pe.last_name, ''), '[-\\s]+') AS last_part
            WHERE last_part <> '' AND shared.f_match_norm(last_part) = shared.f_match_norm(${lastName}))
            OR ${Prisma.join(
              lastName
                .split(/[-\s]+/)
                .filter(Boolean)
                .map((part) => Prisma.sql`shared.f_match_norm(pe.last_name) = shared.f_match_norm(${part})`),
              " OR ",
            )}) AS last_part_eq`,
      );
    }

    return columns;
  }

  private _buildMatchComparisons(input: PartyMatchInput): Prisma.Sql {
    const columns: Prisma.Sql[] = [];
    const joins: Prisma.Sql[] = [];

    const addBestOverRows = (alias: string, aggregates: Prisma.Sql[], source: Prisma.Sql): void => {
      if (aggregates.length) {
        joins.push(
          Prisma.sql`LEFT JOIN LATERAL (SELECT ${Prisma.join(aggregates, ", ")} ${source}) ${Prisma.raw(alias)} ON true`,
        );
        columns.push(Prisma.raw(alias + ".*"));
      }
    };

    if (input.partyTypeCode === PARTY_TYPES.Company) {
      const businessName = input.business?.name?.trim();
      const contact = businessMatchContact(input);
      const contactAggregates: Prisma.Sql[] = [];

      joins.push(Prisma.sql`LEFT JOIN shared.business b ON b.party_guid = c.party_guid`);
      if (businessName) {
        columns.push(
          Prisma.sql`shared.f_match_norm(b.name) = shared.f_match_norm(${businessName}) AS business_name_norm_eq`,
          Prisma.sql`public.similarity(shared.f_unaccent(lower(b.name)), shared.f_unaccent(lower(${businessName}))) AS business_name_sim`,
        );
      }
      if (contact.firstName) {
        contactAggregates.push(
          Prisma.sql`bool_or(shared.f_match_norm(cpe.first_name) = shared.f_match_norm(${contact.firstName})) AS contact_first_norm_eq`,
          Prisma.sql`max(public.similarity(shared.f_unaccent(lower(cpe.first_name)), shared.f_unaccent(lower(${contact.firstName})))) AS contact_first_sim`,
          Prisma.sql`bool_or(public.dmetaphone(cpe.first_name) = public.dmetaphone(${contact.firstName})) AS contact_first_dmeta_eq`,
          Prisma.sql`bool_or(least(char_length(shared.f_match_norm(cpe.first_name)), char_length(shared.f_match_norm(${contact.firstName}))) >= ${MATCH_PREFIX_MIN_LENGTH}
            AND (starts_with(shared.f_match_norm(cpe.first_name), shared.f_match_norm(${contact.firstName}))
              OR starts_with(shared.f_match_norm(${contact.firstName}), shared.f_match_norm(cpe.first_name)))) AS contact_first_prefix_eq`,
        );
      }
      if (contact.lastName) {
        contactAggregates.push(
          Prisma.sql`bool_or(shared.f_match_norm(cpe.last_name) = shared.f_match_norm(${contact.lastName})) AS contact_last_norm_eq`,
          Prisma.sql`max(public.similarity(shared.f_unaccent(lower(cpe.last_name)), shared.f_unaccent(lower(${contact.lastName})))) AS contact_last_sim`,
          Prisma.sql`bool_or(public.dmetaphone(cpe.last_name) = public.dmetaphone(${contact.lastName})) AS contact_last_dmeta_eq`,
          Prisma.sql`bool_or(least(char_length(shared.f_match_norm(cpe.last_name)), char_length(shared.f_match_norm(${contact.lastName}))) >= ${MATCH_PREFIX_MIN_LENGTH}
            AND (starts_with(shared.f_match_norm(cpe.last_name), shared.f_match_norm(${contact.lastName}))
              OR starts_with(shared.f_match_norm(${contact.lastName}), shared.f_match_norm(cpe.last_name)))) AS contact_last_prefix_eq`,
        );
      }
      addBestOverRows(
        "ct",
        contactAggregates,
        Prisma.sql`FROM shared.business cb
          JOIN shared.business_person_xref x ON x.business_guid = cb.business_guid AND x.active_ind = true
          JOIN shared.person cpe ON cpe.person_guid = x.person_guid
          WHERE cb.party_guid = c.party_guid`,
      );
    } else {
      joins.push(Prisma.sql`LEFT JOIN shared.person pe ON pe.party_guid = c.party_guid`);
      columns.push(...this._buildPersonComparisonColumns(input));
    }

    // An alias row has no entered counterpart, so it is compared against the entered name
    const aliasName = input.partyTypeCode === PARTY_TYPES.Company ? "" : personMatchName(input).trim();
    if (aliasName) {
      addBestOverRows(
        "al",
        [
          Prisma.sql`bool_or(shared.f_match_norm(a.name) = shared.f_match_norm(${aliasName})) AS alias_norm_eq`,
          Prisma.sql`max(public.similarity(shared.f_unaccent(lower(a.name)), shared.f_unaccent(lower(${aliasName})))) AS alias_sim`,
        ],
        Prisma.sql`FROM shared.alias a WHERE a.party_guid = c.party_guid AND a.active_ind = true`,
      );
    }

    const addresses = input.addresses ?? [];
    const addressAggregates = [
      ...distinctMatchValues(addresses.map((address) => address.address)).map(
        (value, index) =>
          Prisma.sql`bool_or(shared.f_match_norm(ad.address) = shared.f_match_norm(${value})) AS ${Prisma.raw("address_norm_eq_" + index)}`,
      ),
      ...distinctMatchValues(addresses.map((address) => address.city)).map(
        (value, index) =>
          Prisma.sql`bool_or(shared.f_match_norm(ad.city) = shared.f_match_norm(${value})) AS ${Prisma.raw("city_norm_eq_" + index)}`,
      ),
    ];
    addBestOverRows(
      "addr",
      addressAggregates,
      Prisma.sql`FROM shared.address ad WHERE ad.party_guid = c.party_guid AND ad.active_ind = true`,
    );

    const selected = columns.length ? Prisma.sql`, ${Prisma.join(columns, ", ")}` : Prisma.empty;

    return Prisma.sql`SELECT c.party_guid${selected}
      FROM (SELECT DISTINCT party_guid FROM candidate) c
      ${Prisma.join(joins, " ")}`;
  }

  async matchParty(input: PartyMatchInput): Promise<PartyMatchResult[]> {
    const startedAt = Date.now();
    const lookups = this._buildMatchLookups(input);

    if (!lookups.length) {
      return [];
    }

    const query = Prisma.sql`WITH candidate AS (${Prisma.join(
      lookups.map((lookup) => Prisma.sql`(${lookup.sql})`),
      " UNION ",
    )}) ${this._buildMatchComparisons(input)}`;

    // set_config rather than SET LOCAL, which cannot take a bind parameter
    const comparisonRows = await this.prisma.$transaction(
      async (tx) => {
        await tx.$queryRaw`SELECT set_config('pg_trgm.similarity_threshold', ${String(MATCH_SIMILARITY_THRESHOLD)}, true)`;
        return tx.$queryRaw<MatchComparisons[]>(query);
      },
      { maxWait: 5000, timeout: 10000 },
    );

    const comparisonsByParty = new Map(comparisonRows.map((row) => [row.party_guid, row]));
    const prismaParties: any[] = comparisonRows.length
      ? await this.prisma.party.findMany({
          where: { party_guid: { in: [...comparisonsByParty.keys()] } },
          include: this._partyMatchInclude,
        })
      : [];

    // Ties break on the most recently touched party then on guid
    const results = prismaParties
      .map((prismaParty) => ({
        prismaParty,
        ...this._scoreMatch(input, prismaParty, comparisonsByParty.get(prismaParty.party_guid)),
      }))
      .filter((result) => result.score >= MATCH_SCORE_FLOOR)
      .sort(
        (a, b) =>
          b.score - a.score ||
          (b.prismaParty.update_utc_timestamp?.getTime() ?? 0) - (a.prismaParty.update_utc_timestamp?.getTime() ?? 0) ||
          a.prismaParty.party_guid.localeCompare(b.prismaParty.party_guid),
      )
      .slice(0, MATCH_RESULT_LIMIT);

    const elapsedMs = Date.now() - startedAt;
    const summary = `matchParty partyType=${input.partyTypeCode} elapsedMs=${elapsedMs} lookups=${lookups
      .map((lookup) => lookup.name)
      .join(",")} candidates=${comparisonRows.length} results=${results.length}`;
    if (elapsedMs > MATCH_SLOW_MS) {
      this.logger.warn(summary);
    } else {
      this.logger.log(summary);
    }

    return results.map(({ prismaParty, score, matchedFields }) => ({
      party: this.mapper.map<party, Party>(prismaParty as party, "party", "Party"),
      score,
      matchedFields,
    }));
  }
}
