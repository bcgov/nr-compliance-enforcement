import {
  DetailField,
  DetailSection,
  isInvestigationParty,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { useAppSelector } from "@/app/hooks/hooks";
import { CountryType } from "@/app/types/app/code-tables/country";
import { selectCodeTable } from "@/app/store/reducers/code-table";
import { CountrySubdivisionType } from "@/app/types/app/code-tables/country-subdivision";
import { Address, InvestigationAddress, InvestigationParty, Party } from "@/generated/graphql";
import { FC } from "react";
import { Badge, Card } from "react-bootstrap";

interface PartyAddressInformationProps {
  party: Party | InvestigationParty;
}

export const PartyAddressInformation: FC<PartyAddressInformationProps> = ({ party }) => {
  const countrySubdivisions = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY_SUBDIVISION));
  const countries = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COUNTRY));

  const addresses = ((party.addresses ?? []).filter(Boolean) as Address[])
    .filter((addr) => (isInvestigationParty(party) ? (addr as InvestigationAddress).displayInInvestigation : true)) // only consider this flag if it's an investigation party
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  return (
    <>
      {addresses.length > 0 ? (
        <section className="comp-details-section">
          <h2 className="mb-3">Address(es)</h2>
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
            return (
              <Card
                key={addr.addressGuid}
                className="mb-3"
                border="default"
              >
                <Card.Body>
                  <h3 className="h6 mb-3">
                    {addr.addressName}
                    {addr.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
                  </h3>
                  <dl>
                    <DetailField
                      label="Address"
                      value={addr.address}
                    />
                    <DetailField
                      label="City"
                      value={addr.city}
                    />
                    <DetailField
                      label="Province/state"
                      value={provinceLabel}
                    />
                    <DetailField
                      label="Postal code"
                      value={addr.postalCode}
                    />
                    <DetailField
                      label="Country"
                      value={countryLabel}
                    />
                  </dl>
                </Card.Body>
              </Card>
            );
          })}
        </section>
      ) : (
        <DetailSection title="Address(es)" />
      )}
    </>
  );
};
