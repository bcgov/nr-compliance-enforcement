import { FC, useState } from "react";
import { useAppSelector } from "../../../../../hooks/hooks";
import DatePicker from "react-datepicker";
import {
  selectAgeDropdown,
  selectConflictHistoryDropdown,
  selectSexDropdown,
  selectSpeciesCodeDropdown,
  selectThreatLevelDropdown,
  selectWildlifeComplaintOutcome,
} from "../../../../../store/reducers/code-table";
import { Button, Col, Row } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import { AnimalOutcome } from "../../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { pad } from "../../../../../common/methods";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { AddEarTag } from "./add-ear-tag";
import { BsPlusCircle } from "react-icons/bs";
import { AnimalTag } from "../../../../../types/app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsed } from "../../../../../types/app/complaints/outcomes/wildlife/drug-used";
import { from } from "linq-to-typescript";
import { AddDrug } from "./add-drug";

type props = {
  animalCount: number;
  agency: string;
  add: Function;
  cancel: Function;
};

export const AnimalOutcomeInput: FC<props> = ({ animalCount, agency, add, cancel }) => {
  const species = useAppSelector(selectSpeciesCodeDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);

  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

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

    let isValid = true;

    if (!species || !age || !sex || !threatLevel || !conflictHistory) {
      isValid = false;
    }

    if (!outcome || !officer || !date) {
      isValid = false;
    }

    return isValid;
  };

  const updateModel = (property: string, value: string | Date | Array<AnimalTag | DrugUsed> | null | undefined) => {
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

  const addEarTag = () => {
    const { tags } = data;

    let id = tags.length + 1;

    const update = [...tags, { id, ear: "", number: "" }];
    updateModel("tags", update);
  };

  const renderEarTags = () => {
    const { tags } = data;

    if (tags && from(tags).any()) {
      return from(tags)
        .orderBy((item) => item.id)
        .toArray()
        .map((item) => {
          const { id } = item;
          return <AddEarTag {...item} update={updateEarTag} remove={removeEarTag} key={id} />;
        });
    }
  };

  const updateEarTag = (tag: AnimalTag) => {
    const { tags: source } = data;

    const items = source.filter(({ id }) => id !== tag.id);
    const update = [...items, tag];

    updateModel("tags", update);
  };

  const removeEarTag = (id: number) => {
    const { tags: source } = data;
    const items = source.filter((tag) => id !== tag.id);
    let updatedId = 0;

    const update = from(items)
      .orderBy((item) => item.id)
      .toArray()
      .map((item) => {
        updatedId = updatedId + 1;
        return { ...item, id: updatedId };
      });

    updateModel("tags", update);
  };

  const addDrug = () => {
    const { drugs } = data;

    let id = drugs.length + 1;

    const update = [
      ...drugs,
      {
        id,
        vial: "",
        drug: "",
        amountUsed: -1,
        amountDiscarded: -1,
        reactions: "",
        remainingUse: "",
        injectionMethod: "",
        discardMethod: "",
        officer: "",
      },
    ];
    updateModel("drugs", update);
  };

  const renderDrugs = () => {
    const { drugs } = data;

    if (drugs && from(drugs).any()) {
      return from(drugs)
        .orderBy((item) => item.id)
        .toArray()
        .map((item) => {
          const { id } = item;
          return <AddDrug {...item} update={updateDrug} remove={removeDrug} key={id} />;
        });
    }
  };

  const removeDrug = (id: number) => {
    const { drugs: source } = data;
    const items = source.filter((drug) => id !== drug.id);
    let updatedId = 0;

    const update = from(items)
      .orderBy((item) => item.id)
      .toArray()
      .map((item) => {
        updatedId = updatedId + 1;
        return { ...item, id: updatedId };
      });

    updateModel("drugs", update);
  };

  const updateDrug = (drug: DrugUsed) => {
    const { drugs: source } = data;

    const items = source.filter(({ id }) => id !== drug.id);
    const update = [...items, drug];

    updateModel("drugs", update);
  };

  const style = { border: "1px solid black" };

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <div className="comp-outcome-report-container">
        <h5>Animal {pad(animalCount.toString(), 2)}</h5>
      </div>
      <div className="comp-outcome-report-container">Animal information</div>

      <div className="comp-outcome-report-inner-spacing">
        <Row>
          <Col>
            <label htmlFor="select-species">Species</label>
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
            <label htmlFor="select-species">Sex</label>
            <CompSelect
              id="select-species"
              options={sexes}
              enableValidation={false}
              placeholder={"Please select"}
              onChange={(evt) => {
                updateModel("sex", evt?.value);
              }}
            />
          </Col>
          <Col>
            <label htmlFor="select-species">Age</label>
            <CompSelect
              id="select-species"
              options={ages}
              enableValidation={false}
              placeholder={"Please select"}
              onChange={(evt) => {
                updateModel("age", evt?.value);
              }}
            />
          </Col>
          <Col>
            <label htmlFor="select-species">Threat level</label>
            <CompSelect
              id="select-species"
              options={threatLevels}
              enableValidation={false}
              placeholder={"Please select"}
              onChange={(evt) => {
                updateModel("threatLevel", evt?.value);
              }}
            />
          </Col>
          <Col>
            <label htmlFor="select-species">Conflict history</label>
            <CompSelect
              id="select-species"
              options={conflictHistories}
              enableValidation={false}
              placeholder={"Please select"}
              onChange={(evt) => {
                updateModel("conflictHistory", evt?.value);
              }}
            />
          </Col>
        </Row>
      </div>

      {/* <!-- ear tag component --> */}
      {renderEarTags()}
      <Button id="outcome-report-add-animal" title="Add animal" variant="link" onClick={() => addEarTag()}>
        <BsPlusCircle />
        <span> Add ear tag</span>
      </Button>
      <br />
      {renderDrugs()}
      <Button id="outcome-report-add-animal" title="Add animal" variant="link" onClick={() => addDrug()}>
        <BsPlusCircle />
        <span> Add drug</span>
      </Button>
      {/* <AddEarTag add={() => {}} /> */}

      <div className="comp-outcome-report-container">Outcome</div>
      <div className="comp-outcome-report-inner-spacing">
        <Row style={style}>
          <Col className="mt-auto mb-3" md={4}>
            <CompSelect
              id="select-ears"
              options={outcomes}
              enableValidation={false}
              placeholder={"Please select"}
              onChange={(evt) => {
                updateModel("outcome", evt?.value);
              }}
            />
          </Col>
          <Col md={4}>
            <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
              <label id="officer-assigned-select-label-id">Officer Assigned</label>
              <CompSelect
                id="officer-assigned-select-id"
                classNamePrefix="comp-select"
                onChange={(evt) => {
                  updateModel("officer", evt?.value);
                }}
                className="comp-details-input"
                options={officers}
                placeholder="Select"
                enableValidation={false}
              />
            </div>
          </Col>

          <Col>
            <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
              <label id="officer-assigned-select-label-id">Date</label>
              <DatePicker
                id="complaint-incident-time"
                showIcon
                dateFormat="yyyy-MM-dd"
                wrapperClassName="comp-details-edit-calendar-input"
                maxDate={new Date()}
                onChange={(evt) => {
                  console.log(evt);
                  updateModel("date", evt);
                }}
                selected={data.date}
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className="comp-outcome-report-actions">
        <Button
          id="outcome-cancel-button"
          title="Cancel Outcome"
          placeholder="Enter number"
          className="comp-outcome-cancel"
          onClick={() => cancel()}
        >
          Cancel
        </Button>
        <Button id="outcome-save-button" title="Save Outcome" className="comp-outcome-save" onClick={() => save()}>
          Save
        </Button>
      </div>
      {/* </div> */}
    </div>
  );
};
