import { FC } from "react";
import { Inspection } from "@/generated/graphql";
import { applyStatusClass } from "@common/methods";
import { ActivityCard } from "./activity-card";

interface InspectionCardProps {
  item: Inspection;
}

export const InspectionCard: FC<InspectionCardProps> = ({ item: inspection }) => {
  const statusText = inspection?.inspectionStatus?.shortDescription || "Unknown";

  return (
    <ActivityCard
      id={inspection?.inspectionGuid || ""}
      linkTo={`/inspection/${inspection?.inspectionGuid}`}
      statusBadge={{
        text: statusText,
        className: `${applyStatusClass(statusText)}`,
      }}
    />
  );
};
