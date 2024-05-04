import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectComplaint } from "../../../../store/reducers/complaints";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { AnimalOutcomeV2 } from "../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { from } from "linq-to-typescript";
import { WildlifeComplaint } from "../../../../types/app/complaints/wildlife-complaint";
import { CreateAnimalOutcome } from "./oucome-by-animal/create-outcome";
import { AnimalOutcome } from "./oucome-by-animal/animal-outcome";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "../details/complaint-details-edit";
import { createAnimalOutcome, getCaseFile } from "../../../../store/reducers/case-thunks";

type props = {};

//--
//-- the HWCROutcomeByAnimal component is a container
//-- that shouldn't contain any business logic other than
//-- displaying a list of animal outcomes and providing
//-- the user the ability to add update and remove outcomes
//--
export const HWCROutcomeByAnimalv2: FC<props> = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  const complaint = useAppSelector(selectComplaint);
  const { species, ownedBy: agency } = (complaint as WildlifeComplaint) || {};

  //-- if there's an assigned officer pull them off
  //-- the complaint and pass as a kvp to the input
  const [assignedOfficer, setAssignedOfficer] = useState("");

  //-- outcomes is a collection of all of the animal outcomes
  //-- for the selected complaint
  const [outcomes, setOutcomes] = useState<Array<AnimalOutcomeV2>>([]);

  //-- crud events

  //-- save an item from the create-complaint component
  //-- when saving make sure that the outcome is successfully
  //-- saved before adding the outcome to the list of outcomes
  const handleSave = (item: AnimalOutcomeV2) => {
    dispatch(createAnimalOutcome(id, item)).then((result) => {
      if (result === "success") {
        dispatch(getCaseFile(id));
        setShowForm(false);
      }
    });
  };

  const handleUpdate = () => {};

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleRemove = (id: string) => {};

  const [showForm, setShowForm] = useState(false);

  //-- useEffects
  useEffect(() => {
    const { delegates } = (complaint as WildlifeComplaint) || {};

    if (delegates && from(delegates).any()) {
      const assigned = delegates.find((item) => item.type === "ASSIGNEE");
      if (assigned && assigned?.person !== null) {
        const {
          person: { id },
        } = assigned;

        setAssignedOfficer(id);
      }
    }
  }, [complaint]);

  //-- render a list of outcomes
  const renderOutcomeList = () => {
    if (outcomes && from(outcomes).any()) {
      return outcomes.map((item, idx) => (
        <AnimalOutcome
          index={idx}
          data={item}
          agency={agency}
          update={handleUpdate}
          remove={handleRemove}
        />
      ));
    }
  };

  return (
    <div className="comp-outcome-report-block">
      <h6>Outcome by animal</h6>
      {renderOutcomeList()}

      <div className="comp-outcome-report-button">
        {!showForm && (
          <Button
            id="outcome-report-add-animal"
            title="Add animal"
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            <span>Add animal</span>
            <BsPlusCircle />
          </Button>
        )}

        {showForm && (
          <CreateAnimalOutcome
            index={outcomes.length}
            assignedOfficer={assignedOfficer}
            agency={agency}
            species={species}
            save={handleSave}
            cancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};
