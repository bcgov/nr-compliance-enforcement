import { PickType } from "@nestjs/swagger";
import { AppUserComplaintXrefDto } from "./app_user_complaint_xref.dto";

export class CreateAppUserComplaintXrefDto extends PickType(AppUserComplaintXrefDto, [
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "complaint_identifier",
  "app_user_guid",
  "app_user_complaint_xref_code",
  "active_ind",
] as const) {}
