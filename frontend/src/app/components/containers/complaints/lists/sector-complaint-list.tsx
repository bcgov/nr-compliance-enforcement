import { FC } from "react";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { truncateString } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { SORT_TYPES } from "@constants/sort-direction";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { getUserAgency } from "@/app/service/user-service";
import { SectorComplaint } from "@/app/types/app/complaints/sector-complaint";
import {
  agencyColumn,
  communityColumn,
  complaintNumberColumn,
  complaintTypeColumn,
  dateLoggedColumn,
  lastUpdatedColumn,
  locationAddressColumn,
  sectorStatusColumn,
  typeOfIssueColumn,
} from "@/app/components/containers/complaints/lists/complaint-column-definitions";

type Props = {
  complaints: SectorComplaint[];
  totalItems: number;
  isLoading?: boolean;
  error?: Error | null;
  onSort: (sortKey: string, sortDirection: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
};

export const SectorComplaintList: FC<Props> = ({
  complaints,
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
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));

  const isLocationColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.LOCATION_COLUMN));

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

  const columns: CompColumn<SectorComplaint>[] = [
    complaintNumberColumn<SectorComplaint>(COMPLAINT_TYPES.SECTOR),
    dateLoggedColumn<SectorComplaint>(),
    agencyColumn<SectorComplaint>(agencies),
    complaintTypeColumn<SectorComplaint>(),
    typeOfIssueColumn<SectorComplaint>(getIssueType),
    communityColumn<SectorComplaint>(),
    locationAddressColumn<SectorComplaint>(!isLocationColumnEnabled),
    sectorStatusColumn<SectorComplaint>(getDerivedStatus, getStatusDescription),
    lastUpdatedColumn<SectorComplaint>(),
  ];

  return (
    <CompTable
      data={complaints}
      emptyMessage="No complaints found using your current filters. Remove or change your filters to see complaints."
      columns={columns}
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
      renderExpandedContent={(complaint) => {
        const truncatedDescription = truncateString(complaint.details, 185);
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
function communityLookupColumn<T>(getLocationName: (input: string) => string): CompColumn<any> {
  throw new Error("Function not implemented.");
}
