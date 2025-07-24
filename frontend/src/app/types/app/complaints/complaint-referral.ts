import { UUID } from "crypto";
import { Agency } from "../code-tables/agency";

export interface ComplaintReferral {
  complaint_referral_guid: UUID;
  complaint_identifier: string;
  officer_guid: {
    person_guid: {
      first_name: string;
      last_name: string;
    };
  };
  referred_by_agency: Agency;
  referred_to_agency: Agency;
  referral_reason: string;
  referral_date: string;
  referral_email_logs?: Array<{
    email_address: string;
    email_sent_utc_timestamp: Date;
  }>;
}
