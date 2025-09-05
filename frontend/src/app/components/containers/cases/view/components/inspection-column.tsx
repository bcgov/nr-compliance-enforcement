import { FC } from "react";
import { ActivityColumn } from "./activity-column";
import { Inspection } from "@/generated/graphql";
import { useNavigate, useParams } from "react-router-dom";
import { InspectionCard } from "./inspection-card";

interface InspectionColumnProps {
  inspections?: Inspection[];
  isLoading?: boolean;
}

export const InspectionColumn: FC<InspectionColumnProps> = ({ inspections, isLoading = false }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const handleAddInspection = () => {
    navigate(`/case/${id}/createInspection`);
  };
  return (
    <ActivityColumn
      title="Inspections"
      items={inspections}
      ItemComponent={InspectionCard}
      keyProperty="inspectionGuid"
      addButtonText="Create inspection"
      isLoading={isLoading}
      loadingText="Loading inspections..."
      onAddClick={handleAddInspection}
    />
  );
};
