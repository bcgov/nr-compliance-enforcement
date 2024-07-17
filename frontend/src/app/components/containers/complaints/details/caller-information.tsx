import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintCallerInformation } from "../../../../store/reducers/complaints";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { Card, Col, Row } from "react-bootstrap";

export const CallerInformation: FC = () => {
  const { name, primaryPhone, secondaryPhone, alternatePhone, address, email, reportedByCode } = useAppSelector(
    selectComplaintCallerInformation,
  );

  return (
    <section className="comp-details-section">
      <Card>
        <Card.Body>
          <Card.Title as="h3">Caller Information</Card.Title>
          <Row as="dl">
            <Col
              xs={12}
              md={4}
            >
              <dt>Name</dt>
              <dd id="comp-details-name">{name}</dd>
            </Col>
            <Col
              xs={12}
              md={4}
            >
              <dt>Email</dt>
              <dd id="comp-details-email">{email}</dd>
            </Col>
            <Col
              xs={12}
              md={4}
            >
              <dt>Organization Reporting the Complaint</dt>
              <dd id="comp-details-reported">{reportedByCode?.longDescription}</dd>
            </Col>
            <Col
              xs={12}
              md={4}
            >
              <dt>Primary Phone</dt>
              <dd id="comp-details-phone">{formatPhoneNumber(primaryPhone !== undefined ? primaryPhone : "")}</dd>
            </Col>
            <Col
              xs={12}
              md={4}
            >
              <dt>Alternative Phone 1</dt>
              <dd id="comp-details-phone-1">{formatPhoneNumber(secondaryPhone !== undefined ? secondaryPhone : "")}</dd>
            </Col>
            <Col
              xs={12}
              md={4}
            >
              <dt>Alternative Phone 2</dt>
              <dd id="comp-details-phone-2">{formatPhoneNumber(alternatePhone !== undefined ? alternatePhone : "")}</dd>
            </Col>
            <Col
              xs={12}
              md={4}
            >
              <dt>Address</dt>
              <dd id="comp-details-address">{address}</dd>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </section>
  );
};
