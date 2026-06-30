import { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { InvestigationParty, Party } from "@/generated/graphql";
import { isYoungPerson } from "@/app/common/methods";
import { InvestigationPartyHeader } from "../investigation-party/investigation-party-header";
import AttachmentEnum from "@/app/constants/attachment-enum";
import PartyDetail from "@/app/components/containers/parties/view/party-detail/party-detail";

interface PartyDetailProps {
  party: InvestigationParty;
  investigationGuid: string;
  investigationLabel?: string;
  onBack: () => void;
  onEdit?: () => void;
}

export const InvestigationPartyDetail: FC<PartyDetailProps> = ({
  party,
  investigationGuid,
  investigationLabel,
  onBack,
  onEdit,
}) => {
  // Code tables
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));

  const person = party.person;
  const business = party.business;
  const isPublished = !!party.partyReference;

  const getPartyName = (party: InvestigationParty | Party): string => {
    if (party.__typename === "InvestigationParty" && party.placeholderName) return party.placeholderName;
    if (party.person) return `${party.person.lastName}, ${party.person.firstName}`;
    if (party.business) return party.business.name ?? "";
    return "-";
  };

  // Identifying Information data
  const dob = person?.dateOfBirth ? new Date(String(person.dateOfBirth)) : null;

  // Young person badge (shown in header): DOB under 19, or approximate age 18 and under.
  const personIsYoung = isYoungPerson(dob, person?.approximateAgeCode);

  const roleText =
    partyRoles.find(
      (r) => r.partyAssociationRole === party.partyAssociationRole && r.caseActivityTypeCode === "INVSTGTN",
    )?.shortDescription ?? party.partyAssociationRole;

  return (
    <div className="comp-complaint-details">
      <InvestigationPartyHeader
        title={getPartyName(party)}
        investigationGuid={investigationGuid}
        investigationLabel={investigationLabel}
        badges={
          <>
            {person?.boloIndicator && (
              <div className="badge comp-status-badge-pending-review">
                <i className="bi bi-exclamation-circle"></i> Safety concern
              </div>
            )}
            {isPublished && (
              <div className="badge comp-status-badge-open">
                <i className="bi bi-check-circle-fill"></i> Published
              </div>
            )}
            {personIsYoung && <div className="badge comp-status-badge-closed">Young person</div>}
          </>
        }
        actions={
          <>
            <Button
              variant="outline-light"
              onClick={onBack}
            >
              <i className="bi bi-arrow-left"></i>
              <span>Parties</span>
            </Button>
            {onEdit && (
              <Button
                variant="outline-light"
                id="party-detail-edit-button"
                onClick={onEdit}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit party</span>
              </Button>
            )}
          </>
        }
      />
      <section className="comp-details-body comp-container">
        <div className="comp-details-view">
          <div className="comp-details-content">
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

            <PartyDetail
              party={party}
              attachmentType={AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT}
              investigationGuid={investigationGuid}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestigationPartyDetail;
