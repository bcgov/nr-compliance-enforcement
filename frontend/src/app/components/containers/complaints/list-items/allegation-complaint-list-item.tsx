import { FC, useState } from "react";
import { AllegationComplaint } from "../../../../types/complaints/allegation-complaint";
import { formatDateTime, truncateString } from "../../../../common/methods";
import { Link } from "react-router-dom";
import { ComplaintActionItems } from "./complaint-action-items";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
  type: string;
  complaint: AllegationComplaint;
};

export const AllegationComplaintListItem: FC<Props> = ({
  type,
  complaint,
}) => {
  const {
    complaint_identifier: complaintIdentifier,
    violation_code,
    in_progress_ind,
  } = complaint;

  const {
    complaint_identifier: id,
    incident_reported_utc_timestmp,
    cos_geo_org_unit,
    location_summary_text: locationSummary,
    detail_text,
    location_detailed_text,
    person_complaint_xref,
    complaint_status_code,
    update_utc_timestamp,
  } = complaintIdentifier;

  const incidentReportedDatetime = formatDateTime(incident_reported_utc_timestmp);

  const location = cos_geo_org_unit ? cos_geo_org_unit.area_name : null;

  const firstName = person_complaint_xref[0]?.person_guid?.first_name;
  const lastName = person_complaint_xref[0]?.person_guid?.last_name;

  const firstInitial = firstName?.length > 0 ? firstName.substring(0, 1) : "";
  const lastInitial = lastName?.length > 0 ? lastName.substring(0, 1) : "";
  const initials = firstInitial + lastInitial;

  const displayName =
    firstInitial.length > 0 ? `${firstInitial}. ${lastName}` : lastName;

  const statusButtonClass =
    complaint_status_code.long_description === "Closed"
      ? "badge comp-status-badge-closed"
      : "badge comp-status-badge-open";
  const status = complaint_status_code.long_description;

  const updateDate = formatDateTime(update_utc_timestamp);

  const violationCode =
    violation_code != null ? violation_code.long_description : "";

  const inProgressInd = String(in_progress_ind) === "true" ? "In Progress" : "";

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);

  const toggleExpand = () => {
    if (isExpanded) { // remove the hover state on parent row if the row is collapsed
      toggleHoverState(false);
    }

    setIsExpanded(!isExpanded);
  };

  const toggleHoverState = (state: boolean) => {
    setIsRowHovered(state);
  };

  const truncatedComplaintDetailText = truncateString(detail_text, 185);
  const truncatedLocationDetailedText = truncateString(location_detailed_text,220);

  return (
    <>
    <tr key={id} className={`${isExpanded ? "comp-cell-parent-expanded" : ""} ${isRowHovered ? "comp-table-row-hover-style" : ""}`}>
      <td
        className={`comp-cell-width-95 comp-nav-item-name-underline ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        <Link to={`/complaint/ERS/${id}`} id={id}>
              {id}
        </Link>
      </td>
      <td
        className={`comp-cell-width-95 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        {incidentReportedDatetime}
      </td>
      <td
        className={`comp-cell-width-305 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        {violationCode}
      </td>
      <td
        className={`sortableHeader comp-cell-width-155 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        {in_progress_ind && (
        <div
                      id="comp-details-status-text-id"
                      className="comp-box-violation-in-progress"
                    >
                      <FontAwesomeIcon
                        id="violation-in-progress-icon"
                        className="comp-cell-violation-in-progress-icon"
                        icon={faExclamationCircle}
                      />
                      {inProgressInd}
                    </div>
        )}
      </td>
      <td
        className={`sortableHeader comp-cell-width-165 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        {location}
      </td>
      <td
        className={`comp-cell-width-170 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        {locationSummary}
      </td>
      <td
        className={`sortableHeader comp-cell-width-75 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        <div className={statusButtonClass}>
          {status}
        </div>
      </td>
      <td
        className={`comp-cell-width-130 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        onClick={toggleExpand}
      >
        <div
          data-initials-listview={initials}
          className="comp-profile-avatar"
        ></div>
        {displayName}
      </td>
      <td
        className={`comp-cell-width-110 ${isExpanded ? "comp-cell-parent-expanded" : ""}`}
        
      >
      {!isExpanded && (
          <div className="comp-table-icons">
            <ComplaintActionItems complaint_identifier={id} complaint_type={type} zone={cos_geo_org_unit?.zone_code ?? ""}/>
            <span className={!isExpanded ? "comp-table-update-date" : ""}>{updateDate}</span>          
          </div> 
        )}
        <span  className={!isExpanded ? "comp-table-update-date" : ""}>{updateDate}</span>          
      </td>
    </tr>
    {isExpanded && (
        <tr onMouseEnter={() => toggleHoverState(true)} onMouseLeave={() => toggleHoverState(false)}>
          <td onClick={toggleExpand} colSpan={2} className="comp-cell-child-expanded"></td>
          <td onClick={toggleExpand} className="comp-cell-expanded-truncated comp-cell-child-expanded">
            {truncatedComplaintDetailText}
          </td>
          <td onClick={toggleExpand} className="comp-cell-child-expanded"/>
          <td onClick={toggleExpand} className="comp-cell-expanded-truncated comp-cell-child-expanded" colSpan={2}>
            {truncatedLocationDetailedText}
          </td>
          <td colSpan={3} className="comp-cell-child-expanded comp-cell-child-actions">
            <div>
              <Link to={`/complaint/ERS/${id}`} id={id}>
                <span className="badge comp-view-complaint-badge">View Details</span>
              </Link>
              <ComplaintActionItems complaint_identifier={id} complaint_type={type} zone={cos_geo_org_unit?.zone_code ?? ""}/>
            </div>
          </td>
        </tr>
      )}
    </>

  );
};
