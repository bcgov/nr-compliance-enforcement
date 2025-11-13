const eventsStreamName = `${process.env.EVENT_STREAM_NAME}`;
export const STREAMS = {
  EVENTS: eventsStreamName,
};

export const STREAM_TOPICS = {
  CASE_OPENED: `${eventsStreamName}.case.opened`,
  CASE_CLOSED: `${eventsStreamName}.case.closed`,
  COMPLAINT_ADDED_TO_CASE: `${eventsStreamName}.complaint.added_to_case`,
  COMPLAINT_REMOVED_FROM_CASE: `${eventsStreamName}.complaint.removed_from_case`,
  COMPLAINT_OPENED: `${eventsStreamName}.complaint.opened`,
  COMPLAINT_CLOSED: `${eventsStreamName}.complaint.closed`,
  INVESTIGATION_CLOSED: `${eventsStreamName}.investigation.closed`,
  INVESTIGATION_ADDED_TO_CASE: `${eventsStreamName}.investigation.added_to_case`,
  INSPECTION_CLOSED: `${eventsStreamName}.inspection.closed`,
  INSPECTION_ADDED_TO_CASE: `${eventsStreamName}.inspection.added_to_case`,
};
