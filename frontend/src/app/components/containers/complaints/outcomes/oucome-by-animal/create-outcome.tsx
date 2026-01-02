import { FC, useEffect, useRef, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { ValidationDatePicker } from "@common/validation-date-picker";
import { CompSelect } from "@components/common/comp-select";
import { BsExclamationCircleFill } from "react-icons/bs";
import { useAppSelector } from "@hooks/hooks";
import {
  selectAgeDropdown,
  selectSexDropdown,
  selectSpeciesCodeDropdown,
  selectThreatLevelDropdown,
  selectActiveWildlifeComplaintOutcome,
  selectOutcomeActionedByOptions,
} from "@store/reducers/code-table";
import { AnimalOutcome } from "@apptypes/app/complaints/outcomes/wildlife/animal-outcome";
import { AnimalTagV2 } from "@apptypes/app/complaints/outcomes/wildlife/animal-tag";
import type { DrugUsed as DrugUsedData } from "@apptypes/app/complaints/outcomes/wildlife/drug-used";
import Option from "@apptypes/app/option";
import { selectOfficerAndCollaboratorListByAgency } from "@store/reducers/officer";
import { from } from "linq-to-typescript";
import { EarTag } from "./ear-tag";
import { DrugUsed } from "./drug-used";
import { DrugAuthorization } from "@apptypes/app/complaints/outcomes/wildlife/drug-authorization";
import { DrugAuthorizedBy } from "./drug-authorized-by";
import { REQUIRED } from "@constants/general";
import { v4 as uuidv4 } from "uuid";
import { ToggleError } from "@common/toast";
import { getNextOrderNumber } from "@components/containers/complaints/outcomes/hwcr-outcome-by-animal-v2";
import { ValidationTextArea } from "@common/validation-textarea";
import { selectComplaintLargeCarnivoreInd } from "@store/reducers/complaints";
import { getDropdownOption } from "@/app/common/methods";
import { OUTCOMES_REQUIRING_ACTIONED_BY } from "@/app/constants/outcomes-requiring-actioned-by";

type props = {
  index: number;
  assignedOfficer: string;
  agency: string;
  species: string;
  save: Function;
  cancel: Function;
  outcomeRequired: boolean;
};

//-- this object is used to create an empty outcome
//-- do not export this object
const defaultOutcome: AnimalOutcome = {
  id: "",
  species: "",
  sex: "",
  age: "",
  threatLevel: "",
  identifyingFeatures: "",
  tags: [],
  drugs: [],
  outcome: "",
  officer: "",
  date: undefined,
  order: 0,
};

const defaultAuthorization: DrugAuthorization = {
  officer: "",
  date: new Date(),
};

export const CreateAnimalOutcome: FC<props> = ({
  index,
  assignedOfficer: officer,
  agency,
  species,
  save,
  cancel,
  outcomeRequired,
}) => {
  //-- select data from redux
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const outcomes = useAppSelector(selectActiveWildlifeComplaintOutcome);
  const outcomeActionedByOptions = useAppSelector(selectOutcomeActionedByOptions);
  const officers = useAppSelector(selectOfficerAndCollaboratorListByAgency);
  const isLargeCarnivore = useAppSelector(selectComplaintLargeCarnivoreInd);
  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  //-- error handling
  const [speciesError, setSpeciesError] = useState("");
  const [officerError, setOfficerError] = useState("");
  const [outcomeDateError, setOutcomeDateError] = useState("");
  const [outcomeActionedByError, setOutcomeActionedByError] = useState("");

  //-- new input data
  // eslint-disable-line no-console, max-len
  const [data, applyData] = useState<AnimalOutcome>({ ...defaultOutcome, species });

  // Determine if the actioned by field should be shown
  const [showActionedBy, setShowActionedBy] = useState(false);
  useEffect(() => {
    if (data.outcomeActionedBy || (data.outcome && OUTCOMES_REQUIRING_ACTIONED_BY.includes(data.outcome))) {
      setShowActionedBy(true);
    } else {
      setShowActionedBy(false);
    }
  }, [data.outcome, data.outcomeActionedBy]);

  //-- refs
  // eslint-disable-next-line @typescript-eslint/no-array-constructor
  const earTagRefs = useRef(Array(0));
  const drugRefs = useRef(Array(0));
  const authorizationRef = useRef({ isValid: Function });

  //-- input handlers
  const updateModel = (
    property: string,
    value: string | Date | Array<AnimalTagV2 | DrugUsedData> | DrugAuthorization | null | undefined,
  ) => {
    let model = { ...data, [property]: value };

    if (property === "outcome" && (!value || !OUTCOMES_REQUIRING_ACTIONED_BY.includes(value as string))) {
      model = { ...model, outcomeActionedBy: undefined };
    } else if (property === "outcome" && value && OUTCOMES_REQUIRING_ACTIONED_BY.includes(value as string)) {
      model = { ...model, outcomeActionedBy: agency };
    }
    applyData(model);
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
    const nextOrder = getNextOrderNumber<DrugUsedData>(drugs);

    let id = uuidv4().toString();

    const update = [
      ...drugs,
      {
        id,
        vial: "",
        drug: "",
        amountUsed: "",
        remainingUse: null,
        injectionMethod: "",
        additionalComments: "",
        officer: officer ?? "",
        order: nextOrder,
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

  const updateDrugUsed = (drug: DrugUsedData) => {
    const { drugs: source } = data;

    const items = source.filter(({ id }) => id !== drug.id);
    const update = from([...items, drug])
      .orderBy((item) => item.order)
      .toArray();

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

      if (OUTCOMES_REQUIRING_ACTIONED_BY.includes(outcome) && !data.outcomeActionedBy) {
        _isValid = false;
        setOutcomeActionedByError(REQUIRED);
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

    if (data.drugAuthorization && authorizationRef.current && !authorizationRef.current.isValid()) {
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

  const handleOutcomeChange = (input: Option | null) => {
    updateModel("outcome", input?.value);

    if (outcomeActionedByError && !data.outcomeActionedBy) {
      setOutcomeActionedByError("");
    }
  };

  const handleActionedByChange = (input: Option | null) => {
    updateModel("outcomeActionedBy", input?.value);

    if (outcomeActionedByError && input?.value) {
      setOutcomeActionedByError("");
    }
  };

  const handleSave = () => {
    if (isValid()) {
      save(data);
    } else ToggleError("Error adding animal outcome");
  };

  const handleCancel = () => {
    cancel(index);
  };

  return (
    <Card
      className="comp-animal-card comp-outcome-report-block"
      border={showSectionErrors ? "danger" : "default"}
    >
      <Card.Header className="comp-card-header">
        <div className="comp-card-header-title">
          <h4>Add animal</h4>
        </div>
      </Card.Header>

      <Card.Body>
        {showSectionErrors && (
          <div className="section-error-message">
            <BsExclamationCircleFill />
            <span>
              {outcomeRequired
                ? "Outcome of animal is required to close the complaint once captured."
                : "Save section before closing the complaint."}
            </span>
          </div>
        )}

        <div className="comp-outcome-report-form comp-details-form">
          <fieldset>
            <legend
              className="mb-3"
              id="comp-outcome-report-animal-information-heading"
            >
              Animal information
            </legend>

            <div className="comp-details-form-row">
              <label htmlFor="select-species">
                Species<span className="required-ind">*</span>
              </label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="select-species"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={speciesList}
                  enableValidation={true}
                  placeholder="Select"
                  onChange={handleSpeciesChange}
                  defaultOption={getDropdownOption(data.species, speciesList)}
                  errorMessage={speciesError}
                  isClearable={true}
                />
              </div>
            </div>
            <div className="comp-details-form-row">
              <label htmlFor="select-sex">Sex</label>
              <div className="comp-details-input full-width">
                {" "}
                <CompSelect
                  id="select-sex"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  options={sexes}
                  enableValidation={false}
                  placeholder={"Select"}
                  onChange={(evt) => {
                    updateModel("sex", evt?.value);
                  }}
                  isClearable={true}
                />
              </div>
            </div>
            <div className="comp-details-form-row">
              <label htmlFor="select-age">Age</label>
              <div className="comp-details-input full-width">
                <CompSelect
                  id="select-age"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  options={ages}
                  enableValidation={false}
                  placeholder={"Select"}
                  onChange={(evt) => {
                    updateModel("age", evt?.value);
                  }}
                  isClearable={true}
                />
              </div>
            </div>
            <div
              className="comp-details-form-row"
              id="identifying-features"
            >
              <label htmlFor="outcome-decision-rationale">Identifying features</label>
              <div className="comp-details-input full-width">
                <ValidationTextArea
                  className="comp-form-control"
                  id="outcome-identifying-features"
                  defaultValue={data.identifyingFeatures}
                  rows={2}
                  errMsg={""}
                  maxLength={4000}
                  onChange={(e: any) => updateModel("identifyingFeatures", e.trim())}
                />
              </div>
            </div>
            {isLargeCarnivore && (
              <div className="comp-details-form-row">
                <label htmlFor="select-category-level">Category level</label>
                <CompSelect
                  id="select-category-level"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={threatLevels}
                  enableValidation={false}
                  placeholder={"Select"}
                  onChange={(evt) => {
                    updateModel("threatLevel", evt?.value);
                  }}
                  isClearable={true}
                />
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="mb-3">Ear tags</legend>
            {renderEarTags()}
            {data.tags.length < 2 && (
              <Button
                variant="outline-primary"
                size="sm"
                title="Add ear tag"
                onClick={() => addEarTag()}
              >
                <i className="bi bi-plus-circle"></i>
                <span>Add ear tag</span>
              </Button>
            )}
          </fieldset>

          <fieldset className="comp-drug-form my-4">
            <legend className="mb-3">Drugs</legend>
            {renderDrugsUsed()}

            <Button
              className="comp-add-drug-btn"
              variant="outline-primary"
              size="sm"
              title="Add drug"
              onClick={() => addDrugUsed()}
            >
              <i className="bi bi-plus-circle"></i>
              <span>Add drug</span>
            </Button>
          </fieldset>

          <fieldset>
            <legend
              className="mb-3"
              id="comp-outcome-report-outcome-heading"
            >
              Outcome details
            </legend>

            <div className="comp-details-form">
              <div className="comp-details-form-row">
                <label htmlFor="select-ears">Outcome</label>
                <div className="comp-details-input full-width">
                  <CompSelect
                    id="select-ears"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={outcomes}
                    enableValidation={false}
                    onChange={(evt) => {
                      handleOutcomeChange(evt);
                    }}
                    isClearable={true}
                  />
                </div>
              </div>
              {showActionedBy && (
                <div className="comp-details-form-row">
                  <label htmlFor="select-actioned-by">
                    Outcome actioned by <span className="required-ind">*</span>
                  </label>
                  <div className="comp-details-input full-width">
                    <CompSelect
                      id="select-actioned-by"
                      showInactive={false}
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={outcomeActionedByOptions}
                      enableValidation={false}
                      value={getDropdownOption(data.outcomeActionedBy, outcomeActionedByOptions)}
                      onChange={(evt) => {
                        handleActionedByChange(evt);
                      }}
                      isClearable={true}
                      errorMessage={outcomeActionedByError}
                    />
                  </div>
                </div>
              )}
              <div
                className="comp-details-form-row"
                id="officer-assigned-pair-id"
              >
                <label
                  id="officer-assigned-select-label-id"
                  htmlFor="officer-assigned-select-id"
                >
                  Officer
                </label>
                <div className="comp-details-input full-width">
                  <CompSelect
                    id="officer-assigned-select-id"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={officers}
                    placeholder="Select"
                    enableValidation={true}
                    onChange={(evt) => {
                      handleOfficerChange(evt);
                    }}
                    value={getDropdownOption(data.officer, officers)}
                    errorMessage={officerError}
                    isClearable={true}
                  />
                </div>
              </div>
              <div className="comp-details-form-row">
                <label
                  id="complaint-incident-time-label-id"
                  htmlFor="complaint-incident-time"
                >
                  Date
                </label>
                <div className="comp-details-input">
                  <ValidationDatePicker
                    id="equipment-day-set"
                    maxDate={new Date()}
                    onChange={(input: Date) => {
                      handleOutcomeDateChange(input);
                    }}
                    selectedDate={data?.date}
                    classNamePrefix="comp-details-edit-calendar-input"
                    className={"animal-outcome-details-input"}
                    errMsg={outcomeDateError}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <div className="comp-details-form-buttons mt-4">
            <Button
              variant="outline-primary"
              id="equipment-cancel-button"
              title="Cancel Outcome"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              id="equipment-save-button"
              title="Save Outcome"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
