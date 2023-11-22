import { UUID } from "crypto";

export interface AttractantXrefDto {
  xrefId: UUID;
  attractant: string;
  isActive: boolean;
}
