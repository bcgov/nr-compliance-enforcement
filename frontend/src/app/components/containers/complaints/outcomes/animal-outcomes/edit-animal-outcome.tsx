import { FC, useState } from "react";
import { AnimalTag } from "../../../../../types/app/complaints/outcomes/wildlife/animal-tag";
import { DrugAuthorization } from "../../../../../types/app/complaints/outcomes/wildlife/drug-authorization";
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
import { Row, Col } from "react-bootstrap";
import { CompSelect } from "../../../../common/comp-select";
import Option from "../../../../../types/app/option";

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
    isEditable,
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

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <div className="comp-outcome-report-container">
        <h5>Animal {pad(id.toString(), 2)}</h5>
      </div>
      <div className="comp-outcome-report-container">Animal information</div>

      <div className="comp-outcome-report-inner-spacing">
        <Row>
          <Col>
            <label htmlFor="select-species">Species</label>
            <CompSelect
              id="select-species"
              options={speciesList}
              enableValidation={false}
              placeholder={"Please select"}
              onChange={(evt) => {
                updateModel("species", evt?.value);
              }}
              value={getValue("species")}
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
              value={getValue("sex")}
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
              value={getValue("age")}
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
              value={getValue("threatLevel")}
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
              value={getValue("conflictHistory")}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
