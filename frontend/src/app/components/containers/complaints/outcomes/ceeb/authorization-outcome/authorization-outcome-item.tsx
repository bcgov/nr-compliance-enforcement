import { FC } from "react";

type props = {
  type?: "permit" | "site";
  value?: string;
};

export const AuthoizationOutcomeItem: FC<props> = ({ type, value }) => {
  return (
    <dl>
      <div>
        <dt>{type === "permit" ? "Authorization id" : "Unauthorized site id"}</dt>
        <dd>{value}</dd>
      </div>
    </dl>
  );
};
