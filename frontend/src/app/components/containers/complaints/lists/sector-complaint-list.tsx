import { FC } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { applyStatusClass, formatDateTime, truncateString } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { SORT_TYPES } from "@constants/sort-direction";
import COMPLAINT_TYPES, { complaintTypeToName } from "@apptypes/app/complaint-types";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { getUserAgency } from "@/app/service/user-service";
import { SectorComplaint } from "@/app/types/app/complaints/sector-complaint";

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
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
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

  const getLocationName = (input: string): string => {
    const code = areaCodes.find((item) => item.area === input);
    return code?.areaName ?? "-";
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

  const columns: CompColumn<any>[] = [
    {
      label: "Complaint #",
      sortKey: "complaint_identifier",
      headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
      cellClassName: "comp-cell-width-100 sticky-col sticky-col--left text-center",
      isSortable: true,
      getValue: (complaint) => complaint.id,
      renderCell: (complaint) => (
        <Link
          to={`/complaint/${complaint.type}/${complaint.id}`}
          id={complaint.id}
          className="comp-cell-link"
        >
          {complaint.id}
        </Link>
      ),
    },
    {
      label: "Date logged",
      sortKey: "incident_reported_utc_timestmp",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 gc-table-date-cell",
      isSortable: true,
      getValue: (complaint) => complaint.reportedOn?.toString() ?? "",
      renderCell: (complaint) => formatDateTime(complaint.reportedOn?.toString()),
    },
    {
      label: "Agency",
      isSortable: false,
      getValue: (complaint) =>
        agencies?.find((agency: any) => agency.agency === complaint.ownedBy)?.longDescription ?? "",
      renderCell: (complaint) =>
        agencies?.find((agency: any) => agency.agency === complaint.ownedBy)?.longDescription ?? "-",
    },
    {
      label: "Complaint type",
      sortKey: "complaint_type_code",
      isSortable: true,
      getValue: (complaint) => complaintTypeToName(complaint.type),
      renderCell: (complaint) => complaintTypeToName(complaint.type),
    },
    {
      label: "Type of issue",
      isSortable: false,
      getValue: (complaint) => getIssueType(complaint),
      renderCell: (complaint) => getIssueType(complaint),
    },
    {
      label: "Community",
      sortKey: "area_name",
      isSortable: true,
      getValue: (complaint) => getLocationName(complaint.organization?.area ?? ""),
      renderCell: (complaint) => getLocationName(complaint.organization?.area ?? ""),
    },
    {
      label: "Location/address",
      isSortable: false,
      isHidden: !isLocationColumnEnabled,
      renderCell: (complaint) => complaint.locationSummary ?? "-",
    },
    {
      label: "Status",
      sortKey: "complaint_status_code",
      isSortable: true,
      getValue: (complaint) => getDerivedStatus(complaint),
      renderCell: (complaint) => {
        const derivedStatus = getDerivedStatus(complaint);
        return <div className={`badge ${applyStatusClass(derivedStatus)}`}>{getStatusDescription(derivedStatus)}</div>;
      },
    },
    {
      label: "Last updated",
      sortKey: "update_utc_timestamp",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 gc-table-date-cell",
      isSortable: true,
      getValue: (complaint) => complaint.updatedOn?.toString() ?? "",
      renderCell: (complaint) => formatDateTime(complaint.updatedOn?.toString()),
    },
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
