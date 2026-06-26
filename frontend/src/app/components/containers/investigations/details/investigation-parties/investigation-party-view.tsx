import { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { BusinessIdentifier, InvestigationAttachmentReference, InvestigationParty } from "@/generated/graphql";
import { isYoungPerson } from "@/app/common/methods";
import { InvestigationPartyHeader } from "../investigation-party/investigation-party-header";
import { PartyAttachments } from "@/app/components/containers/parties/attachments/party-attachments";
import AttachmentEnum from "@/app/constants/attachment-enum";
import PartyComplianceHistory from "@/app/components/containers/parties/view/compliance-history/party-compliance-history";
import { PartyTypeCodes } from "@/app/constants/party-types";
import PartyDetail from "@/app/components/containers/parties/view/party-detail";

interface PartyDetailProps {
  party: InvestigationParty;
  investigationGuid: string;
  investigationLabel?: string;
  onBack: () => void;
  onEdit?: () => void;
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

  const isPerson = party.partyTypeCode === PartyTypeCodes.PERSON;

  // TODO: placeholder name from role when first/last name absent.
  const displayName = person ? `${person.lastName ?? ""}, ${person.firstName ?? ""}` : (business?.name ?? "-");

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
        title={displayName}
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

            <PartyDetail party={party} />

            <DetailSection title="Attachments">
              <PartyAttachments
                partyId={party?.partyIdentifier}
                activityId={investigationGuid}
                attachmentReferences={party?.attachmentReferences as InvestigationAttachmentReference[]}
                attachmentType={AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT}
                allowUpload={false}
                allowDelete={false}
              />
            </DetailSection>

            <DetailSection title="Compliance and enforcement history">
              <PartyComplianceHistory
                partyReference={party?.partyReference ?? ""}
                partyTypeGuid={isPerson ? person?.personReference || "" : business?.businessReference || ""}
                partyType={party.partyTypeCode ?? ""}
              />
            </DetailSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestigationPartyDetail;
