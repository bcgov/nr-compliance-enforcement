import { FC, useState } from "react";
import { AllegationComplaint } from "../../../../types/app/complaints/allegation-complaint";
import { formatDateTime, truncateString } from "../../../../common/methods";
import { Link } from "react-router-dom";
import { ComplaintActionItems } from "./complaint-action-items";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectCodeTable } from "../../../../store/reducers/code-table";
import { CODE_TABLE_TYPES } from "../../../../constants/code-table-types";

type Props = {
  type: string;
  complaint: AllegationComplaint;
};

export const AllegationComplaintListItem: FC<Props> = ({ type, complaint }) => {
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [isExpandedClass, setIsExpandedClass] = useState("");

  const {
    id,
    reportedOn,
    updatedOn,
    details,
    status,
    ownedBy,
    violation,
    isInProgress,
    locationDetail,
    locationSummary,
    delegates,
    organization: { area: locationCode, zone },
  } = complaint;

  const getLocationName = (input: string): string => {
    const code = areaCodes.find((item) => item.area === input);
    return code.areaName;
  };

  const getStatusDescription = (input: string): string => {
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code.longDescription;
  };

  const getViolationDescription = (input: string): string => {
    const code = violationCodes.find((item) => item.violation === input);
    return code.longDescription;
  };

  const getOfficerAssigned = (): string => {
    const officer = delegates.find((item) => item.type === "ASSIGNEE");
    if (officer) {
      const {
        person: { firstName, lastName },
      } = officer;

      const firstInitial = firstName.length > 0 ? firstName.substring(0, 1) : "";

      return firstInitial.length > 0 ? `${firstInitial}. ${lastName}` : lastName;
    }

    return "";
  };

  const getOfficerAssignedInitials = () => {
    const officer = delegates.find((item) => item.type === "ASSIGNEE");
    if (officer) {
      const {
        person: { firstName, lastName },
      } = officer;

      const firstInitial = firstName.length > 0 ? firstName.substring(0, 1) : "";
      const lastInitial = lastName.length > 0 ? lastName.substring(0, 1) : "";
      const initials = firstInitial + lastInitial;

      return initials;
    }

    return "";
  };

  const reportedOnDateTime = formatDateTime(reportedOn.toString());
  const updatedOnDateTime = formatDateTime(updatedOn.toString());

  const location = getLocationName(locationCode);

  const statusButtonClass = status === "CLOSED" ? "badge comp-status-badge-closed" : "badge comp-status-badge-open";

  const inProgressFlag = isInProgress ? "In Progress" : "";

  const toggleExpand = () => {
    if (isExpanded) {
      // remove the hover state on parent row if the row is collapsed
      toggleHoverState(false);
      setIsExpandedClass("");
    } else {
      setIsExpandedClass("comp-cell-parent-expanded");
    }

    setIsExpanded(!isExpanded);
  };

  const toggleHoverState = (state: boolean) => {
    setIsRowHovered(state);
  };

  const truncatedComplaintDetailText = truncateString(details, 185);
  const truncatedLocationDetailedText = truncateString(locationDetail, 220);

  return (
    <>
      <tr
        key={id}
        className={`${isExpandedClass} ${isRowHovered ? "comp-table-row-hover-style" : ""}`}
      >
        <td
          className={`comp-cell-width-100 sticky-col sticky-col--left incident-col ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <Link
            to={`/complaint/ERS/${id}`}
            id={id}
          >
            {id}
          </Link>
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {reportedOnDateTime}
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {getViolationDescription(violation)}
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {isInProgress && (
            <div
              id="comp-details-status-text-id"
              className="comp-box-violation-in-progress"
            >
              <FontAwesomeIcon
                id="violation-in-progress-icon"
                className="comp-cell-violation-in-progress-icon"
                icon={faExclamationCircle}
              />
              {inProgressFlag}
            </div>
          )}
        </td>
        <td
          className={`sortableHeader ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {location}
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {locationSummary}
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <div className={statusButtonClass}>{getStatusDescription(status)}</div>
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <div
            data-initials-listview={getOfficerAssignedInitials()}
            className="comp-profile-avatar"
          ></div>
          {getOfficerAssigned()}
        </td>
        <td className={`${isExpandedClass}`}>{updatedOnDateTime}</td>
        <td className={`comp-cell-width-110 sticky-col sticky-col--right actions-col ${isExpandedClass}`}>
          <ComplaintActionItems
            complaint_identifier={id}
            complaint_type={type}
            zone={zone ?? ""}
            agency_code={ownedBy}
          />
        </td>
      </tr>
      {isExpanded && (
        <tr
          onMouseEnter={() => toggleHoverState(true)}
          onMouseLeave={() => toggleHoverState(false)}
        >
          <td className="comp-cell-width-110 comp-cell-child-expanded sticky-col sticky-col--left"></td>
          <td
            onClick={toggleExpand}
            colSpan={8}
            className="comp-cell-child-expanded"
          >
            <dl className="hwc-table-dl">
              <div>
                <dt>Complaint Description</dt>
                <dd>{truncatedComplaintDetailText}</dd>
              </div>
            </dl>

            <dl className="hwc-table-dl">
              <div>
                <dt>Location Description</dt>
                {truncatedLocationDetailedText ? (
                  <dd>{truncatedLocationDetailedText}</dd>
                ) : (
                  <dd>No location description provided</dd>
                )}
              </div>
            </dl>
          </td>
          <td className={`comp-cell-width-110 comp-cell-child-expanded sticky-col sticky-col--right actions-col`}></td>
        </tr>
      )}
    </>
  );
};
