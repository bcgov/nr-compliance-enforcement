import { from } from "linq-to-typescript";
import { EquipmentDetailsDto } from "@/app/types/app/complaint-outcomes/equipment-details";
import { AnimalOutcome } from "@apptypes/app/complaints/outcomes/wildlife/animal-outcome";
import { Assessment } from "@apptypes/outcomes/assessment";
import { Prevention } from "@apptypes/outcomes/prevention";
import { Note } from "@/app/types/outcomes/note";
import { AnimalOutcomeSubject, Subject } from "@/app/types/state/complaint-outcomes-state";
import { RootState } from "@store/store";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { Decision } from "@/app/types/app/complaint-outcomes/ceeb/decision/decision";
import { PermitSite } from "@/app/types/app/complaint-outcomes/ceeb/authorization-outcome/permit-site";
import { createSelector } from "@reduxjs/toolkit";

//-- Case file selectors
export const selectCaseId = (state: RootState): string => {
  const {
    complaintOutcomes: { complaintOutcomeGuid },
  } = state;
  return complaintOutcomeGuid ?? "";
};

export const selectAssessments = (state: RootState): Assessment[] => {
  const { complaintOutcomes } = state;
  return complaintOutcomes.assessments;
};

export const selectPreventions = (state: RootState): Prevention[] => {
  const { complaintOutcomes } = state;
  return complaintOutcomes.preventions;
};

export const selectEquipment = (state: RootState): EquipmentDetailsDto[] => {
  const { complaintOutcomes } = state;
  return complaintOutcomes.equipment;
};

export const selectSubject = (state: RootState): Subject[] => state.complaintOutcomes.subject;

export const selectIsInEdit = (state: RootState): any => state.complaintOutcomes.isInEdit;

export const selectIsReviewRequired = (state: RootState): boolean => state.complaintOutcomes.isReviewRequired;

export const selectReviewComplete = (state: RootState): any => state.complaintOutcomes.reviewComplete;

export const selectNotes = (state: RootState): Note[] => state.complaintOutcomes.notes;
export const selectSubjects = (state: RootState) => state.complaintOutcomes.subject;

export const selectAnimalOutcomes = createSelector([selectSubjects], (subjects) => {
  if (subjects && from(subjects).any()) {
    // Filter out all animal-outcome subjects from the subject collection
    const animals = subjects.filter((subject): subject is AnimalOutcomeSubject => "species" in subject);

    // Map the animals to an animal-outcome-v2 collection
    return animals.map((item) => {
      const {
        id,
        species,
        sex,
        age,
        categoryLevel: threatLevel,
        identifyingFeatures,
        outcome,
        outcomeActionedBy,
        tags,
        drugs,
        actions,
        order,
      } = item;

      // Map or empty out the tags and drugs collections
      const _tags = tags ?? [];
      const _drugs = drugs ?? [];

      let record: AnimalOutcome = {
        id,
        species,
        sex,
        age,
        threatLevel,
        identifyingFeatures,
        outcome,
        outcomeActionedBy,
        tags: _tags,
        drugs: _drugs,
        order,
      };

      // Extract drug authorized by and officer/date from the actions
      if (actions) {
        // drug-authorized-by
        if (from(actions).any((r) => r.actionCode === CASE_ACTION_CODE.ADMNSTRDRG)) {
          const actionItem = actions.find(({ actionCode }) => actionCode === CASE_ACTION_CODE.ADMNSTRDRG);
          const drugAuthorization = {
            officer: actionItem?.actor ?? "",
            date: new Date(actionItem?.date ?? ""),
          };

          record = { ...record, drugAuthorization };
        }

        // officer / date outcome added
        if (from(actions).any((r) => r.actionCode === CASE_ACTION_CODE.RECOUTCOME)) {
          const actionItem = actions.find(({ actionCode }) => actionCode === CASE_ACTION_CODE.RECOUTCOME);

          if (actionItem?.actor) {
            record = { ...record, officer: actionItem.actor };
          }
          if (actionItem?.date) {
            record = { ...record, date: new Date(actionItem.date ?? "") };
          }
        }
      }

      return record;
    });
  }

  return [];
});

export const selectCaseDecision = (state: RootState): Decision => {
  const { complaintOutcomes } = state;

  const defaultDecision: Decision = {
    schedule: "",
    sector: "",
    discharge: "",
    nonCompliance: "",
    ipmAuthCategory: "",
    rationale: "",
    assignedTo: "",
    actionTaken: "",
    actionTakenDate: null,
  };

  return !complaintOutcomes.decision ? defaultDecision : complaintOutcomes.decision;
};

export const selectCeebAuthorization = (state: RootState): PermitSite => {
  const { complaintOutcomes } = state;
  return !complaintOutcomes.authorization ? {} : complaintOutcomes.authorization;
};
