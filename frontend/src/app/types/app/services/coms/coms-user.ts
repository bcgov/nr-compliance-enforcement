import { UUID } from "crypto";

export interface ComsUser {
  userId: UUID;
  identityId: string;
  idp: string;
  username: string;
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  active: boolean;
}
