import { forwardRef, useImperativeHandle, useState } from "react";
import { useAppSelector } from "@hooks/hooks";
import { Button, Card } from "react-bootstrap";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { selectDrugs, selectDrugUseMethods, selectRemainingDrugUse } from "@store/reducers/code-table";
import Option from "@apptypes/app/option";
import { isPositiveNum } from "@common/methods";
import { REQUIRED } from "@constants/general";

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
  remainingUse: string | null;

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
  const [discardMethodError, setDiscardMethodError] = useState("");

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
    } else if (amountUsed && Number.parseFloat(amountUsed) === 0) {
      setAmountUsedError("Must be a positive number");
      result = false;
    } else if (!amountUsed) {
      setAmountUsedError(REQUIRED);
      result = false;
    }

    if (amountDiscarded && !isPositiveNum(amountDiscarded)) {
      setAmountDiscardedError("Must be a positive number");
      result = false;
    } else if (amountDiscarded && Number.parseFloat(amountDiscarded) === 0) {
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

    //-- edge case
    //-- if the user selects DISC from remainingUse then check to
    //-- make sure that the user also provides a discard amount and method
    if (remainingUse === "DISC") {
      if (!amountDiscarded) {
        setAmountDiscardedError(REQUIRED);
        result = false;
      }

      if (!discardMethod) {
        setDiscardMethodError(REQUIRED);
        result = false;
      }
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

  const handleAmountDiscardedChange = (input: string) => {
    updateModel("amountDiscarded", input);
    setAmountDiscardedError("");
  };

  const handleDiscardMethodChange = (input: string) => {
    updateModel("discardMethod", input);
    setDiscardMethodError("");
  };

  return (
    <Card className="comp-drug-form">
      <Card.Header className="comp-card-header px-0">
        <div className="comp-card-header-title">
          <h5>Add Drug</h5>
        </div>
        <div className="comp-card-header-actions">
          <Button
            variant="outline-primary"
            size="sm"
            aria-label="Delete drug"
            onClick={() => {
              remove(id);
            }}
          >
            <i className="bi bi-trash3"></i>
            <span>Delete</span>
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="pt-0">
        <div className="comp-details-form-row">
          <label htmlFor={`vial-number-${id}`}>Vial number</label>
          <div className="comp-details-input">
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
          </div>
        </div>
        <div className="comp-details-form-row">
          <label htmlFor={`select-drug-name-${id}`}>Drug name</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id={`select-drug-name-${id}`}
              classNamePrefix="comp-select"
              options={drugs}
              enableValidation={true}
              placeholder={"Select"}
              errorMessage={drugError}
              onChange={(evt) => {
                handleDrugNameChange(evt);
              }}
              value={getValue("drug")}
            />
          </div>
        </div>

        <div className="comp-details-form-row">
          <label htmlFor={`injection-method-${id}`}>Injection method</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id={`injection-method-${id}`}
              classNamePrefix="comp-select"
              options={drugUseMethods}
              enableValidation={true}
              placeholder={"Select"}
              errorMessage={injectionMethodError}
              onChange={(evt) => {
                handleInjectionMethodChange(evt);
              }}
              value={getValue("injection-method")}
            />
          </div>
        </div>
        <div className="comp-details-form-row">
          <label htmlFor={`amount-used-${id}`}>Amount used (mL)</label>
          <div className="comp-details-input">
            <CompInput
              id={`amount-used-${id}`}
              divid={`amount-used-${id}-div`}
              type="number"
              min={0}
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
          </div>
        </div>

        <div className="comp-details-form-row">
          <label htmlFor={`remaining-drug-use-${id}`}>Fate of remaining drug in vial</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id={`remaining-drug-use-${id}`}
              classNamePrefix="comp-select"
              options={remainingDrugUse}
              enableValidation={false}
              placeholder={"Select"}
              onChange={(evt) => {
                handleRemainingUsed(evt?.value ?? "");
              }}
              value={getValue("remaining")}
            />
          </div>
        </div>

        {showDiscarded && (
          <>
            <div className="comp-details-form-row">
              <label htmlFor={`amount-discarded-${id}`}>Amount discarded (mL)</label>
              <div className="comp-details-input">
                <CompInput
                  id={`amount-discarded-${id}`}
                  divid={`amount-discarded-${id}-div`}
                  type="number"
                  min={0}
                  inputClass="comp-form-control"
                  value={amountDiscarded}
                  error={amountDiscardedError}
                  onChange={(evt: any) => {
                    const {
                      target: { value },
                    } = evt;
                    handleAmountDiscardedChange(value ?? "");
                  }}
                />
              </div>
            </div>
            <div className="comp-details-form-row">
              <label htmlFor={`discard-method-${id}`}>Discard method</label>
              <div className="comp-details-input full-width">
                <CompInput
                  id={`discard-method-${id}`}
                  divid={`discard-method-${id}-div`}
                  type="input"
                  placeholder=""
                  inputClass="comp-form-control"
                  value={discardMethod}
                  error={discardMethodError}
                  onChange={(evt: any) => {
                    const {
                      target: { value },
                    } = evt;
                    handleDiscardMethodChange(value ?? "");
                  }}
                />
              </div>
            </div>
          </>
        )}

        <div className="comp-details-form-row">
          <label htmlFor={`adverse-reactions-${id}`}>Adverse reactions</label>
          <div className="comp-details-input full-width">
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
          </div>
        </div>
      </Card.Body>
    </Card>
  );
});

DrugUsed.displayName = "DrugUsed";
