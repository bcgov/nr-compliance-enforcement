import { FC } from "react";

import { applyStatusClass, formatDate, formatTime } from "@common/methods";
import { ActivityCard } from "./activity-card";
import { ActivityActionMenu } from "./activity-action-menu";
import { CASE_ACTIVITY_TYPES } from "@constants/case-activity-types";
import { Inspection } from "@/generated/graphql";

interface InspectionCardProps {
  item: Inspection;
  caseName?: string;
  caseIdentifier?: string;
}

export const InspectionCard: FC<InspectionCardProps> = ({ item: inspection, caseName, caseIdentifier }) => {
  const inspectionId = inspection.name ?? "";
  const dateOpened = inspection.openedTimestamp ? formatDate(inspection.openedTimestamp.toString()) : "";
  const status = inspection.inspectionStatus?.longDescription ?? "";
  // NOTE: The Inspection type does not currently expose an "updated" timestamp.  Duplicating what's in the Inspection header
  const lastUpdatedDate = inspection.openedTimestamp;

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
        <div className="col-12 col-sm-6 col-md-6 col-lg-12 col-xl-6">
          <div>
            <strong>Date opened</strong>
          </div>
          <div>{dateOpened}</div>
        </div>
        <div className="col-12 col-sm-6 col-md-6 col-lg-12 col-xl-6">
          <div>
            <strong>Last updated</strong>
          </div>
          <div>
            {formatDate(lastUpdatedDate)} {formatTime(lastUpdatedDate)}
          </div>
        </div>
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
