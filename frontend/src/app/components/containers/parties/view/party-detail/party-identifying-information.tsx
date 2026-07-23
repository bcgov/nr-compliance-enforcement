import { calculateAgeYears, formatDateColumnAsDate } from "@/app/common/methods";
import {
  DetailField,
  DetailSection,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { BUSINESS_IDENTIFIER_LABELS } from "@/app/constants/business-identifiers";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@/app/store/reducers/code-table";
import { ApproximateAgeType } from "@/app/types/app/code-tables/approximate-age-type";
import { CountryType } from "@/app/types/app/code-tables/country";
import { CountrySubdivisionType } from "@/app/types/app/code-tables/country-subdivision";
import { GenderType } from "@/app/types/app/code-tables/gender";
import { BusinessIdentifier, InvestigationParty, Party } from "@/generated/graphql";
import { FC } from "react";

interface PartyIdentifyingInformationProps {
  party: Party | InvestigationParty;
}

export const PartyIdentifyingInformation: FC<PartyIdentifyingInformationProps> = ({ party }) => {
  const genderCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GENDER));
  const approximateAgeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.APPROXIMATE_AGE));
  const countrySubdivisions = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY_SUBDIVISION));
  const countries = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY));

  const person = party.person;
  const business = party.business;

  const aliases = (party.aliases ?? [])
    .filter(Boolean)
    .map((a) => a!.name)
    .join(", ");

  const dob = person?.dateOfBirth ? new Date(String(person.dateOfBirth)) : null;

  // Age only when we have a DOB.
  const ageDisplay = dob === null ? undefined : `${calculateAgeYears(dob)} years old`;

  const gender = person?.genderCode
    ? (genderCodes?.find((code: GenderType) => code.genderCode === person.genderCode)?.shortDescription ??
      person.genderCode)
    : undefined;

  // Approximate age only when we have no DOB but do have a code.
  const approximateAge =
    !dob && person?.approximateAgeCode
      ? (approximateAgeCodes?.find((code: ApproximateAgeType) => code.approximateAgeCode === person.approximateAgeCode)
          ?.shortDescription ?? person.approximateAgeCode)
      : undefined;

  const licenceProvince = person?.driversLicenseCountrySubdivisionCode
    ? (countrySubdivisions?.find(
        (code: CountrySubdivisionType) => code.countrySubdivisionCode === person?.driversLicenseCountrySubdivisionCode,
      )?.shortDescription ?? person?.driversLicenseCountrySubdivisionCode)
    : undefined;

  const licenceCountry = person?.driversLicenseCountryCode
    ? (countries?.find((code: CountryType) => code.countryCode === person?.driversLicenseCountryCode)
        ?.shortDescription ?? person?.driversLicenseCountryCode)
    : undefined;

  console.log(person?.dateOfBirth);

  return (
    <>
      {person && (
        <DetailSection title="Identifying information">
          <DetailField label="First name">{person.firstName}</DetailField>
          <DetailField label="Middle name(s)">{person.middleNames}</DetailField>
          <DetailField label="Last name">{person.lastName}</DetailField>
          <DetailField label="Alias(es)">{aliases}</DetailField>
          <DetailField label="Gender">{gender}</DetailField>
          <DetailField label="Date of birth">{formatDateColumnAsDate(person.dateOfBirth, "")}</DetailField>
          <DetailField label="Age">{ageDisplay}</DetailField>
          <DetailField label="Approximate age">{approximateAge}</DetailField>
          <DetailField label="Driver's licence number">{person.driversLicenseNumber}</DetailField>
          <DetailField label="Driver's licence class">{person.driversLicenseClass}</DetailField>
          <DetailField label="Driver's licence country">{licenceCountry}</DetailField>
          <DetailField label="Driver's licence province">{licenceProvince}</DetailField>
        </DetailSection>
      )}

      {business && (
        <DetailSection title="Identifying information">
          <DetailField label="Legal name">{business.name}</DetailField>
          {business.businessIdentifiers
            ?.filter((id): id is BusinessIdentifier => id != null)
            .map((id) => (
              <DetailField
                key={id.businessIdentifierGuid}
                label={BUSINESS_IDENTIFIER_LABELS[id.identifierCode] ?? id.identifierCode}
              >
                {id.identifierValue}
              </DetailField>
            ))}
          <DetailField label="Alias(es)">{aliases}</DetailField>
        </DetailSection>
      )}
    </>
  );
};
