import AttachmentEnum from "@/app/constants/attachment-enum";

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
};

export const getAttachmentConfig = (attachmentType: AttachmentEnum): AttachmentTypeConfig => {
  return ATTACHMENT_TYPE_CONFIG[attachmentType];
};
