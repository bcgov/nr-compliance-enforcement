import { FC } from "react";
import { Investigation } from "@/generated/graphql";
import { ActivityColumn } from "./activity-column";
import { InvestigationCard } from "./investigation-card";
import { useNavigate, useParams } from "react-router-dom";

interface InvestigationColumnProps {
  investigations?: Investigation[];
  isLoading?: boolean;
}

export const InvestigationColumn: FC<InvestigationColumnProps> = ({ investigations, isLoading = false }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const handleAddInvestigation = () => {
    navigate(`/case/${id}/createInvestigation`);
  };
  return (
    <ActivityColumn
      title="Investigations"
      items={investigations}
      ItemComponent={InvestigationCard}
      keyProperty="investigationGuid"
      addButtonText="Create investigation"
      isLoading={isLoading}
      loadingText="Loading investigations..."
      onAddClick={handleAddInvestigation}
    />
  );
};
