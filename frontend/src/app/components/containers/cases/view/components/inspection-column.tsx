import { FC } from "react";
import { Inspection } from "@/generated/graphql";
import { ActivityColumn } from "./activity-column";
import { InspectionCard } from "./inspection-card";
import { useNavigate, useParams } from "react-router-dom";

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
