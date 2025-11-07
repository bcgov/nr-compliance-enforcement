export const STAGING_API_ENDPOINT_CREATES = "staging-complaint/webeoc-complaint";
export const STAGING_API_ENDPOINT_UPDATES = "staging-complaint/webeoc-complaint-update";
export const NATS_DURABLE_COMPLAINTS = `${process.env.WEBEOC_STREAM_NAME}`;

export const STREAMS = {
  COMPLAINTS: `${process.env.WEBEOC_STREAM_NAME}-complaints`,
  ACTIONS_TAKEN: `${process.env.WEBEOC_STREAM_NAME}-actions`,
};

export const OPERATIONS = {
  COMPLAINT: "Complaint(s)",
  COMPLAINT_UPDATE: "Complaint Update(s)",
  ACTION_TAKEN: "Action(s) Taken",
  ACTION_TAKEN_UPDATE: "Action Taken Update(s)",
};

export const STREAM_TOPICS = {
  COMPLAINTS: `${process.env.WEBEOC_STREAM_NAME}.new_complaints`,
  STAGING_COMPLAINTS: `${process.env.WEBEOC_STREAM_NAME}.new_staging_complaints`,
  COMPLAINT_UPDATE: `${process.env.WEBEOC_STREAM_NAME}.updated_complaints`,
  STAGING_COMPLAINT_UPDATE: `${process.env.WEBEOC_STREAM_NAME}.new_staging_complaint_update`,
  STAGE_ACTION_TAKEN: `${process.env.WEBEOC_STREAM_NAME}.stage-action-taken`,
  STAGE_UPDATE_ACTION_TAKEN: `${process.env.WEBEOC_STREAM_NAME}.stage-update-action-taken`,
  ACTION_TAKEN: `${process.env.WEBEOC_STREAM_NAME}.action-taken`,
  UPDATE_ACTION_TAKEN: `${process.env.WEBEOC_STREAM_NAME}.update-action-taken`,
};

export const STAGING_APIS = {
  ACTION_TAKEN: "complaint/staging/action-taken",
  UPDATE_ACTION_TAKEN: "complaint/staging/action-taken-update",
};

export const PROCESSING_APIS = {
  ACTION_TAKEN: "complaint/process/action-taken",
  UPDATE_ACTION_TAKEN: "complaint/process/action-taken-update",
};
