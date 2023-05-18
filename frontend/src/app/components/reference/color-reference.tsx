import { FC } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ReferenceHeader } from "./reference-header";

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

  const neutralVariants: string[] = [
    "doc-bg-bc-gov-neutral-100",
    "doc-bg-bc-gov-neutral-200",
    "doc-bg-bc-gov-neutral-300",
    "doc-bg-bc-gov-neutral-400",
    "doc-bg-bc-gov-neutral-500",
  ];

  const shadeVariants: string[] = [
    "doc-bg-bc-gov-shade-100",
    "doc-bg-bc-gov-shade-200",
    "doc-bg-bc-gov-shade-300",
  ];

  const bcStandard01Variants: string[] = [
    "doc-bg-bc-standard-01-100",
    "doc-bg-bc-standard-01-200",
    "doc-bg-bc-standard-01-300",
    "doc-bg-bc-standard-01-400",
    "doc-bg-bc-standard-01-500",
    "doc-bg-bc-standard-01-600",
    "doc-bg-bc-standard-01-700",
    "doc-bg-bc-standard-01-800",
    "doc-bg-bc-standard-01-900",
  ];

  const bcStandard02Variants: string[] = [
    "doc-bg-bc-standard-02-100",
    "doc-bg-bc-standard-02-200",
    "doc-bg-bc-standard-02-300",
    "doc-bg-bc-standard-02-400",
    "doc-bg-bc-standard-02-500",
    "doc-bg-bc-standard-02-600",
    "doc-bg-bc-standard-02-700",
    "doc-bg-bc-standard-02-800",
    "doc-bg-bc-standard-02-900",
  ];

  const bcStandard03Variants: string[] = [
    "doc-bg-bc-standard-03-100",
    "doc-bg-bc-standard-03-200",
    "doc-bg-bc-standard-03-300",
    "doc-bg-bc-standard-03-400",
    "doc-bg-bc-standard-03-500",
    "doc-bg-bc-standard-03-600",
    "doc-bg-bc-standard-03-700",
    "doc-bg-bc-standard-03-800",
    "doc-bg-bc-standard-03-900",
  ];

  const bcStandard04Variants: string[] = [
    "doc-bg-bc-standard-04-100",
    "doc-bg-bc-standard-04-200",
    "doc-bg-bc-standard-04-300",
    "doc-bg-bc-standard-04-400",
    "doc-bg-bc-standard-04-500",
    "doc-bg-bc-standard-04-600",
    "doc-bg-bc-standard-04-700",
    "doc-bg-bc-standard-04-800",
    "doc-bg-bc-standard-04-900",
  ];

  const bcStandard05Variants: string[] = [
    "doc-bg-bc-standard-05-100",
    "doc-bg-bc-standard-05-200",
    "doc-bg-bc-standard-05-300",
    "doc-bg-bc-standard-05-400",
    "doc-bg-bc-standard-05-500",
    "doc-bg-bc-standard-05-600",
    "doc-bg-bc-standard-05-700",
    "doc-bg-bc-standard-05-800",
    "doc-bg-bc-standard-05-900",
  ];

  const bcStandard06Variants: string[] = [
    "doc-bg-bc-standard-06-100",
    "doc-bg-bc-standard-06-200",
    "doc-bg-bc-standard-06-300",
    "doc-bg-bc-standard-06-400",
    "doc-bg-bc-standard-06-500",
    "doc-bg-bc-standard-06-600",
    "doc-bg-bc-standard-06-700",
    "doc-bg-bc-standard-06-800",
    "doc-bg-bc-standard-06-900",
  ];

  const bcStandard07Variants: string[] = [
    "doc-bg-bc-standard-07-100",
    "doc-bg-bc-standard-07-200",
    "doc-bg-bc-standard-07-300",
    "doc-bg-bc-standard-07-400",
    "doc-bg-bc-standard-07-500",
    "doc-bg-bc-standard-07-600",
    "doc-bg-bc-standard-07-700",
    "doc-bg-bc-standard-07-800",
    "doc-bg-bc-standard-07-900",
  ];

  const bcStandard08Variants: string[] = [
    "doc-bg-bc-standard-08-100",
    "doc-bg-bc-standard-08-200",
    "doc-bg-bc-standard-08-300",
    "doc-bg-bc-standard-08-400",
    "doc-bg-bc-standard-08-500",
    "doc-bg-bc-standard-08-600",
    "doc-bg-bc-standard-08-700",
    "doc-bg-bc-standard-08-800",
    "doc-bg-bc-standard-08-900",
  ];

  const bcStandard09Variants: string[] = [
    "doc-bg-bc-standard-09-100",
    "doc-bg-bc-standard-09-200",
    "doc-bg-bc-standard-09-300",
    "doc-bg-bc-standard-09-400",
    "doc-bg-bc-standard-09-500",
    "doc-bg-bc-standard-09-600",
    "doc-bg-bc-standard-09-700",
    "doc-bg-bc-standard-09-800",
    "doc-bg-bc-standard-09-900",
  ];

  const bcStandard10Variants: string[] = [
    "doc-bg-bc-standard-10-100",
    "doc-bg-bc-standard-10-200",
    "doc-bg-bc-standard-10-300",
    "doc-bg-bc-standard-10-400",
    "doc-bg-bc-standard-10-500",
    "doc-bg-bc-standard-10-600",
    "doc-bg-bc-standard-10-700",
    "doc-bg-bc-standard-10-800",
    "doc-bg-bc-standard-10-900",
  ];

  const bcStandard11Variants: string[] = [
    "doc-bg-bc-standard-11-100",
    "doc-bg-bc-standard-11-200",
    "doc-bg-bc-standard-11-300",
    "doc-bg-bc-standard-11-400",
    "doc-bg-bc-standard-11-500",
    "doc-bg-bc-standard-11-600",
    "doc-bg-bc-standard-11-700",
    "doc-bg-bc-standard-11-800",
    "doc-bg-bc-standard-11-900",
  ];

  const bcStandard12Variants: string[] = [
    "doc-bg-bc-standard-12-100",
    "doc-bg-bc-standard-12-200",
    "doc-bg-bc-standard-12-300",
    "doc-bg-bc-standard-12-400",
    "doc-bg-bc-standard-12-500",
    "doc-bg-bc-standard-12-600",
    "doc-bg-bc-standard-12-700",
    "doc-bg-bc-standard-12-800",
    "doc-bg-bc-standard-12-900",
  ];

  const bcStandard13Variants: string[] = [
    "doc-bg-bc-standard-13-100",
    "doc-bg-bc-standard-13-200",
    "doc-bg-bc-standard-13-300",
    "doc-bg-bc-standard-13-400",
    "doc-bg-bc-standard-13-500",
    "doc-bg-bc-standard-13-600",
    "doc-bg-bc-standard-13-700",
    "doc-bg-bc-standard-13-800",
    "doc-bg-bc-standard-13-900",
  ];

  const formatVariableName = (name: string): string => {
    return name.replace("doc-bg-", "$");
  };

  const textColor400 = (input: string): string => {
    const tokens = input.split("-");
    let weight: number = parseInt(tokens[tokens.length - 1]);

    return weight >= 400 ? "text-white" : "text-dark";
  };

  const textColor500 = (input: string): string => {
    const tokens = input.split("-");
    let weight: number = parseInt(tokens[tokens.length - 1]);

    return weight >= 500 ? "text-white" : "text-dark";
  };

  const textColor200 = (input: string): string => {
    const tokens = input.split("-");
    let weight: number = parseInt(tokens[tokens.length - 1]);

    return weight >= 200 ? "text-white" : "text-dark";
  };

  const swatch = (color: string, isLightText: boolean): object => {
    return {
      display: "block!important",
      backgroundColor: color,
      color: isLightText ? "white" : "rgb(33, 37, 41)",
    };
  };

  return (
    <>
      <Container fluid style={{ backgroundColor: "#F5F5F5" }}>
        <ReferenceHeader title="B.C. Gov Design System: Colors" />
        <Row>
          <Col md={12}>
            <Card className="comp-mt-m">
              <Card.Header>Bootstrap Primary Theme Colors</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-primary text-white`}>Primary</div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-secondary text-dark`}>
                      Secondary
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-success text-white`}>Success</div>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-danger text-white`}>Danger</div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-warning text-dark`}>Warning</div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-info text-dark`}>Info</div>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-dark text-white`}>Dark</div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      style={{ border: "1px solid black" }}
                      className={`p-3 bg-white text-dark`}
                    >
                      Light
                    </div>
                  </Col>
                  <Col md={4} className="mb-3"></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <Card>
              <Card.Header>BC Brand Colors</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-bc-brand-blue text-light`}>
                      *.bc-brand-blue
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-bc-brand-gold text-light`}>
                      *.bc-brand-gold
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-bc-brand-text text-light`}>
                      *.bc-brand-text
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    <div className={`p-3 bg-bc-brand-links text-light`}>
                      *.bc-brand-links
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className={`p-3 bg-bc-brand-background-blue text-light`}
                    >
                      *.bc-brand-background-blue
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className={`p-3 bg-bc-brand-background-light-gray text-dark`}
                    >
                      *.bc-brand-background-light-gray
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <Card>
              <Card.Header>Boostrap Primary Color Variants</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    {primaryVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {secondaryVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {successVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    {dangerVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {warningVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {grayVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    {neutralVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor500(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    {shadeVariants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor200(item)}`}
                          key={idx}
                        >
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

        <Row className="mt-3">
          <Col md={12}>
            <Card>
              <Card.Header>BC Standard Supplementry Colors</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#004F4B", true)}
                    >
                      <strong className="d-block">$bc-standard-01</strong>
                      #004F4B
                    </div>
                    {bcStandard01Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#20754E", true)}
                    >
                      <strong className="d-block">$bc-standard-02</strong>
                      #20754E
                    </div>
                    {bcStandard02Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>

                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#61A744", true)}
                    >
                      <strong className="d-block">$bc-standard-03</strong>
                      #61A744
                    </div>
                    {bcStandard03Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>

                <Row>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#31BA9A", true)}
                    >
                      <strong className="d-block">$bc-standard-04</strong>
                      #31BA9A
                    </div>
                    {bcStandard04Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#05A6D1", true)}
                    >
                      <strong className="d-block">$bc-standard-05</strong>
                      #05A6D1
                    </div>
                    {bcStandard05Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>

                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#005C98", true)}
                    >
                      <strong className="d-block">$bc-standard-06</strong>
                      #005C98
                    </div>
                    {bcStandard06Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>

                <Row>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#243C7C", true)}
                    >
                      <strong className="d-block">$bc-standard-07</strong>
                      #243C7C
                    </div>
                    {bcStandard07Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#5F3795", true)}
                    >
                      <strong className="d-block">$bc-standard-08</strong>
                      #5F3795
                    </div>
                    {bcStandard08Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>

                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#883895", true)}
                    >
                      <strong className="d-block">$bc-standard-09</strong>
                      #883895
                    </div>
                    {bcStandard09Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>

                <Row>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#DD5857", true)}
                    >
                      <strong className="d-block">$bc-standard-10</strong>
                      #DD5857
                    </div>
                    {bcStandard10Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#F38489", true)}
                    >
                      <strong className="d-block">$bc-standard-11</strong>
                      #F38489
                    </div>
                    {bcStandard11Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>

                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#F2A488", true)}
                    >
                      <strong className="d-block">$bc-standard-12</strong>
                      #F2A488
                    </div>
                    {bcStandard12Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
                          {formatVariableName(item)}
                        </div>
                      );
                    })}
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    <div
                      className="p-3 mb-2 position-relative"
                      style={swatch("#ECC51D", true)}
                    >
                      <strong className="d-block">$bc-standard-13</strong>
                      #ECC51D
                    </div>
                    {bcStandard13Variants.map((item, idx) => {
                      return (
                        <div
                          className={`p-3 ${item} ${textColor400(item)}`}
                          key={idx}
                        >
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
