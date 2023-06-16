import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintCallerInformation } from "../../../../store/reducers/hwcr-complaints";

export const CallerInformation: FC = () => {
  const {
    name,
    primaryPhone,
    secondaryPhone,
    alternatePhone,
    address,
    email,
    referredByAgencyCode,
  } = useAppSelector(selectComplaintCallerInformation);

  return (
    <div className="comp-complaint-caller-information-container">
      <h6>Caller Information</h6>
      <div className="comp-complaint-caller-information">
        <Row>
          <Col md="6">
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Name</span>
              <span className="comp-complaint-incident-time">{name}</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Primary Phone</span>
              <span className="comp-complaint-incident-time">
                {primaryPhone}
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Alternate 1 Phone</span>
              <span className="comp-complaint-incident-time">
                {secondaryPhone}
              </span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Alternate 2 Phone</span>
              <span className="comp-complaint-incident-time">
                {alternatePhone}
              </span>
            </div>
          </Col>
          <Col md="6">
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Address</span>
              <span className="comp-complaint-incident-time">{address}</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">Email</span>
              <span className="comp-complaint-incident-time">{email}</span>
            </div>
            <div className="comp-complaint-section">
              <span className="comp-complaint-label">
                Referred by / Complaint Agency
              </span>
              <span className="comp-complaint-incident-time">
                {referredByAgencyCode}
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
