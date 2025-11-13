import { PickType } from "@nestjs/swagger";
import { LinkedComplaintXrefDto } from "./linked_complaint_xref.dto";

export class CreateLinkedComplaintXrefDto extends PickType(LinkedComplaintXrefDto, [
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "complaint_identifier",
  "linked_complaint_identifier",
  "active_ind",
  "link_type",
  "app_user_guid",
] as const) {}
