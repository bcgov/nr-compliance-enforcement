import { UUID } from "crypto";

export interface Person {
  id: UUID;
  firstName: string;
  lastName: string;
  middleName1?: string;
  middleName2?: string;
}
