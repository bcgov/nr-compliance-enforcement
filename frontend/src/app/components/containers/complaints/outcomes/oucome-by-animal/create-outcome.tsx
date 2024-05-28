import { FC, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { ValidationDatePicker } from "../../../../../common/validation-date-picker";
import { CompSelect } from "../../../../common/comp-select";
import { BsPlusCircle } from "react-icons/bs";
import { pad } from "../../../../../common/methods";
import { useAppSelector } from "../../../../../hooks/hooks";
import {
  selectAgeDropdown,
  selectConflictHistoryDropdown,
  selectSexDropdown,
  selectSpeciesCodeDropdown,
  selectThreatLevelDropdown,
  selectWildlifeComplaintOutcome,
} from "../../../../../store/reducers/code-table";
import { AnimalOutcomeV2 } from "../../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { AnimalTagV2 } from "../../../../../types/app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsedV2 } from "../../../../../types/app/complaints/outcomes/wildlife/drug-used";
import Option from "../../../../../types/app/option";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { from } from "linq-to-typescript";
import { EarTag } from "./ear-tag";
import { DrugUsed } from "./drug-used";
import { DrugAuthorization } from "../../../../../types/app/complaints/outcomes/wildlife/drug-authorization";
import { DrugAuthorizedBy } from "./drug-authorized-by";
import { REQUIRED } from "../../../../../constants/general";
import { v4 as uuidv4 } from "uuid";

type props = {
  index: number;
  assignedOfficer: string;
  agency: string;
  species: string;
  save: Function;
  cancel: Function;
};

//-- this object is used to create an empty outcome
//-- do not export this object
const defaultOutcome: AnimalOutcomeV2 = {
  id: "",
  species: "",
  sex: "",
  age: "",
  threatLevel: "",
  conflictHistory: "",
  tags: [],
  drugs: [],
  outcome: "",
  officer: "",
  date: new Date(),
  order: 0,
};

const defaultAuthorization: DrugAuthorization = {
  officer: "",
  date: new Date(),
};

