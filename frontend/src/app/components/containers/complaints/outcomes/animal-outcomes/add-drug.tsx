import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { BsXCircle } from "react-icons/bs";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectDrugUseMethods, selectDrugs, selectRemainingDrugUse } from "../../../../../store/reducers/code-table";

type props = {
  id: number;

  vial: string;
  drug: string;
  amountUsed: number;
  amountDiscarded: number;

  reactions: string;
  remainingUse: string;

  officer: string;
  date?: Date;

  injectionMethod: string;
  discardMethod: string;
  
  remove: Function;
  update: Function;
};

export const AddDrug: FC<props> = ({
  id,
  vial,
  drug,
  amountUsed,
  injectionMethod,
  discardMethod,
  amountDiscarded,
  reactions,
  remainingUse,
  officer,
  date,
  remove,
  update,
}) => {
  const drugs = useAppSelector(selectDrugs);
  const drugUseMethods = useAppSelector(selectDrugUseMethods);
  const remainingDrugUse = useAppSelector(selectRemainingDrugUse);

  const updateModel = (property: string, value: string | number | undefined) => {
    if (value) {
      const source = { id, vial, drug, amountUsed, amountDiscarded, reactions, remainingUse, injectionMethod, discardMethod, officer, date };
      const updatedTag = { ...source, [property]: value };

      update(updatedTag);
    }
  };

  return (
    <div className="comp-outcome-report-inner-spacing">
      <Row>
        <Col>
          <label htmlFor="select-species">Vial number</label>
          <CompInput
            id="comp-details-edit-y-coordinate-input"
            divId="comp-details-edit-y-coordinate-div"
            type="input"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={vial}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              updateModel("vial", value);
            }}
          />
        </Col>
        <Col>
          <label htmlFor="select-ears">Drug name</label>
          <CompSelect
            id="select-ears"
            options={drugs}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("drug", evt?.value);
            }}
          />
        </Col>
        <Col>
          <label htmlFor="select-species">Amount used</label>
          <CompInput
            id="comp-details-edit-y-coordinate-input"
            divId="comp-details-edit-y-coordinate-div"
            type="number"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={amountUsed === -1 ? "" : amountUsed}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              updateModel("amountUsed", parseInt(value));
            }}
          />
        </Col>
        <Col>
          <label htmlFor="select-ears">Injection method</label>
          <CompSelect
            id="select-ears"
            options={drugUseMethods}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("injectionMethod", evt?.value);
            }}
          />
        </Col>
        <Col>
          <label htmlFor="select-species">Adverse reactions</label>
          <CompInput
            id="comp-details-edit-y-coordinate-input"
            divId="comp-details-edit-y-coordinate-div"
            type="input"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={reactions}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              updateModel("reactions", value);
            }}
          />
        </Col>
        <Col style={{ textAlign: "left" }} className="mt-auto mb-2">
          <BsXCircle size={24} onClick={() => remove(id)} />
        </Col>
      </Row>
      <Row>
        <Col>
          <label htmlFor="select-ears">Fate of remaining drug in vial</label>
          <CompSelect
            id="select-ears"
            options={remainingDrugUse}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("remainingUse", evt?.value);
            }}
          />
        </Col>
        <Col>
          <label htmlFor="select-species">Amount discarded</label>
          <CompInput
            id="comp-details-edit-y-coordinate-input"
            divId="comp-details-edit-y-coordinate-div"
            type="input"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={amountDiscarded === -1 ? "" : amountDiscarded}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              updateModel("amountDiscarded", parseInt(value));
            }}
          />
        </Col>
        <Col>
          <label htmlFor="select-species">Discard method</label>
          <CompInput
            id="comp-details-edit-y-coordinate-input"
            divId="comp-details-edit-y-coordinate-div"
            type="input"
            placeholder="Enter number"
            inputClass="comp-form-control"
            value={discardMethod}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              updateModel("discardMethod", value);
            }}
          />
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
};
