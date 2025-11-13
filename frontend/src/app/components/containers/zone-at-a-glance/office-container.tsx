import { FC } from "react";
import { OfficeUserContainer } from "./office-user-container";
import { Row, Col } from "react-bootstrap";
import { OfficeStats } from "@apptypes/complaints/zone-at-a-glance-stats";
import { useCollapse } from "react-collapsed";
import chevronDown from "@assets/images/chevron-down.png";
import chevronUp from "@assets/images/chevron-up.png";
import { useAppSelector } from "@hooks/hooks";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { isFeatureActive } from "@store/reducers/app";

type Props = {
  hwcrOpenComplaintsOfficeStat: OfficeStats;
  allegationOpenComplaintsOfficeStat: OfficeStats;
};
export const OfficeContainer: FC<Props> = ({ hwcrOpenComplaintsOfficeStat, allegationOpenComplaintsOfficeStat }) => {
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  let hwcrUnassigned: number = 0;
  let hwcrUnassignedStyle: { width: string } = { width: "49%" };
  let hwcrAssigned: number = 0;
  let hwcrAssignedStyle: { width: string } = { width: "49%" };

  let allegationUnassigned: number = 0;
  let allegationUnassignedStyle: { width: string } = { width: "49%" };
  let allegationAssigned: number = 0;
  let allegationAssignedStyle: { width: string } = { width: "49%" };

  if (
    hwcrOpenComplaintsOfficeStat?.appUsers !== undefined &&
    allegationOpenComplaintsOfficeStat?.appUsers !== undefined
  ) {
    if (hwcrOpenComplaintsOfficeStat.assigned === 0 && hwcrOpenComplaintsOfficeStat.unassigned !== 0) {
      hwcrUnassigned = hwcrOpenComplaintsOfficeStat.unassigned;
      hwcrUnassignedStyle = { width: "93%" };
      hwcrAssignedStyle = { width: "5%" };
    } else if (hwcrOpenComplaintsOfficeStat.assigned !== 0 && hwcrOpenComplaintsOfficeStat.unassigned === 0) {
      hwcrUnassignedStyle = { width: "5%" };
      hwcrAssigned = hwcrOpenComplaintsOfficeStat.assigned;
      hwcrAssignedStyle = { width: "93%" };
    } else if (hwcrOpenComplaintsOfficeStat.assigned !== 0 && hwcrOpenComplaintsOfficeStat.unassigned !== 0) {
      hwcrAssigned = hwcrOpenComplaintsOfficeStat.assigned;
      hwcrAssignedStyle = {
        width:
          Math.round(
            (hwcrOpenComplaintsOfficeStat.assigned /
              (hwcrOpenComplaintsOfficeStat.assigned + hwcrOpenComplaintsOfficeStat.unassigned)) *
              100,
          ) -
          1 +
          "%",
      };
      hwcrUnassigned = hwcrOpenComplaintsOfficeStat.unassigned;
      hwcrUnassignedStyle = {
        width:
          100 -
          Math.round(
            (hwcrOpenComplaintsOfficeStat.assigned /
              (hwcrOpenComplaintsOfficeStat.assigned + hwcrOpenComplaintsOfficeStat.unassigned)) *
              100,
          ) -
          1 +
          "%",
      };
    }
    if (allegationOpenComplaintsOfficeStat.assigned === 0 && allegationOpenComplaintsOfficeStat.unassigned !== 0) {
      allegationUnassigned = allegationOpenComplaintsOfficeStat.unassigned;
      allegationUnassignedStyle = { width: "93%" };
      allegationAssignedStyle = { width: "5%" };
    } else if (
      allegationOpenComplaintsOfficeStat.assigned !== 0 &&
      allegationOpenComplaintsOfficeStat.unassigned === 0
    ) {
      allegationUnassignedStyle = { width: "5%" };
      allegationAssigned = allegationOpenComplaintsOfficeStat.assigned;
      allegationAssignedStyle = { width: "93%" };
    } else if (
      allegationOpenComplaintsOfficeStat.assigned !== 0 &&
      allegationOpenComplaintsOfficeStat.unassigned !== 0
    ) {
      allegationAssigned = allegationOpenComplaintsOfficeStat.assigned;
      allegationAssignedStyle = {
        width:
          Math.round(
            (allegationOpenComplaintsOfficeStat.assigned /
              (allegationOpenComplaintsOfficeStat.assigned + allegationOpenComplaintsOfficeStat.unassigned)) *
              100,
          ) -
          1 +
          "%",
      };
      allegationUnassigned = allegationOpenComplaintsOfficeStat.unassigned;
      allegationUnassignedStyle = {
        width:
          100 -
          Math.round(
            (allegationOpenComplaintsOfficeStat.assigned /
              (allegationOpenComplaintsOfficeStat.assigned + allegationOpenComplaintsOfficeStat.unassigned)) *
              100,
          ) -
          1 +
          "%",
      };
    }

    return (
      <div className="comp-zag-office-container">
        <Row className="comp-zag-flex-container">
          <Col className="comp-zag-office">
            <div
              className="ms-auto left-float"
              {...getToggleProps({
                id: hwcrOpenComplaintsOfficeStat.name + " chevron",
              })}
            >
              <img
                src={isExpanded ? chevronDown : chevronUp}
                alt="chevron"
              />
            </div>
            <div
              id={hwcrOpenComplaintsOfficeStat.name + " Office"}
              className="left-float comp-padding-left-md"
            >
              {hwcrOpenComplaintsOfficeStat.name + " Office"}
            </div>
          </Col>
          <Col className="comp-padding-left-md">
            <div className="comp-zag-stats-title">Human Wildlife Conflict</div>
            <div className="comp-zag-bar-spacing">
              <div
                className="comp-zag-float-bar hwcr-unassigned"
                style={hwcrUnassignedStyle}
              >
                <div className="comp-zag-bar-text">{hwcrUnassigned}</div>
              </div>
              <div className="comp-zag-float-bar comp-zag-bar-spacer"></div>
              <div
                className="comp-zag-float-bar hwcr-assigned"
                style={hwcrAssignedStyle}
              >
                <div className="comp-zag-bar-text">{hwcrAssigned}</div>
              </div>
              <div className="clear-left-float" />
            </div>
            {showExperimentalFeature && <div className="comp-zag-stats-view">View Unassigned Compaints</div>}
          </Col>
          <Col className="comp-padding-left-md negative-office-margin">
            <div className="comp-zag-stats-title">Enforcement</div>
            <div className="comp-zag-bar-spacing">
              <div
                className="comp-zag-float-bar allegation-unassigned"
                style={allegationUnassignedStyle}
              >
                <div className="comp-zag-bar-text">{allegationUnassigned}</div>
              </div>
              <div className="comp-zag-float-bar comp-zag-bar-spacer"></div>
              <div
                className="comp-zag-float-bar allegation-assigned"
                style={allegationAssignedStyle}
              >
                <div className="comp-zag-bar-text">{allegationAssigned}</div>
              </div>
              <div className="clear-left-float" />
            </div>
            {showExperimentalFeature && <div className="comp-zag-stats-view">View Unassigned Compaints</div>}
          </Col>
        </Row>
        <div className="collapsible">
          <div {...getCollapseProps({ id: hwcrOpenComplaintsOfficeStat.name })}>
            <OfficeUserContainer
              hwcrOfficers={hwcrOpenComplaintsOfficeStat.appUsers}
              allegationOfficers={allegationOpenComplaintsOfficeStat.appUsers}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
