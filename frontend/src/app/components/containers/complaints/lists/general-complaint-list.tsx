import { FC } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { GeneralIncidentComplaint } from "@apptypes/app/complaints/general-complaint";
import { applyStatusClass, formatDateTime, truncateString } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { selectCodeTable } from "@store/reducers/code-table";
import { selectOfficers } from "@store/reducers/officer";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { SORT_TYPES } from "@constants/sort-direction";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { ComplaintActionItems } from "../list-items/complaint-action-items";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { getUserAgency } from "@/app/service/user-service";
import { usePark } from "@/app/hooks/usePark";
import getOfficerAssigned from "@common/get-officer-assigned";

type Props = {
  complaints: GeneralIncidentComplaint[];
  totalItems: number;
  isLoading?: boolean;
  error?: Error | null;
  onSort: (sortKey: string, sortDirection: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
};

export const GeneralComplaintList: FC<Props> = ({
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
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const officers = useAppSelector(selectOfficers);

  const isParkColumnEnabled = useAppSelector(isFeatureActive(FEATURE_TYPES.PARK_COLUMN));
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

  const getGirTypeDescription = (input: string): string => {
    const code = girTypeCodes.find((item) => item.girType === input);
    return code?.longDescription ?? "";
  };

  const columns: CompColumn<GeneralIncidentComplaint>[] = [
    {
      label: "Complaint #",
      sortKey: "complaint_identifier",
      headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
      cellClassName: "comp-cell-width-100 sticky-col sticky-col--left text-center",
      isSortable: true,
      getValue: (complaint) => complaint.id,
      renderCell: (complaint) => (
        <Link
          to={`/complaint/${COMPLAINT_TYPES.GIR}/${complaint.id}`}
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
      label: "GIR type",
      sortKey: "gir_type_code",
      isSortable: true,
      getValue: (complaint) => getGirTypeDescription(complaint.girType),
      renderCell: (complaint) => getGirTypeDescription(complaint.girType),
    },
    {
      label: "Community",
      sortKey: "area_name",
      isSortable: true,
      getValue: (complaint) => getLocationName(complaint.organization?.area ?? ""),
      renderCell: (complaint) => getLocationName(complaint.organization?.area ?? ""),
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
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 gc-table-date-cell",
      isSortable: true,
      getValue: (complaint) => complaint.updatedOn?.toString() ?? "",
      renderCell: (complaint) => formatDateTime(complaint.updatedOn?.toString()),
    },
    {
      label: "Actions",
      headerClassName:
        "sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col gc-table-actions-cell",
      cellClassName:
        "comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col gc-table-actions-cell",
      isSortable: false,
      renderCell: (complaint) => <GeneralActionsCell complaint={complaint} />,
    },
  ];

  return (
    <CompTable
      data={complaints}
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

const ParkCell: FC<{ parkGuid?: string }> = ({ parkGuid }) => {
  const park = usePark(parkGuid);
  return <>{park?.name ?? "-"}</>;
};

const GeneralActionsCell: FC<{ complaint: GeneralIncidentComplaint }> = ({ complaint }) => {
  const userAgency = getUserAgency();
  const derivedStatus = complaint.ownedBy === userAgency ? complaint.status : "Referred";
  const park = usePark(complaint.parkGuid);
  const parkAreaGuids = park?.parkAreas?.map((area) => area.parkAreaGuid) ?? [];

  return (
    <ComplaintActionItems
      complaint_identifier={complaint.id}
      complaint_type={COMPLAINT_TYPES.GIR}
      zone={complaint.organization?.zone ?? ""}
      agency_code={complaint.ownedBy}
      complaint_status={derivedStatus}
      park_area_guids={parkAreaGuids}
    />
  );
};
