// Prisma models whose tables have an RLS policy

export const COMPLAINT_OUTCOME_RLS_MODELS = new Set<string>(["complaint_outcome"]);

export const CASE_FILE_RLS_MODELS = new Set<string>(["case_file", "case_activity"]);

export const INSPECTION_RLS_MODELS = new Set<string>([
  "inspection",
  "inspection_party",
  "inspection_business",
  "inspection_person",
  "officer_inspection_xref",
]);

export const INVESTIGATION_RLS_MODELS = new Set<string>([
  "investigation",
  "investigation_party",
  "investigation_business",
  "investigation_person",
  "officer_investigation_xref",
  "task",
  "diary_date",
  "activity_note",
  "exhibit",
  "contravention",
  "contravention_party_xref",
  "enforcement_action",
  "ticket",
]);
