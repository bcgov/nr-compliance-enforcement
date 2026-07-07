import {
  DetailField,
  DetailSection,
  isInvestigationBusiness,
  renderContactRows,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { ContactMethods } from "@/app/constants/contact-methods";
import { Business, ContactMethod, InvestigationBusiness, InvestigationBusinessPerson } from "@/generated/graphql";
import { FC } from "react";
import { Badge, Card } from "react-bootstrap";
import { formatPhoneNumber } from "react-phone-number-input";

interface BusinessContactPersonInformationProps {
  business: Business | InvestigationBusiness;
}

export const BusinessContactPersonInformation: FC<BusinessContactPersonInformationProps> = ({ business }) => {
  // If it's an investigation, check the display in Investigation flag
  const contactPeople = business.contactPeople
    ?.filter((c) =>
      isInvestigationBusiness(business) ? (c as InvestigationBusinessPerson).displayInInvestigation : true,
    )
    .toSorted((a, b) => Number(b?.isPrimary ?? false) - Number(a?.isPrimary ?? false));

  const sortPrimaryFirst = (methods: ContactMethod[]): ContactMethod[] =>
    [...methods].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  return (
    <>
      {contactPeople && contactPeople.length > 0 ? (
        <section className="comp-details-section">
          <h2 className="mb-3">Contact(s)</h2>
          {contactPeople.map((c) => {
            const methods = (c?.contactMethods ?? []).filter(Boolean) as ContactMethod[];
            const phones = sortPrimaryFirst(methods.filter((cm) => cm.typeCode === ContactMethods.PHONE && cm.value));
            const emails = sortPrimaryFirst(methods.filter((cm) => cm.typeCode === ContactMethods.EMAIL && cm.value));

            return (
              <Card
                key={c?.businessPersonXrefGuid}
                className="mb-3"
                border="default"
              >
                <Card.Body>
                  <h3 className="h6 mb-3">
                    {c?.title}
                    {c?.isPrimary && <Badge className="ms-1 badge">Primary</Badge>}
                  </h3>
                  <dl>
                    <DetailField label="First name">{c?.person?.firstName}</DetailField>
                    <DetailField label="Last name">{c?.person?.lastName}</DetailField>
                    {renderContactRows(phones, "phone", (value) => formatPhoneNumber(value) ?? value)}
                    {renderContactRows(emails, "email address", (value) => value)}
                    {c?.associatedAddresses && c?.associatedAddresses.length > 0 && (
                      <DetailField label="Offices associated with">
                        {c?.associatedAddresses?.map((a) => {
                          return (
                            <Badge
                              bg="species-badge comp-species-badge"
                              className="me-2"
                              key={a?.address.addressGuid}
                            >
                              {a?.address.addressName}
                            </Badge>
                          );
                        })}
                      </DetailField>
                    )}
                  </dl>
                </Card.Body>
              </Card>
            );
          })}
        </section>
      ) : (
        <DetailSection title="Contact(s)" />
      )}
    </>
  );
};
