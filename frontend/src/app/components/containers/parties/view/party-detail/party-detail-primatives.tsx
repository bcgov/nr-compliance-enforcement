import { ContactMethod, InvestigationParty, Party } from "@/generated/graphql";
import { FC } from "react";
import { Card } from "react-bootstrap";

export const isInvestigationParty = (p: Party | InvestigationParty): p is InvestigationParty =>
  p.__typename === "InvestigationParty";

export const DetailSection: FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <section className="comp-details-section">
    <h2 className="mb-3">{title}</h2>
    <Card
      className="mb-3"
      border="default"
    >
      <Card.Body>
        <dl>{children}</dl>
      </Card.Body>
    </Card>
  </section>
);

export const DetailField: FC<{ label: string; children?: React.ReactNode }> = ({ label, children }) =>
  children ? (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  ) : null;

/** Renders contact-method rows with positional labels: "<primaryLabel>", then "<alternateLabel> 1", 2, … */
export const renderContactRows = (methods: ContactMethod[], noun: string, formatValue: (value: string) => string) =>
  methods.map((cm, index) => (
    <DetailField
      key={cm.contactMethodGuid}
      label={_contactLabel(index, noun)}
    >
      {formatValue(cm.value ?? "")}
    </DetailField>
  ));

const _contactLabel = (index: number, noun: string): string => {
  if (index === 0) return `Primary ${noun}`;
  if (index === 1) return `Alternate ${noun}`;
  return `Alternate ${noun} ${index}`;
};
