import { FC, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectEarDropdown } from "../../../../../store/reducers/code-table";
import { BsXCircle, BsFillXCircleFill } from "react-icons/bs";
import { CompIconButton } from "../../../../common/comp-icon-button";

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

  const updateModel = (property: string, value: string | undefined) => {
    const source = { id, ear, number };
    const updatedTag = { ...source, [property]: value };

    update(updatedTag);
  };

  return (
    <div className="comp-outcome-report-inner-spacing comp-padding-top-2">
      <Row>
        <Col>
          <label htmlFor={`comp-ear-tag-value-${id}`} className="comp-margin-bottom-8">Ear Tag</label>
          <CompInput
            id={`comp-ear-tag-value-${id}`}
            divid="comp-details-edit-y-coordinate-div"
            type="input"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={number}
            maxLength={7}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;

              if (value.length <= 6) {
                updateModel("number", value);
              }
            }}
          />
        </Col>
        <Col>
          <label htmlFor={`comp-ear-tag-${id}`} className="comp-margin-bottom-8">&nbsp;</label>
          <CompSelect
            id={`comp-ear-tag-${id}`}
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={ears}
            enableValidation={false}
            placeholder={"Select"}
            onChange={(evt) => {
              updateModel("ear", evt?.value);
            }}
            value={selectedEar}
          />
        </Col>
        <Col className="mt-auto mb-2">
          <CompIconButton onClick={() => remove(id)}>
            <BsXCircle size={24} className="comp-outcome-remove-botton" />
            <BsFillXCircleFill size={24} className="comp-outcome-remove-botton-hover" />
          </CompIconButton>
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </div>
  );
};
