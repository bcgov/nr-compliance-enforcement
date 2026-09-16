import { FC } from "react";
import { Inspection } from "@/generated/graphql";
import { ActivityColumn } from "./activity-column";
import { useNavigate, useParams } from "react-router-dom";
import { InspectionCard } from "./inspection-card";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectIsInspectionsFeatureEnabled } from "@/app/access/module-access";

interface InspectionColumnProps {
  inspections?: Inspection[];
  isLoading?: boolean;
}

export const InspectionColumn: FC<InspectionColumnProps> = ({ inspections, isLoading = false }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const inspectionsFeatureOn = useAppSelector(selectIsInspectionsFeatureEnabled);
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
      showAddButton={inspectionsFeatureOn}
      isLoading={isLoading}
      loadingText="Loading inspections..."
      onAddClick={handleAddInspection}
    />
  );
};
