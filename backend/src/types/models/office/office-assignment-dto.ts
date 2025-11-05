import { UUID } from "node:crypto";

export interface OfficeAssignmentDto {
  id: UUID;
  name: string;
  agency: string;
}
