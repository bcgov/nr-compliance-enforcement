const eventsStreamName = process.env.EVENT_STREAM_NAME;
export const STREAMS = {
  EVENTS: eventsStreamName,
};

export const STREAM_TOPICS = {
  CASE_CREATED: `${eventsStreamName}.case.created`,
  CASE_CLOSED: `${eventsStreamName}.case.closed`,
  COMPLAINT_ADDED_TO_CASE: `${eventsStreamName}.complaint.added_to_case`,
  COMPLAINT_REMOVED_FROM_CASE: `${eventsStreamName}.complaint.removed_from_case`,
  INVESTIGATION_CREATED: `${eventsStreamName}.investigation.created`,
  INVESTIGATION_CLOSED: `${eventsStreamName}.investigation.closed`,
  INSPECTION_CREATED: `${eventsStreamName}.inspection.created`,
  INSPECTION_CLOSED: `${eventsStreamName}.inspection.closed`,
};
