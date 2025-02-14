import { from } from "linq-to-typescript";
import { EquipmentDetailsDto } from "@apptypes/app/case-files/equipment-details";
import { AnimalOutcome } from "@apptypes/app/complaints/outcomes/wildlife/animal-outcome";
import { Assessment } from "@apptypes/outcomes/assessment";
import { Prevention } from "@apptypes/outcomes/prevention";
import { Note } from "@/app/types/outcomes/note";
import { AnimalOutcomeSubject, Subject } from "@apptypes/state/cases-state";
import { RootState } from "@store/store";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { Decision } from "@apptypes/app/case-files/ceeb/decision/decision";
import { PermitSite } from "@apptypes/app/case-files/ceeb/authorization-outcome/permit-site";

//-- Case file selectors
export const selectCaseId = (state: RootState): string => {
  const {
    cases: { caseId },
  } = state;
  return caseId ?? "";
};

export const selectAssessment = (state: RootState): Assessment => {
  const { cases } = state;
  return cases.assessment;
};

export const selectPrevention = (state: RootState): Prevention => {
  const { cases } = state;
  return cases.prevention;
};

export const selectEquipment = (state: RootState): EquipmentDetailsDto[] => {
  const { cases } = state;
  return cases.equipment;
};

export const selectSubject = (state: RootState): Subject[] => state.cases.subject;

export const selectIsInEdit = (state: RootState): any => state.cases.isInEdit;

export const selectIsReviewRequired = (state: RootState): boolean => state.cases.isReviewRequired;

export const selectReviewComplete = (state: RootState): any => state.cases.reviewComplete;

export const selectNotes = (state: RootState): Note[] => state.cases.notes;

export const selectAnimalOutcomes = (state: RootState): Array<AnimalOutcome> => {
  const {
    cases: { subject: subjects },
  } = state;

  if (subjects && from(subjects).any()) {
    //-- this will filter out all animal-outcome-subjets from the subject collection
    const animals = subjects.filter((subject): subject is AnimalOutcomeSubject => "species" in subject);

    //-- map the animals to an animal-outcome-v2 collection
    const results = animals.map((item) => {
      const {
        id,
        species,
        sex,
        age,
        categoryLevel: threatLevel,
        identifyingFeatures,
        outcome,
        tags,
        drugs,
        actions,
        order,
      } = item;

      //-- map or emtpy out the drugs-used and ear-tags collections
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
        tags: _tags,
        drugs: _drugs,
        order,
      };

      //-- pull the drug-authroized-by and officer/date from the actions
      if (actions) {
        //-- drug-authorized-by
        if (from(actions).any((r) => r.actionCode === CASE_ACTION_CODE.ADMNSTRDRG)) {
          const item = actions.find(({ actionCode }) => actionCode === CASE_ACTION_CODE.ADMNSTRDRG);
          const drugAuthorization = {
            officer: item?.actor ?? "",
            date: new Date(item?.date ?? ""),
          };

          record = { ...record, drugAuthorization };
        }

        //-- officer / date outcome added
        if (from(actions).any((r) => r.actionCode === CASE_ACTION_CODE.RECOUTCOME)) {
          const item = actions.find(({ actionCode }) => actionCode === CASE_ACTION_CODE.RECOUTCOME);

          if (item?.actor) {
            record = { ...record, officer: item?.actor };
          }
          if (item?.date) {
            record = { ...record, date: new Date(item?.date ?? "") };
          }
        }
      }

      return record;
    });

    return results;
  }

  return [];
};

export const selectCaseDecision = (state: RootState): Decision => {
  const { cases } = state;

  const defaultDecision: Decision = {
    schedule: "",
    sector: "",
    discharge: "",
    nonCompliance: "",
    rationale: "",
    assignedTo: "",
    actionTaken: "",
    actionTakenDate: null,
  };

  return !cases.decision ? defaultDecision : cases.decision;
};

export const selectCeebAuthorization = (state: RootState): PermitSite => {
  const { cases } = state;
  return !cases.authorization ? {} : cases.authorization;
};
