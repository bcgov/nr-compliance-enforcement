import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

// Separates each section of the call details with a blank line.
const SECTION_SEPARATOR = "\n\n";

// Builds the WebEOC call details from the CHEFS fields, in order:
// the "Previously reported" line (when indicated), the call details, then the CHEFS confirmation id.
export const callDetailsTransform: ChefsTransform = (data) => {
  const sections: string[] = [];

  if (data.previously_reported_ind) {
    const agency = data.agency_reported_txt?.trim();
    sections.push(agency ? `Previously reported: ${agency}` : "Previously reported");
  }

  const callDetails = data.cos_call_details?.trim();
  if (callDetails) {
    sections.push(callDetails);
  }

  const confirmationId = data.chefs_confirmation_id?.trim();
  if (confirmationId) {
    sections.push(`CHEFS confirmation ID: ${confirmationId}`);
  }

  if (sections.length === 0) {
    return data;
  }

  return {
    ...data,
    cos_call_details: sections.join(SECTION_SEPARATOR),
  };
};
