import { gql } from "graphql-request";
import { graphqlRequest } from "@graphql/client";
import { PartyUniqueFieldCheckInput, PartyUniqueFieldConflict } from "@/generated/graphql";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { buildExternalIds } from "@/app/components/containers/parties/form/party-form-utils";

export const PARTY_DUPLICATE_MESSAGE =
  "A party with the same information already exists. Review existing profiles to avoid creating a duplicate.";

// Drivers licence is not an external id so it gets a hardcoded code
export const DRIVERS_LICENSE_FIELD_CODE = "DRIVERS_LICENSE";

export const profileExistsMessage = (shortDescription: string): string =>
  `${shortDescription} already belongs to another profile`;

const CHECK_PARTY_UNIQUE_FIELDS = gql`
  query CheckPartyUniqueFields($input: PartyUniqueFieldCheckInput!, $excludePartyIdentifier: String) {
    checkPartyUniqueFields(input: $input, excludePartyIdentifier: $excludePartyIdentifier) {
      fieldCode
      shortDescription
      value
    }
  }
`;

export const buildUniqueFieldCheckInput = (values: any): PartyUniqueFieldCheckInput => ({
  ...(values?.partyType === PartyTypeCodes.PERSON && values?.driversLicenseNumber?.trim()
    ? { driversLicenseNumber: values.driversLicenseNumber.trim() }
    : {}),
  ...(values?.partyType === PartyTypeCodes.ORGANIZATION && values?.businessNumber?.identifierValue?.trim()
    ? { businessIdentifierValue: values.businessNumber.identifierValue.trim() }
    : {}),
  externalIds: buildExternalIds(values?.externalIds, false).map(({ externalIdCode, externalIdValue }) => ({
    externalIdCode,
    externalIdValue,
  })),
});

const hasUniqueFieldValues = (input: PartyUniqueFieldCheckInput): boolean =>
  !!input.driversLicenseNumber || !!input.businessIdentifierValue || !!input.externalIds?.length;

// A party being edited shouldn't conflict with itself
export const checkPartyUniqueFields = async (
  input: PartyUniqueFieldCheckInput,
  excludePartyIdentifier?: string,
): Promise<PartyUniqueFieldConflict[]> => {
  if (!hasUniqueFieldValues(input)) {
    return [];
  }

  const data = await graphqlRequest(CHECK_PARTY_UNIQUE_FIELDS, {
    input,
    excludePartyIdentifier: excludePartyIdentifier ?? null,
  });

  return (data?.checkPartyUniqueFields ?? []) as PartyUniqueFieldConflict[];
};

export const scrollToFormErrorBanner = () => {
  setTimeout(() => {
    document.getElementById("complaint-error-notification")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 0);
};
