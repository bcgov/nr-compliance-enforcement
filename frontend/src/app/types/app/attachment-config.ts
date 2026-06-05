import AttachmentEnum from "@constants/attachment-enum";

export type AttachmentTypeConfig = {
  headerKey: string;
  subHeaderKey?: string; // for subtypes like task
  shouldUpdateComplaintDate?: boolean;
};

const ATTACHMENT_TYPE_CONFIG: Record<AttachmentEnum, AttachmentTypeConfig> = {
  [AttachmentEnum.COMPLAINT_ATTACHMENT]: {
    headerKey: "x-amz-meta-complaint-id",
    shouldUpdateComplaintDate: true,
  },
  [AttachmentEnum.OUTCOME_ATTACHMENT]: {
    headerKey: "x-amz-meta-complaint-id",
    shouldUpdateComplaintDate: true,
  },
  [AttachmentEnum.TASK_ATTACHMENT]: {
    headerKey: "x-amz-meta-investigation-id",
    subHeaderKey: "x-amz-meta-task-id",
    shouldUpdateComplaintDate: false,
  },
  [AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT]: {
    headerKey: "x-amz-meta-investigation-id",
    subHeaderKey: "x-amz-meta-enforcement-action-id",
    shouldUpdateComplaintDate: false,
  },
};

export const getAttachmentConfig = (attachmentType: AttachmentEnum): AttachmentTypeConfig => {
  return ATTACHMENT_TYPE_CONFIG[attachmentType];
};

// Stored in the secure bucket?
export const isSecureAttachmentType = (attachmentType: AttachmentEnum): boolean =>
  attachmentType === AttachmentEnum.TASK_ATTACHMENT || attachmentType === AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT;
