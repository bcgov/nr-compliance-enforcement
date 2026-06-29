import { FC } from "react";
import { Badge, Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import {
  Address,
  BusinessIdentifier,
  ContactMethod,
  InvestigationAddress,
  InvestigationAttachmentReference,
  InvestigationParty,
  Party,
} from "@/generated/graphql";
import { calculateAgeYears, formatDateStr } from "@/app/common/methods";
import { ContactMethods } from "@/app/constants/contact-methods";
import { formatPhoneNumber } from "react-phone-number-input";
import { CountrySubdivisionType } from "@/app/types/app/code-tables/country-subdivision";
import { CountryType } from "@/app/types/app/code-tables/country";
import { GenderType } from "@/app/types/app/code-tables/gender";
import { ApproximateAgeType } from "@/app/types/app/code-tables/approximate-age-type";
import { cmToFeetInches, kgToLb } from "@/app/components/containers/parties/form/party-form-utils";
import { ComplexionType } from "@/app/types/app/code-tables/complexion";
import { BuildType } from "@/app/types/app/code-tables/build";
import { HairColourType } from "@/app/types/app/code-tables/hair-colour";
import { HairLengthType } from "@/app/types/app/code-tables/hair-length";
import { EyeColourType } from "@/app/types/app/code-tables/eye-colour";
import { FacialHairStyleType } from "@/app/types/app/code-tables/facial-hair-style";
import { BUSINESS_IDENTIFIER_LABELS } from "@/app/constants/business-identifiers";
import { PartyAttachments } from "@/app/components/containers/parties/attachments/party-attachments";
import PartyComplianceHistory from "@/app/components/containers/parties/view/compliance-history/party-compliance-history";
import { PartyTypeCodes } from "@/app/constants/party-types";

interface PartyDetailProps {
  party: Party | InvestigationParty;
  attachmentType: number;
  investigationGuid?: string;
}

export const DetailSection: FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <section className="comp-details-section">
    <h2 className="mb-3">{title}</h2>
    <Card
      className="mb-3"
      border="default"
    >
      <Card.Body>
        <dl>{children}</dl>
      </Card.Body>
    </Card>
  </section>
);

const DetailField: FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) =>
  value ? (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  ) : null;

