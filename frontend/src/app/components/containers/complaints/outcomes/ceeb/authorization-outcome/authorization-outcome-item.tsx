import { FC } from "react";

type props = {
  id?: string;
  type?: "permit" | "site";
  value?: string;
};

export const AuthoizationOutcomeItem: FC<props> = ({ id, type, value }) => {
  return <>Item</>;
};
