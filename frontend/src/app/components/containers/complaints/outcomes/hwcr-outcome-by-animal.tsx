import { FC, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { useAppSelector } from "../../../../hooks/hooks";
import { AnimalOutcome } from "../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { selectComplaint } from "../../../../store/reducers/complaints";
import { AnimalOutcomeItem } from "./animal-outcomes/animal-outcome-item";
import { EditAnimalOutcome } from "./animal-outcomes/edit-animal-outcome";
import { selectSpeciesCodeDropdown } from "../../../../store/reducers/code-table";
import { WildlifeComplaint } from "../../../../types/app/complaints/wildlife-complaint";
import { from } from "linq-to-typescript";

import Option from "../../../../types/app/option";

export const HWCROutcomeByAnimal: FC = () => {

  const [animalOutcomeData, setAnimalOutcomeData] = useState<Array<AnimalOutcome>>([]);
  const [showAnimalOutcomeAddForm, setShowAnimalOutcomeAddForm] = useState<boolean>(false)
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const complaintData = useAppSelector(selectComplaint);

  const {delegates} = complaintData as WildlifeComplaint || {};

  const [assigned, setAssigned] = useState<Option>();

  useEffect(() => {
    if (delegates && from(delegates).any()) {
      const assigned = delegates.find((item) => item.type === "ASSIGNEE");
      if (assigned && assigned?.person !== null) {
        setAssigned({value: assigned.person.id, label: assigned.person.firstName + " " + assigned.person.lastName});
      }
    }
  }, [complaintData, delegates]);

  const newEditAnimalOutcome: AnimalOutcome = {
    id: undefined,
    isInEditMode: true,
    species: speciesList.find((item) => item.value === (complaintData as WildlifeComplaint)?.species),
    age: undefined,
    sex: undefined,
    threatLevel: undefined,
    conflictHistory: undefined,
    tags: [],
    drugs: [],
    drugAuthorization: 
    {
      officer: assigned?.value ?? "",
      date: new Date(),
    },
    outcome: undefined,
    officer: assigned,
    date: undefined,
  }; 

  const handleDelete = (indexItem: number) => {
    animalOutcomeData.splice(indexItem,1);
    setAnimalOutcomeData([...animalOutcomeData]);
  }

  const handleEdit = (indexItem: number) => {
    const newAnimalOutcomeArr = animalOutcomeData?.map((animalOutcome,i) => {
      if(i === indexItem) return {...animalOutcome, isInEditMode: true}
      else return animalOutcome
    });
    if(setAnimalOutcomeData) setAnimalOutcomeData(newAnimalOutcomeArr);
  }

  return (
    <div className="comp-outcome-report-block">
      <h6>Outcome by animal</h6>
      {animalOutcomeData && animalOutcomeData.length > 0 ? animalOutcomeData.map((animalOutcome,indexItem)=>
        animalOutcome.isInEditMode? 
          <EditAnimalOutcome
            key={animalOutcome?.id}
            animalOutcomeItemData={animalOutcome}
            indexItem={indexItem}
            animalOutcomeData={animalOutcomeData}
            setAnimalOutcomeData={setAnimalOutcomeData}
            editMode={true}

          />
          :
          <AnimalOutcomeItem
            key={animalOutcome?.id}
            animalOutcome={animalOutcome}
            handleEdit={handleEdit}
            indexItem={indexItem}
            handleDelete={handleDelete}
          />
      ): null}
      {/* Add Equipment Form */}
      {showAnimalOutcomeAddForm ?
        <EditAnimalOutcome
          key={animalOutcomeData.length}
          animalOutcomeItemData={newEditAnimalOutcome}
          animalOutcomeData={animalOutcomeData}
          setAnimalOutcomeData={setAnimalOutcomeData}
          setShowAnimalOutcomeAddForm={setShowAnimalOutcomeAddForm}
          indexItem={animalOutcomeData.length}
          editMode={false}
        />
        : null
      }
      { !showAnimalOutcomeAddForm ?
        <div className="comp-outcome-report-button">
          <Button
            id="outcome-report-add-animal-outcome"
            title="Add Animal Outcome"
            variant="primary"
            onClick={() => setShowAnimalOutcomeAddForm(true)}
          >
              <span>Add animal</span>
            <BsPlusCircle />
          </Button>
        </div>
        : null
      }
    </div>
  );
};
