import { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReferenceHeader } from "./reference-header";

export const MiscReference: FC = () => {
  const orientations: string[] = ["top", "right", "left", "bottom"];

  const borderUnits: { unit: string; size: string }[] = [
    { unit: "xs", size: "1px" },
    { unit: "sm", size: "2px" },
    { unit: "md", size: "4px" },
    { unit: "lg", size: "8px" },
    { unit: "xl", size: "16px" },
    { unit: "xxl", size: "32px" },
  ];

  return (
    <>
      <Container
        fluid
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <ReferenceHeader title="B.C. Gov Design System: Misc" />
        <Row>
          <Col className="comp-margin-bottom-sm comp-padding-top-sm">
            <h2>Shadows</h2>
            <p>Shadows can be set using the following bootstrap classes. These have been customized</p>
            <Row>
              <Col>
                <div
                  style={{
                    height: "172px",
                    border: "1px solid black",
                  }}
                  className="shadow comp-margin-bottom-lg "
                >
                  <div className="p-2">Regular shadow</div>
                  <code className="p-2">.shadow</code>
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    height: "172px",
                    border: "1px solid black",
                  }}
                  className="shadow-sm comp-margin-bottom-lg"
                >
                  <div className="p-2">Small shadow</div>
                  <code className="p-2">.shadow-sm</code>
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    height: "172px",
                    border: "1px solid black",
                  }}
                  className="shadow-lg"
                >
                  <div className="p-2">Large shadow</div>
                  <code className="p-2">.shadow-lg</code>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="comp-margin-bottom-sm">
            <h2>Borders</h2>
            <p>
              Borders can set per orientation or on all sides by using the following classes{" "}
              <code>.comp-border-$size </code> or <code>.comp-border-$orientation-$size</code>
            </p>
            <p>
              the foloowing units are defined in the <code>$border-units</code> sass map{" "}
              <code>{JSON.stringify(borderUnits)}</code>
            </p>
            <Row>
              {orientations.map((orientation) => {
                return (
                  <Col
                    md={3}
                    className="comp-margin-bottom-sm "
                  >
                    {borderUnits.map(({ unit, size }, idx) => {
                      return (
                        <div
                          className={`comp-border-${orientation}-${unit} comp-margin-top-sm`}
                          key={idx}
                        >
                          {`.comp-border-${orientation}-${unit}`}
                        </div>
                      );
                    })}
                  </Col>
                );
              })}
              <Col md={3}>
                {borderUnits.map(({ unit, size }, idx) => {
                  return (
                    <>
                      <div
                        className={`comp-border-${unit} comp-margin-top-sm comp-padding-xs`}
                        key={idx}
                      >
                        {`.comp-border-${unit}`}
                      </div>
                    </>
                  );
                })}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};
