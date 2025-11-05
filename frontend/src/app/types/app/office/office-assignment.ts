import { UUID } from "node:crypto";

export interface OfficeAssignment {
  id: UUID;
  name: string;
  agency: string;
  code: string;
}
