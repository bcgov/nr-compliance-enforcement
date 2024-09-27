import { RootState } from "../store";
import Option from "../../types/app/option";
import { ScheduleSectorXref } from "../../types/app/code-tables/schedule-sector-xref";

export const selectDischargeDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { discharge: items },
  } = state;

  const data = items.map(({ discharge: value, longDescription: label }) => {
    return { label, value };
  });

  return data;
};

export const selectNonComplianceDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { "non-compliance": items },
  } = state;

  const data = items.map(({ nonCompliance: value, longDescription: label }) => {
    return { label, value };
  });

  return data;
};

export const selectSectorDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { sector: items },
  } = state;

  const data = items.map(({ sector: value, longDescription: label }) => {
    return { label, value };
  });

  return data;
};

export const selectScheduleSectorXref = (state: RootState): Array<ScheduleSectorXref> => {
  const {
    codeTables: { "schedule-sector-type": scheduleSectorType },
  } = state;
  return scheduleSectorType;
};
export const selectScheduleDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { schedule: items },
  } = state;

  const data = items.map(({ schedule: value, longDescription: label }) => {
    return { label, value };
  });

  return data;
};

export const selectDecisionTypeDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { "decision-type": items },
  } = state;

  const data = items.map(({ decisionType: value, longDescription: label }) => {
    return { label, value };
  });

  return data;
};
