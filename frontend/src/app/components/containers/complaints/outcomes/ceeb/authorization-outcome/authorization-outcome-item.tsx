import { FC } from "react";

type props = {
  type?: "permit" | "site";
  value?: string;
};

export const AuthoizationOutcomeItem: FC<props> = ({ type, value }) => {
  return (
    <dl>
      <div>
        <dt>{type === "permit" ? "Authorization ID" : "Unauthorized site ID"}</dt>
        <dd id="authorization-id">{type === "site" ? `UA${value}` : value}</dd>
      </div>
    </dl>
  );
};
