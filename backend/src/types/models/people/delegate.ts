import { UUID } from "crypto";
import { PersonDto } from "./person";

export interface DelegateDto { 
   xrefId: UUID
   isActive: boolean
   type: string // -- this can be an ASSIGNE, SUSPECT, etc
   person: PersonDto
}