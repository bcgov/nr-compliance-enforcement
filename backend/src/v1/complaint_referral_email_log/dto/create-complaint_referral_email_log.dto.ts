import { PickType } from "@nestjs/swagger";
import { ComplaintReferralEmailLogDto } from "./complaint_referral_email_log.dto";
import { ComplaintReferral } from "src/v1/complaint_referral/entities/complaint_referral.entity";

export class CreateComplaintReferralEmailLogDto extends PickType(ComplaintReferralEmailLogDto, [
  "complaint_referral_email_log_guid",
  "email_address",
  "email_sent_utc_timestamp",
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
] as const) {
  complaint_referral_guid: ComplaintReferral;
}
