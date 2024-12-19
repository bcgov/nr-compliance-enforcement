export interface Attachment {
  type: AttachmentType;
  date: Date;
  name: string;
  user: string;
  sequenceId: number;
  fileType: string;
}

export enum AttachmentType {
  COMPLAINT_ATTACHMENT = "COMPLAINT_ATTACHMENT",
  OUTCOME_ATTACHMENT = "OUTCOME_ATTACHMENT",
}
