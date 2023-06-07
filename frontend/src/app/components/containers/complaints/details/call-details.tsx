import { FC } from "react";
import { Row, Col } from "react-bootstrap";

export const CallDetails: FC = () => {
  return (
    <div className="comp-complaint-call-details-container">
      <h6>Call Details</h6>
      <div className="comp-complaint-call-details">
        <Row>
          <Col md="6" style={{ paddingRight: "28px" }}>
            <div className="comp-complaint-label">Complaint Description</div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse ut enim convallis, dapibus diam sed, interdum neque.
              Nulla vulputate ac felis sit amet varius. Nullam pretium non
              tortor eu maximus. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Suspendisse ut enim convallis, dapibus diam sed,
              interdum neque. Nulla vulputate ac felis sit amet varius. Nullam
              pretium non tortor eu maximus. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Suspendisse ut enim convallis,
              dapibus diam sed, interdum neque. Nulla vulputate ac
            </p>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Incident Time</span>
              <span className="comp-complaint-incident-time">
                <i className="bi bi-calendar"></i>08/04/2023{" "}
                <i className="bi bi-clock"></i>2:01:01
              </span>
            </div>

            <div>
              <span className="comp-complaint-label">Attractants</span>
              <span className="comp-complaint-attactants">
                <span className="badge comp-attactant-badge">Open</span>
              </span>
            </div>
          </Col>
          <Col md="6" style={{ paddingLeft: "28px" }}>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Complaint Location</span>
              <span className="comp-complaint-incident-time">
                123 Street Ave, Victoria, British Columbia
              </span>
            </div>
            <div className="comp-complaint-label">Location Description</div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse ut enim convallis, dapibus diam sed, interdum neque.
              Nulla vulputate
            </p>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">X Coordinate</span>
              <span className="comp-complaint-incident-time">12.345678</span>
              <span className="comp-complaint-label">Y Coordinate</span>
              <span className="comp-complaint-incident-time">12.345678</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Area / Community</span>
              <span className="comp-complaint-incident-time">Kelowna</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Office</span>
              <span className="comp-complaint-incident-time">Kelowna</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Zone</span>
              <span className="comp-complaint-incident-time">
                Central Okanagan
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Region</span>
              <span className="comp-complaint-incident-time">Okanagan</span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
