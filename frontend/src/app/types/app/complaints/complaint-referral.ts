import { UUID } from "crypto";

export interface ComplaintReferral {
  complaint_referral_guid: UUID;
  complaint_identifier: string;
  officer_guid: {
    person_guid: {
      first_name: string;
      last_name: string;
    };
  };
  referred_by_agency_code: {
    agency_code: string;
    long_description: string;
  };
  referred_to_agency_code: {
    agency_code: string;
    long_description: string;
    external_agency_ind: string;
  };
  referral_reason: string;
  referral_date: string;
}
