import { FC } from "react";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { truncateString } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { selectCodeTable } from "@store/reducers/code-table";
import { selectOfficers } from "@store/reducers/officer";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { SORT_TYPES } from "@constants/sort-direction";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { getUserAgency } from "@/app/service/user-service";
import getOfficerAssigned from "@common/get-officer-assigned";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";
import {
  actionsColumn,
  agencyColumn,
  authorizationColumn,
  communityColumn,
  complaintNumberColumn,
  complaintTypeColumn,
  dateLoggedColumn,
  girTypeColumn,
  lastUpdatedColumn,
  locationAddressColumn,
  natureOfComplaintColumn,
  officerAssignedColumn,
  parkColumn,
  sectorStatusColumn,
  speciesColumn,
  statusColumn,
  typeOfIssueColumn,
  violationInProgressColumn,
  violationTypeColumn,
} from "./complaint-column-definitions";

type Props = {
  complaints: any[];
  complaintType: string;
  totalItems: number;
  isLoading?: boolean;
  error?: Error | null;
  onSort: (sortKey: string, sortDirection: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
};

export const ComplaintTableList: FC<Props> = ({
  complaints,
  complaintType,
  totalItems,
  isLoading = false,
  error = null,
  onSort,
  onPageChange,
  currentPage,
  pageSize,
}) => {
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const speciesCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.SPECIES));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const officers = useAppSelector(selectOfficers);

  const isParkColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.PARK_COLUMN));
  const isLocationColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.LOCATION_COLUMN));
  const isAuthorizationColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.AUTHORIZATION_COLUMN));
  const isCeebRole = UserService.hasRole([Roles.CEEB, Roles.CEEB_COMPLIANCE_COORDINATOR]);

  const userAgency = getUserAgency();

  const getStatusDescription = (input: string): string => {
    if (input === "Referred") return "Referred";
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code?.longDescription ?? "";
  };

  const getNatureOfComplaint = (input: string): string => {
    const code = natureOfComplaints.find((item) => item.natureOfComplaint === input);
    return code?.longDescription ?? "";
  };

  const getSpecies = (input: string): string => {
    const code = speciesCodes.find((item) => item.species === input);
    return code?.longDescription ?? "";
  };

  const getGirTypeDescription = (input: string): string => {
    const code = girTypeCodes.find((item) => item.girType === input);
    return code?.longDescription ?? "";
  };

  const getViolationDescription = (input: string): string => {
    const code = violationCodes.find((item) => item.violation === input);
    return code?.longDescription ?? "";
  };

  const getIssueType = (complaint: any): string => {
    switch (complaint.type) {
      case COMPLAINT_TYPES.HWCR:
        return getNatureOfComplaint(complaint.issueType);
      case COMPLAINT_TYPES.GIR:
        return getGirTypeDescription(complaint.issueType);
      case COMPLAINT_TYPES.ERS:
        return getViolationDescription(complaint.issueType);
      default:
        return "-";
    }
  };

  const getDerivedStatus = (complaint: any): string => {
    const isReferred =
      complaint.ownedBy !== userAgency && complaint.referralAgency?.find((agency: string) => agency === userAgency);
    return isReferred ? "Referred" : complaint.status;
  };

  const buildColumns = (): CompColumn<any>[] => {
    switch (complaintType) {
      case COMPLAINT_TYPES.HWCR:
        return [
          complaintNumberColumn(COMPLAINT_TYPES.HWCR),
          dateLoggedColumn(),
          natureOfComplaintColumn(getNatureOfComplaint),
          speciesColumn(getSpecies),
          communityColumn(),
          parkColumn(!isParkColumnEnabled),
          locationAddressColumn(!isLocationColumnEnabled),
          statusColumn(userAgency, getStatusDescription),
          officerAssignedColumn((complaint) => getOfficerAssigned(complaint, officers) ?? ""),
          lastUpdatedColumn(),
          actionsColumn(COMPLAINT_TYPES.HWCR),
        ];
      case COMPLAINT_TYPES.ERS:
        return [
          complaintNumberColumn(COMPLAINT_TYPES.ERS),
          dateLoggedColumn(),
          authorizationColumn(!isAuthorizationColumnEnabled),
          violationTypeColumn(getViolationDescription),
          violationInProgressColumn(isCeebRole),
          communityColumn(),
          parkColumn(!isParkColumnEnabled),
          locationAddressColumn(!isLocationColumnEnabled),
          statusColumn(userAgency, getStatusDescription),
          officerAssignedColumn((complaint) => getOfficerAssigned(complaint, officers) ?? ""),
          lastUpdatedColumn(),
          actionsColumn(COMPLAINT_TYPES.ERS),
        ];
      case COMPLAINT_TYPES.GIR:
        return [
          complaintNumberColumn(COMPLAINT_TYPES.GIR),
          dateLoggedColumn(),
          girTypeColumn(getGirTypeDescription),
          communityColumn(),
          parkColumn(!isParkColumnEnabled),
          locationAddressColumn(!isLocationColumnEnabled),
          statusColumn(userAgency, getStatusDescription),
          officerAssignedColumn((complaint) => getOfficerAssigned(complaint, officers) ?? ""),
          lastUpdatedColumn(),
          actionsColumn(COMPLAINT_TYPES.GIR),
        ];
      case COMPLAINT_TYPES.SECTOR:
      default:
        return [
          complaintNumberColumn(COMPLAINT_TYPES.SECTOR),
          dateLoggedColumn(),
          agencyColumn(agencies),
          complaintTypeColumn(),
          typeOfIssueColumn(getIssueType),
          communityColumn(),
          locationAddressColumn(!isLocationColumnEnabled),
          sectorStatusColumn(getDerivedStatus, getStatusDescription),
          lastUpdatedColumn(),
        ];
    }
  };

  return (
    <CompTable
      data={complaints}
      columns={buildColumns()}
      getRowKey={(complaint) => complaint.id}
      isLoading={isLoading}
      error={error}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={pageSize}
      defaultSortLabel="Date logged"
      defaultSortDirection={SORT_TYPES.DESC}
      onSort={onSort}
      onPageChange={onPageChange}
      emptyMessage="No complaints found using your current filters. Remove or change your filters to see complaints."
      renderExpandedContent={(complaint) => {
        const truncatedDescription = truncateString(complaint.details, 205);
        const truncatedLocationDetail = truncateString(complaint.locationDetail, 220);
        return (
          <dl className="hwc-table-dl">
            <div>
              <dt>Complaint description</dt>
              <dd>{truncatedDescription}</dd>
            </div>
            <div>
              <dt>Location description</dt>
              {truncatedLocationDetail ? <dd>{truncatedLocationDetail}</dd> : <dd>No location description provided</dd>}
            </div>
          </dl>
        );
      }}
    />
  );
};
