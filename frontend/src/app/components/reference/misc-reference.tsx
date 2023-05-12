import { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReferenceHeader } from "./reference-header";

export const MiscReference: FC = () => {
  return (
    <>
      <Container fluid style={{ backgroundColor: "#F5F5F5" }}>
        <ReferenceHeader title="B.C. Gov Design System: Misc" />
        <Row>
          <Col className="comp-mb-s">
            <h2>How it works</h2>
            <p>
              Assign responsive-friendly margin or padding values to an element
              or a subset of its sides with shorthand classes. Includes support
              for individual properties, all properties, and vertical and
              horizontal properties. Classes are built from a custom Sass map
              ranging from 4px to 48px
            </p>
            <div
              style={{
                width: "460px",
                height: "172px",
                border: "1px solid black",
              }}
              className="shadow comp-mb-l "
            >
              <div className="p-2">Regular shadow</div>
            </div>
            <div
              style={{
                width: "460px",
                height: "172px",
                border: "1px solid black",
              }}
              className="shadow-sm comp-mb-l"
            >
              <div className="p-2">Small shadow</div>
            </div>
            <div
              style={{
                width: "460px",
                height: "172px",
                border: "1px solid black",
              }}
              className="shadow-lg"
            >
              <div className="p-2">Large shadow</div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
