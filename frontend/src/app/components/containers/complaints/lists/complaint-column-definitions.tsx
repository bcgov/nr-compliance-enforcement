import { CompColumn } from "@/app/types/app/comp-tables";
import { formatDateTime, applyStatusClass } from "@common/methods";
import { ParkCell } from "@/app/components/containers/complaints/lists/custom/park-cell";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ComplaintActionsCell } from "@/app/components/containers/complaints/lists/custom/action-cell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import COMPLAINT_TYPES, { complaintTypeToName } from "@/app/types/app/complaint-types";

// COMMON COLUMNS

// Date logged column
export const dateLoggedColumn = <T extends { reportedOn?: any }>(): CompColumn<T> => ({
  label: "Date logged",
  sortKey: "incident_reported_utc_timestmp",
  headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
  cellClassName: "comp-cell-width-160 comp-cell-min-width-160 comp-table-date-cell",
  isSortable: true,
  getValue: (complaint) => complaint.reportedOn?.toString() ?? "",
  renderCell: (complaint) => formatDateTime(complaint.reportedOn?.toString()),
});

// Location/address column
export const locationAddressColumn = <T extends { locationSummary?: string }>(isHidden: boolean): CompColumn<T> => ({
  label: "Location/address",
  isSortable: false,
  isHidden,
  renderCell: (complaint) => complaint.locationSummary ?? "-",
});

// Park column
export const parkColumn = <T extends { parkGuid?: string }>(isHidden: boolean): CompColumn<T> => ({
  label: "Park",
  isSortable: false,
  isHidden,
  renderCell: (complaint) => <ParkCell parkGuid={complaint.parkGuid} />,
});

// Status column
export const statusColumn = <T extends { ownedBy?: string; status?: string }>(
  userAgency: string,
  getStatusDescription: (s: string) => string,
): CompColumn<T> => ({
  label: "Status",
  sortKey: "complaint_status_code",
  isSortable: true,
  getValue: (complaint) => (complaint.ownedBy === userAgency ? complaint.status : "Referred") ?? "",
  renderCell: (complaint) => {
    const derivedStatus = complaint.ownedBy === userAgency ? complaint.status : "Referred";
    return (
      <div className={`badge ${applyStatusClass(derivedStatus ?? "")}`}>
        {getStatusDescription(derivedStatus ?? "")}
      </div>
    );
  },
});

// Officer assigned column
export const officerAssignedColumn = <T,>(getOfficer: (row: T) => string): CompColumn<T> => ({
  label: "Officer assigned",
  sortKey: "last_name",
  isSortable: true,
  getValue: (complaint) => getOfficer(complaint),
  renderCell: (complaint) => getOfficer(complaint),
});

// Last updated column
export const lastUpdatedColumn = <T extends { updatedOn?: any }>(): CompColumn<T> => ({
  label: "Last updated",
  sortKey: "update_utc_timestamp",
  headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
  cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
  isSortable: true,
  getValue: (complaint) => complaint.updatedOn?.toString() ?? "",
  renderCell: (complaint) => formatDateTime(complaint.updatedOn?.toString()),
});

// Community
export const communityColumn = <T extends { organization?: { areaName?: string } }>(): CompColumn<T> => ({
  label: "Community",
  sortKey: "area_name",
  isSortable: true,
  getValue: (complaint) => complaint.organization?.areaName ?? "",
  renderCell: (complaint) => complaint.organization?.areaName ?? "-",
});

// HWCR Specific Columns

// Nature of complaint column
export const natureOfComplaintColumn = <T extends { natureOfComplaint?: string }>(
  getNatureOfComplaint: (input: string) => string,
): CompColumn<T> => ({
  label: "Nature of complaint",
  sortKey: "hwcr_complaint_nature_code",
  cellClassName: "hwc-nature-of-complaint-cell",
  isSortable: true,
  getValue: (complaint) => getNatureOfComplaint(complaint.natureOfComplaint ?? ""),
  renderCell: (complaint) => getNatureOfComplaint(complaint.natureOfComplaint ?? ""),
});

// Species column
export const speciesColumn = <T extends { species?: string }>(
  getSpecies: (input: string) => string,
): CompColumn<T> => ({
  label: "Species",
  sortKey: "species_code",
  cellClassName: "comp-cell-width-130",
  isSortable: true,
  getValue: (complaint) => getSpecies(complaint.species ?? ""),
  renderCell: (complaint) => <Badge bg="species-badge comp-species-badge">{getSpecies(complaint.species ?? "")}</Badge>,
});

// ERS specific columns

// Authorization column
export const authorizationColumn = <T extends { authorization?: string }>(isHidden: boolean): CompColumn<T> => ({
  label: "Authorization",
  isSortable: false,
  isHidden,
  renderCell: (complaint) => complaint.authorization ?? "-",
});

