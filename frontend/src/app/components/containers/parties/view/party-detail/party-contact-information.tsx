import { DetailSection } from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { ContactMethods } from "@/app/constants/contact-methods";
import { ContactMethod, InvestigationParty, Party } from "@/generated/graphql";
import { FC } from "react";
import { Badge } from "react-bootstrap";
import { formatPhoneNumber } from "react-phone-number-input";

interface PartyContactInformationProps {
  party: Party | InvestigationParty;
}

export const PartyContactInformation: FC<PartyContactInformationProps> = ({ party }) => {
  // Contact information data
  const contactMethods = (party.contactMethods ?? []).filter(Boolean) as ContactMethod[];

  // Primary first; sort is stable so remaining order is preserved.
  const phones = contactMethods
    .filter((cm) => cm.typeCode === ContactMethods.PHONE && cm.value)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  const emails = contactMethods
    .filter((cm) => cm.typeCode === ContactMethods.EMAIL && cm.value)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  /** Renders contact-method rows with positional labels: "<primaryLabel>", then "<alternateLabel> 1", 2, … */
  const renderContactRows = (
    methods: ContactMethod[],
    primaryLabel: string,
    alternateLabel: string,
    formatValue: (value: string) => string,
  ) =>
    methods.map((cm, index) => (
      <div key={cm.contactMethodGuid}>
        <dt>
          {index === 0 ? primaryLabel : `${alternateLabel} ${index}`}
          {cm.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
        </dt>
        <dd>{formatValue(cm.value)}</dd>
      </div>
    ));

  return (
    <DetailSection title="Contact information">
      {renderContactRows(
        phones,
        "Phone number",
        "Alternate phone number",
        (value) => formatPhoneNumber(value) ?? value,
      )}
      {renderContactRows(emails, "Email address", "Alternate email address", (value) => value)}
    </DetailSection>
  );
};
