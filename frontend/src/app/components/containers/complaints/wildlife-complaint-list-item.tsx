import { FC } from "react";
import { HwcrComplaint } from "../../../types/complaints/hwcr-complaint";
import { formatDateTime } from "../../../common/methods";
import ComplaintEllipsisPopover from "./complaint-ellipsis-popover";

type Props = {
  type: string;
  complaint: HwcrComplaint;
  complaintClick: Function;
  sortKey: string;
  sortDirection: string;
};

export const WildlifeComplaintListItem: FC<Props> = ({
  type,
  complaint,
  complaintClick,
  sortKey, 
  sortDirection
}) => {
  const {
    complaint_identifier: complaintIdentifier,
    hwcr_complaint_nature_code,
    species_code,
  } = complaint;

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
  const natureCode =
    hwcr_complaint_nature_code !== null
      ? hwcr_complaint_nature_code.long_description
      : null;
  const species = species_code.short_description;
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
  const assigned_ind = person_complaint_xref.length > 0 && person_complaint_xref[0].active_ind;

    return (
    <tr key={id}>
      <td
        className="comp-cell-width-95 comp-header-left-border"
        onClick={(event) => complaintClick(event, id)}
      >
        {id}
      </td>
      <td
        className="comp-cell-width-95 comp-header-vertical-border"
        onClick={(event) => complaintClick(event, id)}
      >
        {incidentReportedDatetime}
      </td>
      <td
        className="comp-cell-width-330"
        onClick={(event) => complaintClick(event, id)}
      >
        {natureCode}
      </td>
      <td
        className="comp-cell-width-130 comp-header-vertical-border"
        onClick={(event) => complaintClick(event, id)}
      >
        <button type="button" className="btn btn-primary comp-species-btn">
          {species}
        </button>
      </td>
      <td
        className="comp-cell-width-165"
        onClick={(event) => complaintClick(event, id)}
      >
        {location}
      </td>
      <td
        className="comp-cell-width-170 comp-header-vertical-border"
        onClick={(event) => complaintClick(event, id)}
      >
        {locationSummary}
      </td>
      <td
        className="comp-cell-width-130"
        onClick={(event) => complaintClick(event, id)}
      >
        <div
          data-initials-listview={initials}
          className="comp-profile-avatar"
        ></div>{" "}
        {displayName}
      </td>
      <td
        className="comp-cell-width-75 comp-header-vertical-border"
        onClick={(event) => complaintClick(event, id)}
      >
        <button type="button" className={statusButtonClass}>
          {status}
        </button>
      </td>
      <td
        className="comp-cell-width-110 comp-header-right-border"
        onClick={(event) => complaintClick(event, id)}
      >
        {updateDate}
      </td>
      <ComplaintEllipsisPopover
        complaint_identifier={id}
        complaint_type={type}
        assigned_ind={assigned_ind}

        sortColumn={sortKey}
        sortOrder={sortDirection}
      ></ComplaintEllipsisPopover>
    </tr>
  );
};
