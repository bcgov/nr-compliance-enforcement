import { FC } from "react";
import { isFeatureActive } from "@store/reducers/app";
import { useAppSelector } from "@hooks/hooks";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";

type props = {
  feature: string;
  children: React.ReactNode;
  bypassingRoles?: Array<Roles>; // If set, children render when the feature is on or the user has any of these roles
};

export const FeatureFlag: FC<props> = ({ feature, children, bypassingRoles }) => {
  const isEnabled = useAppSelector(isFeatureActive(feature));
  const hasBypassingRole = bypassingRoles && bypassingRoles.length > 0 && UserService.hasRole(bypassingRoles);

  if (isEnabled || hasBypassingRole) {
    return <>{children}</>;
  }

  return <></>;
};
