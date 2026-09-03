import { FC } from "react";
import { Alert, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { InvestigationParty } from "@/generated/graphql";
import { isYoungPerson } from "@/app/common/methods";
import { getPartyName } from "@/app/common/party-name";
import { InvestigationPartyHeader } from "../investigation-party/investigation-party-header";
import AttachmentEnum from "@/app/constants/attachment-enum";
import PartyDetail from "@/app/components/containers/parties/view/party-detail/party-detail";
import {
  DetailField,
  DetailSection,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";

interface PartyDetailProps {
  party: InvestigationParty;
  investigationGuid: string;
  investigationLabel?: string;
  onBack: () => void;
  backLabel: string;
  onEdit: () => void;
  editDisabledReason?: string;
  onUpdateParty?: () => void;
}

export const InvestigationPartyDetail: FC<PartyDetailProps> = ({
  party,
  investigationGuid,
  investigationLabel,
  onBack,
  backLabel,
  onEdit,
  editDisabledReason,
  onUpdateParty,
}) => {
  // Code tables
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));

  const person = party.person;
  const business = party.business;
  const isPublished = !!party.partyReference;

  // Identifying Information data
  const dob = person?.dateOfBirth ? new Date(String(person.dateOfBirth)) : null;

  // Young person badge (shown in header): DOB under 19, or approximate age 18 and under.
  const personIsYoung = isYoungPerson(dob, person?.approximateAgeCode);

  const roleText =
    partyRoles.find(
      (r) => r.partyAssociationRole === party.partyAssociationRole && r.caseActivityTypeCode === "INVSTGTN",
    )?.shortDescription ?? party.partyAssociationRole;

  const editButton = (
    <Button
      variant="outline-light"
      id="party-detail-edit-button"
      onClick={onEdit}
      disabled={!!editDisabledReason}
    >
      <i className="bi bi-pencil"></i>
      <span>Edit party</span>
    </Button>
  );

  return (
    <div className="comp-complaint-details">
      <InvestigationPartyHeader
        title={getPartyName(party)}
        investigationGuid={investigationGuid}
        investigationLabel={investigationLabel}
        badges={
          <PartyBadges
            isSafetyConcern={!!(person?.safetyConcernIndicator || business?.safetyConcernIndicator)}
            isPublished={isPublished}
            isYoungPerson={personIsYoung}
          />
        }
        actions={
          <>
            <Button
              variant="outline-light"
              onClick={onBack}
            >
              <i className="bi bi-arrow-left"></i>
              <span>{backLabel}</span>
            </Button>
            {editDisabledReason ? (
              <OverlayTrigger
                placement="left"
                overlay={<Tooltip id="party-detail-edit-disabled-tooltip">{editDisabledReason}</Tooltip>}
              >
                <span
                  className="d-inline-block ms-2"
                  style={{ cursor: "not-allowed" }}
                >
                  {editButton}
                </span>
              </OverlayTrigger>
            ) : (
              editButton
            )}
          </>
        }
        isEditMode={false}
      />
      <section className="comp-details-body comp-container">
        <div className="comp-details-view">
          <div className="comp-details-content">
            {party.isUpToDate === false && (
              <Alert
                id="party-detail-not-up-to-date-alert"
                variant="warning"
                className="comp-complaint-details-alert d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <i className="bi bi-info-circle me-2" />
                  <span>
                    {onUpdateParty
                      ? "Party information have changed as part of another investigation. Update to the latest version of information prior to making additional edits."
                      : "This party includes the information available when the investigation was closed. See the " +
                        "published profile list to view the most up-to-date information."}
                  </span>
                </div>
                <Button
                  id="party-detail-update-party-information-button"
                  variant="outline-primary"
                  className="ms-3 text-nowrap"
                  onClick={onUpdateParty}
                  disabled={!onUpdateParty}
                >
                  Update party information
                </Button>
              </Alert>
            )}

            {/* Investigation role — own section at top*/}
            <DetailSection title="Party details">
              <DetailField label="Investigation role">{roleText}</DetailField>
              {person?.safetyConcernReason && (
                <DetailField label="Safety concern reason">{person.safetyConcernReason}</DetailField>
              )}
              {business?.safetyConcernReason && (
                <DetailField label="Safety concern reason">{business.safetyConcernReason}</DetailField>
              )}
            </DetailSection>

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
