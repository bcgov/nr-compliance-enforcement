import { FC } from "react";
import { Investigation } from "@/generated/graphql";
import { applyStatusClass } from "@common/methods";
import { ActivityCard } from "./activity-card";

interface InvestigationCardProps {
  item: Investigation;
}

export const InvestigationCard: FC<InvestigationCardProps> = ({ item: investigation }) => {
  const statusText = investigation?.investigationStatus?.shortDescription || "Unknown";

  return (
    <ActivityCard
      id={investigation?.name || investigation?.investigationGuid || ""}
      linkTo={`/investigation/${investigation?.investigationGuid}`}
      statusBadge={{
        text: statusText,
        className: `${applyStatusClass(statusText)}`,
      }}
    />
  );
};
