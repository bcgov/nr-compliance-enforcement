import { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { InvestigationParty } from "@/generated/graphql";

interface PartyDetailProps {
  party: InvestigationParty;
  onBack: () => void;
  onEdit?: () => void;
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
export const InvestigationPartyDetail: FC<PartyDetailProps> = ({ party, onBack, onEdit }) => {
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));

  const person = party.person;
  const isPublished = !!party.partyReference;

  // TODO: placeholder name from role when first/last name absent.
  const displayName = person ? `${person.lastName ?? ""}, ${person.firstName ?? ""}` : "-";

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
          </div>
          {onEdit && (
            <Button
              variant="outline-primary"
              size="sm"
              id="party-detail-edit-button"
              onClick={onEdit}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit party</span>
            </Button>
          )}
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

        <DetailSection title="Identifying information" />
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
