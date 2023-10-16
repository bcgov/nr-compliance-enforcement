import { PickType } from "@nestjs/swagger";
import { AllegationComplaintDto } from "./allegation_complaint.dto";

export class CreateAllegationComplaintDto extends PickType(AllegationComplaintDto, [
    "complaint_identifier",
    "allegation_complaint_guid",
    "violation_code",
    "in_progress_ind",
    "observed_ind",
    "suspect_witnesss_dtl_text",
    "create_user_id",
    "create_utc_timestamp",
    "update_user_id",
    "update_utc_timestamp"
          ] as const) {}
