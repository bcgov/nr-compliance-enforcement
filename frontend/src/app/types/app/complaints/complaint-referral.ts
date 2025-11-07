import { UUID } from "node:crypto";
import { Agency } from "../code-tables/agency";

export interface ComplaintReferral {
  complaint_referral_guid: UUID;
  complaint_identifier: string;
  app_user_guid_ref: UUID; // Changed from app_user_guid to match backend DTO
  referred_by_agency: Agency;
  referred_to_agency: Agency;
  referral_reason: string;
  referral_date: string;
  referral_email_logs?: Array<{
    email_address: string;
    email_sent_utc_timestamp: Date;
  }>;
}
