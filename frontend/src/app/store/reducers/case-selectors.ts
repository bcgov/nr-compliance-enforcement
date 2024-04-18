import { EquipmentDetailsDto } from "../../types/app/case-files/equipment-details";
import { Assessment } from "../../types/outcomes/assessment";
import { Prevention } from "../../types/outcomes/prevention";
import { SupplementalNote } from "../../types/outcomes/supplemental-note";
import { RootState } from "../store";

//-- Case file selectors
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
      initials: `${profile.givenName?.substring(0, 1)}${profile.surName?.substring(0, 1)}`,
      displayName: `${profile.givenName} ${profile.surName}`,
    };
  } else {
    const { actor } = action;
    const officer = data.find((item) => item.officer_guid === actor);
    if (officer) {
      const {
        person_guid: { first_name: givenName, last_name: surName },
      } = officer;
      currentOfficer = {
        initials: `${givenName?.substring(0, 1)}${surName?.substring(0, 1)}`,
        displayName: `${givenName} ${surName}`,
      };
    }
  }

  return currentOfficer;
};

export const selectEquipment = (state: RootState): EquipmentDetailsDto[] => {
  const { cases } = state;
  return cases.equipment;
};
