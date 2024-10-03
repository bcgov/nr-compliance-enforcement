import { UUID } from "crypto";

export interface OfficeAssignmentDto {
  id: UUID;
  name: string;
  agency: string;
  code: string;
}