// Violation type column
export const violationTypeColumn = <T extends { violation?: string }>(
  getViolationDescription: (input: string) => string,
): CompColumn<T> => ({
  label: "Violation type",
  sortKey: "violation_code",
  isSortable: true,
  getValue: (complaint) => getViolationDescription(complaint.violation ?? ""),
  renderCell: (complaint) => getViolationDescription(complaint.violation ?? ""),
});

// Violation in progress column
export const violationInProgressColumn = <T extends { isInProgress?: boolean }>(isHidden: boolean): CompColumn<T> => ({
  label: "Violation in progress",
  sortKey: "in_progress_ind",
  isSortable: true,
  isHidden,
  getValue: (complaint) => (complaint.isInProgress ? "In Progress" : ""),
  renderCell: (complaint) =>
    complaint.isInProgress ? (
      <div
        id="comp-details-status-text-id"
        className="comp-box-violation-in-progress"
      >
        <FontAwesomeIcon
          id="violation-in-progress-icon"
          className="comp-cell-violation-in-progress-icon"
          icon={faExclamationCircle}
        />
        In Progress
      </div>
    ) : null,
});

// GIR Specific Columns

// GIR type column
export const girTypeColumn = <T extends { girType?: string }>(
  getGirTypeDescription: (input: string) => string,
): CompColumn<T> => ({
  label: "GIR type",
  sortKey: "gir_type_code",
  isSortable: true,
  getValue: (complaint) => getGirTypeDescription(complaint.girType ?? ""),
  renderCell: (complaint) => getGirTypeDescription(complaint.girType ?? ""),
});

// Sector Specific Columns

// Agency column
export const agencyColumn = <T extends { ownedBy?: string }>(agencies: any[]): CompColumn<T> => ({
  label: "Agency",
  isSortable: false,
  getValue: (complaint) => agencies?.find((agency: any) => agency.agency === complaint.ownedBy)?.longDescription ?? "",
  renderCell: (complaint) =>
    agencies?.find((agency: any) => agency.agency === complaint.ownedBy)?.longDescription ?? "-",
});

// Complaint type column
export const complaintTypeColumn = <T extends { type?: string }>(): CompColumn<T> => ({
  label: "Complaint type",
  sortKey: "complaint_type_code",
  isSortable: true,
  getValue: (complaint) => complaintTypeToName(complaint.type ?? ""),
  renderCell: (complaint) => complaintTypeToName(complaint.type ?? ""),
});

// Type of issue column
export const typeOfIssueColumn = <T,>(getIssueType: (complaint: T) => string): CompColumn<T> => ({
  label: "Type of issue",
  isSortable: false,
  getValue: (complaint) => getIssueType(complaint),
  renderCell: (complaint) => getIssueType(complaint),
});

// Status column for Sector - different derived status logic
export const sectorStatusColumn = <T,>(
  getDerivedStatus: (complaint: T) => string,
  getStatusDescription: (input: string) => string,
): CompColumn<T> => ({
  label: "Status",
  sortKey: "complaint_status_code",
  isSortable: true,
  getValue: (complaint) => getDerivedStatus(complaint),
  renderCell: (complaint) => {
    const derivedStatus = getDerivedStatus(complaint);
    return <div className={`badge ${applyStatusClass(derivedStatus)}`}>{getStatusDescription(derivedStatus)}</div>;
  },
});

// Parameterized Columns

// Complaint number column
export const complaintNumberColumn = <T extends { id: string; type?: string }>(
  complaintType: string,
): CompColumn<T> => ({
  label: "Complaint #",
  sortKey: "complaint_identifier",
  headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
  cellClassName: "comp-cell-width-110 sticky-col sticky-col--left text-center",
  isSortable: true,
  getValue: (complaint) => complaint.id,
  renderCell: (complaint) => (
    <Link
      to={`/complaint/${complaintType === COMPLAINT_TYPES.SECTOR ? complaint.type : complaintType}/${complaint.id}`}
      id={complaint.id}
      className="comp-cell-link"
    >
      {complaint.id}
    </Link>
  ),
});

// Actions column
export const actionsColumn = <
  T extends { id: string; ownedBy?: string; status?: string; parkGuid?: string; organization?: { zone?: string } },
>(
  complaintType: string,
): CompColumn<T> => ({
  label: "Actions",
  headerClassName: "sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col",
  cellClassName: "comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col",
  isSortable: false,
  renderCell: (complaint) => (
    <ComplaintActionsCell
      id={complaint.id}
      complaintType={complaintType}
      ownedBy={complaint.ownedBy ?? ""}
      zone={complaint.organization?.zone ?? ""}
      status={complaint.status ?? ""}
      parkGuid={complaint.parkGuid}
    />
  ),
});
