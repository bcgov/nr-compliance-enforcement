import { FC } from "react";
import ComplaintEllipsisPopover from "./complaint-ellipsis-popover";
import { AllegationComplaint } from "../../../types/complaints/allegation-complaint";
import { formatDateTime } from "../../../common/methods";

type Props = {
  type: string;
  complaint: AllegationComplaint;
  complaintClick: Function;
  sortKey: string;
  sortDirection: string;
};

export const AllegationComplaintListItem: FC<Props> = ({
  type,
  complaint,
  complaintClick,
  sortKey,
  sortDirection,
}) => {
  const { complaint_identifier: complaintIdentifier, violation_code, in_progress_ind } = complaint;

  const {
    complaint_identifier: id,
    incident_reported_datetime,
    cos_geo_org_unit,
    location_summary_text: locationSummary,
    person_complaint_xref,
    complaint_status_code,
    update_timestamp,
  } = complaintIdentifier;

  const incidentReportedDatetime = formatDateTime(incident_reported_datetime);

  const location = cos_geo_org_unit ? cos_geo_org_unit.area_name : null;

  const firstName = person_complaint_xref[0]?.person_guid?.first_name;
  const lastName = person_complaint_xref[0]?.person_guid?.last_name;
  const firstInitial = firstName?.length > 0 ? firstName.substring(0, 1) : "";
  const lastInitial = lastName?.length > 0 ? lastName.substring(0, 1) : "";
  const initials = firstInitial + lastInitial;
  const displayName =
    firstInitial.length > 0 ? firstInitial + ". " + lastName : lastName;

  const statusButtonClass =
    complaint_status_code.long_description === "Closed"
      ? "btn btn-primary comp-status-closed-btn"
      : "btn btn-primary comp-status-open-btn";
  const status = complaint_status_code.long_description;

  const updateDate =
    Date.parse(update_timestamp) >= Date.parse(update_timestamp)
      ? formatDateTime(update_timestamp)
      : formatDateTime(update_timestamp);

  const zone = cos_geo_org_unit.zone_code;
  const assigned_ind =
    person_complaint_xref.length > 0 && person_complaint_xref[0].active_ind;

    const violationCode = violation_code != null ? violation_code.long_description : "";
    const inProgressButtonClass = (String)(in_progress_ind) === 'true' ? "btn btn-primary comp-in-progress-btn" : "btn btn-primary comp-in-progress-btn btn-hidden";
    const inProgressInd = (String)(in_progress_ind) === 'true' ? "In Progress" : "";

  return (
    <tr>
      <td className="sortableHeader comp-cell-width-95 comp-header-left-radius ">
        {id}
      </td>
      <td className="sortableHeader comp-cell-width-95 comp-header-horizontal-border">{incidentReportedDatetime}</td>
      <td className="sortableHeader comp-cell-width-305 comp-header-horizontal-border comp-header-vertical-border">{violationCode}</td>
      <td className="sortableHeader comp-cell-width-155 comp-header-horizontal-border">
         <button type="button" className={inProgressButtonClass}>{inProgressInd}</button>
      </td>
      <td className="sortableHeader comp-cell-width-165 comp-header-horizontal-border comp-header-vertical-border">{location}</td>
      <td className="comp-cell-width-170 comp-header-horizontal-border">{locationSummary}</td>
      <td className="sortableHeader comp-cell-width-130 comp-header-horizontal-border comp-header-vertical-border">{displayName}</td>
      <td className="sortableHeader comp-cell-width-75 comp-header-horizontal-border ">
         <button type="button" className={statusButtonClass}>{status}</button>
      </td>
      <td className="sortableHeader comp-cell-width-110 comp-header-horizontal-border comp-header-vertical-border">{updateDate}</td>
      <ComplaintEllipsisPopover
        complaint_identifier={id}
        complaint_type={type}
        assigned_ind={assigned_ind}
        sortColumn={sortKey}
        sortOrder={sortDirection}
      />
    </tr>
  );
};
