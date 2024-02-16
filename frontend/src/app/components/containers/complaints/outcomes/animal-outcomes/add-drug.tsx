import { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { BsFillXCircleFill, BsXCircle } from "react-icons/bs";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectDrugUseMethods, selectDrugs, selectRemainingDrugUse } from "../../../../../store/reducers/code-table";
import { CompIconButton } from "../../../../common/comp-icon-button";
import Option from "../../../../../types/app/option";

type props = {
  id: number;

  vial: string;
  drug: string;
  amountUsed: number;
  amountDiscarded: number;

  reactions: string;
  remainingUse: string;

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
  remove,
  update,
}) => {
  const drugs = useAppSelector(selectDrugs);
  const drugUseMethods = useAppSelector(selectDrugUseMethods);
  const remainingDrugUse = useAppSelector(selectRemainingDrugUse);

  const [showDiscarded, setShowDiscarded] = useState(remainingUse === "DISC");

  const updateModel = (property: string, value: string | Date | number | null | undefined) => {
    const source = {
      id,
      vial,
      drug,
      amountUsed,
      amountDiscarded,
      reactions,
      remainingUse,
      injectionMethod,
      discardMethod,
    };
    const updatedTag = { ...source, [property]: value };

    update(updatedTag);
  };

  const getValue = (property: string): Option | undefined => {
    switch (property) {
      case "drug": {
        return drugs.find((item) => item.value === drug);
      }

      case "injection-method": {
        return drugUseMethods.find((item) => item.value === injectionMethod);
      }

      case "remaining": {
        return remainingDrugUse.find((item) => item.value === remainingUse);
      }
    }
  };

  const handleAmountUsed = (input: string) => {
    updateModel("amountUsed", input);
  };

  const handleAmountDiscarded = (input: string) => {
    updateModel("amountDiscarded", input);
  };

  const handleRemainingUsed = (input: string) => {
    setShowDiscarded(input === "DISC");
    updateModel("remainingUse", input);
  };

  return (
    <div className="comp-outcome-report-inner-spacing">
      <Row>
        <Col>
          <label htmlFor={`vial-number-${id}`}>Vial number</label>
          <CompInput
            id={`vial-number-${id}`}
            divid={`vial-number-${id}-div`}
            type="input"
            placeholder="Example"
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
          <label htmlFor={`select-drug-name-${id}`}>Drug name</label>
          <CompSelect
            id={`select-drug-name-${id}`}
            options={drugs}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("drug", evt?.value);
            }}
            value={getValue("drug")}
          />
        </Col>
        <Col>
          <label htmlFor={`amount-used-${id}`}>Amount used (mL)</label>
          <CompInput
            id={`amount-used-${id}`}
            divid={`amount-used-${id}-div`}
            type="input"
            placeholder="Example"
            inputClass="comp-form-control"
            value={amountUsed === -1 ? "" : amountUsed}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              handleAmountUsed(value);
            }}
          />
        </Col>
        <Col>
          <label htmlFor={`injection-method-${id}`}>Injection method</label>
          <CompSelect
            id={`injection-method-${id}`}
            options={drugUseMethods}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("injectionMethod", evt?.value);
            }}
            value={getValue("injection-method")}
          />
        </Col>
        <Col>
          <label htmlFor={`adverse-reactions-${id}`}>Adverse reactions</label>
          <CompInput
            id={`adverse-reactions-${id}`}
            divid={`adverse-reactions-${id}-div`}
            type="input"
            placeholder="Example"
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
        <Col className="mt-auto mb-2">
          <CompIconButton onClick={() => remove(id)}>
            <BsXCircle size={24} />
            <BsFillXCircleFill size={24} />
          </CompIconButton>
        </Col>
      </Row>
      <Row className="comp-padding-top-md">
        <Col>
          <label htmlFor={`remaining-drug-use-${id}`}>Fate of remaining drug in vial</label>
          <CompSelect
            id={`remaining-drug-use-${id}`}
            options={remainingDrugUse}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              handleRemainingUsed(evt?.value ?? "");
            }}
            value={getValue("remaining")}
          />
        </Col>
        <Col>
          {showDiscarded && (
            <>
              {" "}
              <label htmlFor={`amount-discarded-${id}`}>Amount discarded (mL)</label>
              <CompInput
                id={`amount-discarded-${id}`}
                divid={`amount-discarded-${id}-div`}
                type="input"
                placeholder="Example"
                inputClass="comp-form-control"
                value={amountDiscarded === -1 ? "" : amountDiscarded}
                onChange={(evt: any) => {
                  const {
                    target: { value },
                  } = evt;
                  handleAmountDiscarded(value);
                }}
              />
            </>
          )}
        </Col>
        <Col>
          {showDiscarded && (
            <>
              <label htmlFor={`discard-method-${id}`}>Discard method</label>
              <CompInput
                id={`discard-method-${id}`}
                divid={`discard-method-${id}-div`}
                type="input"
                placeholder="Example"
                inputClass="comp-form-control"
                value={discardMethod}
                onChange={(evt: any) => {
                  const {
                    target: { value },
                  } = evt;
                  updateModel("discardMethod", value);
                }}
              />
            </>
          )}
        </Col>
        <Col></Col>
      </Row>

      <hr className="comp-margin-top-lg comp-nmargin-bottom-xs" />
    </div>
  );
};
