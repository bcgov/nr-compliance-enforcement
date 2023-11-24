import React, { FC, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useAppSelector } from "../../../hooks/hooks";
import { selectOfficersDropdown } from "../../../store/reducers/officer";
import { CompSelect } from "../../common/comp-select";
import Option from "../../../types/app/option";

export const UserManagement: FC = () => {
  const officers = useAppSelector(selectOfficersDropdown);

  const [officer, setOfficer] = useState<Option>();

  const handleOfficerChange = (input: any) => {
    if (input.value) {
      setOfficer(input);
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          <h1>User Administration</h1>
          <p>
            Manage user agency / office location. Select a user and Agency +
            Location{" "}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          {" "}
          {"Select User"}
          <CompSelect
            id="species-select-id"
            classNamePrefix="comp-select"
            onChange={(evt) => handleOfficerChange(evt)}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={officers}
            placeholder="Select"
            enableValidation={false}
            value={officer}
          />
        </Col>
        <Col></Col>
        <Col>dropdown</Col>
        <Col>button</Col>
        <Col></Col>
      </Row>
    </Container>
  );
};
