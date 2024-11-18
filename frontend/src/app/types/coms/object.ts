import AttachmentEnum from "@constants/attachment-enum";

export interface COMSObject {
  id?: string;
  path?: string;
  public?: boolean;
  active?: boolean;
  bucketId?: string;
  name: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
  pendingUpload?: boolean;
  imageIconString?: string;
  imageIconId?: string;
  errorMesage?: string;
  attachmentType?: AttachmentEnum;
}
