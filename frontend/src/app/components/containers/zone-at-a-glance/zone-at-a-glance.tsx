import { OfficesContainer } from "./offices-container";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { profileZone } from "@store/reducers/app";
import { OpenComplaints } from "./open-complaints";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { Row, Col } from "react-bootstrap";
import {
  getZoneAtAGlanceStats,
  selectAllegationZagOpenComplaints,
  selectWildlifeZagOpenComplaints,
} from "@store/reducers/complaints";
import ComplaintType from "@constants/complaint-types";

export const ZoneAtAGlance: FC = () => {
  const dispatch = useAppDispatch();
  const currentZone = useAppSelector<string>(profileZone);
  const hwcrOpenComplaints = useAppSelector(selectWildlifeZagOpenComplaints);
  const allegationOpenComplaints = useAppSelector(selectAllegationZagOpenComplaints);

  useEffect(() => {
    if (currentZone) {
      dispatch(getZoneAtAGlanceStats(currentZone, ComplaintType.HWCR_COMPLAINT));
      dispatch(getZoneAtAGlanceStats(currentZone, ComplaintType.ALLEGATION_COMPLAINT));
    }
  }, [dispatch, currentZone]);

  const bannerSource = `/images/zone-at-a-glance/zones/${currentZone}.svg`;

  return (
    <div className="comp-page-container">
      <div className="comp-page-title-container">
        <h1 className="mb-4">Zone At a Glance</h1>
      </div>
      <div className="comp-zag-container">
        <div className="comp-zag-banner">
          <img
            src={bannerSource}
            alt=""
            width="355px"
            height="176px"
          />
        </div>
        <div className="comp-zag-charts comp-padding-left-md">
          <h6 className="comp-margin-top-xs">Open Complaints</h6>

          <Row>
            <Col md="6">
              <OpenComplaints
                assigned={hwcrOpenComplaints.assigned}
                unassigned={hwcrOpenComplaints.unassigned}
                background={{
                  assignedColor: "#31ba9a",
                  unassignedColor: "#5EDBBE",
                }}
                type={COMPLAINT_TYPES.HWCR}
              />
            </Col>
            <Col md="6">
              <OpenComplaints
                assigned={allegationOpenComplaints.assigned}
                unassigned={allegationOpenComplaints.unassigned}
                background={{
                  assignedColor: "#ECC51D",
                  unassignedColor: "#F4DC77",
                }}
                type={COMPLAINT_TYPES.ERS}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <OfficesContainer
          hwcrOpenComplaintsOfficeStats={hwcrOpenComplaints.offices}
          allegationOpenComplaintsOfficeStats={allegationOpenComplaints.offices}
        />
      </div>
    </div>
  );
};
