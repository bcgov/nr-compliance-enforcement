import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

// Separates each section of the call details with a blank line.
const SECTION_SEPARATOR = "\n\n";

// Builds the WebEOC call details from the CHEFS fields, in order: the violation type,
// the "Previously reported" lines (when indicated), the call details, then the CHEFS confirmation id.
export const callDetailsTransform: ChefsTransform = (data) => {
  const sections: string[] = [];

  const violationType = data.violation_type_label?.trim();
  if (violationType) {
    sections.push(`Violation type: ${violationType}`);
  }

  if (data.previously_reported_ind === "Yes") {
    const agency = data.agency_reported_txt?.trim();
    const dateReported = data.whenDidYouReportIt?.split("T")[0];
    const referenceNumber = data.doYouHaveAFileOrReferenceNumber?.trim();
    sections.push(
      [
        agency ? `Previously reported: ${agency}` : "Previously reported",
        dateReported && `Date reported: ${dateReported}`,
        referenceNumber && `File or reference number: ${referenceNumber}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
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
