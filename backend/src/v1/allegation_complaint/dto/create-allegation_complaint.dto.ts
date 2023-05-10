import { PickType } from "@nestjs/swagger";
import { AllegationComplaintDto } from "./allegation_complaint.dto";

export class CreateAllegationComplaintDto extends PickType(AllegationComplaintDto, [
    "complaint_identifier",
    "violation_code",
    "in_progress_ind",
    "observed_ind",
    "suspect_witnesss_dtl_text",
    "create_user_id",
    "create_user_guid",
    "create_timestamp",
    "update_user_id",
    "update_user_guid",
    "update_timestamp"
          ] as const) {}
