import { ComplaintUpdate } from "src/v1/complaint_updates/entities/complaint_updates.entity";
import { ActionTaken } from "src/v1/complaint/entities/action_taken.entity";
import { ComplaintReferral } from "src/v1/complaint_referral/entities/complaint_referral.entity";
import { ComplaintReferralEmailLog } from "src/v1/complaint_referral_email_log/entities/complaint_referral_email_log.entity";

export interface RelatedDataDto {
  updates: Array<ComplaintUpdate>;
  actions: Array<ActionTaken>;
  referrals?: Array<ComplaintReferral>;
  referral_email_logs?: Array<ComplaintReferralEmailLog>;
}
