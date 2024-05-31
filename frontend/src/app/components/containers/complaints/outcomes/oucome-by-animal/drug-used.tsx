import { forwardRef, useImperativeHandle, useState } from "react";
import { useAppSelector } from "../../../../../hooks/hooks";
import { Col, Row } from "react-bootstrap";
import { CompInput } from "../../../../common/comp-input";
import { CompSelect } from "../../../../common/comp-select";
import { CompIconButton } from "../../../../common/comp-icon-button";
import { BsFillXCircleFill, BsXCircle } from "react-icons/bs";
import { selectDrugs, selectDrugUseMethods, selectRemainingDrugUse } from "../../../../../store/reducers/code-table";
import Option from "../../../../../types/app/option";
import { isPositiveNum } from "../../../../../common/methods";
import { REQUIRED } from "../../../../../constants/general";

type refProps = {
  isValid: Function;
};

type props = {
  id: string;

  vial: string;
  drug: string;
  amountUsed: string;
  amountDiscarded: string;

  reactions: string;
  remainingUse: string;

  injectionMethod: string;
  discardMethod: string;

  order: number;

  remove: Function;
  update: Function;
};

export const DrugUsed = forwardRef<refProps, props>((props, ref) => {
  const drugs = useAppSelector(selectDrugs);
  const drugUseMethods = useAppSelector(selectDrugUseMethods);
  const remainingDrugUse = useAppSelector(selectRemainingDrugUse);

  const {
    id,
    vial,
    drug,
    amountUsed,
    amountDiscarded,
    reactions,
    remainingUse,
    injectionMethod,
    discardMethod,
    order,
    remove,
    update,
  } = props;

  const [showDiscarded, setShowDiscarded] = useState(remainingUse === "DISC");

  //-- error messages //
  const [vialError, setVialError] = useState("");
  const [drugError, setDrugError] = useState("");
  const [amountDiscardedError, setAmountDiscardedError] = useState("");
  const [amountUsedError, setAmountUsedError] = useState("");
  const [injectionMethodError, setInjectionMethodError] = useState("");

  //-- this allows the developers to consume functions within the
  //-- drug-used component in a parent component
  useImperativeHandle(ref, () => {
    return {
      isValid,
    };
  });

  //-- use to validate the drug-used component inputs
  const isValid = (): boolean => {
    let result = true;

    //-- validate that amount used is a positive number
    if (amountUsed && !isPositiveNum(amountUsed)) {
      setAmountUsedError("Must be a positive number");
      result = false;
    } else if (!amountUsed) {
      setAmountUsedError(REQUIRED);
      result = false;
    }

    if (amountDiscarded && !isPositiveNum(amountDiscarded)) {
      setAmountDiscardedError("Must be a positive number");
      result = false;
    }

    if (!vial) {
      setVialError(REQUIRED);
      result = false;
    }

    if (!drug) {
      setDrugError(REQUIRED);
      result = false;
    }

    if (!injectionMethod) {
      setInjectionMethodError(REQUIRED);
      result = false;
    }

    return result;
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
      order,
    };
    let updatedDrug = { ...source, [property]: value };

    //-- if the user selects DISC clear the method and amount discarded
    if (property === "remainingUse" && (value === "STOR" || value === "RDIS")) {
      updatedDrug = { ...updatedDrug, discardMethod: "", amountDiscarded: "" };
    }

    update(updatedDrug, property);
  };

  //-- event handlers
  const handleVialNumberChange = (input: string | null) => {
    updateModel("vial", input);

    if (vialError && input) {
      setVialError("");
    }
  };

  const handleDrugNameChange = (input: Option | null) => {
    updateModel("drug", input?.value);

    if (drugError && input?.value) {
      setDrugError("");
    }
  };

  const handleAmountUsedChange = (input: string | null) => {
    updateModel("amountUsed", input);

    if (amountUsedError && input) {
      setAmountUsedError("");
    }
  };

  const handleInjectionMethodChange = (input: Option | null) => {
    updateModel("injectionMethod", input?.value);

    if (injectionMethodError && input?.value) {
      setInjectionMethodError("");
    }
  };

  const handleRemainingUsed = (input: string) => {
    setShowDiscarded(input === "DISC");
    updateModel("remainingUse", input);
  };

  return (
    <div className="comp-animal-outcome-report-inner-spacing">
      <Row>
        <Col>
          <label
            htmlFor={`vial-number-${id}`}
            className="comp-margin-bottom-8"
          >
            Vial number
          </label>
          <CompInput
            id={`vial-number-${id}`}
            divid={`vial-number-${id}-div`}
            type="input"
            placeholder=""
            inputClass="comp-form-control"
            value={vial}
            error={vialError}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              handleVialNumberChange(value);
            }}
          />
        </Col>
        <Col>
          <label
            htmlFor={`select-drug-name-${id}`}
            className="comp-margin-bottom-8"
          >
            Drug name
          </label>
          <CompSelect
            id={`select-drug-name-${id}`}
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={drugs}
            enableValidation={true}
            placeholder={"Select"}
            errorMessage={drugError}
            onChange={(evt) => {
              handleDrugNameChange(evt);
            }}
            value={getValue("drug")}
          />
        </Col>
        <Col>
          <label
            htmlFor={`amount-used-${id}`}
            className="comp-margin-bottom-8"
          >
            Amount used (mL)
          </label>
          <CompInput
            id={`amount-used-${id}`}
            divid={`amount-used-${id}-div`}
            type="input"
            placeholder=""
            inputClass="comp-form-control"
            value={amountUsed}
            error={amountUsedError}
            onChange={(evt: any) => {
              const {
                target: { value },
              } = evt;
              handleAmountUsedChange(value ?? "");
            }}
          />
        </Col>
        <Col>
          <label
            htmlFor={`injection-method-${id}`}
            className="comp-margin-bottom-8"
          >
            Injection method
          </label>
          <CompSelect
            id={`injection-method-${id}`}
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={drugUseMethods}
            enableValidation={true}
            placeholder={"Select"}
            errorMessage={injectionMethodError}
            onChange={(evt) => {
              handleInjectionMethodChange(evt);
            }}
            value={getValue("injection-method")}
          />
        </Col>
        <Col>
          <label
            htmlFor={`adverse-reactions-${id}`}
            className="comp-margin-bottom-8"
          >
            Adverse reactions
          </label>
          <CompInput
            id={`adverse-reactions-${id}`}
            divid={`adverse-reactions-${id}-div`}
            type="input"
            placeholder=""
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
        <Col className="mt-delete-button mb-2">
          <CompIconButton
            onClick={() => {
              remove(id);
            }}
          >
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
      </Row>
      <Row className="comp-padding-top-md">
        <Col>
          <label
            htmlFor={`remaining-drug-use-${id}`}
            className="comp-margin-bottom-8"
          >
            Fate of remaining drug in vial
          </label>
          <CompSelect
            id={`remaining-drug-use-${id}`}
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={remainingDrugUse}
            enableValidation={false}
            placeholder={"Select"}
            onChange={(evt) => {
              handleRemainingUsed(evt?.value ?? "");
            }}
            value={getValue("remaining")}
          />
        </Col>
        <Col>
          {showDiscarded && (
            <>
              <label
                htmlFor={`amount-discarded-${id}`}
                className="comp-margin-bottom-8"
              >
                Amount discarded (mL)
              </label>
              <CompInput
                id={`amount-discarded-${id}`}
                divid={`amount-discarded-${id}-div`}
                type="input"
                placeholder=""
                inputClass="comp-form-control"
                value={amountDiscarded}
                error={amountDiscardedError}
                onChange={(evt: any) => {
                  const {
                    target: { value },
                  } = evt;
                  updateModel("amountDiscarded", value);
                }}
              />
            </>
          )}
        </Col>
        <Col>
          {showDiscarded && (
            <>
              <label
                htmlFor={`discard-method-${id}`}
                className="comp-margin-bottom-8"
              >
                Discard method
              </label>
              <CompInput
                id={`discard-method-${id}`}
                divid={`discard-method-${id}-div`}
                type="input"
                placeholder=""
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

      <hr className="comp-outcome-animal-seperator" />
    </div>
  );
});

DrugUsed.displayName = "DrugUsed";
