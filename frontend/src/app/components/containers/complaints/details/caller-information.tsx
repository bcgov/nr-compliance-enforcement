import { FC } from "react";
import { Row, Col } from "react-bootstrap";

export const CallerInformation: FC = () => {
  return (
    <div className="comp-complaint-caller-information-container">
      <h6>Caller Information</h6>
      <div className="comp-complaint-caller-information">
        <Row>
          <Col md="6">
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Name</span>
              <span className="comp-complaint-incident-time">
                First Name Last Name
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Primary Phone</span>
              <span className="comp-complaint-incident-time">250-555-1234</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Secondary Phone</span>
              <span className="comp-complaint-incident-time">250-555-1234</span>
            </div>
          </Col>
          <Col md="6">
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Address</span>
              <span className="comp-complaint-incident-time">
                123 Street Ave, Victoria, British Columbia
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Email</span>
              <span className="comp-complaint-incident-time">
                test@test.com
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">
                Referred by / Complaint Agency
              </span>
              <span className="comp-complaint-incident-time">Agency Name</span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
