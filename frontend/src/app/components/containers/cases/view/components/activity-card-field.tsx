import { FC, ReactNode } from "react";

interface ActivityCardFieldProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export const ActivityCardField: FC<ActivityCardFieldProps> = ({ label, children, fullWidth = false }) => {
  const columnClasses = fullWidth ? "col-12" : "col-12 col-sm-6 col-md-6 col-lg-12 col-xl-6";

  return (
    <div className={columnClasses}>
      <div>
        <strong>{label}</strong>
      </div>
      <div>{children}</div>
    </div>
  );
};
