export const STAGING_API_ENDPOINT_CREATES = "staging-complaint/webeoc-complaint";
export const STAGING_API_ENDPOINT_UPDATES = "staging-complaint/webeoc-complaint-update";
export const NATS_DURABLE_COMPLAINTS = "nats_durable_complaints";

export const STREAMS = {
  COMPLAINTS: "complaints",
  ACTIONS_TAKEN: "actions",
};

export const STREAM_TOPICS = {
  COMPLAINTS: "new_complaints",
  STAGING_COMPLAINTS: "new_staging_complaints",
  COMPLAINT_UPDATE: "updated_complaints",
  STAGING_COMPLAINT_UPDATE: "new_staging_complaint_update",
  ACTION_TAKEN: "action-taken",
  UPDATE_ACTION_TAKEN: "update-action-taken",
};
