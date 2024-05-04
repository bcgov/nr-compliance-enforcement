import { forwardRef, useImperativeHandle, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { BsXCircle, BsFillXCircleFill } from "react-icons/bs";
import { CompIconButton } from "../../../../common/comp-icon-button";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectEarDropdown } from "../../../../../store/reducers/code-table";

type props = {
  id: number;
  ear: string;
  number: string;
  update: Function;
  remove: Function;
};

export const EarTag = forwardRef<{ isValid: Function }, props>((props, ref) => {
  const ears = useAppSelector(selectEarDropdown);

  const { id, ear, number, update, remove } = props;

  const [error, setError] = useState("");

  const leftEar = ears.find((ear) => ear.value === "L");
  const rightEar = ears.find((ear) => ear.value === "R");

  let selectedEar = ear === "L" ? leftEar : rightEar;

  const updateModel = (property: string, value: string | undefined) => {
    const source = { id, ear, number };
    const updatedTag = { ...source, [property]: value };
    update(updatedTag, property);
  };

  const isValid = (): boolean => {
    let error = !number ? "Required" : "";
    setError(error);

    return number !== "";
  };
  useImperativeHandle(ref, () => {
    return {
      isValid,
    };
  });

  return (
    <div className="comp-animal-outcome-report-inner-spacing comp-padding-top-2">
      <Row>
        <Col>
          <label
            htmlFor={`comp-ear-tag-value-${id}`}
            className="comp-margin-bottom-8"
          >
            Ear Tag
          </label>
          <CompInput
            id={`comp-ear-tag-value-${id}`}
            divid="comp-details-edit-y-coordinate-div"
            type="input"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={number}
            error={error}
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
          <label
            htmlFor={`comp-ear-tag-${id}`}
            className="comp-margin-bottom-8"
          >
            &nbsp;
          </label>
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
        <Col className="mt-delete-button mb-2">
          <CompIconButton onClick={() => remove(id)}>
            <BsXCircle
              size={24}
              className="comp-outcome-remove-botton"
            />
            <BsFillXCircleFill
              size={24}
              className="comp-outcome-remove-botton-hover"
            />
          </CompIconButton>
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </div>
  );
});
EarTag.displayName = "EarTag";
