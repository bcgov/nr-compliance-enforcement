import {
  DetailSection,
  renderContactRows,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { ContactMethods } from "@/app/constants/contact-methods";
import { ContactMethod, InvestigationParty, Party } from "@/generated/graphql";
import { FC } from "react";
import { formatPhoneNumber } from "react-phone-number-input";

interface PartyContactMethodInformationProps {
  party: Party | InvestigationParty;
}

export const PartyContactMethodInformation: FC<PartyContactMethodInformationProps> = ({ party }) => {
  // Contact information data
  const contactMethods = (party.contactMethods ?? []).filter(Boolean) as ContactMethod[];

  // Primary first; sort is stable so remaining order is preserved.
  const phones = contactMethods
    .filter((cm) => cm.typeCode === ContactMethods.PHONE && cm.value)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  const emails = contactMethods
    .filter((cm) => cm.typeCode === ContactMethods.EMAIL && cm.value)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  return (
    <DetailSection title="Contact information">
      {renderContactRows(phones, "phone", (value) => formatPhoneNumber(value) ?? value)}
      {renderContactRows(emails, "email address", (value) => value)}
    </DetailSection>
  );
};