/** Renders contact-method rows with positional labels: "<primaryLabel>", then "<alternateLabel> 1", 2, … */
const renderContactRows = (
  methods: ContactMethod[],
  primaryLabel: string,
  alternateLabel: string,
  formatValue: (value: string) => string,
) =>
  methods.map((cm, index) => (
    <div key={cm.contactMethodGuid}>
      <dt>
        {index === 0 ? primaryLabel : `${alternateLabel} ${index}`}
        {cm.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
      </dt>
      <dd>{formatValue(cm.value)}</dd>
    </div>
  ));

/** Boolean indicator → "Yes"/"No"; undefined when unset. */
const yesNo = (indicator: boolean | null | undefined): string | undefined => {
  if (indicator === null || indicator === undefined) return undefined;
  return indicator ? "Yes" : "No";
};

export const PartyDetail: FC<PartyDetailProps> = ({ party, attachmentType, investigationGuid }) => {
  // Code tables
  const genderCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GENDER));
  const approximateAgeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.APPROXIMATE_AGE));
  const countrySubdivisions = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY_SUBDIVISION));
  const countries = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY));
  const complexionCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLEXION));
  const buildCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.BUILD));
  const hairColourCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.HAIR_COLOUR));
  const hairLengthCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.HAIR_LENGTH));
  const eyeColourCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.EYE_COLOUR));
  const facialHairStyleCodeTable = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.FACIAL_HAIR_STYLE));

  // Determine party type
  const isInvestigationParty = (p: Party | InvestigationParty): p is InvestigationParty =>
    p.__typename === "InvestigationParty";

  const isPerson = party.partyTypeCode === PartyTypeCodes.PERSON;

  const partyReference = isInvestigationParty(party) ? (party.partyReference ?? "") : (party.partyIdentifier ?? "");

  let partyTypeGuid = "";
  if (isInvestigationParty(party)) {
    partyTypeGuid = isPerson ? (party.person?.personReference ?? "") : (party.business?.businessReference ?? "");
  } else {
    partyTypeGuid = isPerson ? (party.person?.personGuid ?? "") : (party.business?.businessGuid ?? "");
  }

  const person = party.person;
  const business = party.business;

  const gender = person?.genderCode
    ? (genderCodes?.find((code: GenderType) => code.genderCode === person.genderCode)?.shortDescription ??
      person.genderCode)
    : undefined;

  const aliases = (party.aliases ?? [])
    .filter(Boolean)
    .map((a) => a!.name)
    .join(", ");

  const dob = person?.dateOfBirth ? new Date(String(person.dateOfBirth)) : null;

  // Age only when we have a DOB.
  const ageDisplay = dob === null ? undefined : `${calculateAgeYears(dob)} years old`;

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

  // Contact information data
  const contactMethods = (party.contactMethods ?? []).filter(Boolean) as ContactMethod[];

  // Primary first; sort is stable so remaining order is preserved.
  const phones = contactMethods
    .filter((cm) => cm.typeCode === ContactMethods.PHONE && cm.value)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  const emails = contactMethods
    .filter((cm) => cm.typeCode === ContactMethods.EMAIL && cm.value)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  // Address data
  const addresses = ((party.addresses ?? []).filter(Boolean) as Address[])
    .filter((addr) => (isInvestigationParty(party) ? (addr as InvestigationAddress).displayInInvestigation : true)) // only consider this flag if it's an investigation party
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  // Descriptor data

  const imperialHeight = cmToFeetInches(person?.heightInCm ?? 0);

  const heightDisplay = person?.heightInCm
    ? `${person.heightInCm} cm (${imperialHeight.feet} feet ${imperialHeight.inches} inches)`
    : undefined;
  const weightDisplay = person?.weightInKg ? `${person.weightInKg} kg (${kgToLb(person.weightInKg)} lbs)` : undefined;

  const complexion = person?.complexionCode
    ? (complexionCodes?.find((code: ComplexionType) => code.complexionCode === person.complexionCode)
        ?.shortDescription ?? person.complexionCode)
    : undefined;

  const build = person?.buildCode
    ? (buildCodes?.find((code: BuildType) => code.buildCode === person.buildCode)?.shortDescription ?? person.buildCode)
    : undefined;

  let hairColour = person?.hairColourCode
    ? (hairColourCodes?.find((code: HairColourType) => code.hairColourCode === person.hairColourCode)
        ?.shortDescription ?? person.hairColourCode)
    : undefined;

  if (person?.hairColourCode === "OTH" && person.hairColourOther) {
    hairColour = `Other (${person.hairColourOther})`;
  }

  const hairLength = person?.hairLengthCode
    ? (hairLengthCodes?.find((code: HairLengthType) => code.hairLengthCode === person.hairLengthCode)
        ?.shortDescription ?? person.hairLengthCode)
    : undefined;

  let eyeColour = person?.eyeColourCode
    ? (eyeColourCodes?.find((code: EyeColourType) => code.eyeColourCode === person.eyeColourCode)?.shortDescription ??
      person.eyeColourCode)
    : undefined;

  if (person?.eyeColourCode === "OTH" && person.eyeColourOther) {
    eyeColour = `Other (${person.eyeColourOther})`;
  }

  const facialHair = yesNo(person?.facialHairIndicator);

  const facialHairStyle = person?.facialHairStyleCodes
    ?.map(
      (ref) =>
        facialHairStyleCodeTable?.find(
          (code: FacialHairStyleType) => code.facialHairStyleCode === ref?.facialHairStyleCode,
        )?.shortDescription ?? ref,
    )
    .join(", ");

  const hasTattoos = yesNo(person?.tattooIndicator);

  return (
    <>
      {person && (
        <DetailSection title="Identifying information">
          <DetailField
            label="First name"
            value={person.firstName}
          />
          <DetailField
            label="Middle name(s)"
            value={person.middleNames}
          />
          <DetailField
            label="Last name"
            value={person.lastName}
          />
          <DetailField
            label="Alias(es)"
            value={aliases}
          />
          <DetailField
            label="Gender"
            value={gender}
          />
          <DetailField
            label="Date of birth"
            value={formatDateStr(person.dateOfBirth, "")}
          />
          <DetailField
            label="Age"
            value={ageDisplay}
          />
          <DetailField
            label="Approximate age"
            value={approximateAge}
          />
          <DetailField
            label="Driver's licence number"
            value={person.driversLicenseNumber}
          />
          <DetailField
            label="Driver's licence class"
            value={person.driversLicenseClass}
          />
          <DetailField
            label="Driver's licence country"
            value={licenceCountry}
          />
          <DetailField
            label="Driver's licence province"
            value={licenceProvince}
          />
        </DetailSection>
      )}

      {business && (
        <DetailSection title="Identifying information">
          <DetailField
            label="Legal name"
            value={business.name}
          />
          {business.businessIdentifiers
            ?.filter((id): id is BusinessIdentifier => id != null)
            .map((id) => (
              <DetailField
                key={id.businessIdentifierGuid}
                label={BUSINESS_IDENTIFIER_LABELS[id.identifierCode] ?? id.identifierCode}
                value={id.identifierValue}
              />
            ))}
          <DetailField
            label="Alias(es)"
            value={aliases}
          />
        </DetailSection>
      )}

      <DetailSection title="Contact information">
        {renderContactRows(
          phones,
          "Phone number",
          "Alternate phone number",
          (value) => formatPhoneNumber(value) ?? value,
        )}
        {renderContactRows(emails, "Email address", "Alternate email address", (value) => value)}
      </DetailSection>

      {addresses.length > 0 ? (
        <section className="comp-details-section">
          <h2 className="mb-3">Address(es)</h2>
          {addresses.map((addr) => {
            const provinceLabel = addr.province
              ? (countrySubdivisions?.find(
                  (code: CountrySubdivisionType) => code.countrySubdivisionCode === addr.province,
                )?.shortDescription ?? addr.province)
              : undefined;
            const countryLabel = addr.country
              ? (countries?.find((code: CountryType) => code.countryCode === addr.country)?.shortDescription ??
                addr.country)
              : undefined;
            return (
              <Card
                key={addr.addressGuid}
                className="mb-3"
                border="default"
              >
                <Card.Body>
                  <h3 className="h6 mb-3">
                    {addr.addressName}
                    {addr.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
                  </h3>
                  <dl>
                    <DetailField
                      label="Address"
                      value={addr.address}
                    />
                    <DetailField
                      label="City"
                      value={addr.city}
                    />
                    <DetailField
                      label="Province/state"
                      value={provinceLabel}
                    />
                    <DetailField
                      label="Postal code"
                      value={addr.postalCode}
                    />
                    <DetailField
                      label="Country"
                      value={countryLabel}
                    />
                  </dl>
                </Card.Body>
              </Card>
            );
          })}
        </section>
      ) : (
        <DetailSection title="Address(es)" />
      )}

      {person && (
        <DetailSection title="Descriptors">
          <DetailField
            label="Height"
            value={heightDisplay}
          />
          <DetailField
            label="Weight"
            value={weightDisplay}
          />
          <DetailField
            label="Complexion"
            value={complexion}
          />
          <DetailField
            label="Build"
            value={build}
          />
          <DetailField
            label="Hair colour"
            value={hairColour}
          />
          <DetailField
            label="Hair length"
            value={hairLength}
          />
          <DetailField
            label="Additional hair descriptors"
            value={person?.additionalHairDescriptors}
          />
          <DetailField
            label="Eye colour"
            value={eyeColour}
          />
          <DetailField
            label="Facial hair"
            value={facialHair}
          />
          <DetailField
            label="Facial hair style"
            value={facialHairStyle}
          />
          <DetailField
            label="Has tattoos"
            value={hasTattoos}
          />
          <DetailField
            label="Tattoos descriptors"
            value={person?.tattooDescription}
          />
          <DetailField
            label="Additional descriptors"
            value={person?.additionalDescriptors}
          />
        </DetailSection>
      )}

      <DetailSection title="Additional information">
        <DetailField
          label="Comments"
          value={person?.comments}
        />
      </DetailSection>

      <DetailSection title="Attachments">
        <PartyAttachments
          partyId={party?.partyIdentifier ?? ""}
          activityId={investigationGuid ?? ""}
          {...(isInvestigationParty(party) && party.attachmentReferences
            ? { attachmentReferences: party.attachmentReferences as InvestigationAttachmentReference[] }
            : {})}
          attachmentType={attachmentType}
          allowUpload={false}
          allowDelete={false}
        />
      </DetailSection>

      <DetailSection title="Compliance and enforcement history">
        <PartyComplianceHistory
          partyReference={partyReference}
          partyTypeGuid={partyTypeGuid}
          partyType={party.partyTypeCode ?? ""}
        />
      </DetailSection>
    </>
  );
};

export default PartyDetail;
