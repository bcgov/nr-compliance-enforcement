import { PickType } from "@nestjs/swagger";
import { ComplaintReferralDto } from "./complaint_referral.dto";

export class CreateComplaintReferralDto extends PickType(ComplaintReferralDto, [
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "active_ind",
] as const) {}
