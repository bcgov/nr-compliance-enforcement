import { FC } from "react";
import { isFeatureActive } from "../../store/reducers/app";
import { useAppSelector } from "../../hooks/hooks";

type props = {
  feature: string;
  children: React.ReactNode;
};

export const FeatureFlag: FC<props> = ({ feature, children }) => {
  const isEnabled = useAppSelector(isFeatureActive(feature));

  if (isEnabled) {
    return <>{children}</>;
  }

  return <></>;
};
