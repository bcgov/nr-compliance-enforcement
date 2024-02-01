import { FC, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { from } from "linq-to-typescript";
import { useAppSelector } from "../../../../hooks/hooks";
import { AnimalOutcomeInput } from "./animal-outcomes/animal-outcome-input";
import { AnimalOutcome } from "../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { selectComplaintCallerInformation } from "../../../../store/reducers/complaints";

export const HWCROutcomeByAnimal: FC = () => {
  const { ownedByAgencyCode } = useAppSelector(selectComplaintCallerInformation);

  const [agency, setAgency] = useState<string>("");
  const [animals, setAnimals] = useState<Array<AnimalOutcome>>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log(ownedByAgencyCode)
    if (ownedByAgencyCode) {
        const { agency } = ownedByAgencyCode;
        
        setAgency(!agency ? "" : agency)
    }
  }, [ownedByAgencyCode]);

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
          <AnimalOutcomeInput animalCount={1 + animals.length} agency={agency} add={add} cancel={cancel} />
        )}
      </div>
    </div>
  );
};
