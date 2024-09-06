import { FC } from "react";

type props = {
  id?: string;
  type?: "authorized" | "unauthorized";
  site?: string;
};

export const AuthorizationItem: FC<props> = ({ id, type, site }) => {
  return <>Item</>;
};
