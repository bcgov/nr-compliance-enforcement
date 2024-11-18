import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "react-bootstrap";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { useAppSelector } from "@hooks/hooks";
import { selectEarDropdown } from "@store/reducers/code-table";
import { REQUIRED } from "@constants/general";

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
    <div className="comp-ear-tag">
      <div className="comp-ear-tag-form-item">
        <label htmlFor={`comp-ear-tag-value-${id}`}>Identifier</label>
        <CompInput
          id={`comp-ear-tag-value-${id}`}
          divid="comp-ear-tag-value"
          type="input"
          inputClass="comp-form-control comp-ear-tag-id-input"
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
      </div>
      <div className="comp-ear-tag-form-item">
        <label htmlFor={`comp-ear-tag-${id}`}>Side</label>
        <CompSelect
          id={`comp-ear-tag-${id}`}
          classNamePrefix="comp-select"
          className="comp-details-input comp-ear-tag-side-input"
          options={ears}
          enableValidation={false}
          placeholder={"Ear side"}
          onChange={(evt) => {
            updateModel("ear", evt?.value);
          }}
          value={selectedEar}
        />
      </div>

      <Button
        variant="outline-primary"
        size="sm"
        aria-label="Delete ear tag"
        onClick={() => remove(id)}
      >
        <i className="bi bi-trash3"></i>
        <span>Delete</span>
      </Button>
    </div>
  );
});
EarTag.displayName = "EarTag";
