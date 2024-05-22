import { forwardRef, useImperativeHandle, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { BsXCircle, BsFillXCircleFill } from "react-icons/bs";
import { CompIconButton } from "../../../../common/comp-icon-button";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectEarDropdown } from "../../../../../store/reducers/code-table";
import { REQUIRED } from "../../../../../constants/general";

type props = {
  id: string;
  ear: string;
  identifier: string;
  order: number;
  update: Function;
  remove: Function;
};

export const EarTag = forwardRef<{ isValid: Function }, props>((props, ref) => {
  const ears = useAppSelector(selectEarDropdown);

  const { id, ear, identifier, order, update, remove } = props;

  const [error, setError] = useState("");

  const leftEar = ears.find((ear) => ear.value === "L");
  const rightEar = ears.find((ear) => ear.value === "R");

  let selectedEar = ear === "L" ? leftEar : rightEar;

  const updateModel = (property: string, value: string | undefined) => {
    const source = { id, ear, identifier, order };
    const updatedTag = { ...source, [property]: value };
    update(updatedTag, property);
  };

  const isValid = (): boolean => {
    let error = !identifier ? REQUIRED : "";
    setError(error);

    return identifier !== "";
  };
  useImperativeHandle(ref, () => {
    return {
      id,
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
            value={identifier}
            error={error}
            maxLength={7}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;

              if (value.length <= 6) {
                updateModel("identifier", value);
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
