import { UUID } from "node:crypto";

export interface Collaborator {
  appUserComplaintXrefGuid: UUID;
  complaintId: string;
  appUserGuid: UUID;
  authUserGuid: UUID;
  collaboratorAgency: string;
  firstName: string;
  lastName: string;
  middleName1: string;
  middleName2: string;
  activeInd: boolean;
}
