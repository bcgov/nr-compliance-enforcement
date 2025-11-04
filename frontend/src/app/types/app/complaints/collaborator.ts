import { UUID } from "crypto";

export interface Collaborator {
  personComplaintXrefGuid: UUID;
  complaintId: string;
  appUserGuid: UUID;  // Renamed from personGuid
  authUserGuid: UUID;
  collaboratorAgency: string;
  firstName: string;
  lastName: string;
  middleName1: string;
  middleName2: string;
  activeInd: boolean;
}
