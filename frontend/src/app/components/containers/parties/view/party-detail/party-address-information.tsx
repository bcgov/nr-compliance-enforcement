import {
  DetailField,
  DetailSection,
  isInvestigationParty,
  renderContactRows,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { useAppSelector } from "@/app/hooks/hooks";
import { CountryType } from "@/app/types/app/code-tables/country";
import { selectCodeTable } from "@/app/store/reducers/code-table";
import { CountrySubdivisionType } from "@/app/types/app/code-tables/country-subdivision";
import { Address, ContactMethod, InvestigationAddress, InvestigationParty, Party } from "@/generated/graphql";
import { FC } from "react";
import { Badge, Card } from "react-bootstrap";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { formatPhoneNumber } from "react-phone-number-input";
import { ContactMethods } from "@/app/constants/contact-methods";

interface PartyAddressInformationProps {
  party: Party | InvestigationParty;
}

export const PartyAddressInformation: FC<PartyAddressInformationProps> = ({ party }) => {
  const countrySubdivisions = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY_SUBDIVISION));
  const countries = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY));

  const isPerson = party.partyTypeCode === PartyTypeCodes.PERSON;

  // If it's an investigation, check the display in Investigation flag
  const addresses = ((party.addresses ?? []).filter(Boolean) as Address[])
    .filter((addr) => (isInvestigationParty(party) ? (addr as InvestigationAddress).displayInInvestigation : true))
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  return (
    <>
      {addresses.length > 0 ? (
        <section className="comp-details-section">
          <h3 className="mb-3">{isPerson ? "Address(es)" : "Contact information"}</h3>
          {addresses.map((addr) => {
            const provinceLabel = addr.province
              ? (countrySubdivisions?.find(
                  (code: CountrySubdivisionType) => code.countrySubdivisionCode === addr.province,
                )?.shortDescription ?? addr.province)
              : undefined;
            const countryLabel = addr.country
              ? (countries?.find((code: CountryType) => code.countryCode === addr.country)?.shortDescription ??
                addr.country)
              : undefined;

            const methods = (addr.contactMethods ?? []).filter(Boolean) as ContactMethod[];
            const phones = methods
              .filter((cm) => cm.typeCode === ContactMethods.PHONE && cm.value)
              .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
            const emails = methods
              .filter((cm) => cm.typeCode === ContactMethods.EMAIL && cm.value)
              .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

            return (
              <Card
                key={addr.addressGuid}
                className="mb-3"
                border="default"
              >
                <Card.Body className="comp-details-form">
                  <fieldset>
                    <legend className="mb-3">
                      {addr.addressName}
                      {addr.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
                    </legend>
                    <dl>
                      <DetailField label="Address">{addr.address}</DetailField>
                      <DetailField label="City">{addr.city}</DetailField>
                      <DetailField label="Province/state">{provinceLabel}</DetailField>
                      <DetailField label="Postal code">{addr.postalCode}</DetailField>
                      <DetailField label="Country">{countryLabel}</DetailField>
                      {renderContactRows(phones, "phone", (value) => formatPhoneNumber(value) ?? value)}
                      {renderContactRows(emails, "email address", (value) => value)}
                    </dl>
                  </fieldset>
                </Card.Body>
              </Card>
            );
          })}
        </section>
      ) : (
        <DetailSection title={isPerson ? "Address(es)" : "Contact information"} />
      )}
    </>
  );
};
