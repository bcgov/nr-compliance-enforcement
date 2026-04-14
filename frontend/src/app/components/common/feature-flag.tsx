import { FC } from "react";
import { isFeatureActive } from "@store/reducers/app";
import { useAppSelector } from "@hooks/hooks";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";

type props = {
  feature: string;
  children: React.ReactNode;
  requiredRole?: Roles; // If set, children render only when the feature is on AND the user has the required role
};

export const FeatureFlag: FC<props> = ({ feature, children, requiredRole }) => {
  const isEnabled = useAppSelector(isFeatureActive(feature));
  const hasRequiredRole = requiredRole ? UserService.hasRole(requiredRole) : true;

  if (isEnabled && hasRequiredRole) {
    return <>{children}</>;
  }

  return <></>;
};
