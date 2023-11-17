import { UUID } from "crypto";

export interface Person {
  id: UUID;
  firstname: string;
  lastName: string;
  middleName1: string;
  middleName2: string;
}
