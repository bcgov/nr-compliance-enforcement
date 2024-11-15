import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import logo from "@assets/images/BCID_H_rgb_rev.png";

interface ReferenceHeaderProps {
  title: string;
}

export const ReferenceHeader: FC<ReferenceHeaderProps> = ({ title }) => {
  return (
    <>
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
          <img
            style={{ height: "53px" }}
            src={logo}
            alt="logo"
          />{" "}
          Ministry of Environment and Climate Change Strategy
        </Col>
        <Col md={12}>
          <h1 style={{ fontSize: "96px", color: "white" }}>{title}</h1>
        </Col>
      </Row>
    </>
  );
};
