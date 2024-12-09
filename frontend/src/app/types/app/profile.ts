import { UUID } from "crypto";

export default interface Profile {
  givenName: string;
  surName: string;
  email: string;
  idir: UUID;
  idir_username: string;
  office: string;
  region: string;
  zone: string;
  zoneDescription: string;
  agency: string;
  personGuid: string;
  comsEnrolledInd: boolean | null;
}
