import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintCallerInformation } from "../../../../store/reducers/complaints";
import { formatPhoneNumber } from "react-phone-number-input/input";


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
    <div className="comp-complaint-details-block">
      <h6>Caller Information</h6>
      <div className="comp-complaint-call-information">
        <Row>
          <Col md="6">
            <div>
              <div className="comp-details-content-label">Name</div>
              <div className="comp-details-content">{name}</div>
            </div>
            <div>
              <div className="comp-details-content-label">Primary Phone</div>
              <div className="comp-details-content">{formatPhoneNumber((primaryPhone !== undefined ? primaryPhone : ""))}</div>
            </div>
            <div>
              <div className="comp-details-content-label">
                Alternate 1 Phone
              </div>
              <div className="comp-details-content">{formatPhoneNumber((secondaryPhone !== undefined ? secondaryPhone : ""))}</div>
            </div>
            <div>
              <div className="comp-details-content-label">
                Alternate 2 Phone
              </div>
              <div className="comp-details-content">{formatPhoneNumber((alternatePhone !== undefined ? alternatePhone : ""))}</div>
            </div>
          </Col>
          <Col md="6">
            <div>
              <div className="comp-details-content-label">Address</div>
              <div className="comp-details-content">{address}</div>
            </div>
            <div>
              <div className="comp-details-content-label">Email</div>
              <div className="comp-details-content">{email}</div>
            </div>
            <div>
              <div className="comp-details-content-label">
                Referred by / Complaint Agency
              </div>
              <div className="comp-details-content">{referredByAgencyCode?.long_description}</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
