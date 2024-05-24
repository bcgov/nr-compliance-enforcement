import { FC, useState } from "react";
import { applyStatusClass, formatDateTime, truncateString } from "../../../../common/methods";
import { Link } from "react-router-dom";
import { ComplaintActionItems } from "./complaint-action-items";
import { WildlifeComplaint } from "../../../../types/app/complaints/wildlife-complaint";
import { useAppSelector } from "../../../../hooks/hooks";
import { CODE_TABLE_TYPES } from "../../../../constants/code-table-types";
import { selectCodeTable } from "../../../../store/reducers/code-table";
import { Badge } from "react-bootstrap";

type Props = {
  type: string;
  complaint: WildlifeComplaint;
};

export const WildlifeComplaintListItem: FC<Props> = ({ type, complaint }) => {
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const speciesCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.SPECIES));

  const [isExpanded, setIsExpanded] = useState(false); // used to indicate if the row is in an expanded state or not (row is expanded/contracted when click)
  const [isRowHovered, setIsRowHovered] = useState(false); // we want to apply the hover highlighting to the parent row when the expanded child row is hovered over
  const [isExpandedClass, setIsExpandedClass] = useState("");

  const {
    id,
    reportedOn,
    updatedOn,
    details,
    status,
    ownedBy,
    natureOfComplaint,
    species: speciesCode,
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

  const getNatureOfComplaint = (input: string): string => {
    const code = natureOfComplaints.find((item) => item.natureOfComplaint === input);
    return code.longDescription;
  };

  const getSpecies = (input: string): string => {
    const code = speciesCodes.find((item) => item.species === input);
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

  const natureCode = getNatureOfComplaint(natureOfComplaint);
  const species = getSpecies(speciesCode);

  const location = getLocationName(locationCode);

  const statusButtonClass = `badge ${applyStatusClass(status)}`;

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

  const truncatedComplaintDetailText = truncateString(details, 205);
  const truncatedLocationDetailedText = truncateString(locationDetail, 220);

  return (
    <>
      <tr
        key={id}
        className={`${isExpandedClass} ${isRowHovered ? "comp-table-row-hover-style" : ""}`}
      >
        <td
          className={`comp-cell-width-95 sticky-col sticky-col--left incident-col ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <Link
            to={`/complaint/HWCR/${id}`}
            id={id}
          >
            {id}
          </Link>
        </td>
        <td
          className={`comp-cell-width-95 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {reportedOnDateTime}
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
          <Badge bg="species-badge">{species}</Badge>
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
          <div className={statusButtonClass}>{getStatusDescription(status)}</div>
        </td>
        <td
          className={`comp-cell-width-130 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <div
            data-initials-listview={getOfficerAssignedInitials()}
            className="comp-profile-avatar"
          ></div>
          {getOfficerAssigned()}
        </td>
        <td className={`comp-cell-width-110 ${isExpandedClass}`}>{updatedOnDateTime}</td>
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
