import { FC, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectEarDropdown } from "../../../../../store/reducers/code-table";
import { BsXCircle, BsFillXCircleFill } from "react-icons/bs";

type props = {
  id: number;
  ear: string;
  number: string;
  isLeftEarUsed: boolean;
  update: Function;
  remove: Function;
};

export const AddEarTag: FC<props> = ({ id, ear, number, isLeftEarUsed, update, remove }) => {
  const ears = useAppSelector(selectEarDropdown);
  const leftEar = ears.find((ear) => ear.value === "L");
  const rightEar = ears.find((ear) => ear.value === "R");

  let selectedEar = ear === "R" ? rightEar : leftEar;

  useEffect(() => {
    if (!ear) {
      updateModel("ear", isLeftEarUsed ? "R" : "L");
    }
  }, [ear, isLeftEarUsed]);

  const isValid = (): boolean => {
    let isValid = true;

    if (!number || !ear) {
      isValid = false;
    }

    return isValid;
  };

  const updateModel = (property: string, value: string | undefined) => {
    if (value) {
      const source = { id, ear, number };
      const updatedTag = { ...source, [property]: value };

      update(updatedTag);
    }
  };

  return (
    <div className="comp-outcome-report-inner-spacing">
      <Row>
        <Col>
          <label htmlFor="select-species">Ear Tag</label>
          <CompInput
            id={`comp-ear-tag-value-${id}`}
            divid="comp-details-edit-y-coordinate-div"
            type="input"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={number}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              updateModel("number", value);
            }}
          />
        </Col>
        <Col>
          <label htmlFor="select-ears"></label>
          <CompSelect
            id={`comp-ear-tag-${id}`}
            options={ears}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("ear", evt?.value);
            }}
            value={selectedEar}
          />
        </Col>
        <Col style={{ textAlign: "left" }} className="mt-auto mb-2">
          {/* <BsXCircle size={24} onClick={() => remove(id)} className="remove" /> */}
          <div className="icon-container" onClick={() => remove(id)}>
            <BsXCircle size={24} />
            <BsFillXCircleFill size={24} />
          </div>
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </div>
  );
};
