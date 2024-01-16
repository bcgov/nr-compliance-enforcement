import { Complaint as ComplaintDto } from "./complaints/complaint"
import { WildlifeComplaint as WildlifeComplaintDto } from "./complaints/wildlife-complaint"
import { AllegationComplaint as AllegationComplaintDto } from "./complaints/allegation-complaint"

//--
//-- type aliases: Sonar cloud is recommending creating aliases for when multiple types are 
//-- are used opposed to unions
//---
export type ComplaintAlias = ComplaintDto | WildlifeComplaintDto | AllegationComplaintDto