export const CreateAnimalOutcome: FC<props> = ({ index, assignedOfficer: officer, agency, species, save, cancel }) => {
  //-- select data from redux
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);
  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  //-- misc
  const [animalNumber] = useState(index);

  //-- error handling
  const [speciesError, setSpeciesError] = useState("");
  const [officerError, setOfficerError] = useState("");
  const [outcomeDateError, setOutcomeDateError] = useState("");

  //-- new input data
  // eslint-disable-line no-console, max-len
  const [data, applyData] = useState<AnimalOutcomeV2>({ ...defaultOutcome, species, officer });

  //-- refs
  // eslint-disable-next-line @typescript-eslint/no-array-constructor
  const earTagRefs = useRef(Array(0));
  const drugRefs = useRef(Array(0));
  const authorizationRef = useRef({ isValid: Function });

  //-- input handlers
  const updateModel = (
    property: string,
    value: string | Date | Array<AnimalTagV2 | DrugUsedV2> | DrugAuthorization | null | undefined,
  ) => {
    const model = { ...data, [property]: value };
    applyData(model);
  };

  const getValue = (property: string): Option | undefined => {
    switch (property) {
      case "species": {
        const { species } = data;
        return speciesList.find((item) => item.value === species);
      }
      case "sex": {
        const { sex } = data;
        return sexes.find((item) => item.value === sex);
      }

      case "age": {
        const { age } = data;
        return ages.find((item) => item.value === age);
      }

      case "threatLevel": {
        const { threatLevel } = data;
        return threatLevels.find((item) => item.value === threatLevel);
      }

      case "conflictHistory": {
        const { conflictHistory } = data;
        return conflictHistories.find((item) => item.value === conflictHistory);
      }

      case "officer":
      case "assigned": {
        const { officer } = data;
        return officers.find((item) => item.value === officer);
      }

      case "outcome": {
        const { outcome } = data;
        return outcomes.find((item) => item.value === outcome);
      }
    }
  };

  const handleSpeciesChange = (input: Option | null) => {
    updateModel("species", input?.value);
    setSpeciesError(!(input ?? undefined) ? "Required" : "");
  };

  //-- handle adding / removing ear tags
  const renderEarTags = () => {
    const { tags } = data;

    if (tags && from(tags).any()) {
      return from(tags)
        .orderBy((item) => item.order)
        .toArray()
        .map((item, idx) => {
          const { id } = item;
          return (
            <EarTag
              key={id}
              {...item}
              update={updateEarTag}
              remove={removeEarTag}
              ref={(el) => (earTagRefs.current[idx] = el)}
              // ref={(el) => earTagRefs.current.push(el)}
            />
          );
        });
    }
  };

  const addEarTag = () => {
    const { tags } = data;

    if (tags.length < 2) {
      let id = uuidv4().toString();

      const update = !from(tags).any()
        ? [{ id, ear: "L", identifier: "", order: 1 }]
        : [...tags, { id, ear: tags[0].ear === "L" ? "R" : "L", identifier: "", order: 2 }];

      updateModel("tags", update);
    }
  };

  const removeEarTag = (id: string) => {
    const { tags: source } = data;
    const items = source.filter((tag) => id !== tag.id);

    const refs = earTagRefs.current.filter((r) => {
      if (r) {
        return r.id !== null && r.id !== id;
      }

      return false;
    });

    const update =
      items.length === 0
        ? []
        : from(items)
            .orderBy((item) => item.order)
            .toArray()
            .map((item, idx) => {
              return { ...item, id: uuidv4().toString(), order: idx + 1 };
            });

    earTagRefs.current = refs;
    updateModel("tags", update);
  };

  const updateEarTag = (tag: AnimalTagV2) => {
    const { tags: source } = data;

    const items = source.filter(({ id }) => id !== tag.id);
    const update = [...items, tag];

    updateModel("tags", update);
  };

  //-- handle adding / removing drugs used
  const renderDrugsUsed = () => {
    const { drugs } = data;

    if (drugs && from(drugs).any()) {
      const { drugAuthorization } = data;

      if (!drugAuthorization) {
        const authorization = { ...defaultAuthorization, officer };
        updateModel("drugAuthorization", authorization);
      }

      return (
        <>
          {from(drugs)
            .orderBy((item) => item.order)
            .toArray()
            .map((item, idx) => {
              const { id } = item;
              return (
                <DrugUsed
                  {...item}
                  update={updateDrugUsed}
                  remove={removeDrugUsed}
                  key={id}
                  ref={(el) => (drugRefs.current[idx] = el)}
                />
              );
            })}

          <DrugAuthorizedBy
            drugAuthorization={drugAuthorization ?? { ...defaultAuthorization, officer }}
            agency={agency}
            update={updateModel}
            ref={authorizationRef}
          />
        </>
      );
    }
  };

  const addDrugUsed = () => {
    const { drugs } = data;

    let id = uuidv4().toString();

    const update = [
      ...drugs,
      {
        id,
        vial: "",
        drug: "",
        amountUsed: "",
        amountDiscarded: "",
        reactions: "",
        remainingUse: "",
        injectionMethod: "",
        discardMethod: "",
        officer: officer ?? "",
        order: 0,
      },
    ];
    updateModel("drugs", update);
  };

  const removeDrugUsed = (id: string) => {
    const { drugs } = data;

    const items = drugs.filter((drug) => id !== drug.id);

    const update =
      items.length === 0
        ? []
        : from(items)
            .orderBy((item) => item.order)
            .toArray()
            .map((item, idx) => {
              return { ...item, id: uuidv4().toString(), order: idx + 1 };
            });

    if (update.length === 0 && data.drugAuthorization) {
      updateModel("drugAuthorization", {
        officer: "",
        date: new Date(),
      });
    }

    updateModel("drugs", update);

    drugRefs.current = update.length === 0 ? [] : drugRefs.current.filter((item) => item.id !== null && item.id === id);
  };

  const updateDrugUsed = (drug: DrugUsedV2) => {
    const { drugs: source } = data;

    const items = source.filter(({ id }) => id !== drug.id);
    const update = [...items, drug];

    updateModel("drugs", update);
  };

  const isValid = (): boolean => {
    const { outcome, date: outcomeDate, officer } = data;
    let _isValid = true;

    if (!species) {
      _isValid = false;
      setSpeciesError(REQUIRED);
    }

    //-- if the outcome is set make sure that there's an officer and date
    if (outcome) {
      if (!officer) {
        _isValid = false;
        setOfficerError(REQUIRED);
      }

      if (!outcomeDate) {
        _isValid = false;
        setOutcomeDateError(REQUIRED);
      }
    }

    //-- validate any ear-tags, drugs-used and
    //-- drug-authorized-by components
    earTagRefs.current.forEach((tag) => {
      if (tag && !tag.isValid()) {
        _isValid = false;
      }
    });

    drugRefs.current.forEach((drug) => {
      if (drug && !drug.isValid()) {
        _isValid = false;
      }
    });

    if (!authorizationRef.current.isValid()) {
      _isValid = false;
    }

    return _isValid;
  };

  //-- event handlers
  const handleOutcomeDateChange = (input: Date) => {
    updateModel("date", input);

    if (outcomeDateError && input) {
      setOutcomeDateError("");
    }
  };

  const handleOfficerChange = (input: Option | null) => {
    updateModel("officer", input?.value);

    if (officerError && input?.value) {
      setOfficerError("");
    }
  };

  const handleSave = () => {
    if (isValid()) {
      save(data);
    }
  };

  const handleCancel = () => {
    cancel(index);
  };

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <div className="comp-animal-outcome-report">
        <div className="equipment-item">
          <div className="equipment-item-header">
            <div className="title">
              <h6>Animal {pad(animalNumber.toString(), 2)}</h6>
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
                defaultOption={getValue("species")}
                errorMessage={speciesError}
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
                onChange={(evt) => {
                  updateModel("sex", evt?.value);
                }}
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
                onChange={(evt) => {
                  updateModel("age", evt?.value);
                }}
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
                onChange={(evt) => {
                  updateModel("threatLevel", evt?.value);
                }}
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
                onChange={(evt) => {
                  updateModel("conflictHistory", evt?.value);
                }}
              />
            </Col>
          </Row>
        </div>

        {renderEarTags()}
        {data.tags.length < 2 && (
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

        {renderDrugsUsed()}
        <Button
          className="comp-animal-outcome-add-button"
          title="Add drug"
          variant="link"
          onClick={() => addDrugUsed()}
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
                  updateModel("outcome", evt?.value);
                }}
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
                  onChange={(evt) => {
                    handleOfficerChange(evt);
                  }}
                  value={getValue("officer")}
                  errorMessage={officerError}
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
                  onChange={(input: Date) => {
                    handleOutcomeDateChange(input);
                  }}
                  selectedDate={!data?.date ? new Date() : data.date}
                  classNamePrefix="comp-details-edit-calendar-input"
                  className={"animal-outcome-details-input"}
                  placeholder={"Select"}
                  errMsg={outcomeDateError}
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
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            id="equipment-save-button"
            title="Save Outcome"
            className="comp-outcome-save"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
