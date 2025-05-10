import { PickType } from "@nestjs/swagger";
import { ComplaintReferralDto } from "./complaint_referral.dto";
import { ExportComplaintParameters } from "src/types/models/complaints/export-complaint-parameters";

export class CreateComplaintReferralDto extends PickType(ComplaintReferralDto, [
  "create_user_id",
  "create_utc_timestamp",
  "update_user_id",
  "update_utc_timestamp",
  "active_ind",
] as const) {
  exportComplaintParams: ExportComplaintParameters;
  complaint_url: string;
}
