import { FC, useState } from "react";
import { AnimalOutcomeV2 } from "../../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { useAppSelector } from "../../../../../hooks/hooks";
import {
  selectSpeciesCodeDropdown,
  selectSexDropdown,
  selectAgeDropdown,
  selectThreatLevelDropdown,
  selectConflictHistoryDropdown,
  selectWildlifeComplaintOutcome,
} from "../../../../../store/reducers/code-table";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { Button, Col, Row } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import { BsPlusCircle } from "react-icons/bs";
import { ValidationDatePicker } from "../../../../../common/validation-date-picker";
import { pad } from "../../../../../common/methods";
import Option from "../../../../../types/app/option";
import { AnimalTagV2 } from "../../../../../types/app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsedV2 } from "../../../../../types/app/complaints/outcomes/wildlife/drug-used";
import { DrugAuthorization } from "../../../../../types/app/complaints/outcomes/wildlife/drug-authorization";

type props = {
  id: string;
  index: number;
  outcome: AnimalOutcomeV2;
  agency: string;
  cancel: Function;
};

export const EditOutcome: FC<props> = ({ id, index, outcome, agency, cancel }) => {
  //-- select data from redux
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);
  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  //-- new input data
  const [data, applyData] = useState<AnimalOutcomeV2>({ ...outcome });

  //-- misc
  const [animalNumber] = useState(index + 1);

  //-- error handling
  const [speciesError, setSpeciesError] = useState("");
  const [officerError, setOfficerError] = useState("");
  const [outcomeDateError, setOutcomeDateError] = useState("");

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

      case "assigned": {
        const { officer } = data;
        return officers.find((item) => item.value === officer);
      }

      case "outcome": {
        const { outcome } = data;
        return outcomes.find((item) => item.value === outcome);
      }

      case "officer": {
        const { officer } = data;
        return officers.find((item) => item.value === officer);
      }
    }
  };

  //-- input handlers
  const updateModel = (
    property: string,
    value: string | Date | Array<AnimalTagV2 | DrugUsedV2> | DrugAuthorization | null | undefined,
  ) => {
    const model = { ...data, [property]: value };
    applyData(model);
  };

  //-- events
  const handleSpeciesChange = (input: Option | null) => {
    updateModel("species", input?.value);
    setSpeciesError(!(input ?? undefined) ? "Required" : "");
  };

  const handleOfficerChange = (input: Option | null) => {
    updateModel("officer", input?.value);

    if (officerError && input?.value) {
      setOfficerError("");
    }
  };

  const handleOutcomeDateChange = (input: Date) => {
    updateModel("date", input);

    if (outcomeDateError && input) {
      setOutcomeDateError("");
    }
  };

  const handleCancel = () => {
    cancel(id);
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
                defaultOption={getValue("sex")}
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
                defaultOption={getValue("age")}
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
                defaultOption={getValue("threatLevel")}
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
                defaultOption={getValue("conflictHistory")}
              />
            </Col>
          </Row>
        </div>

        {/* {renderEarTags()} */}
        {data.tags.length < 2 && (
          <Button
            className="comp-animal-outcome-add-button"
            title="Add ear tag"
            variant="link"
            // onClick={() => addEarTag()}
          >
            <BsPlusCircle size={16} />
            <span> Add ear tag</span>
          </Button>
        )}

        {/* {renderDrugsUsed()} */}
        <Button
          className="comp-animal-outcome-add-button"
          title="Add drug"
          variant="link"
          // onClick={() => addDrugUsed()}
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
                defaultOption={getValue("outcome")}
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
                  defaultOption={getValue("officer")}
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
                  selectedDate={data?.date}
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
            // onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
