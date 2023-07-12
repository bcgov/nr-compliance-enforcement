import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { profileZone } from "../../../store/reducers/app";
import { getBannerByZone } from "./banner-map";
import { OpenComplaints } from "./open-complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { Row, Col } from "react-bootstrap";
import { getZoneAtAGlanceStats } from "../../../store/reducers/complaints";

export const ZoneAtAGlance: FC = () => {
  const dispatch = useAppDispatch();
  const currentZone = useAppSelector<string>(profileZone);
  let image = getBannerByZone(currentZone);

  useEffect(() => {
    // dispatch(getZoneAtAGlanceStats(currentZone));
  }, [dispatch]);

  return (
    <>
      <div className="comp-sub-header">Zone At a Glance</div>

      <div className="comp-zag-container">
        <div className="comp-zag-banner">
          <img src={image} alt="" width="355px" height="176px" />
        </div>
        <div className="comp-zag-charts comp-padding-left-md">
          <h6 className="comp-margin-top-xs">Open Complaints</h6>

          <Row>
            <Col md="6">
              <OpenComplaints
                assigned={23}
                unassigned={5}
                background={{
                  assignedColor: "#31ba9a",
                  unassignedColor: "#5EDBBE",
                }}
                type={COMPLAINT_TYPES.HWCR}
              />
            </Col>
            <Col md="6">
              <OpenComplaints
                assigned={9}
                unassigned={34}
                background={{
                  assignedColor: "#C4A417",
                  unassignedColor: "#ECC51D",
                }}
                type={COMPLAINT_TYPES.ERS}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
