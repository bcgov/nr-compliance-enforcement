import { FC } from "react";
import { Investigation } from "@/generated/graphql";
import { ActivityColumn } from "./activity-column";
import { InvestigationCard } from "./investigation-card";

interface InvestigationColumnProps {
  investigations?: Investigation[];
  isLoading?: boolean;
}

export const InvestigationColumn: FC<InvestigationColumnProps> = ({ investigations, isLoading = false }) => {
  const handleAddInvestigation = () => {
    console.log("Add investigation clicked");
  };
  return (
    <ActivityColumn
      title="Investigations"
      items={investigations}
      ItemComponent={InvestigationCard}
      addButtonText="Add investigation"
      isLoading={isLoading}
      loadingText="Loading investigations..."
      onAddClick={handleAddInvestigation}
    />
  );
};
