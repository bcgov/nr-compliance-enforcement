import { InvestigationParty, Party } from "@/generated/graphql";
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

export const DetailField: FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) =>
  value ? (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  ) : null;
