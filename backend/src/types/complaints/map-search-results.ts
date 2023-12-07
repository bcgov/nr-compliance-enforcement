import { AllegationComplaint } from "src/v1/allegation_complaint/entities/allegation_complaint.entity";
import { HwcrComplaint } from "src/v1/hwcr_complaint/entities/hwcr_complaint.entity";
import { WildlifeComplaintDto } from "../models/complaints/wildlife-complaint";
import { AllegationComplaintDto } from "../models/complaints/allegation-complaint";

export interface MapSearchResults {
    complaints: HwcrComplaint[] | AllegationComplaint[] | WildlifeComplaintDto[] | AllegationComplaintDto[];
    unmappedComplaints: number;
  }