import { FC, useState } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { from } from "linq-to-typescript";
import { AnimalOutcomeInput } from "./animal-outcome-input";
import { AnimalOutcome } from "../../../../types/app/complaints/outcomes/wildlife/animal-outcome";

export const HWCROutcomeByAnimal: FC = () => {
  const [animals, setAnimals] = useState<Array<AnimalOutcome>>([]);
  const [showForm, setShowForm] = useState(false);

  const renderAnimals = () => {
    if (animals && from(animals).any()) {
      return <>animal list</>;
    }
  };

  const add = (model: AnimalOutcome) => {
    const update = [...animals, model];
    setAnimals(update);
  };

  const cancel = () => {
    setAnimals([]);
    setShowForm(false);
  };

  return (
    <div className="comp-outcome-report-block">
      <h5>Outcome by animal</h5>
      <div className="comp-outcome-report-button">
        {!showForm ? (
          <>
            {renderAnimals()}
            <Button
              id="outcome-report-add-animal"
              title="Add animal"
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              <span>Add animal</span>
              <BsPlusCircle />
            </Button>
          </>
        ) : (
          <AnimalOutcomeInput add={add} cancel={cancel} />
        )}
      </div>
    </div>
  );
};
