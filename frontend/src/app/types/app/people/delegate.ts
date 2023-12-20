import { UUID } from "crypto"
import { Person } from "./person"

export interface Delegate { 
   xrefId?: UUID
   isActive: boolean
   type: string // -- this can be an ASSIGNE, SUSPECT, etc
   person: Person
}