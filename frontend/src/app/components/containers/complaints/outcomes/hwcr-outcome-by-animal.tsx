import { FC, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { from } from "linq-to-typescript";
import { useAppSelector } from "../../../../hooks/hooks";
import { AnimalOutcomeInput } from "./animal-outcomes/animal-outcome-input";
import { AnimalOutcome } from "../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { selectComplaint } from "../../../../store/reducers/complaints";
import { WildlifeComplaint } from "../../../../types/app/complaints/wildlife-complaint";
import { AnimalOutcomeItem } from "./animal-outcomes/animal-outcome-item";

export const HWCROutcomeByAnimal: FC = () => {
  const complaint = useAppSelector(selectComplaint);

  const { species, delegates, ownedBy: agency } = (complaint as WildlifeComplaint) || {};
  const [animals, setAnimals] = useState<Array<AnimalOutcome>>([]);
  const [showForm, setShowForm] = useState(false);
  const [assigned, setAssigned] = useState("");

  useEffect(() => {
    if (delegates && from(delegates).any()) {
      const assigned = delegates.find((item) => item.type === "ASSIGNEE");
      if (assigned && assigned?.person !== null) {
        const {
          person: { id },
        } = assigned;
        setAssigned(id);
      }
    }
  }, [complaint, delegates]);

  const renderAnimals = () => {
    if (animals && from(animals).any()) {
      return animals.map(outcome => {
        const { id } = outcome;
        return <AnimalOutcomeItem {...outcome} agency={agency} key={id}/>
      })
    }
  };

  const add = (model: AnimalOutcome) => {
    const update = [...animals, model];
    setAnimals(update);
    setShowForm(false);
  };

  const cancel = () => {
    setShowForm(false);
  };

  return (
    <div className="comp-outcome-report-block">
      <h6>Outcome by animal</h6>
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
          <AnimalOutcomeInput
            animalCount={1 + animals.length}
            agency={agency}
            assigned={assigned}
            species={species}
            add={add}
            cancel={cancel}
          />
        )}
      </div>
    </div>
  );
};
