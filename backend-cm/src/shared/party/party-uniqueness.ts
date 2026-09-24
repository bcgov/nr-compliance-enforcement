import { BusinessIdentifiers } from "src/enum/business-identifier.enum";

export const PARTY_DUPLICATE_MESSAGE =
  "A party with the same information already exists. Review existing profiles to avoid creating a duplicate.";

export const DRIVERS_LICENSE_FIELD_CODE = "DRIVERS_LICENSE";
export const DRIVERS_LICENSE_FIELD_LABEL = "Driver's licence";

export const CANADA_COUNTRY_CODE = "CA";

interface DriversLicenseFields {
  driversLicenseNumber?: string | null;
  driversLicenseCountryCode?: string | null;
  driversLicenseCountrySubdivisionCode?: string | null;
}

export interface PartyUniqueFieldCheck extends DriversLicenseFields {
  businessIdentifierValue?: string | null;
  externalIds?: { externalIdCode?: string | null; externalIdValue?: string | null }[];
}

interface PartyUniqueFieldCheckSource {
  person?: DriversLicenseFields | null;
  business?: {
    businessIdentifiers?: { identifierCode?: string | null; identifierValue?: string | null }[] | null;
  } | null;
  externalIds?: { externalIdCode?: string | null; externalIdValue?: string | null }[] | null;
}

export const buildPartyUniqueFieldCheck = (input: PartyUniqueFieldCheckSource): PartyUniqueFieldCheck => ({
  driversLicenseNumber: input.person?.driversLicenseNumber ?? null,
  driversLicenseCountryCode: input.person?.driversLicenseCountryCode ?? null,
  driversLicenseCountrySubdivisionCode: input.person?.driversLicenseCountrySubdivisionCode ?? null,
  businessIdentifierValue:
    input.business?.businessIdentifiers?.find(
      (identifier) => identifier.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER,
    )?.identifierValue ?? null,
  externalIds: (input.externalIds ?? []).map((externalId) => ({
    externalIdCode: externalId.externalIdCode,
    externalIdValue: externalId.externalIdValue,
  })),
});

export const hasMatchableUniqueValue = (value?: string | null): boolean =>
  !!value && value.replace(/[^a-z0-9]/gi, "").length > 0;
