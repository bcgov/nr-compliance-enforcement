export const EVENT_STREAM_NAME = `${process.env.EVENT_STREAM_NAME}`;

export const STREAM_TOPICS = {
  CASE_OPENED: `${EVENT_STREAM_NAME}.case.opened`,
  CASE_CLOSED: `${EVENT_STREAM_NAME}.case.closed`,
  COMPLAINT_ADDED_TO_CASE: `${EVENT_STREAM_NAME}.complaint.added_to_case`,
  COMPLAINT_REMOVED_FROM_CASE: `${EVENT_STREAM_NAME}.complaint.removed_from_case`,
  COMPLAINT_OPENED: `${EVENT_STREAM_NAME}.complaint.opened`,
  COMPLAINT_CLOSED: `${EVENT_STREAM_NAME}.complaint.closed`,
  INVESTIGATION_CLOSED: `${EVENT_STREAM_NAME}.investigation.closed`,
  INVESTIGATION_ADDED_TO_CASE: `${EVENT_STREAM_NAME}.investigation.added_to_case`,
  INSPECTION_CLOSED: `${EVENT_STREAM_NAME}.inspection.closed`,
  INSPECTION_ADDED_TO_CASE: `${EVENT_STREAM_NAME}.inspection.added_to_case`,
};

export type StreamTopic = (typeof STREAM_TOPICS)[keyof typeof STREAM_TOPICS];

export const eventVerbs = ["CLOSED", "ADDED", "REMOVED"] as const;
export type EventVerbType = (typeof eventVerbs)[number];

export type EventEntityTypeCodes = "COMPLAINT" | "INVESTIGATION" | "INSPECTION" | "CASE";

export const ActivityTypeToEventEntity: Record<string, string> = {
  COMP: "COMPLAINT",
  INVSTGTN: "INVESTIGATION",
  INSPECTION: "INSPECTION",
  CASE: "CASE",
};
