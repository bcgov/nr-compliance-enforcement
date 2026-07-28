import { FC } from "react";
import { Button } from "react-bootstrap";
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
  console.log(party);

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

  return (
    <div className="comp-complaint-details">
      <InvestigationPartyHeader
        title={getPartyName(party)}
        investigationGuid={investigationGuid}
        investigationLabel={investigationLabel}
        badges={
          <PartyBadges
            isSafetyConcern={!!(person?.boloIndicator || business?.boloIndicator)}
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
        isEditMode={false}
      />
      <section className="comp-details-body comp-container">
        <div className="comp-details-view">
          <div className="comp-details-content">
            {/* Investigation role — own section at top*/}
            <DetailSection title="Party details">
              <DetailField label="Investigation role">{roleText}</DetailField>
              {person?.boloComment && <DetailField label="Safety concern reason">{person.boloComment}</DetailField>}
              {business?.boloComment && <DetailField label="Safety concern reason">{business.boloComment}</DetailField>}
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
