import { EmailReference } from "../email_reference/entities/email_reference.entity";
import { NewComplaintEmailDetail } from "../../email_templates/new_chefs_complaint";

export interface NewComplaintNotification {
  complaintId: string;
  complaintType: string;
  agencyCode: string;
  communityCode?: string;
  parkGuid?: string;
  submission: Record<string, any>;
}

export const COMPLAINT_TYPE_DESCRIPTIONS: Record<string, string> = {
  HWCR: "Human wildlife conflict",
  ERS: "Enforcement",
  GIR: "General incident",
};

// Picks who gets a new complaint notification from the agency's email references:
// the agency-wide addresses plus the ones for the complaint's zone.
export const selectNewComplaintRecipients = (emailReferences: EmailReference[], zoneCode?: string): string[] => {
  const references = emailReferences.filter(
    (ref) => !ref.geo_organization_unit_code || ref.geo_organization_unit_code === zoneCode,
  );

  const addresses = references.map((ref) => ref.email_address?.trim()).filter((address) => address);
  return Array.from(new Set(addresses));
};

const toDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value).trim();
};

// Builds the labelled details listed in the email, skipping anything that wasn't filled in.
export const buildNewComplaintDetails = (
  notification: NewComplaintNotification,
  communityName?: string,
  parkName?: string,
): NewComplaintEmailDetail[] => {
  const { submission, complaintType } = notification;

  const coordinates =
    submission.address_coordinates_lat && submission.address_coordinates_long
      ? `${submission.address_coordinates_lat}, ${submission.address_coordinates_long}`
      : "";

  const details: [string, unknown][] = [
    ["Complaint type", COMPLAINT_TYPE_DESCRIPTIONS[complaintType] ?? complaintType],
    ["Violation type", submission.violation_type],
    ["Nature of complaint", submission.nature_of_complaint],
    ["Species", submission.species],
    ["General incident type", submission.call_type_gir],
    ["Violation in progress", submission.violation_in_progress],
    ["Violation observed", submission.observe_violation],
    ["Incident date/time", submission.incident_datetime],
    ["Date/time reported", submission.created_by_datetime],
    ["Community", communityName || submission.cos_area_community],
    ["Park", parkName],
    ["Address", submission.address],
    ["Location description", submission.cos_location_description],
    ["Coordinates (lat, long)", coordinates],
    ["Call details", submission.cos_call_details],
    ["Suspect and witness details", submission.suspect_details],
    ["Caller name", submission.cos_caller_name],
    ["Caller email", submission.cos_caller_email],
    ["Caller primary phone", submission.cos_primary_phone],
    ["Caller alternate phone", submission.cos_alt_phone],
    ["Caller address", submission.caller_address],
    ["CHEFS confirmation ID", submission.chefs_confirmation_id],
  ];

  return details.map(([label, value]) => ({ label, value: toDisplayValue(value) })).filter((detail) => detail.value);
};

// Link to the complaint in NatSuite, when the frontend URL is configured.
export const buildComplaintUrl = (complaintType: string, complaintId: string): string | undefined => {
  const baseUrl = process.env.NATSUITE_URL?.replace(/\/+$/, "");
  return baseUrl ? `${baseUrl}/complaint/${complaintType}/${complaintId}` : undefined;
};
