import { FC, useState } from "react";
import { applyStatusClass, formatDateTime, truncateString } from "@common/methods";
import { Link } from "react-router-dom";
import { ComplaintActionItems } from "./complaint-action-items";
import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { useAppSelector } from "@hooks/hooks";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";
import { Badge } from "react-bootstrap";
import getOfficerAssigned from "@common/get-officer-assigned";
import { getUserAgency } from "@/app/service/user-service";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { usePark } from "@/app/hooks/usePark";
import { selectOfficers } from "@store/reducers/officer";

type Props = {
  type: string;
  complaint: WildlifeComplaint;
};

export const WildlifeComplaintListItem: FC<Props> = ({ type, complaint }) => {
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const speciesCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.SPECIES));
  const officers = useAppSelector(selectOfficers);

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
    parkGuid,
    organization: { areaName: location, zone },
  } = complaint;

  const userAgency = getUserAgency();
  const derivedWildlifeStatus = ownedBy !== userAgency ? "Referred" : status;
  const park = usePark(parkGuid);
  const parkAreaGuids = park?.parkAreas?.map((area) => area.parkAreaGuid) ?? [];

  const getStatusDescription = (input: string): string => {
    if (input === "Referred") {
      return "Referred";
    }
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

  const reportedOnDateTime = formatDateTime(reportedOn.toString());
  const updatedOnDateTime = formatDateTime(updatedOn?.toString());

  const natureCode = getNatureOfComplaint(natureOfComplaint);
  const species = getSpecies(speciesCode);

  const statusButtonClass = `badge ${applyStatusClass(derivedWildlifeStatus)}`;

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
          className={`comp-cell-width-110 sticky-col sticky-col--left text-center ${isExpandedClass}`}
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
          className={`comp-cell-width-160 comp-cell-min-width-160 hwc-table-date-cell ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {reportedOnDateTime}
        </td>
        <td
          className={`hwc-nature-of-complaint-cell ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {natureCode}
        </td>
        <td
          className={`comp-cell-width-130 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <Badge bg="species-badge comp-species-badge">{species}</Badge>
        </td>
        <td
          className={`comp-cell-width-165 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {location}
        </td>
        <FeatureFlag feature={FEATURE_TYPES.PARK_COLUMN}>
          <td
            className={`${isExpandedClass}`}
            onClick={toggleExpand}
          >
            {park?.name}
          </td>
        </FeatureFlag>
        <FeatureFlag feature={FEATURE_TYPES.LOCATION_COLUMN}>
          <td
            className={`${isExpandedClass}`}
            onClick={toggleExpand}
          >
            {locationSummary}
          </td>
        </FeatureFlag>
        <td
          className={`comp-cell-width-75 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <div className={statusButtonClass}>{getStatusDescription(derivedWildlifeStatus)}</div>
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {getOfficerAssigned(complaint, officers)}
        </td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 hwc-table-date-cell ${isExpandedClass}`}>
          {updatedOnDateTime}
        </td>
        <td
          className={`comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col hwc-table-actions-cell ${isExpandedClass}`}
        >
          <ComplaintActionItems
            complaint_identifier={id}
            complaint_type={type}
            zone={zone ?? ""}
            agency_code={ownedBy}
            complaint_status={derivedWildlifeStatus}
            park_area_guids={parkAreaGuids}
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
                <dt>Complaint description</dt>
                <dd>{truncatedComplaintDetailText}</dd>
              </div>
            </dl>

            <dl className="hwc-table-dl">
              <div>
                <dt>Location description</dt>
                {truncatedLocationDetailedText ? (
                  <dd>{truncatedLocationDetailedText}</dd>
                ) : (
                  <dd>No location description provided</dd>
                )}
              </div>
            </dl>
          </td>
          <td
            className={`comp-cell-width-90 comp-cell-min-width-90 comp-cell-child-expanded sticky-col sticky-col--right actions-col`}
          ></td>
        </tr>
      )}
    </>
  );
};
