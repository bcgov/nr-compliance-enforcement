import { Delegate } from "../people/delegate";

export interface Complaint {
   id: string;
   details: string;
   name: string;
   address: string;
   email: string;
   phone1: string;
   phone2: string;
   phone3: string;
   location: { type: string; coordinates: Array<number> };
   locationSummary: string;
   locationDetail: string;
   status: string;
   referredBy?: string;
   ownedBy: string;
   referredByAgencyOther: string;
   incidentDateTime: Date;
   reportedOn: Date;
   updatedOn: Date;
   organization: {
     area: string;
     zone: string;
     region: string;
   };
   delegates: Array<Delegate>;
 }
 