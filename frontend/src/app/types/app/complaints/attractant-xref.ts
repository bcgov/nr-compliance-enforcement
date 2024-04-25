import { UUID } from "crypto";

export interface AttractantXref {
  xrefId?: UUID;
  attractant: string;
  isActive: boolean;
}
