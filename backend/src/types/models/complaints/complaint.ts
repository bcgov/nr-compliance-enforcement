import { ContactType } from "../general/contact-type"
import { Delegate } from "../people/delegate"

export interface Complaint { 
   id: string 
   details: string
   callerName: string
   /*
   contacts is an array of contacts in the event we add more types
   [
      { type: "email", value: "moo@cow.com"}, 
      { type: "phoneNumber1", value: "250-555-1234"}
   ]
   */
   constacts: Array<ContactType>
   location: { type: string, coordinates: Array<number> }
   locationSummary: string
   locationDetail: string
   status: string
   referedBy: string
   referredBy: string
   ownedBy: string
   incidentDateTime: Date
   reported: Date
   organization: {
      area: string
      zone: string
      region: string
   },
   delegates: Array<Delegate>
}
