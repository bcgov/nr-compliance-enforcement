export interface Complaint {
    detail_text:                   string;
    caller_name:                   string;
    caller_address:                string;
    caller_email:                  null;
    caller_phone_1:                string;
    caller_phone_2:                null;
    caller_phone_3:                null;
    location_geometry_point:       LocationGeometryPoint;
    location_summary_text:         string;
    location_detailed_text:        string;
    incident_datetime:             Date;
    incident_reported_datetime:    Date;
    referred_by_agency_other_text: null;
    create_user_id:                string;
    create_user_guid:              string | null;
    create_timestamp:              Date;
    update_user_id:                string;
    update_user_guid:              string | null;
    update_timestamp:              Date;
    complaint_identifier:          string;
    complaint_status_code:         ComplaintStatusCode;
  }
  
  export interface ComplaintStatusCode {
    complaint_status_code: string;
    short_description:     string;
    long_description:      string;
    display_order:         number;
    active_ind:            boolean;
    create_user_id:        string;
    create_user_guid:      null;
    create_timestamp:      Date;
    update_user_id:        string;
    update_user_guid:      null;
    update_timestamp:      Date;
  }
  
  export interface LocationGeometryPoint {
    type:        string;
    coordinates: number[];
  }