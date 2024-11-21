import { AttractantCode } from "@apptypes/code-tables/attractant-code";
import { HwcrComplaintNatureCode } from "@apptypes/code-tables/hwcr-complaint-nature-code";
import { SpeciesCode } from "@apptypes/code-tables/species-code";
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
  other_attractants_text: string;
}
