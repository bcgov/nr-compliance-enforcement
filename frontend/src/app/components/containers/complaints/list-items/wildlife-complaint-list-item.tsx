import { FC, useState } from "react";
import { HwcrComplaint } from "../../../../types/complaints/hwcr-complaint";
import { formatDateTime, truncateString } from "../../../../common/methods";
import { Link } from "react-router-dom";
import { ComplaintActionItems } from "./complaint-action-items";

type Props = {
  type: string;
  complaint: HwcrComplaint;
};

export const WildlifeComplaintListItem: FC<Props> = ({
  type,
  complaint,
}) => {
  const {
    complaint_identifier: complaintIdentifier,
    hwcr_complaint_nature_code,
    species_code,
  } = complaint;

  const {
    complaint_identifier: id,
    incident_reported_utc_timestmp,
    cos_geo_org_unit,
    detail_text,
    location_summary_text: locationSummary,
    location_detailed_text,
    person_complaint_xref,
    complaint_status_code,
    update_utc_timestamp,
  } = complaintIdentifier;

  const incidentReportedDatetime = formatDateTime(incident_reported_utc_timestmp);
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
    firstInitial.length > 0 ? `${firstInitial}. ${lastName}` : lastName;

  const statusButtonClass =
    complaint_status_code.long_description === "Closed"
      ? "badge comp-status-badge-closed"
      : "badge comp-status-badge-open";
  const status = complaint_status_code.long_description;

  const updateDate = formatDateTime(update_utc_timestamp);

  const [isExpanded, setIsExpanded] = useState(false); // used to indicate if the row is in an expanded state or not (row is expanded/contracted when click)
  const [isRowHovered, setIsRowHovered] = useState(false); // we want to apply the hover highlighting to the parent row when the expanded child row is hovered over

  const [isExpandedClass, setIsExpandedClass] = useState("");

    const toggleExpand = () => {
    if (isExpanded) { // remove the hover state on parent row if the row is collapsed
      toggleHoverState(false);
      setIsExpandedClass("");
    } else
    {
      setIsExpandedClass("comp-cell-parent-expanded");
    }
    
    setIsExpanded(!isExpanded);
  };

  const toggleHoverState = (state: boolean) => {
    setIsRowHovered(state);
  };

  const truncatedComplaintDetailText = truncateString(detail_text, 205);
  const truncatedLocationDetailedText = truncateString(location_detailed_text,220);

  return (
    <>
    <tr key={id} className={`${isExpandedClass} ${isRowHovered ? "comp-table-row-hover-style" : ""}`}>
      <td
        className={`comp-cell-width-95 comp-nav-item-name-underline ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        <Link to={`/complaint/HWCR/${id}`} id={id}>
              {id}
        </Link>
      </td>
      <td
        className={`comp-cell-width-95 ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        {incidentReportedDatetime}
      </td>
      <td
        className={`comp-cell-width-330 ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        {natureCode}
      </td>
      <td
        className={`comp-cell-width-130 ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        <button type="button" className="btn btn-primary comp-species-btn">
          {species}
        </button>
      </td>
      <td
        className={`comp-cell-width-165 ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        {location}
      </td>
      <td
        className={`comp-cell-width-170 ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        {locationSummary}
      </td>
      <td
        className={`comp-cell-width-75 ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        <div className={statusButtonClass}>
          {status}
        </div>
      </td>
      <td
        className={`comp-cell-width-130 ${isExpandedClass}`}
        onClick={toggleExpand}
      >
        <div
          data-initials-listview={initials}
          className="comp-profile-avatar"
        ></div>
        {displayName}
      </td>
      <td
        className={`comp-cell-width-110 ${isExpandedClass}`}
        
      >
        {!isExpanded && (
          <div className="comp-table-icons">
            <ComplaintActionItems complaint_identifier={id} complaint_type={type} zone={cos_geo_org_unit?.zone_code ?? ""} complaint_agency={}/>
            <span className={!isExpanded ? "comp-table-update-date" : ""}>{updateDate}</span>          
          </div> 
        )}
        <span  className={!isExpanded ? "comp-table-update-date" : ""}>{updateDate}</span>          
      </td>
      </tr>
      {isExpanded && (
        <tr onMouseEnter={() => toggleHoverState(true)} onMouseLeave={() => toggleHoverState(false)}>
          <td onClick={toggleExpand} colSpan={2} className="comp-cell-child-expanded"></td>
          <td onClick={toggleExpand} className="comp-cell-width-330 comp-cell-expanded-truncated comp-cell-child-expanded">
            {truncatedComplaintDetailText}
          </td>
          <td onClick={toggleExpand} className="comp-cell-child-expanded"/>
          <td onClick={toggleExpand} className="comp-cell-expanded-truncated comp-cell-child-expanded" colSpan={2}>
            {truncatedLocationDetailedText}
          </td>
          <td onClick={toggleExpand} className="comp-cell-child-expanded"/>
          <td colSpan={2} className="comp-cell-child-expanded comp-cell-child-actions">
            <div className="comp-cell-action-icon">
              <Link to={`/complaint/HWCR/${id}`} id={id}>
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
