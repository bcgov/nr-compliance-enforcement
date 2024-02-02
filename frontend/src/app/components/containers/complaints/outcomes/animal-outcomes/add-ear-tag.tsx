import { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectEarDropdown } from "../../../../../store/reducers/code-table";
import { BsXCircle } from "react-icons/bs";

type props = {
  id: number;
  ear: string;
  number: string;
  update: Function;
  remove: Function;
};

export const AddEarTag: FC<props> = ({ id, ear, number, update, remove }) => {
  const ears = useAppSelector(selectEarDropdown);

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
            id="comp-details-edit-y-coordinate-input"
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
            id="select-ears"
            options={ears}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("ear", evt?.value);
            }}
          />
        </Col>
        <Col style={{ textAlign: "left" }} className="mt-auto mb-2">
          <BsXCircle size={24} onClick={() => remove(id)} />
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </div>
  );
};
