import { FC, useState } from "react";
import { applyStatusClass, formatDateTime, truncateString } from "@common/methods";
import { Link } from "react-router-dom";
import { useAppSelector } from "@hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { getUserAgency } from "@/app/service/user-service";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { complaintTypeToName } from "@apptypes/app/complaint-types";

type Props = {
  complaint: any;
};

export const SectorComplaintListItem: FC<Props> = ({ complaint }) => {
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
  const statusCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_STATUS));
  const natureOfComplaints = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.NATURE_OF_COMPLAINT));
  const girTypeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GIR_TYPE));
  const violationCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.VIOLATIONS));
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [isExpandedClass, setIsExpandedClass] = useState("");

  const {
    id,
    reportedOn,
    updatedOn,
    details,
    status,
    type,
    ownedBy,
    locationDetail,
    locationSummary,
    organization: { area: locationCode },
    issueType,
    referralAgency,
  } = complaint;

  const userAgency = getUserAgency();
  const derivedGeneralStatus =
    ownedBy !== userAgency && referralAgency.find((agency: string) => agency === userAgency) ? "Referred" : status;

  const getLocationName = (input: string): string => {
    const code = areaCodes.find((item) => item.area === input);
    return code.areaName;
  };

  const getStatusDescription = (input: string): string => {
    if (input === "Referred") {
      return "Referred";
    }
    const code = statusCodes.find((item) => item.complaintStatus === input);
    return code.longDescription;
  };

  const reportedOnDateTime = formatDateTime(reportedOn.toString());
  const updatedOnDateTime = formatDateTime(updatedOn?.toString());

  const location = getLocationName(locationCode);

  const statusButtonClass = `badge ${applyStatusClass(derivedGeneralStatus)}`;

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

  const getNatureOfComplaint = (input: string): string => {
    const code = natureOfComplaints.find((item) => item.natureOfComplaint === input);
    return code.longDescription;
  };

  const getGirTypeDescription = (input: string): string => {
    const code = girTypeCodes.find((item) => item.girType === input);
    return code.longDescription;
  };

  const getViolationDescription = (input: string): string => {
    const code = violationCodes.find((item) => item.violation === input);
    return code.longDescription;
  };

  return (
    <>
      <tr
        key={id}
        className={`${isExpandedClass} ${isRowHovered ? "comp-table-row-hover-style" : ""}`}
      >
        <td
          className={`comp-cell-width-100 sticky-col sticky-col--left text-center ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <Link
            to={`/complaint/${type}/${id}`}
            id={id}
          >
            {id}
          </Link>
        </td>
        <td
          className={`comp-cell-width-160 comp-cell-min-width-160 gc-table-date-cell ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {reportedOnDateTime}
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {agencies?.length > 0 && agencies.filter((agency: any) => agency.agency === ownedBy)[0]?.longDescription}
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {complaintTypeToName(type)}
        </td>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {type === "HWCR" && getNatureOfComplaint(issueType)}
          {type === "GIR" && getGirTypeDescription(issueType)}
          {type === "ERS" && getViolationDescription(issueType)}
        </td>
        <td
          className={`sortableHeader ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {location}
        </td>
        <FeatureFlag feature={FEATURE_TYPES.LOCATION_COLUMN}>
          <td
            className={`${isExpandedClass}`}
            onClick={toggleExpand}
          >
            {locationSummary}
          </td>
        </FeatureFlag>
        <td
          className={`${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <div className={statusButtonClass}>{getStatusDescription(derivedGeneralStatus)}</div>
        </td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 gc-table-date-cell ${isExpandedClass}`}>
          {updatedOnDateTime}
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
            colSpan={7}
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
            className={`comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col gc-table-actions-cell`}
          ></td>
        </tr>
      )}
    </>
  );
};
