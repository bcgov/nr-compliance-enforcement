import { AllegationComplaint } from "../../v1/allegation_complaint/entities/allegation_complaint.entity";
import { HwcrComplaint } from "../../v1/hwcr_complaint/entities/hwcr_complaint.entity";

export interface MapReturn {
    complaints: HwcrComplaint[] | AllegationComplaint[];
    unmappedComplaints: number;
  }