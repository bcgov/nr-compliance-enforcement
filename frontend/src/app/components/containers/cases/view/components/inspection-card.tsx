import { FC } from "react";

import { applyStatusClass } from "@common/methods";
import { ActivityCard } from "./activity-card";
import { ActivityActionMenu } from "./activity-action-menu";
import { CASE_ACTIVITY_TYPES } from "@constants/case-activity-types";
import { Inspection } from "@/generated/graphql";
import { ActivityCardField } from "@/app/components/containers/cases/view/components/activity-card-field";
import { formatDateObjectAsString, parseUTCTimestampToLocal } from "@/app/common/date-utils";

interface InspectionCardProps {
  item: Inspection;
  caseName?: string;
  caseIdentifier?: string;
}

export const InspectionCard: FC<InspectionCardProps> = ({ item: inspection, caseName, caseIdentifier }) => {
  const inspectionId = inspection.name ?? "";
  const dateOpened = formatDateObjectAsString(parseUTCTimestampToLocal(inspection.openedTimestamp), { format: "date" });
  const status = inspection.inspectionStatus?.longDescription ?? "";
  const lastUpdatedDate = parseUTCTimestampToLocal(inspection.updatedTimestamp);

  return (
    <ActivityCard
      id={inspectionId}
      linkTo={`/inspection/${inspection?.inspectionGuid}`}
      statusBadge={{
        text: status,
        className: `${applyStatusClass(status)}`,
      }}
    >
      <div className="row g-2 text-muted">
        <ActivityCardField label="Date opened">{dateOpened}</ActivityCardField>
        <ActivityCardField label="Last updated">
          {formatDateObjectAsString(lastUpdatedDate, { format: "dateTime" })}
        </ActivityCardField>
      </div>
      {caseIdentifier && (
        <ActivityActionMenu
          activityId={inspection?.inspectionGuid ?? ""}
          caseName={caseName}
          caseIdentifier={caseIdentifier}
          activityType={CASE_ACTIVITY_TYPES.INSPECTION}
        />
      )}
    </ActivityCard>
  );
};
