import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

// CHEFS uses one violation type field per form section: violation_type_1, violation_type_2, ...
const VIOLATION_TYPE_FIELD_PATTERN = /^violation_type_\d+$/;

// Values may carry a numeric suffix to keep them unique within the form (e.g. "Wildlife_2").
const NUMERIC_SUFFIX_PATTERN = /_\d+$/;

// Copies the selected CHEFS violation type into the WebEOC violation_type field, without its numeric suffix.
export const violationTypeTransform: ChefsTransform = (data) => {
  const selectedValue = Object.entries(data).find(
    ([field, value]) => VIOLATION_TYPE_FIELD_PATTERN.test(field) && typeof value === "string" && value.trim(),
  )?.[1] as string | undefined;

  if (!selectedValue) {
    return data;
  }

  return {
    ...data,
    violation_type: selectedValue.trim().replace(NUMERIC_SUFFIX_PATTERN, ""),
  };
};
