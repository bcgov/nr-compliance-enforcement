import { UUID } from "node:crypto";

export interface AttractantXref {
  xrefId?: UUID;
  attractant: string;
  isActive: boolean;
}
