import { UUID } from "crypto";

export interface PersonDto {
  id: UUID;
  firstName: string;
  lastName: string;
  middleName1: string;
  middleName2: string;
}
