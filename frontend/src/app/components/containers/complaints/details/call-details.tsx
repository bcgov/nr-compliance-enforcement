import { FC } from "react";
import { Row, Col } from "react-bootstrap";

export const CallDetails: FC = () => {
  return (
    <div style={{ marginLeft: "24px", marginRight: "24px" }}>
      Call Details
      <div
        style={{
          border: "1px solid black",
          borderRadius: "3px",
          padding: "18px",
        }}
      >
        <Row>
          <Col md="6">
            complaint description
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
          </Col>
          <Col md="6">complaint location</Col>
        </Row>
      </div>
    </div>
  );
};
