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
import { PartyContactInformation } from "@/app/components/containers/parties/view/party-detail/party-contact-information";
import { PartyAddressInformation } from "@/app/components/containers/parties/view/party-detail/party-address-information";
import { PersonDescriptorInformation } from "@/app/components/containers/parties/view/party-detail/person-descriptor-information";
import { BusinessContactInformation } from "@/app/components/containers/parties/view/party-detail/business-contact-information";

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

  console.log(party.business);

  return (
    <>
      <PartyIdentifyingInformation party={party} />

      <PartyContactInformation party={party} />

      {/* Address only on people */}
      {party.person && <PartyAddressInformation party={party} />}

      {/* Contacts only on business */}
      {party.business && <BusinessContactInformation business={party.business} />}

      {/* Descriptors only on people */}
      {party.person && <PersonDescriptorInformation person={party.person} />}

      {/* Comments only on people */}
      {party.person && (
        <DetailSection title="Additional information">
          <DetailField
            label="Comments"
            value={party.person?.comments}
          />
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
