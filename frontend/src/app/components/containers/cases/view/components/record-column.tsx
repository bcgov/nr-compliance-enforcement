import { FC } from "react";
import { ActivityColumn } from "./activity-column";

interface RecordColumnProps {}

export const RecordColumn: FC<RecordColumnProps> = () => {
  const handleAddRecord = () => {
    console.log("Add record clicked");
  };

  return (
    <ActivityColumn
      title="Records"
      addButtonText="Add record"
      disableBorder={true}
      onAddClick={handleAddRecord}
    />
  );
};
