export const CASE_ACTIVITY_TYPES = {
  COMPLAINT: "COMP",
  INVESTIGATION: "INVSTGTN",
  INSPECTION: "INSPECTION",
} as const;


export type CaseActivityType = (typeof CASE_ACTIVITY_TYPES)[keyof typeof CASE_ACTIVITY_TYPES];
