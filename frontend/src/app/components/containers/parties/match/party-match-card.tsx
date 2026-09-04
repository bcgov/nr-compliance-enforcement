// party-match-card.tsx
import { FC, Fragment, ReactNode, useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { ContactMethods } from "@/app/constants/contact-methods";
import { Address, Alias, BusinessIdentifier, ContactMethod, Party, PartyMatchedField } from "@/generated/graphql";
import { formatPhoneNumber } from "react-phone-number-input";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { getPartyName } from "@/app/common/party-name";
import { calculateAgeYears, isYoungPerson } from "@/app/common/methods";
import { formatDateObjectAsString, parseUTCDateToLocal } from "@/app/common/date-utils";

const MATCH_FIELD_LABELS: Record<string, string> = {
  driversLicenseNumber: "Driver's licence",
  firstName: "First name",
  lastName: "Last name",
  middleNames: "Middle name",
  alias: "Alias",
  dateOfBirth: "Date of birth",
  phone: "Phone number",
  email: "Email",
  addressLine: "Address",
  city: "City",
  postalCode: "Postal code",
  province: "Province",
  country: "Country",
  sexCode: "Sex as per ID",
  youngPerson: "Young person",
  approximateAgeCode: "Approximate age",
  heightInCm: "Height",
  weightInKg: "Weight",
  buildCode: "Build",
  complexionCode: "Complexion",
  eyeColourCode: "Eye colour",
  hairColourCode: "Hair colour",
  hairLengthCode: "Hair length",
  facialHairIndicator: "Facial hair",
  tattooIndicator: "Tattoos",
  businessName: "Legal name",
  businessNumber: "Business number",
  worksafeBCNumber: "WorkSafeBC number",
  contactPhone: "Contact phone",
  contactEmail: "Contact email",
  contactFirstName: "Contact first name",
  contactLastName: "Contact last name",
  "firstName+lastName": "First and last name bonus",
  "firstName+lastName+dateOfBirth": "Name and date of birth bonus",
};

const STRONG_MATCH_MINIMUM = 850;
// An exact name pair with its bonus is 200, so this needs at least one corroborating field
const LIKELY_MATCH_MINIMUM = 250;

type PartyMatchCardProps = {
  party: Party;
  score: number;
  matchedFields: PartyMatchedField[];
  onAdd: (party: Party) => void;
  isDisabled?: boolean;
  pulse?: boolean;
};

export const PartyMatchCard: FC<PartyMatchCardProps> = ({
  party,
  score,
  matchedFields,
  onAdd,
  isDisabled = false,
  pulse = false,
}) => {
  const { person, business } = party;
  const isBusiness = party.partyTypeCode === PartyTypeCodes.BUSINESS;

  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showMatchScore, setShowMatchScore] = useState(false);

  const approximateAgeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.APPROXIMATE_AGE));
  const countrySubdivisions = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY_SUBDIVISION));
  const countries = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY));

  const name = getPartyName(party);

  const aliases =
    (party.aliases ?? [])
      .filter((a): a is Alias => a != null)
      .map((a) => a.name)
      .join(", ") || "-";

  const businessIdentifiers = (business?.businessIdentifiers ?? []).filter(
    (bi): bi is BusinessIdentifier => bi != null,
  );
  const businessNumber =
    businessIdentifiers.find((bi) => bi.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER)?.identifierValue ?? "-";
  const worksafeBCNumber =
    businessIdentifiers.find((bi) => bi.identifierCode === BusinessIdentifiers.WSBC_NUMBER)?.identifierValue ?? "-";

  const contactMethods = (party.contactMethods ?? []).filter((cm): cm is ContactMethod => cm != null);
  const primaryPhone = contactMethods.find((cm) => cm.typeCode === ContactMethods.PHONE && cm.isPrimary)?.value;
  const phone = primaryPhone ? formatPhoneNumber(primaryPhone) || primaryPhone : "-";
  const email = contactMethods.find((cm) => cm.typeCode === ContactMethods.EMAIL && cm.isPrimary)?.value ?? "-";

  const addresses = (party.addresses ?? []).filter((a): a is Address => a != null);
  const primaryAddress = addresses.find((a) => a.isPrimary) ?? addresses[0];
  const address = primaryAddress
    ? [
        primaryAddress.address,
        primaryAddress.city,
        countrySubdivisions?.find((code: any) => code.countrySubdivisionCode === primaryAddress.province)
          ?.shortDescription,
        primaryAddress.postalCode,
        countries?.find((code: any) => code.countryCode === primaryAddress.country)?.longDescription,
      ]
        .filter(Boolean)
        .join(", ")
    : "-";

  const dob = parseUTCDateToLocal(person?.dateOfBirth);
  const getAge = (): string => {
    if (dob) {
      return `${calculateAgeYears(dob)} (${formatDateObjectAsString(dob, { format: "date" })})`;
    }
    if (person?.approximateAgeCode) {
      return (
        approximateAgeCodes?.find((code: any) => code.approximateAgeCode === person.approximateAgeCode)
          ?.shortDescription ?? person.approximateAgeCode
      );
    }
    return "-";
  };

  const personIsYoung = isYoungPerson(dob, person?.approximateAgeCode);
  const ageDisplay = personIsYoung ? (
    <>
      {getAge()} <Badge bg="species-badge comp-species-badge">Young person</Badge>
    </>
  ) : (
    getAge()
  );

  const matchedFieldNames = new Set(matchedFields.map((matchedField) => matchedField.field));
  const anyMatched = (...fields: string[]) => fields.some((field) => matchedFieldNames.has(field));

  const detailRow = (label: string, value: ReactNode, matched = false) => (
    <div className="row mb-1">
      <div className="col-5 text-muted">{label}</div>
      <div className="col-7">
        {value}
        {matched && <i className="bi bi-circle-fill text-success comp-party-match-card-matched-dot ms-1" />}
      </div>
    </div>
  );

  return (
    <Card className={`comp-party-match-card${pulse ? " comp-party-match-card-pulse" : ""}`}>
      <div className="d-flex justify-content-between align-items-center pt-2 px-3">
        <div className="w-100 border-bottom d-flex align-items-center gap-2 pb-2">
          <i className={`bi ${isBusiness ? "bi-building" : "bi-person"} text-muted fs-6`} />
          <span className="comp-party-match-card-name">{name}</span>
          {(isBusiness ? anyMatched("businessName") : anyMatched("firstName", "lastName", "middleNames")) && (
            <i className="bi bi-circle-fill text-success comp-party-match-card-matched-dot" />
          )}
          {score >= STRONG_MATCH_MINIMUM ? (
            <Badge bg="success">Strong match</Badge>
          ) : (
            score >= LIKELY_MATCH_MINIMUM && <Badge bg="info text-dark">Likely match</Badge>
          )}
        </div>
      </div>
      <Card.Body className="py-2 px-3">
        {isBusiness ? (
          <>
            {detailRow("Doing business as", aliases)}
            {detailRow("Business number", businessNumber, anyMatched("businessNumber"))}
            {detailRow("WorkSafeBC number", worksafeBCNumber, anyMatched("worksafeBCNumber"))}
            {detailRow("Primary phone", phone, anyMatched("phone"))}
            {detailRow("Primary address", address, anyMatched("addressLine", "city", "province", "country"))}
            {showMoreInfo && detailRow("Email", email, anyMatched("email"))}
          </>
        ) : (
          <>
            {detailRow("Sex as per ID", person?.sexCode ?? "-", anyMatched("sexCode"))}
            {detailRow("Age", ageDisplay, anyMatched("dateOfBirth", "approximateAgeCode"))}
            {detailRow("Phone number", phone, anyMatched("phone"))}
            {detailRow("Address", address, anyMatched("addressLine", "city", "postalCode", "province", "country"))}
            {showMoreInfo && (
              <>
                {detailRow(
                  "Driver's licence",
                  person?.driversLicenseNumber?.trim() || "-",
                  anyMatched("driversLicenseNumber"),
                )}
                {detailRow("Aliases", aliases, anyMatched("alias"))}
                {detailRow("Email", email, anyMatched("email"))}
              </>
            )}
          </>
        )}
        <div className="comp-party-match-card-actions">
          <Button
            variant="link"
            className="comp-party-match-card-score-toggle p-0"
            aria-expanded={showMoreInfo}
            onClick={() => setShowMoreInfo((show) => !show)}
          >
            <i className={`bi bi-chevron-${showMoreInfo ? "down" : "right"} me-1`} />
            <span>{showMoreInfo ? "Show less info" : "Show more info"}</span>
          </Button>
          {matchedFields.length > 0 && (
            <Button
              variant="link"
              className="comp-party-match-card-score-toggle p-0"
              aria-expanded={showMatchScore}
              onClick={() => setShowMatchScore((show) => !show)}
            >
              <i className={`bi bi-chevron-${showMatchScore ? "down" : "right"} me-1`} />
              <span>Why did this match?</span>
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            className="ms-auto mt-3"
            onClick={() => onAdd(party)}
            disabled={isDisabled}
          >
            <i className="bi bi-plus-circle" />
            <span>Select profile</span>
          </Button>
        </div>
        {matchedFields.length > 0 && showMatchScore && (
          <div className="comp-party-match-card-score-table comp-party-match-card-body-line">
            {matchedFields.map((matchedField, index) => (
              <Fragment key={`${matchedField.field}-${index}`}>
                <span>
                  {MATCH_FIELD_LABELS[matchedField.field] ?? matchedField.field}
                  {!matchedField.exact && " (similar)"}
                </span>
                <span className="comp-party-match-card-score-points">{`+${matchedField.points}`}</span>
              </Fragment>
            ))}
            <span className="fw-bold">Total</span>
            <span className="comp-party-match-card-score-points fw-bold">{score}</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
