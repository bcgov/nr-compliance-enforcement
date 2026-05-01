import { FC } from "react";
import { SectorComplaint } from "@/app/types/app/complaints/sector-complaint";
import { applyStatusClass, formatDate } from "@common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { complaintTypeToName } from "@apptypes/app/complaint-types";
import { ActivityCard } from "./activity-card";
import { ActivityActionMenu } from "./activity-action-menu";
import { CASE_ACTIVITY_TYPES } from "@constants/case-activity-types";
import { ActivityCardField } from "@/app/components/containers/cases/view/components/activity-card-field";

interface ComplaintCardProps {
  item: SectorComplaint;
  caseName?: string;
  caseIdentifier?: string;
}

export const ComplaintCard: FC<ComplaintCardProps> = ({ item: complaint, caseName, caseIdentifier }) => {
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));

  const getLocationName = (input: string): string => {
    const code = areaCodes.find((item) => item.area === input);
    return code?.areaName || input;
  };

  const getStatusDescription = (input: string): string => {
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code?.longDescription || input;
  };

  const getNatureOfComplaint = (input: string): string => {
    const code = natureOfComplaints.find((item) => item.natureOfComplaint === input);
    return code?.longDescription || input;
  };

  const getGirTypeDescription = (input: string): string => {
    const code = girTypeCodes.find((item) => item.girType === input);
    return code?.longDescription || input;
  };

  const getViolationDescription = (input: string): string => {
    const code = violationCodes.find((item) => item.violation === input);
    return code?.longDescription || input;
  };

  const getAgencyDescription = (input: string): string => {
    const agency = agencies?.find((agency: any) => agency.agency === input);
    return agency?.longDescription || input;
  };

  const getIssueType = (type: string, issueType: string): string => {
    if (!issueType) return "—";

    switch (type) {
      case "HWCR":
        return getNatureOfComplaint(issueType);
      case "GIR":
        return getGirTypeDescription(issueType);
      case "ERS":
        return getViolationDescription(issueType);
      default:
        return issueType;
    }
  };

  const dateLogged = complaint.reportedOn ? formatDate(complaint.reportedOn.toString()) : "—";
  const agency = getAgencyDescription(complaint.ownedBy || "");
  const complaintType = complaintTypeToName(complaint.type || "");
  const issueType = getIssueType(complaint.type || "", complaint.issueType || "");
  const community = getLocationName(complaint.organization?.area || "");
  const status = getStatusDescription(complaint.status || "");

  return (
    <ActivityCard
      id={complaint?.id}
      linkTo={`/complaint/${complaint?.type}/${complaint?.id}`}
      statusBadge={{
        text: status,
        className: `${applyStatusClass(complaint?.status || "")}`,
      }}
    >
      <div className="row g-2 text-muted">
        <ActivityCardField label="Date logged">{dateLogged}</ActivityCardField>
        <ActivityCardField label="Community">{community}</ActivityCardField>
        <ActivityCardField label="Type">{complaintType}</ActivityCardField>
        <ActivityCardField label="Agency">{agency}</ActivityCardField>
        <ActivityCardField
          label="Issue"
          fullWidth
        >
          {issueType}
        </ActivityCardField>
      </div>
      {caseIdentifier && (
        <ActivityActionMenu
          activityId={complaint?.id}
          caseName={caseName}
          caseIdentifier={caseIdentifier}
          activityType={CASE_ACTIVITY_TYPES.COMPLAINT}
        />
      )}
    </ActivityCard>
  );
};
