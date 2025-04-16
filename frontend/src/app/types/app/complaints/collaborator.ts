import { UUID } from "crypto";

export interface Collaborator {
  personComplaintXrefGuid: UUID;
  complaintId: string;
  personGuid: UUID;
  collaboratorAgency: string;
  firstName: string;
  lastName: string;
  middleName1: string;
  middleName2: string;
}
