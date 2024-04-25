import { FC, useState } from "react";
import { ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { useAppSelector } from "../../../../../hooks/hooks";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import {
  selectAgeDropdown,
  selectConflictHistoryDropdown,
  selectSexDropdown,
  selectSpeciesCodeDropdown,
  selectThreatLevelDropdown,
  selectWildlifeComplaintOutcome,
} from "../../../../../store/reducers/code-table";
import { selectComplaint } from "../../../../../store/reducers/complaints";
import { CompSelect } from "../../../../common/comp-select";
import { isPositiveNum, pad } from "../../../../../common/methods";

import Option from "../../../../../types/app/option";

import "react-toastify/dist/ReactToastify.css";
import { AnimalOutcome } from "../../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { Row, Col, Button } from "react-bootstrap";
import { AnimalTag } from "../../../../../types/app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsed } from "../../../../../types/app/complaints/outcomes/wildlife/drug-used";
import { AddEarTag } from "./add-ear-tag";

import { AddDrug } from "./add-drug";

import { DrugAuthorization as AddDrugAuthorization } from "./drug-authorization";

import { from } from "linq-to-typescript";
import { BsPlusCircle } from "react-icons/bs";
import { DrugAuthorization } from "../../../../../types/app/complaints/outcomes/wildlife/drug-authorization";
import { ValidationDatePicker } from "../../../../../common/validation-date-picker";

export interface EditAnimalOutcomeProps {
  animalOutcomeItemData?: AnimalOutcome | null;
  animalOutcomeData?: Array<AnimalOutcome>;
  setAnimalOutcomeData?: (param: any) => void | null;
  indexItem: number;
  setShowAnimalOutcomeEditForm?: (param: boolean) => void | null;
  setShowAnimalOutcomeAddForm?: (param: boolean) => void | null;
  editMode: boolean;
}

export const EditAnimalOutcome: FC<EditAnimalOutcomeProps> = ({
  animalOutcomeData,
  animalOutcomeItemData,
  indexItem,
  setAnimalOutcomeData,
  setShowAnimalOutcomeAddForm,
  editMode,
}) => {
  const complaintData = useAppSelector(selectComplaint);
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);

  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(
    selectOfficersByAgencyDropdown(complaintData?.ownedBy ? complaintData?.ownedBy : "COS"),
  );

  const [species, setSpecies] = useState<Option | undefined>(animalOutcomeItemData?.species);
  const [sex, setSex] = useState<Option | undefined>(animalOutcomeItemData?.sex);
  const [age, setAge] = useState<Option | undefined>(animalOutcomeItemData?.age);
  const [threatLevel, setThreatLevel] = useState<Option | undefined>(animalOutcomeItemData?.threatLevel);
  const [conflictHistory, setConflictHistory] = useState<Option | undefined>(animalOutcomeItemData?.conflictHistory);
  const [tags, setTags] = useState<AnimalTag[]>(animalOutcomeItemData?.tags ?? []);
  const [drugs, setDrugs] = useState<DrugUsed[]>(animalOutcomeItemData?.drugs ?? []);
  const [drugAuthorization, setDrugAuthorization] = useState<DrugAuthorization | undefined>(
    animalOutcomeItemData?.drugAuthorization,
  );
  const [outcome, setOutcome] = useState<Option | undefined>(animalOutcomeItemData?.outcome);
  const [outcomeOfficer, setOutcomeOfficer] = useState<Option | undefined>(animalOutcomeItemData?.officer);
  const [outcomeDate, setOutcomeDate] = useState<Date | undefined>(animalOutcomeItemData?.date);

  const [speciesErrorMessage, setSpeciesErrorMessage] = useState<string>("");
  const [outcomeOfficerErrorMessage, setOutcomeOfficerErrorMessage] = useState<string>("");
  const [outcomeDateErrorMessage, setOutcomeDateErrorMessage] = useState<string>("");

  const handleSaveAnimalOutcome = () => {
    const id = editMode ? animalOutcomeItemData?.id?.toString() : uuidv4();
    const newAnimalOutcome: AnimalOutcome = {
      id: id,
      isInEditMode: false,
      species,
      sex,
      age,
      threatLevel,
      conflictHistory,
      tags,
      drugs,
      drugAuthorization,
      outcome,
      officer: outcomeOfficer,
      date: outcomeDate,
    };
    if (isValid()) {
      if (editMode) {
        const newAnimalOutcomeArr = animalOutcomeData?.map((animalOutcome, i) => {
          if (i === indexItem) return newAnimalOutcome;
          else return animalOutcome;
        });
        if (setAnimalOutcomeData) setAnimalOutcomeData(newAnimalOutcomeArr);
      } else {
        const newAnimalOutcomeArr = animalOutcomeData ?? [];
        if (newAnimalOutcome) newAnimalOutcomeArr.push(newAnimalOutcome);
        if (setAnimalOutcomeData) setAnimalOutcomeData(newAnimalOutcomeArr);
        if (setShowAnimalOutcomeAddForm) setShowAnimalOutcomeAddForm(false);
      }
    }
  };

  const handleCancelAnimalOutcome = () => {
    if (editMode) {
      const newAnimalOutcomeArr = animalOutcomeData?.map((animalOutcome, i) => {
        if (i === indexItem) return { ...animalOutcome, isInEditMode: false };
        else return animalOutcome;
      });
      if (setAnimalOutcomeData) setAnimalOutcomeData(newAnimalOutcomeArr);
    } else {
      const newAnimalOutcomeArr = animalOutcomeData ? animalOutcomeData.splice(animalOutcomeData.length - 1, 1) : [];
      if (setAnimalOutcomeData) setAnimalOutcomeData(newAnimalOutcomeArr);
      if (setShowAnimalOutcomeAddForm) setShowAnimalOutcomeAddForm(false);
    }
  };

  const handleSpeciesChange = (input: Option | null) => {
    setSpecies(input ?? undefined);
    setSpeciesErrorMessage(!(input ?? undefined) ? "Required" : "");
  };

  const handleOutcomeChange = (input: Option | null) => {
    setOutcome(input ?? undefined);
  };

  const handleOutcomeOfficerChange = (input: Option | null) => {
    setOutcomeOfficer(input ?? undefined);
    setOutcomeOfficerErrorMessage(outcome && !(input ?? undefined) ? "Required" : "");
  };
  const handleOutcomeDateChange = (input: Date) => {
    setOutcomeDate(input);
    setOutcomeDateErrorMessage(outcome && !(input ?? undefined) ? "Required" : "");
  };

  const renderEarTags = () => {
    if (tags && from(tags).any()) {
      return from(tags)
        .orderBy((item) => item.id)
        .toArray()
        .map((item) => {
          const { id } = item;
          return (
            <AddEarTag
              {...item}
              update={updateEarTagFromInput}
              remove={removeEarTag}
              key={id}
            />
          );
        });
    }
  };

  const addEarTag = () => {
    if (tags.length < 2) {
      let id = tags.length + 1;

      if (tags.length === 1) {
        const update = [...tags, { id, ear: tags[0].ear === "L" ? "R" : "L", number: "", numberErrorMessage: "" }];
        setTags(update);
      } else {
        const newTags = [{ id: 1, ear: "L", number: "", numberErrorMessage: "" }];
        setTags(newTags);
      }
    }
  };

  const updateEarTagFromInput = (tag: AnimalTag, type: string) => {
    const currentTag = tags.find(({ id }) => id === tag.id) ?? tag;
    const otherTags = tags.filter(({ id }) => id !== tag.id);
    if (type === "number") {
      currentTag.number = tag.number;
      if (!tag.number) {
        currentTag.numberErrorMessage = "Required";
      } else {
        currentTag.numberErrorMessage = "";
      }
    } else if (type === "ear") {
      currentTag.ear = tag.ear;
    }

    const update = [...otherTags, currentTag];

    setTags(update);
  };

  const updateEarTag = (tag: AnimalTag) => {
    if (!tag.number) {
      tag.numberErrorMessage = "Required";
    } else {
      tag.numberErrorMessage = "";
    }
    const items = tags.filter(({ id }) => id !== tag.id);
    const update = [...items, tag];

    setTags(update);
  };

  const removeEarTag = (id: number) => {
    const items = tags.filter((tag) => id !== tag.id);
    let updatedId = 0;

    const update = from(items)
      .orderBy((item) => item.id)
      .toArray()
      .map((item) => {
        updatedId = updatedId + 1;
        return { ...item, id: updatedId };
      });
    setTags(update);
  };

  const addDrug = () => {
    let id = drugs.length + 1;

    const update = [
      ...drugs,
      {
        id,
        vial: "",
        vialErrorMessage: "",
        drug: "",
        drugErrorMessage: "",
        amountUsed: "",
        amountUsedErrorMessage: "",
        amountDiscarded: "",
        amountDiscardedErrorMessage: "",
        reactions: "",
        remainingUse: "",
        injectionMethod: "",
        injectionMethodErrorMessage: "",
        discardMethod: "",
        officer: "",
      },
    ];
    setDrugs(update);
  };

  const removeDrug = (id: number) => {
    const items = drugs.filter((drug) => id !== drug.id);
    let updatedId = 0;

    const update = from(items)
      .orderBy((item) => item.id)
      .toArray()
      .map((item) => {
        updatedId = updatedId + 1;
        return { ...item, id: updatedId };
      });
    if (update.length === 0) {
      if (drugAuthorization) {
        setDrugAuthorization({
          officer: "",
          date: new Date(),
        });
      }
    }
    setDrugs(update);
  };

  //this feels awful and hacky -- when updating individual inputs within the child component, only update one error message in the input
  const updateDrugFromInput = (drug: DrugUsed, type: string) => {
    const currentDrug = drugs.find(({ id }) => id === drug.id) ?? drug;
    const otherDrugs = drugs.filter(({ id }) => id !== drug.id);
    switch (type) {
      case "vial":
        currentDrug.vial = drug.vial;
        setErrorMessage(currentDrug, "vial");
        break;
      case "drug":
        currentDrug.drug = drug.drug;
        setErrorMessage(currentDrug, "drug");
        break;

      case "amountUsed":
        currentDrug.amountUsed = drug.amountUsed;
        if (!drug.amountUsed) {
          currentDrug.amountUsedErrorMessage = "Required";
        } else if (!isPositiveNum(drug.amountUsed)) {
          currentDrug.amountUsedErrorMessage = "Must be a positive number";
        } else {
          currentDrug.amountUsedErrorMessage = "";
        }
        break;
      case "injectionMethod":
        currentDrug.injectionMethod = drug.injectionMethod;
        setErrorMessage(currentDrug, "injectionMethod");
        break;
      case "reactions":
        currentDrug.reactions = drug.reactions;
        break;
      case "amountDiscarded":
        currentDrug.amountDiscarded = drug.amountDiscarded;
        if (drug.amountDiscarded && !isPositiveNum(drug.amountDiscarded)) {
          currentDrug.amountDiscardedErrorMessage = "Must be a positive number";
        } else {
          currentDrug.amountDiscardedErrorMessage = "";
        }
        break;
      case "discardMethod":
        currentDrug.discardMethod = drug.discardMethod;
        break;
      case "remainingUse":
        currentDrug.remainingUse = drug.remainingUse;
        break;

      default:
    }
    const update = [...otherDrugs, currentDrug];

    setDrugs(update);
  };

  const setErrorMessage = (drug: any, field: string) => {
    const dataField = field as keyof DrugUsed;
    const errorField = (field + "ErrorMessage") as keyof DrugUsed;
    drug[errorField] = drug[dataField] ? "" : "Required";
  };

  //update all input validation
  const updateDrug = (drug: DrugUsed) => {
    if (!drug.vial) {
      drug.vialErrorMessage = "Required";
    } else {
      drug.vialErrorMessage = "";
    }
    if (!drug.drug) {
      drug.drugErrorMessage = "Required";
    } else {
      drug.drugErrorMessage = "";
    }
    if (!drug.amountUsed) {
      drug.amountUsedErrorMessage = "Required";
    } else if (!isPositiveNum(drug.amountUsed)) {
      drug.amountUsedErrorMessage = "Must be a positive number";
    } else {
      drug.amountUsedErrorMessage = "";
    }
    if (!drug.injectionMethod) {
      drug.injectionMethodErrorMessage = "Required";
    } else {
      drug.injectionMethodErrorMessage = "";
    }
    if (drug.amountDiscarded && !isPositiveNum(drug.amountDiscarded)) {
      drug.amountDiscardedErrorMessage = "Must be a positive number";
    } else {
      drug.amountDiscardedErrorMessage = "";
    }

    const items = drugs.filter(({ id }) => id !== drug.id);
    const update = [...items, drug];

    setDrugs(update);
  };

  const updateDrugAuthorization = (newDrugAuthorization: DrugAuthorization | undefined) => {
    let isValid = true;
    isValid = updateDrugAuthorizationFromInput(newDrugAuthorization, "officer");
    isValid = updateDrugAuthorizationFromInput(newDrugAuthorization, "date") && isValid;
    return isValid;
  };

  const updateDrugAuthorizationFromInput = (newDrugAuthorization: DrugAuthorization | undefined, type: string) => {
    let isValid = true;
    if (newDrugAuthorization) {
      if (type === "officer") {
        if (!newDrugAuthorization?.officer) {
          newDrugAuthorization.officerErrorMessage = "Required";
          isValid = false;
        } else {
          newDrugAuthorization.officerErrorMessage = "";
        }
      }
      if (type === "date") {
        if (!newDrugAuthorization?.date) {
          newDrugAuthorization.dateErrorMessage = "Required";
          isValid = false;
        } else {
          newDrugAuthorization.dateErrorMessage = "";
        }
      }
      setDrugAuthorization(newDrugAuthorization);
    }
    return isValid;
  };

  const renderDrugs = () => {
    if (drugs && from(drugs).any()) {
      return (
        <>
          {from(drugs)
            .orderBy((item) => item.id)
            .toArray()
            .map((item) => {
              const { id } = item;
              return (
                <AddDrug
                  {...item}
                  update={updateDrugFromInput}
                  remove={removeDrug}
                  key={id}
                />
              );
            })}

          <AddDrugAuthorization
            drugAuthorization={drugAuthorization}
            agency={complaintData?.ownedBy ?? "COS"}
            update={updateDrugAuthorizationFromInput}
          />
        </>
      );
    }
  };

  const isValid = (): boolean => {
    let isValid = true;

    if (!species) {
      isValid = false;
    }

    if (tags.length > 0) {
      from(tags)
        .orderBy((item) => item.id)
        .toArray()
        .map((item) => {
          if (!item.number) {
            isValid = false;
          }
          updateEarTag(item);
        });
    }

    if (drugs.length > 0) {
      let isDrugItemValid = true;
      from(drugs)
        .orderBy((item) => item.id)
        .toArray()
        .map((item) => {
          if (
            !item.vial ||
            !item.drug ||
            !item.amountUsed ||
            !isPositiveNum(item.amountUsed) ||
            !item.injectionMethod
          ) {
            isDrugItemValid = false;
          }
          updateDrug(item);
        });
      isValid = updateDrugAuthorization(drugAuthorization) && isDrugItemValid;
    }

    if (outcome) {
      if (!outcomeOfficer) {
        isValid = false;
        setOutcomeOfficerErrorMessage("Required");
      }
      if (!outcomeDate) {
        isValid = false;
        setOutcomeDateErrorMessage("Required");
      }
    }
    return isValid;
  };

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <ToastContainer />

      <div className="comp-animal-outcome-report">
        <div className="equipment-item">
          <div className="equipment-item-header">
            <div className="title">
              <h6>Animal {pad((indexItem + 1)?.toString(), 2)}</h6>
            </div>
          </div>
        </div>
        <div id="comp-outcome-report-animal-information-heading">Animal information</div>

        <div className="comp-animal-outcome-report-inner-spacing">
          <Row>
            <Col>
              <label
                htmlFor="select-species"
                className="label-margin-bottom"
              >
                Species
              </label>
              <CompSelect
                id="select-species"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={speciesList}
                enableValidation={true}
                placeholder="Select"
                onChange={handleSpeciesChange}
                errorMessage={speciesErrorMessage}
                defaultOption={animalOutcomeItemData?.species}
              />
            </Col>
            <Col>
              <label
                htmlFor="select-sex"
                className="label-margin-bottom"
              >
                Sex
              </label>
              <CompSelect
                id="select-sex"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={sexes}
                enableValidation={false}
                placeholder={"Select"}
                onChange={(sex: any) => setSex(sex)}
                defaultOption={animalOutcomeItemData?.sex}
              />
            </Col>
            <Col>
              <label
                htmlFor="select-age"
                className="label-margin-bottom"
              >
                Age
              </label>
              <CompSelect
                id="select-age"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={ages}
                enableValidation={false}
                placeholder={"Select"}
                onChange={(age: any) => setAge(age)}
                defaultOption={animalOutcomeItemData?.age}
              />
            </Col>
            <Col>
              <label
                htmlFor="select-category-level"
                className="label-margin-bottom"
              >
                Category level
              </label>
              <CompSelect
                id="select-category-level"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={threatLevels}
                enableValidation={false}
                placeholder={"Select"}
                onChange={(threatLevel: any) => setThreatLevel(threatLevel)}
                defaultOption={animalOutcomeItemData?.threatLevel}
              />
            </Col>
            <Col>
              <label
                htmlFor="select-conflict-history"
                className="label-margin-bottom"
              >
                Conflict history
              </label>
              <CompSelect
                id="select-conflict-history"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={conflictHistories}
                enableValidation={false}
                placeholder={"Select"}
                onChange={(conflictHistory: any) => setConflictHistory(conflictHistory)}
                defaultOption={animalOutcomeItemData?.conflictHistory}
              />
            </Col>
          </Row>
        </div>

        {renderEarTags()}
        {tags.length < 2 && (
          <Button
            className="comp-animal-outcome-add-button"
            title="Add ear tag"
            variant="link"
            onClick={() => addEarTag()}
          >
            <BsPlusCircle size={16} />
            <span> Add ear tag</span>
          </Button>
        )}

        {renderDrugs()}
        <Button
          className="comp-animal-outcome-add-button"
          title="Add drug"
          variant="link"
          onClick={() => addDrug()}
        >
          <BsPlusCircle size={16} />
          <span> Add drug</span>
        </Button>

        <div
          id="comp-outcome-report-outcome-heading"
          className="comp-outcome-spacing"
        >
          Outcome
        </div>
        <div className="comp-animal-outcome-report-inner-spacing comp-margin-top-sm">
          <Row>
            <Col
              className="mt-4 mb-3"
              md={4}
            >
              <CompSelect
                id="select-ears"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={outcomes}
                enableValidation={false}
                placeholder={"Select"}
                onChange={(evt) => {
                  handleOutcomeChange(evt);
                }}
                defaultOption={animalOutcomeItemData?.outcome}
              />
            </Col>
            <Col md={4}>
              <div
                className="animal-outcome-label-input-pair"
                id="officer-assigned-pair-id"
              >
                <label
                  id="officer-assigned-select-label-id"
                  htmlFor="officer-assigned-select-id"
                >
                  Officer
                </label>
                <CompSelect
                  id="officer-assigned-select-id"
                  classNamePrefix="comp-select"
                  className="animal-outcome-details-input"
                  options={officers}
                  placeholder="Select"
                  enableValidation={true}
                  errorMessage={outcomeOfficerErrorMessage}
                  onChange={(evt) => {
                    handleOutcomeOfficerChange(evt);
                  }}
                  value={outcomeOfficer}
                />
              </div>
            </Col>

            <Col>
              <div
                className="animal-outcome-label-input-pair"
                id="officer-assigned-pair-id"
              >
                <label
                  id="complaint-incident-time-label-id"
                  htmlFor="complaint-incident-time"
                >
                  Date
                </label>
                <ValidationDatePicker
                  id="equipment-day-set"
                  maxDate={new Date()}
                  onChange={(date: Date) => handleOutcomeDateChange(date)}
                  selectedDate={outcomeDate}
                  classNamePrefix="comp-details-edit-calendar-input"
                  className={"animal-outcome-details-input"}
                  placeholder={"Select"}
                  errMsg={outcomeDateErrorMessage}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="comp-outcome-report-actions">
          <Button
            id="equipment-cancel-button"
            title="Cancel Outcome"
            className="comp-outcome-cancel"
            onClick={handleCancelAnimalOutcome}
          >
            Cancel
          </Button>
          <Button
            id="equipment-save-button"
            title="Save Outcome"
            className="comp-outcome-save"
            onClick={handleSaveAnimalOutcome}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
