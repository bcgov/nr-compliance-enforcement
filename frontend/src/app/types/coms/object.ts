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
  toBeUploaded?: boolean
}
