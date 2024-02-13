import { FC, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { from } from "linq-to-typescript";
import { useAppSelector } from "../../../../hooks/hooks";
import { AddAnimalOutcome } from "./animal-outcomes/add-animal-outcome";
import { AnimalOutcome } from "../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { selectComplaint } from "../../../../store/reducers/complaints";
import { WildlifeComplaint } from "../../../../types/app/complaints/wildlife-complaint";
import { AnimalOutcomeItem } from "./animal-outcomes/animal-outcome-item";
import { EditAnimalOutcome } from "./animal-outcomes/edit-animal-outcome";

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

  const add = (model: AnimalOutcome) => {
    const update = [...animals, model];
    setAnimals(update);
    setShowForm(false);
  };

  const cancel = () => {
    setShowForm(false);
  };

  const updateEditFlag = (id: number, isEditable: boolean) => {
    if (from(animals).any((item) => item.id === id)) {
      let original = from(animals).first((item) => item.id === id);
      let editable = { ...original, isEditable };

      let index = animals.findIndex((item) => item.id === id);

      let update = [...animals.slice(0, index), editable, ...animals.slice(index + 1)];
      setAnimals(update);
    }
  };

  const edit = (id: number) => {
    updateEditFlag(id, true);
  };

  const cancelEdit = (id: number) => {
    updateEditFlag(id, false);
  };

  const update = (model: AnimalOutcome) => {
    const { id } = model;

    if (from(animals).any((item) => item.id === id)) {
      const filtered = animals.filter((item) => item.id !== id);
      const updated = [...filtered, model];
      const update = from(updated)
        .orderBy((item) => item.id)
        .toArray();

      setAnimals(update);
    }
  };

  const renderAnimals = () => {
    if (animals && from(animals).any()) {
      return animals.map((outcome) => {
        const { id, isEditable } = outcome;

        return isEditable ? (
          <EditAnimalOutcome {...outcome} agency={agency} update={update} cancel={cancelEdit} key={id} />
        ) : (
          <AnimalOutcomeItem {...outcome} agency={agency} edit={edit} key={id} />
        );
      });
    }
  };

  return (
    <div className="comp-outcome-report-block">
      <h6>Outcome by animal</h6>
      <div className="comp-outcome-report-button">
        {renderAnimals()}

        {!showForm ? (
          <>
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
          <AddAnimalOutcome
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
