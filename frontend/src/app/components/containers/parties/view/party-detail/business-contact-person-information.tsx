import {
  DetailField,
  DetailSection,
} from "@/app/components/containers/parties/view/party-detail/party-detail-primatives";
import { ContactMethods } from "@/app/constants/contact-methods";
import { Business, ContactMethod, InvestigationBusiness } from "@/generated/graphql";
import { FC } from "react";
import { Card } from "react-bootstrap";
import { formatPhoneNumber } from "react-phone-number-input";

interface BusinessContactPersonInformationProps {
  business: Business | InvestigationBusiness;
}

export const BusinessContactPersonInformation: FC<BusinessContactPersonInformationProps> = ({ business }) => {
  const contactPeople = business.contactPeople;

  const sortPrimaryFirst = (methods: ContactMethod[]): ContactMethod[] =>
    [...methods].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

  const contactLabel = (index: number, noun: string): string => {
    if (index === 0) return `Primary ${noun}`;
    if (index === 1) return `Alternate ${noun}`;
    return `Alternate ${noun} ${index}`;
  };

  const renderContactRows = (methods: ContactMethod[], noun: string, formatValue: (value: string) => string) =>
    methods.map((cm, index) => (
      <dl key={cm.contactMethodGuid}>
        <DetailField
          label={contactLabel(index, noun)}
          value={formatValue(cm.value ?? "")}
        />
      </dl>
    ));

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
                  <h3 className="h6 mb-3">{c?.title}</h3>
                  <dl>
                    <DetailField
                      label="First name"
                      value={c?.person?.firstName}
                    />
                  </dl>
                  <dl>
                    <DetailField
                      label="Last name"
                      value={c?.person?.lastName}
                    />
                  </dl>
                  {renderContactRows(phones, "phone", (value) => formatPhoneNumber(value) ?? value)}
                  {renderContactRows(emails, "email address", (value) => value)}
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
