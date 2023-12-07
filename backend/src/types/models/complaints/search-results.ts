import { AllegationComplaint } from "../../../v1/allegation_complaint/entities/allegation_complaint.entity";
import { HwcrComplaint } from "../../../v1/hwcr_complaint/entities/hwcr_complaint.entity";
import { WildlifeComplaintDto } from "./wildlife-complaint";
import { AllegationComplaintDto } from "./allegation-complaint";

export interface SearchResults {
  complaints:
    | HwcrComplaint[]
    | AllegationComplaint[]
    | Array<WildlifeComplaintDto>
    | Array<AllegationComplaintDto>;
  totalCount: number;
}
