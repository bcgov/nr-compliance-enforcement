import { FC } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import logo from "../../assets/images/BCID_H_rgb_rev.png";

export const ColorReference: FC = () => {
  const primaryVariants: string[] = [
    "doc-bg-bc-gov-primary-100",
    "doc-bg-bc-gov-primary-200",
    "doc-bg-bc-gov-primary-300",
    "doc-bg-bc-gov-primary-400",
    "doc-bg-bc-gov-primary-500",
    "doc-bg-bc-gov-primary-600",
    "doc-bg-bc-gov-primary-700",
  ];

  const secondaryVariants: string[] = [
    "doc-bg-bc-gov-secondary-100",
    "doc-bg-bc-gov-secondary-200",
    "doc-bg-bc-gov-secondary-300",
    "doc-bg-bc-gov-secondary-400",
    "doc-bg-bc-gov-secondary-500",
    "doc-bg-bc-gov-secondary-600",
    "doc-bg-bc-gov-secondary-700",
  ];

  const successVariants: string[] = [
    "doc-bg-bc-gov-success-100",
    "doc-bg-bc-gov-success-200",
    "doc-bg-bc-gov-success-300",
    "doc-bg-bc-gov-success-400",
    "doc-bg-bc-gov-success-500",
  ];

  const dangerVariants: string[] = [
    "doc-bg-bc-gov-danger-100",
    "doc-bg-bc-gov-danger-200",
    "doc-bg-bc-gov-danger-300",
    "doc-bg-bc-gov-danger-400",
  ];

  const warningVariants: string[] = [
    "doc-bg-bc-gov-warning-100",
    "doc-bg-bc-gov-warning-200",
    "doc-bg-bc-gov-warning-300",
  ];

  const grayVariants: string[] = [
    "doc-bg-gray-100",
    "doc-bg-gray-200",
    "doc-bg-gray-300",
    "doc-bg-gray-400",
    "doc-bg-gray-500",
    "doc-bg-gray-600",
    "doc-bg-gray-700",
    "doc-bg-gray-800",
    "doc-bg-gray-900",
  ];

  const formatVariableName = (name: string): string => {
    return name.replace("doc-bg-", "$");
  };

  return (
    <>
      <Container fluid style={{ backgroundColor: "#F5F5F5" }}>
        <Row
          style={{
            backgroundColor: "#004968",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "96px",
            gap: "10px",
            height: "461px",
          }}
        >
          <Col
            md={12}
            style={{
              backgroundColor: "#004968",
              color: "white",
              fontFamily: "BC Sans",
              fontStyle: "normal",

              fontSize: "18px",
              lineHeight: "25px",
            }}
          >
            <img style={{ height: "53px" }} src={logo} alt="logo" /> Ministry of
            Environment and Climate Change Strategy
          </Col>
          <Col md={12}>
            <h1 style={{ fontSize: "96px", color: "white" }}>
              B.C. Gov Design System
            </h1>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h2>Colors</h2>
            <Card>
              <Card.Header>Primary Theme</Card.Header>
              <Card.Body>
                <Row>
                  <Col
                    className="bg-primary text-white"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                    }}
                  >
                    Primary
                  </Col>
                  <Col
                    className="bg-secondary tetx-dark"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                    }}
                  >
                    Secondary
                  </Col>
                  <Col
                    className="bg-success text-white"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                    }}
                  >
                    Success
                  </Col>
                </Row>
                <Row>
                  <Col
                    className="bg-danger text-white"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                    }}
                  >
                    Danger
                  </Col>
                  <Col
                    className="bg-warning text-dark"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                    }}
                  >
                    Warning
                  </Col>
                  <Col
                    className="bg-info text-dark"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                    }}
                  >
                    Info
                  </Col>
                </Row>
                <Row>
                  <Col
                    md={4}
                    className="bg-dark text-white"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                    }}
                  >
                    Dark
                  </Col>
                  <Col
                    md={4}
                    className="bg-white text-dark"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      margin: "8px",
                      height: "56px",
                      width: "32%",
                      border: "1px solid black",
                    }}
                  >
                    White
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <Card>
              <Card.Header>Color Pallet</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    {primaryVariants.map((item) => {
                      return (
                        <div className={`p-3 ${item}`}>
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {secondaryVariants.map((item) => {
                      return (
                        <div className={`p-3 ${item}`}>
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {successVariants.map((item) => {
                      return (
                        <div className={`p-3 ${item}`}>
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    {dangerVariants.map((item) => {
                      return (
                        <div className={`p-3 ${item}`}>
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {warningVariants.map((item) => {
                      return (
                        <div className={`p-3 ${item}`}>
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {grayVariants.map((item) => {
                      return (
                        <div className={`p-3 ${item}`}>
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
