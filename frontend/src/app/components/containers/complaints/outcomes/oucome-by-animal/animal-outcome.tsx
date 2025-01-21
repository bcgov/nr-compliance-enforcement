import { FC, useEffect, useState } from "react";
import type { AnimalOutcome as AnimalOutcomeData } from "@apptypes/app/complaints/outcomes/wildlife/animal-outcome";
import { useAppSelector } from "@hooks/hooks";
import {
  selectAgeDropdown,
  selectEarDropdown,
  selectSexDropdown,
  selectSpeciesCodeDropdown,
  selectThreatLevelDropdown,
  selectAllWildlifeComplaintOutcome,
} from "@store/reducers/code-table";
import { from } from "linq-to-typescript";
import { BsExclamationCircleFill } from "react-icons/bs";
import { formatDate, pad } from "@common/methods";
import { selectOfficerListByAgency } from "@store/reducers/officer";
import { DrugItem } from "./drug-item";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { selectComplaintLargeCarnivoreInd } from "@/app/store/reducers/complaints";

type props = {
  index: number;
  data: AnimalOutcomeData;
  agency: string;
  edit: Function;
  remove: Function;
};

export const AnimalOutcome: FC<props> = ({ index, data, agency, edit, remove }) => {
  //-- select data from redux
  const ears = useAppSelector(selectEarDropdown);
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const outcomes = useAppSelector(selectAllWildlifeComplaintOutcome); //want to display inactive items
  const officers = useAppSelector(selectOfficerListByAgency);
  const isLargeCarnivore = useAppSelector(selectComplaintLargeCarnivoreInd);
  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const showSectionErrors = !data.outcome && !data.officer && !data.date && isInEdit.showSectionErrors;

  const [animal, setAnimal] = useState("");
  const [animalSex, setAnimalSex] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalThreatLevel, setAnimalThreatLevel] = useState("");
  const [animalIdentifyingFeatures, setAnimalIdentifyingFeatures] = useState("");
  const [animalOutcome, setAnimalOutcome] = useState("");
  const [outcomeOfficer, setOutcomeOfficer] = useState("");

  //-- misc
  const [animalNumber, setAnimalNumber] = useState(index);

  const leftEar = ears.find((ear) => ear.value === "L");
  const rightEar = ears.find((ear) => ear.value === "R");

  //-- listen for changes to the animal number
  useEffect(() => {
    setAnimalNumber(index);
  }, [index]);

  //-- get all of the values for the animal outcome and apply them
  useEffect(() => {
    const { species, sex, age, threatLevel, identifyingFeatures, outcome, officer } = data;

    if (species) {
      const selected = from(speciesList).firstOrDefault((item) => item.value === species);
      if (selected?.label) {
        setAnimal(selected.label);
      }
    }

    if (sex) {
      const selected = from(sexes).firstOrDefault((item) => item.value === sex);
      if (selected?.label) {
        setAnimalSex(selected.label);
      }
    }

    if (age) {
      const selected = from(ages).firstOrDefault((item) => item.value === age);
      if (selected?.label) {
        setAnimalAge(selected.label);
      }
    }

    if (threatLevel) {
      const selected = from(threatLevels).firstOrDefault((item) => item.value === threatLevel);
      if (selected?.label) {
        setAnimalThreatLevel(selected.label);
      }
    }

    if (identifyingFeatures) {
      setAnimalIdentifyingFeatures(identifyingFeatures);
    }

    if (outcome) {
      const selected = from(outcomes).firstOrDefault((item) => item.value === outcome);
      if (selected?.label) {
        setAnimalOutcome(selected.label);
      }
    }

    if (officer) {
      const selected = officers.find((item) => item.value === officer);
      if (selected?.label) {
        setOutcomeOfficer(selected.label);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ages, data, outcomes, sexes, speciesList, threatLevels]);

  //-- events
  const handleDeleteItem = () => {
    const { id } = data;
    remove(id);
  };

  const hendleEnableEditMode = () => {
    const { id } = data;
    edit(id);
  };

  return (
    <Card
      className="comp-animal-card comp-outcome-report-block"
      border={showSectionErrors ? "danger" : "default"}
    >
      {showSectionErrors && (
        <div className="section-error-message">
          <BsExclamationCircleFill />
          <span>Complete or delete section before closing the complaint.</span>
        </div>
      )}

      <Card.Header className="comp-card-header">
        <div className="comp-card-header-title">
          <h4>Animal {pad(animalNumber.toString(), 2)}</h4>
          <div className="comp-card-header-metadata fw-bold text-muted">
            <span>{animal}</span>
            {data?.sex && <>{data?.sex === "U" ? <span>Sex unknown</span> : <span>{animalSex}</span>}</>}
            {data?.age && <>{data?.age === "UNKN" ? <span>Age unknown</span> : <span>{animalAge}</span>}</>}
          </div>
        </div>
        <div className="comp-card-header-actions">
          <Button
            onClick={() => hendleEnableEditMode()}
            variant="outline-primary"
            size="sm"
          >
            <i className="bi bi-pencil"></i>
            <span>Edit</span>
          </Button>
          <Button
            onClick={() => handleDeleteItem()}
            variant="outline-primary"
            size="sm"
          >
            <i className="bi bi-trash3"></i>
            <span>Delete</span>
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        <Row
          as="dl"
          className="mb-3"
        >
          {data?.identifyingFeatures && (
            <Col xs={12}>
              <dt>Identifying features</dt>
              <dd>{animalIdentifyingFeatures}</dd>
            </Col>
          )}
          {data?.threatLevel && isLargeCarnivore && (
            <Col
              xs={12}
              md={6}
            >
              <dt>Category level</dt>
              <dd>{animalThreatLevel}</dd>
            </Col>
          )}
          {data?.tags && from(data?.tags).any() && (
            <Col xs={12}>
              <dt>Ear Tag{data?.tags.length > 1 && "s"}</dt>
              <dd>
                <ul className="comp-ear-tag-list">
                  {data?.tags.map(({ id, identifier, ear }) => (
                    <li key={id}>
                      ID: {identifier} ({ear === "L" ? leftEar?.label : rightEar?.label} side)
                    </li>
                  ))}
                </ul>
              </dd>
            </Col>
          )}
        </Row>

        {data?.drugs && from(data?.drugs).any() && (
          <section>
            <hr className="mt-0"></hr>
            <h5 className="fw-bold mb-3">Drugs</h5>

            <ListGroup
              as="ul"
              variant="flush"
            >
              <hr className="my-0"></hr>
              {data.drugs.map((item) => {
                const { officer, date } = data?.drugAuthorization || {};
                return (
                  <DrugItem
                    {...item}
                    officer={officer}
                    date={date}
                    key={item.id}
                  />
                );
              })}
            </ListGroup>
          </section>
        )}

        <section className="mt-0">
          <hr className="mt-0"></hr>
          <h5 className="fw-bold mb-3">Outcome details</h5>
          <Row as="dl">
            <Col
              xs={12}
              md={6}
            >
              <dt>Outcome</dt>
              <dd>{data?.outcome ? animalOutcome : "Outcome pending"}</dd>
            </Col>
            <Col
              xs={12}
              md={6}
            >
              <dt>Officer</dt>
              <dd>{data?.officer ? outcomeOfficer : "Officer pending"}</dd>
            </Col>
            <Col
              xs={12}
              md={6}
            >
              <dt>Date</dt>
              <dd>{data?.date ? formatDate(data?.date?.toString()) : "Date pending"}</dd>
            </Col>
          </Row>
        </section>
      </Card.Body>
    </Card>
  );
};
