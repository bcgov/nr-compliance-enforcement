import { UUID } from "node:crypto";

export interface AttractantXrefDto {
  xrefId: UUID;
  attractant: string;
  isActive: boolean;
}
