export interface ComplaintTable {
  detail_text: string;
  caller_name: string;
  caller_address: string;
  caller_email: string;
  caller_phone_1: string;
  caller_phone_2: string;
  caller_phone_3: string;
  location_geometry_point: { type: string; coordinates: Array<number> };
  location_summary_text: string;
  location_detailed_text: string;
  incident_reported_utc_timestmp: Date;
  incident_utc_datetime: Date;
  reported_by_other_text: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  complaint_identifier: string;
  reported_by_code: string;
  owned_by_agency_code_ref: string;
  complaint_status_code: string;
  geo_organization_unit_code: string;
  cos_geo_org_unit: string;
  complaint_type_code: string;
}
