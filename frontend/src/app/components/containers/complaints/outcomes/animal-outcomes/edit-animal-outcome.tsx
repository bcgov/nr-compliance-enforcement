import { FC, useState } from "react";
import { AnimalTag } from "../../../../../types/app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsed } from "../../../../../types/app/complaints/outcomes/wildlife/drug-used";
import { useAppSelector } from "../../../../../hooks/hooks";
import {
  selectSpeciesCodeDropdown,
  selectAgeDropdown,
  selectSexDropdown,
  selectThreatLevelDropdown,
  selectConflictHistoryDropdown,
  selectWildlifeComplaintOutcome,
} from "../../../../../store/reducers/code-table";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { AnimalOutcome } from "../../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { pad } from "../../../../../common/methods";
import { Row, Col, Button } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import Option from "../../../../../types/app/option";
import { from } from "linq-to-typescript";
import { AddEarTag } from "./add-ear-tag";
import { BsPlusCircle } from "react-icons/bs";
import { AddDrug } from "./add-drug";
import { DrugAuthorization } from "../../../../../types/app/complaints/outcomes/wildlife/drug-authorization";
import { DrugAuthorization as AddDrugAuthorization } from "./drug-authorization";
import DatePicker from "react-datepicker";

type props = {
  id: number;
  agency: string;
  species: string;
  sex: string;
  age: string;
  threatLevel: string;
  conflictHistory: string;
  tags: Array<AnimalTag>;
  drugs: Array<DrugUsed>;
  drugAuthorization?: DrugAuthorization;
  outcome: string;
  officer: string;
  date?: Date;
  isEditable: boolean;
  update: Function;
  cancel: Function;
};

export const EditAnimalOutcome: FC<props> = ({
  id,
  agency,
  species,
  sex,
  age,
  threatLevel,
  conflictHistory,
  tags,
  drugs,
  drugAuthorization,
  outcome,
  officer,
  date,
  isEditable,
  update,
  cancel,
}) => {
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);

  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  const [data, applyData] = useState<AnimalOutcome>({
    id,
    species,
    sex,
    age,
    threatLevel,
    conflictHistory,
    tags,
    drugs,
    outcome,
    officer,
    date,
    isEditable,
    drugAuthorization,
  });

  const updateModel = (property: string, value: string | Date | Array<AnimalTag | DrugUsed> | null | undefined) => {
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

  const renderEarTags = () => {
    const { tags } = data;

    if (tags && from(tags).any()) {
      let isLeftEarUsed = false;

      const selected = tags.find((item) => item.ear === "L");
      if (selected) {
        isLeftEarUsed = true;
      }

      return from(tags)
        .orderBy((item) => item.id)
        .toArray()
        .map((item) => {
          const { id } = item;
          return (
            <AddEarTag {...item} isLeftEarUsed={isLeftEarUsed} update={updateEarTag} remove={removeEarTag} key={id} />
          );
        });
    }
  };

  const addEarTag = () => {
    const { tags } = data;

    if (tags.length < 2) {
      let id = tags.length + 1;

      const update = [...tags, { id, ear: "", number: "" }];
      updateModel("tags", update);
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

  const renderDrugs = () => {
    const { drugs } = data;

    if (drugs && from(drugs).any()) {
      return (
        <>
          {from(drugs)
            .orderBy((item) => item.id)
            .toArray()
            .map((item) => {
              const { id } = item;
              return <AddDrug {...item} update={updateDrug} remove={removeDrug} key={id} />;
            })}

          <AddDrugAuthorization {...drugAuthorization} agency={agency} update={updateModel} />
        </>
      );
    }
  };

  //update({ ...data, isEditable: false })
  const handleEditAnimalOutcomeUpdate = () => {
    update({ ...data, isEditable: false });
  };

  return (
    <div className="comp-animal-outcome-report">
      <h5>Animal {pad(id.toString(), 2)}</h5>
      <div>Animal information</div>

      <div className="comp-animal-outcome-report-inner-spacing">
        <Row>
          <Col>
            <label htmlFor="select-species">Species</label>
            <CompSelect
              id="select-species"
              classNamePrefix="comp-select"
              className="comp-details-input"
              options={speciesList}
              enableValidation={false}
              placeholder={"Select"}
              onChange={(evt) => {
                updateModel("species", evt?.value);
              }}
              value={getValue("species")}
            />
          </Col>
          <Col>
            <label htmlFor="select-sex">Sex</label>
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
              value={getValue("sex")}
            />
          </Col>
          <Col>
            <label htmlFor="select-age">Age</label>
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
              value={getValue("age")}
            />
          </Col>
          <Col>
            <label htmlFor="select-category-level">Category level</label>
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
              value={getValue("threatLevel")}
            />
          </Col>
          <Col>
            <label htmlFor="select-conflict-history">Conflict history</label>
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
              value={getValue("conflictHistory")}
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

      {renderDrugs()}
      <Button className="comp-animal-outcome-add-button" title="Add drug" variant="link" onClick={() => addDrug()}>
        <BsPlusCircle size={16} />
        <span> Add drug</span>
      </Button>

      <div>Outcome</div>
      <div className="comp-animal-outcome-report-inner-spacing"></div>

      <Row>
        <Col className="mt-auto mb-3" md={4}>
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
            value={getValue("outcome")}
          />
        </Col>
        <Col md={4}>
          <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
            <label id="officer-assigned-select-label-id" htmlFor="officer-assigned-select-id">
              Officer
            </label>
            <CompSelect
              id="officer-assigned-select-id"
              classNamePrefix="comp-select"
              className="comp-details-input"
              onChange={(evt) => {
                updateModel("officer", evt?.value);
              }}
              options={officers}
              placeholder="Select"
              enableValidation={false}
              value={getValue("assigned")}
            />
          </div>
        </Col>

        <Col>
          <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
            <label id="complaint-incident-time-label-id" htmlFor="complaint-incident-time">
              Date
            </label>
            <DatePicker
              id="complaint-incident-time"
              showIcon
              dateFormat="yyyy-MM-dd"
              wrapperClassName="comp-details-edit-calendar-input"
              maxDate={new Date()}
              onChange={(evt) => {
                updateModel("date", evt);
              }}
              selected={data.date}
            />
          </div>
        </Col>
      </Row>

      <div className="comp-animal-outcome-report-actions">
        <Button
          id="outcome-cancel-button"
          title="Cancel Outcome"
          placeholder="Enter number"
          className="comp-animal-outcome-cancel"
          onClick={() => cancel(id)}
        >
          Cancel
        </Button>
        <Button
          id="outcome-save-button"
          title="Save Outcome"
          className="comp-animal-outcome-save"
          onClick={() => handleEditAnimalOutcomeUpdate()}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
