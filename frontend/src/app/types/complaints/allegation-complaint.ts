import { ViolationCode } from "@apptypes/code-tables/violation-code";
import { Complaint } from "./complaint";

export interface AllegationComplaint {
  complaint_identifier: Complaint;
  violation_code: ViolationCode;
  in_progress_ind: string | boolean;
  observed_ind: boolean;
  suspect_witnesss_dtl_text: string;
  update_utc_timestamp: string;
  allegation_complaint_guid: string;
}
