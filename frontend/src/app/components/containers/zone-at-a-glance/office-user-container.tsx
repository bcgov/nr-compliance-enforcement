import { FC } from "react";
import { OfficerStats } from "@apptypes/complaints/zone-at-a-glance-stats";
import { Row, Col } from "react-bootstrap";
import { isFeatureActive } from "@store/reducers/app";
import { useAppSelector } from "@hooks/hooks";
import { FEATURE_TYPES } from "@constants/feature-flag-types";

type Props = {
  hwcrOfficers: OfficerStats[];
  allegationOfficers: OfficerStats[];
};

export const OfficeUserContainer: FC<Props> = ({ hwcrOfficers, allegationOfficers }) => {
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));
  if (
    hwcrOfficers !== undefined &&
    hwcrOfficers.length !== 0 &&
    allegationOfficers !== undefined &&
    allegationOfficers.length !== 0
  ) {
    //NOTE: Have to pull office type into the  object in the future
    return (
      <>
        {hwcrOfficers.map((item, index) => {
          return (
            <div
              key={"officer " + item.name}
              className="comp-zag-officer-container"
            >
              <Row className="comp-zag-flex-container">
                <Col className="comp-zag-office-user comp-zag-officer">
                  <div style={{ float: "left" }}>
                    <div
                      data-initials-zagview={
                        item.name.split(" ")[0].substring(0, 1) + item.name.split(" ")[1].substring(0, 1)
                      }
                      className="data-initials-zagview"
                    ></div>
                  </div>
                  <div className="comp-zag-float-left">
                    <div
                      id={"officerName" + item.name}
                      className="comp-zag-stats-title"
                    >
                      {item.name}
                    </div>
                    {showExperimentalFeature && <div className="comp-zag-stats-view">Conservation Officer</div>}
                  </div>
                  <div className="clear-left-float"></div>
                </Col>
                <Col className="comp-zag-office-user">
                  <div style={{ float: "left" }}>
                    <div
                      data-initials-zagview-hwcr={item.hwcrAssigned}
                      className="data-initials-zagview-hwcr"
                    ></div>
                  </div>
                  <div className="comp-zag-float-left">
                    <div className="comp-zag-stats-title">Human Wildlife Conflict</div>
                    {showExperimentalFeature && <div className="comp-zag-stats-view">View complaints</div>}
                  </div>
                </Col>
                <Col className="comp-zag-office-user">
                  <div style={{ float: "left" }}>
                    <div
                      data-initials-zagview-allegation={allegationOfficers[index].allegationAssigned}
                      className="data-initials-zagview-allegation"
                    ></div>
                  </div>
                  <div className="comp-zag-float-left">
                    <div className="comp-zag-stats-title">Enforcement</div>
                    {showExperimentalFeature && <div className="comp-zag-stats-view">View complaints</div>}
                  </div>
                </Col>
              </Row>
            </div>
          );
        })}
      </>
    );
  } else {
    return <></>;
  }
};
