import { FC } from "react";

import { applyStatusClass, formatDate, formatTime } from "@common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { selectOfficerByAppUserGuid } from "@store/reducers/officer";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { ActivityCard } from "./activity-card";
import { ActivityActionMenu } from "./activity-action-menu";
import { CASE_ACTIVITY_TYPES } from "@constants/case-activity-types";
import { Investigation } from "@/generated/graphql";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { ActivityCardField } from "@/app/components/containers/cases/view/components/activity-card-field";

interface InvestigationCardProps {
  item: Investigation;
  caseName?: string;
  caseIdentifier?: string;
}

export const InvestigationCard: FC<InvestigationCardProps> = ({ item: investigation, caseName, caseIdentifier }) => {
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));

  const primaryInvestigator = useAppSelector(selectOfficerByAppUserGuid(investigation?.primaryInvestigatorGuid ?? ""));
  const fileCoordinator = useAppSelector(selectOfficerByAppUserGuid(investigation?.fileCoordinatorGuid ?? ""));

  const getCommunityName = (input: string): string => {
    const code = areaCodes.find((item) => item.area === input);
    return code?.areaName ?? "";
  };

  const formatOfficerName = (user: AppUser | undefined): string => {
    if (!user) return "";
    return `${user.last_name}, ${user.first_name}`;
  };

  const investigationId = investigation.name ?? "";
  const dateOpened = investigation.openedTimestamp ? formatDate(investigation.openedTimestamp.toString()) : "";
  const community = getCommunityName(investigation.community ?? "");
  const status = investigation.investigationStatus?.longDescription ?? "";
  const primaryInvestigatorName = formatOfficerName(primaryInvestigator ?? undefined);
  const fileCoordinatorName = formatOfficerName(fileCoordinator ?? undefined);
  const partyCount = investigation.parties?.length;
  // NOTE: The Investigation type does not currently expose an "updated" timestamp.  Duplicating what's in the Investigation header
  const lastUpdatedDate = investigation.openedTimestamp;

  return (
    <ActivityCard
      id={investigationId}
      linkTo={`/investigation/${investigation?.investigationGuid}`}
      statusBadge={{
        text: status,
        className: `${applyStatusClass(status)}`,
      }}
    >
      <div className="row g-2 text-muted">
        <ActivityCardField label="Date opened">{dateOpened}</ActivityCardField>
        <ActivityCardField label="Last updated">
          {formatDate(lastUpdatedDate)} {formatTime(lastUpdatedDate)}
        </ActivityCardField>
        <ActivityCardField label="Community">{community}</ActivityCardField>
        <ActivityCardField label="Parties">{partyCount}</ActivityCardField>
        <ActivityCardField label="Primary investigator">{primaryInvestigatorName}</ActivityCardField>
        <ActivityCardField label="File coordinator">{fileCoordinatorName}</ActivityCardField>
      </div>
      {caseIdentifier && (
        <ActivityActionMenu
          activityId={investigation?.investigationGuid ?? ""}
          caseName={caseName}
          caseIdentifier={caseIdentifier}
          activityType={CASE_ACTIVITY_TYPES.INVESTIGATION}
        />
      )}
    </ActivityCard>
  );
};
