import { UUID } from "node:crypto";

export interface StagingComplaintDto {
  stagingComplaintGuid: UUID;
  stagingStatusCode: string;
  stagingActivityCode: string;
  complaintIdentifier: string;
  complaintJsonb: JSON;
  updatedOn: Date;
  createdBy: string;
  updatedBy: string;
}
