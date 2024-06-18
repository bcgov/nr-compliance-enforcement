import { FC } from "react";
import { IconType } from "react-icons/lib";

type props = {
  icon: IconType;
  header: string;
  children: React.ReactNode;
};

export const ErrorMessage: FC<props> = ({ icon, header, children }) => {
  const Icon = icon;

  return (
    <div className="message">
      <Icon />
      <h1 className="comp-padding-top-25">{header}</h1>
      {children}
    </div>
  );
};
