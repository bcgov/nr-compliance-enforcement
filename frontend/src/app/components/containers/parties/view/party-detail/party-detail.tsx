import { FC } from "react";
import { InvestigationAttachmentReference, InvestigationParty, Party } from "@/generated/graphql";
import { PartyAttachments } from "@/app/components/containers/parties/attachments/party-attachments";
import PartyComplianceHistory from "@/app/components/containers/parties/view/compliance-history/party-compliance-history";
import { PartyTypeCodes } from "@/app/constants/party-types";
import {
  DetailField,
  DetailSection,
  isInvestigationParty,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { PartyIdentifyingInformation } from "@/app/components/containers/parties/view/party-detail/party-identifying-information";
import { PartyAddressInformation } from "@/app/components/containers/parties/view/party-detail/party-address-information";
import { PersonDescriptorInformation } from "@/app/components/containers/parties/view/party-detail/person-descriptor-information";
import { BusinessContactPersonInformation } from "@/app/components/containers/parties/view/party-detail/business-contact-person-information";
import { PartyContactMethodInformation } from "@/app/components/containers/parties/view/party-detail/party-contact-method-information";

interface PartyDetailProps {
  party: Party | InvestigationParty;
  attachmentType: number;
  investigationGuid?: string;
}

export const PartyDetail: FC<PartyDetailProps> = ({ party, attachmentType, investigationGuid }) => {
  const isPerson = party.partyTypeCode === PartyTypeCodes.PERSON;

  const partyReference = isInvestigationParty(party) ? (party.partyReference ?? "") : (party.partyIdentifier ?? "");

  let partyTypeGuid = "";
  if (isInvestigationParty(party)) {
    partyTypeGuid = isPerson ? (party.person?.personReference ?? "") : (party.business?.businessReference ?? "");
  } else {
    partyTypeGuid = isPerson ? (party.person?.personGuid ?? "") : (party.business?.businessGuid ?? "");
  }

  return (
    <>
      <PartyIdentifyingInformation party={party} />

      {/* Contact Methods only on people */}
      {party.person && <PartyContactMethodInformation party={party} />}

      <PartyAddressInformation party={party} />

      {/* Contact People only on business */}
      {party.business && <BusinessContactPersonInformation business={party.business} />}

      {/* Descriptors only on people */}
      {party.person && <PersonDescriptorInformation person={party.person} />}

      {/* Comments only on people */}
      {party.person && (
        <DetailSection title="Additional information">
          <DetailField label="Comments">{party.person?.comments}</DetailField>
        </DetailSection>
      )}

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
        <div className="party-compliance-history-wrapper">
          <PartyComplianceHistory
            partyReference={partyReference}
            partyTypeGuid={partyTypeGuid}
            partyType={party.partyTypeCode ?? ""}
          />
        </div>
      </DetailSection>
    </>
  );
};

export default PartyDetail;
