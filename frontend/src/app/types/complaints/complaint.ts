import { TimezoneCode } from "../code-tables/timezone-code";

export interface Complaint {
  detail_text: string;
  caller_name: string;
  caller_address: string;
  caller_email: null;
  caller_phone_1: string;
  caller_phone_2: null;
  caller_phone_3: null;
  location_geometry_point: LocationGeometryPoint;
  location_summary_text: string;
  location_detailed_text: string;
  incident_utc_datetime: Date | null;
  timezone_code: TimezoneCode;
  incident_reported_utc_timestmp: Date;
  referred_by_agency_other_text: null;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  complaint_identifier: string;
  complaint_status_code: ComplaintStatusCode;
}

export interface ComplaintStatusCode {
  complaint_status_code: string;
  short_description: string;
  long_description: string;
  display_order: number;
  active_ind: boolean;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
}

export interface LocationGeometryPoint {
  type: string;
  coordinates: number[];
}
