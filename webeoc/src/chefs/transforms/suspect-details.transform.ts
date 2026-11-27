import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

// CHEFS fields combined into the WebEOC suspect_details field, in this order, each with its label.
const DETAIL_SECTIONS = [
  { field: "suspect_details", label: "Suspect details" },
  { field: "witness_details", label: "Witness details" },
  { field: "transportation_details", label: "Transportation details" },
] as const;

// Separates each labelled section with a blank line.
const SECTION_SEPARATOR = "\n\n";

// Combines the CHEFS suspect, witness and transportation details into the WebEOC suspect_details field.
export const suspectDetailsTransform: ChefsTransform = (data) => {
  const sections = DETAIL_SECTIONS.map(({ field, label }) => ({ label, value: data[field]?.trim() }))
    .filter(({ value }) => value)
    .map(({ label, value }) => `${label}: ${value}`);

  if (sections.length === 0) {
    return data;
  }

  return {
    ...data,
    suspect_details: sections.join(SECTION_SEPARATOR),
  };
};
