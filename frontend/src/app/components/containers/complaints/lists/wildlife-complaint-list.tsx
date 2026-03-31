import { FC } from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { applyStatusClass, formatDateTime, truncateString } from "@common/methods";
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
import { ParkCell } from "@/app/components/containers/complaints/lists/custom/park-cell";
import { ComplaintActionsCell } from "@/app/components/containers/complaints/lists/custom/action-cell";

type Props = {
  complaints: WildlifeComplaint[];
  totalItems: number;
  isLoading?: boolean;
  error?: Error | null;
  onSort: (sortKey: string, sortDirection: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
};

export const WildlifeComplaintList: FC<Props> = ({
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
  const speciesCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.SPECIES));
  const officers = useAppSelector(selectOfficers);

  const isParkColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.PARK_COLUMN));
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

  const getSpecies = (input: string): string => {
    const code = speciesCodes.find((item) => item.species === input);
    return code?.longDescription ?? "";
  };

  const columns: CompColumn<WildlifeComplaint>[] = [
    {
      label: "Complaint #",
      sortKey: "complaint_identifier",
      headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
      cellClassName: "comp-cell-width-110 sticky-col sticky-col--left text-center",
      isSortable: true,
      getValue: (complaint) => complaint.id,
      renderCell: (complaint) => (
        <Link
          to={`/complaint/${COMPLAINT_TYPES.HWCR}/${complaint.id}`}
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
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 hwc-table-date-cell",
      isSortable: true,
      getValue: (complaint) => complaint.reportedOn?.toString() ?? "",
      renderCell: (complaint) => formatDateTime(complaint.reportedOn?.toString()),
    },
    {
      label: "Nature of complaint",
      sortKey: "hwcr_complaint_nature_code",
      cellClassName: "hwc-nature-of-complaint-cell",
      isSortable: true,
      getValue: (complaint) => getNatureOfComplaint(complaint.natureOfComplaint),
      renderCell: (complaint) => getNatureOfComplaint(complaint.natureOfComplaint),
    },
    {
      label: "Species",
      sortKey: "species_code",
      cellClassName: "comp-cell-width-130",
      isSortable: true,
      getValue: (complaint) => getSpecies(complaint.species),
      renderCell: (complaint) => <Badge bg="species-badge comp-species-badge">{getSpecies(complaint.species)}</Badge>,
    },
    {
      label: "Community",
      sortKey: "area_name",
      cellClassName: "comp-cell-width-165",
      isSortable: true,
      getValue: (complaint) => complaint.organization?.areaName ?? "",
      renderCell: (complaint) => complaint.organization?.areaName ?? "-",
    },
    {
      label: "Park",
      isSortable: false,
      isHidden: !isParkColumnEnabled,
      renderCell: (complaint) => <ParkCell parkGuid={complaint.parkGuid} />,
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
      cellClassName: "comp-cell-width-75",
      isSortable: true,
      getValue: (complaint) => {
        const derivedStatus = complaint.ownedBy === userAgency ? complaint.status : "Referred";
        return derivedStatus;
      },
      renderCell: (complaint) => {
        const derivedStatus = complaint.ownedBy === userAgency ? complaint.status : "Referred";
        return <div className={`badge ${applyStatusClass(derivedStatus)}`}>{getStatusDescription(derivedStatus)}</div>;
      },
    },
    {
      label: "Officer assigned",
      sortKey: "last_name",
      isSortable: true,
      getValue: (complaint) => getOfficerAssigned(complaint, officers) ?? "",
      renderCell: (complaint) => getOfficerAssigned(complaint, officers),
    },
    {
      label: "Last updated",
      sortKey: "update_utc_timestamp",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 hwc-table-date-cell",
      isSortable: true,
      getValue: (complaint) => complaint.updatedOn?.toString() ?? "",
      renderCell: (complaint) => formatDateTime(complaint.updatedOn?.toString()),
    },
    {
      label: "Actions",
      headerClassName:
        "sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col hwc-table-actions-cell",
      cellClassName:
        "comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col hwc-table-actions-cell",
      isSortable: false,
      renderCell: (complaint) => (
        <ComplaintActionsCell
          id={complaint.id}
          complaintType={COMPLAINT_TYPES.HWCR}
          ownedBy={complaint.ownedBy}
          zone={complaint.organization?.zone ?? ""}
          status={complaint.status}
          parkGuid={complaint.parkGuid}
        />
      ),
    },
  ];

  return (
    <CompTable
      data={complaints}
      columns={columns}
      emptyMessage="No complaints found using your current filters. Remove or change your filters to see complaints."
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
