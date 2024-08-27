import { RootState } from "../store";
import Option from "../../types/app/option";

export const selectDischargeDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { discharge: items },
  } = state;

  const data = items.map(({ discharge: value, shortDescription: label }) => {
    const item: Option = { label, value };
    return item;
  });

  return data;
};

export const selectNonComplianceDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { "non-compliance": items },
  } = state;

  const data = items.map(({ nonCompliance: value, shortDescription: label }) => {
    const item: Option = { label, value };
    return item;
  });

  return data;
};

export const selectRationalDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { rational: items },
  } = state;

  const data = items.map(({ rational: value, shortDescription: label }) => {
    const item: Option = { label, value };
    return item;
  });

  return data;
};

export const selectSectorDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { sector: items },
  } = state;

  const data = items.map(({ sector: value, shortDescription: label }) => {
    const item: Option = { label, value };
    return item;
  });

  return data;
};

export const selectScheduleDropdown = (state: RootState): Array<Option> => {
  const {
    codeTables: { schedule: items },
  } = state;

  const data = items.map(({ schedule: value, shortDescription: label }) => {
    const item: Option = { label, value };
    return item;
  });

  return data;
};
