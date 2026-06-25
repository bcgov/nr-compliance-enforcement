import { FC } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { InvestigationParty } from "@/generated/graphql";
import { calculateAgeYears, formatDateStr, isYoungPerson } from "@/app/common/methods";

interface PartyDetailProps {
  party: InvestigationParty;
  onBack: () => void;
}

const DetailSection: FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
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

export const InvestigationPartyDetail: FC<PartyDetailProps> = ({ party, onBack }) => {
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const genderCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GENDER));
  const approximateAgeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.APPROXIMATE_AGE));

  const person = party.person;
  const isPublished = !!party.partyReference;

  // TODO: placeholder name from role when first/last name absent.
  const displayName = person ? `${person.lastName ?? ""}, ${person.firstName ?? ""}` : "-";

  const gender = person?.genderCode
    ? (genderCodes?.find((code: any) => code.genderCode === person.genderCode)?.shortDescription ?? person.genderCode)
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
      ? (approximateAgeCodes?.find((code: any) => code.approximateAgeCode === person.approximateAgeCode)
          ?.shortDescription ?? person.approximateAgeCode)
      : undefined;

  // Young person badge (shown in header): DOB under 19, or approximate age 18 and under.
  const personIsYoung = isYoungPerson(dob, person?.approximateAgeCode);

  const roleText =
    partyRoles.find(
      (r) => r.partyAssociationRole === party.partyAssociationRole && r.caseActivityTypeCode === "INVSTGTN",
    )?.shortDescription ?? party.partyAssociationRole;

  return (
    <div className="comp-details-view">
      <div className="comp-details-content">
        <Button
          variant="outline-primary"
          size="sm"
          className="mb-3"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Parties</span>
        </Button>

        {/* Title + edit row */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <h2 className="mb-0">{displayName}</h2>
            {person?.boloIndicator && (
              <span className="text-danger small d-flex align-items-center gap-1">
                <i className="bi bi-exclamation-circle"></i> Safety concern
              </span>
            )}
            {isPublished && (
              <span className="text-success small d-flex align-items-center gap-1">
                <i className="bi bi-check-circle-fill"></i> Published
              </span>
            )}
            {personIsYoung && <Badge bg="species-badge comp-species-badge">Young person</Badge>}
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            id="party-detail-edit-button"
            onClick={() => {
              /* TODO: Switch to edit mode */
            }}
          >
            <i className="bi bi-pencil"></i>
            <span>Edit party</span>
          </Button>
        </div>

        {/* Investigation role — own section at top*/}
        <section className="comp-details-section">
          <Card className="mb-3 border-0">
            <Card.Body>
              <dl>
                <div>
                  <dt>Investigation role</dt>
                  <dd>{roleText}</dd>
                </div>
              </dl>
            </Card.Body>
          </Card>
        </section>

        <DetailSection title="Identifying information">
          <DetailField
            label="First name"
            value={person?.firstName}
          />
          <DetailField
            label="Middle name(s)"
            value={person?.middleNames}
          />
          <DetailField
            label="Last name"
            value={person?.lastName}
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
            value={formatDateStr(person?.dateOfBirth, "")}
          />
          <DetailField
            label="Age"
            value={ageDisplay}
          />
          <DetailField
            label="Approximate age"
            value={approximateAge}
          />
        </DetailSection>

        <DetailSection title="Contact information" />
        <DetailSection title="Address(es)" />
        <DetailSection title="Descriptors" />
        <DetailSection title="Attachments" />
        <DetailSection title="Compliance and enforcement history" />
      </div>
    </div>
  );
};

export default InvestigationPartyDetail;
