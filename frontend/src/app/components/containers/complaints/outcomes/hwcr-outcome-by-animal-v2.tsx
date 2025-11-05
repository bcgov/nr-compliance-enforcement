import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectComplaint, selectComplaintViewMode } from "@store/reducers/complaints";
import { Button } from "react-bootstrap";
import type { AnimalOutcome as AnimalOutcomeData } from "@apptypes/app/complaints/outcomes/wildlife/animal-outcome";
import { from } from "linq-to-typescript";
import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { CreateAnimalOutcome } from "./oucome-by-animal/create-outcome";
import { AnimalOutcome } from "./oucome-by-animal/animal-outcome";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "@components/containers/complaints/details/complaint-details-edit";
import { createAnimalOutcome, getCaseFile, updateAnimalOutcome } from "@/app/store/reducers/complaint-outcome-thunks";
import { selectAnimalOutcomes, selectCaseId } from "@/app/store/reducers/complaint-outcome-selectors";
import { selectOfficersByAgency } from "@store/reducers/officer";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM, DELETE_ANIMAL_OUTCOME } from "@apptypes/modal/modal-types";
import { EditOutcome } from "./oucome-by-animal/edit-outcome";
import { UUID } from "node:crypto";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import useValidateComplaint from "@hooks/validate-complaint";
import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";

type props = {};

//--
//-- in order to make sure things are inserted into the correct spot and get
//-- the right number values, get the most recent order number and increase
//-- by 1, default 1 if no items in array exist
export const getNextOrderNumber = <T extends { order: number }>(input: Array<T>): number => {
  if (input.length === 0) {
    return 1;
  }

  let result = (input as Array<T>).reduce((prev, current) => {
    return prev.order > current.order ? prev : current;
  });

  let { order } = result || { order: 1 };
  return order + 1;
};

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
  const subjects = useAppSelector(selectAnimalOutcomes);
  const caseId = useAppSelector(selectCaseId) as UUID;
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);

  const { species, ownedBy: agency } = (complaint as WildlifeComplaint) || {};
  const officersInAgencyList = useSelector(
    (state: RootState) => selectOfficersByAgency(state, agency), // Pass agency here
  );
  //-- if there's an assigned officer pull them off
  //-- the complaint and pass as a kvp to the input
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [editId, setEditId] = useState<string>("");

  //-- outcomes is a collection of all of the animal outcomes
  //-- for the selected complaint
  const [outcomes, setOutcomes] = useState<Array<AnimalOutcomeData>>([]);

  //-- modals
  //-- delete animal outcome modal
  const openDeleteAnimalOutcomeModal = (outcomeId: string) => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_ANIMAL_OUTCOME,
        data: {
          leadId: id,
          outcomeId, //-- this is the id of the animal outcome thats being deleted
          title: "Delete animal outcome",
          description: "All the data in this section will be lost.",
          ok: "Yes, delete animal outcome",
          cancel: "No, go back",
        },
      }),
    );
  };

  //-- crud events

  //-- save an item from the create-complaint component
  //-- when saving make sure that the outcome is successfully
  //-- saved before adding the outcome to the list of outcomes
  const handleSave = (item: AnimalOutcomeData) => {
    dispatch(createAnimalOutcome(id, item)).then((result) => {
      if (result === "success") {
        dispatch(getCaseFile(id));
        setShowForm(false);
      }
    });
  };

  //-- save an item from the create-complaint component
  //-- when saving make sure that the outcome is successfully
  //-- saved before adding the outcome to the list of outcomes
  const handleUpdate = (item: AnimalOutcomeData) => {
    dispatch(updateAnimalOutcome(caseId, id, item)).then((result) => {
      if (result === "success") {
        dispatch(getCaseFile(id));
        setShowForm(false);
      }
    });
  };

  const handleEnableEdit = (id: string) => {
    setEditId(id);
  };

  const handleCancelCreateOutcome = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => {
            setShowForm(false);
          },
        },
      }),
    );
  };

  const [showForm, setShowForm] = useState(false);

  const validationResults = useValidateComplaint();

  //-- useEffects
  useEffect(() => {
    const { delegates } = (complaint as WildlifeComplaint) || {};

    if (delegates && from(delegates).any()) {
      const assigned = delegates.find((item) => item.type === "ASSIGNEE");
      if (assigned && assigned?.appUserGuid !== null) {
        const appUserGuid = assigned.appUserGuid;

        if (officersInAgencyList) {
          const officerAssigned: any = officersInAgencyList.filter((officer) => officer.app_user_guid === appUserGuid);
          if (officerAssigned.length === 1) {
            setAssignedOfficer(officerAssigned[0].auth_user_guid);
          }
        }
      }
    }
    // officersInAgencyList should be a dependency but its selector needs to be refactored using a selector creator to avoid an infinte loop here by adding it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaint]);

  useEffect(() => {
    setOutcomes([...subjects]);
  }, [dispatch, subjects]);

  useEffect(() => {
    dispatch(setIsInEdit({ animal: showForm || editId.length > 0 }));
    return () => {
      dispatch(setIsInEdit({ animal: false }));
    };
  }, [dispatch, showForm, editId]);

  // Outcome of animal is required to close the complaint once captured, if none are recorded show the form so that the validation message can be displayed
  // Using an effect to control this behavior using the existing flag would be preferable but would require a refactor around the way the add buttons work
  const showFormBasedOnOutcomes =
    showForm ||
    (isInEdit?.showSectionErrors &&
      !validationResults?.canCloseComplaint &&
      !validationResults?.validationDetails?.animalCapturedCriteria);

  //-- render a list of outcomes
  const renderOutcomeList = () => {
    if (outcomes && from(outcomes).any()) {
      return outcomes.map((item) => {
        const { id, order } = item;
        if (editId === id) {
          return (
            <EditOutcome
              key={id}
              id={id}
              index={order}
              outcome={item}
              agency={agency}
              assignedOfficer={assignedOfficer}
              update={handleUpdate}
              toggle={handleEnableEdit}
            />
          );
        }

        return (
          <AnimalOutcome
            key={id}
            index={order}
            data={item}
            agency={agency}
            edit={handleEnableEdit}
            remove={openDeleteAnimalOutcomeModal}
            outcomeRequired={!validationResults?.validationDetails?.animalCapturedCriteria}
          />
        );
      });
    }
  };

  return (
    <section
      className="comp-details-section"
      id="outcome-animal"
    >
      <h3>Outcome by animal</h3>
      {renderOutcomeList()}

      <div className="comp-outcome-report-button">
        {!showFormBasedOnOutcomes && (
          <Button
            variant="primary"
            title="Add animal"
            id="outcome-report-add-animal"
            onClick={() => setShowForm(true)}
            disabled={isReadOnly}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add animal</span>
          </Button>
        )}

        {showFormBasedOnOutcomes && (
          <CreateAnimalOutcome
            index={getNextOrderNumber<AnimalOutcomeData>(outcomes)}
            assignedOfficer={assignedOfficer}
            agency={agency}
            species={species}
            save={handleSave}
            cancel={handleCancelCreateOutcome}
            outcomeRequired={!validationResults?.validationDetails?.animalCapturedCriteria}
          />
        )}
      </div>
    </section>
  );
};
