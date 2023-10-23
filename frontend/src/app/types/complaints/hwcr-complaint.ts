import { AttractantCode } from "../code-tables/attractant-code";
import { HwcrComplaintNatureCode } from "../code-tables/hwcr-complaint-nature-code";
import { SpeciesCode } from "../code-tables/species-code";
import { Complaint } from "./complaint";

export interface HwcrComplaint {
  complaint_identifier: Complaint;
  
  hwcr_complaint_nature_code: HwcrComplaintNatureCode;
  species_code: SpeciesCode;
  update_utc_timestamp: string;
  hwcr_complaint_guid: string;
  attractant_hwcr_xref: {
    attractant_hwcr_xref_guid?: string;
    attractant_code?: AttractantCode;
    hwcr_complaint_guid: string;
    create_user_id: string;
    active_ind: boolean;
  }[];
}
