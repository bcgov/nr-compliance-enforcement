import { FC, useState } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import {
  selectAgeDropdown,
  selectConflictHistoryDropdown,
  selectSexDropdown,
  selectSpeciesCodeDropdown,
  selectThreatLevelDropdown,
} from "../../../../store/reducers/code-table";
import { Button, Col, Row } from "react-bootstrap";
import { CompSelect } from "../../../common/comp-select";
import { AnimalOutcome } from "../../../../types/app/complaints/outcomes/wildlife/animal-outcome";

type props = {
  add: Function;
  cancel: Function;
};

export const AnimalOutcomeInput: FC<props> = ({ add, cancel }) => {
  const species = useAppSelector(selectSpeciesCodeDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);

  const [data, applyData] = useState<AnimalOutcome>({
    species: "",
    sex: "",
    age: "",
    threatLevel: "",
    conflictHistory: "",
    tags: [],
    drugs: [],
    outcome: "",
    officer: "",
  });

  const isValid = (): boolean => {
    const { species, sex, age, threatLevel, conflictHistory, outcome, officer, date } = data;

    let result = !(!species && !sex && !age && !threatLevel && !conflictHistory && !outcome && !officer && !date);
    console.log("isValid: ", result);

    return result;
  };

  const updateModel = (property: string, value: string | Date | undefined) => {
    const update = { ...data, [property]: value };

    applyData(update);
  };

  const save = () => {
    if (isValid()) {
      console.log("add animal");
    } else {
      console.log("show errors");
    }
  };

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <Row>
        <Col>
          <h5>Animal 01</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <h6>Animal Information</h6>
        </Col>
      </Row>
      <Row>
        <Col>Species involved</Col>
        <Col>Sex</Col>
        <Col>Age</Col>
        <Col>Threat level</Col>
        <Col>Conflict history</Col>
      </Row>
      <Row>
        <Col>
          <CompSelect
            id="select-species"
            options={species}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("species", evt?.value);
            }}
          />
        </Col>
        <Col>
          <CompSelect
            id="select-sex"
            options={sexes}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("sex", evt?.value);
            }}
          />
        </Col>
        <Col>
          <CompSelect
            id="select-age"
            options={ages}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("age", evt?.value);
            }}
          />
        </Col>
        <Col>
          <CompSelect
            id="select-threat-level"
            options={threatLevels}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("threatLevel", evt?.value);
            }}
          />
        </Col>
        <Col>
          <CompSelect
            id="select-conflict-history"
            options={conflictHistories}
            enableValidation={false}
            placeholder={"Please select"}
            onChange={(evt) => {
              updateModel("conflictHistory", evt?.value);
            }}
          />
        </Col>
      </Row>
      <div className="comp-outcome-report-container">
        <div className="comp-outcome-report-actions">
          <Button
            id="outcome-cancel-button"
            title="Cancel Outcome"
            className="comp-outcome-cancel"
            onClick={() => cancel()}
          >
            Cancel
          </Button>
          <Button id="outcome-save-button" title="Save Outcome" className="comp-outcome-save" onClick={() => save()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
