import { Complaint } from "./complaints/complaint";
import { WildlifeComplaint } from "./complaints/wildlife-complaint";
import { AllegationComplaint } from "./complaints/allegation-complaint";

//--
//-- type aliases: Sonar cloud is recommending creating aliases for when multiple types are
//-- are used opposed to unions
//---
export type ComplaintAlias = Complaint | WildlifeComplaint | AllegationComplaint;
