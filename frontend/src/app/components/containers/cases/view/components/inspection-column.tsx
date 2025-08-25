import { FC } from "react";
import { ActivityColumn } from "./activity-column";

interface InspectionColumnProps {}

export const InspectionColumn: FC<InspectionColumnProps> = () => {
  const handleAddInspection = () => {
    console.log("Add inspection clicked");
  };

  return (
    <ActivityColumn
      title="Inspections"
      addButtonText="Add inspection"
      onAddClick={handleAddInspection}
    />
  );
};
