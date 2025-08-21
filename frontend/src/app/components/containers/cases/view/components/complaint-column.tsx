import { FC } from "react";
import { Complaint } from "@/app/types/app/complaints/complaint";
import { ActivityColumn } from "./activity-column";
import { ComplaintCard } from "./complaint-card";

interface ComplaintColumnProps {
  complaints?: Complaint[];
  isLoading?: boolean;
}

export const ComplaintColumn: FC<ComplaintColumnProps> = ({ complaints, isLoading = false }) => {
  const handleAddComplaint = () => {
    console.log("Add complaint clicked");
  };

  return (
    <ActivityColumn
      title="Complaints"
      items={complaints}
      ItemComponent={ComplaintCard}
      addButtonText="Add complaint"
      isLoading={isLoading}
      loadingText="Loading complaints..."
      onAddClick={handleAddComplaint}
    />
  );
};
