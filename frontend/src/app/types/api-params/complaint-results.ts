import { AllegationComplaint } from "@apptypes/app/complaints/allegation-complaint";
import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { GeneralIncidentComplaint } from "@apptypes/app/complaints/general-complaint";
import { Complaint } from "@apptypes/app/complaints/complaint";

export type ComplaintSearchResults = {
  complaints: Array<WildlifeComplaint | AllegationComplaint | GeneralIncidentComplaint | Complaint>;
  totalCount: number;
};
