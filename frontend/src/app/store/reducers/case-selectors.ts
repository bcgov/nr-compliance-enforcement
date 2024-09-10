import { from } from "linq-to-typescript";
import { EquipmentDetailsDto } from "../../types/app/case-files/equipment-details";
import { AnimalOutcomeV2 } from "../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { Assessment } from "../../types/outcomes/assessment";
import { Prevention } from "../../types/outcomes/prevention";
import { SupplementalNote } from "../../types/outcomes/supplemental-note";
import { AnimalOutcomeSubject } from "../../types/state/cases-state";
import { RootState } from "../store";
import { CASE_ACTION_CODE } from "../../constants/case_actions";
import { Decision } from "../../types/app/case-files/ceeb/decision/decision";
import { PermitSite } from "../../types/app/case-files/ceeb/authorization-outcome/permit-site";

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

export const selectSupplementalNote = (state: RootState): SupplementalNote => {
  const {
    cases: { note },
  } = state;

  return !note?.note ? { ...note, note: "" } : note;
};

export const selectNotesOfficer = (state: RootState) => {
  const {
    app: { profile },
    cases: {
      note: { action },
    },
    officers: { officers: data },
  } = state;

  let currentOfficer: { initials: string; displayName: string } = { initials: "UN", displayName: "Unknown" };

  if (!action) {
    currentOfficer = {
      initials: `${profile.surName?.substring(0, 1)}${profile.givenName?.substring(0, 1)}`,
      displayName: `${profile.surName}, ${profile.givenName}`,
    };
  } else {
    const { actor } = action;
    const officer = data.find((item) => item.officer_guid === actor);
    if (officer) {
      const {
        person_guid: { first_name: givenName, last_name: surName },
      } = officer;
      currentOfficer = {
        initials: `${surName?.substring(0, 1)}${givenName?.substring(0, 1)}`,
        displayName: `${surName}, ${givenName}`,
      };
    }
  }

  return currentOfficer;
};

export const selectEquipment = (state: RootState): EquipmentDetailsDto[] => {
  const { cases } = state;
  return cases.equipment;
};

export const selectAnimalOutcomes = (state: RootState): Array<AnimalOutcomeV2> => {
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
        conflictHistory,
        outcome,
        tags,
        drugs,
        actions,
        order,
      } = item;

      //-- map or emtpy out the drugs-used and ear-tags collections
      const _tags = tags ?? [];
      const _drugs = drugs ?? [];

      let record: AnimalOutcomeV2 = {
        id,
        species,
        sex,
        age,
        threatLevel,
        conflictHistory,
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
  const {
    complaints: { complaint },
    cases,
  } = state;

  let assignedTo = "";
  //-- if the compalint is assigned to an officer pre-select the assigned to officer
  if (complaint?.delegates) {
    const { delegates } = complaint;
    if (from(delegates).any()) {
      const assigned = delegates.find((item) => item.type === "ASSIGNEE");
      if (assigned && assigned?.person !== null) {
        const {
          person: { id },
        } = assigned;

        assignedTo = id;
      }
    }
  }

  const defaultDecision: Decision = {
    schedule: "",
    sector: "",
    discharge: "",
    nonCompliance: "",
    rationale: "",
    assignedTo,
    actionTaken: "",
    actionTakenDate: new Date(),
  };

  return !cases.decision ? defaultDecision : cases.decision;
};

export const selectCeebAuthorization = (state: RootState): PermitSite => {
  const { cases } = state;
  return !cases.authorization ? {} : cases.authorization;
};
