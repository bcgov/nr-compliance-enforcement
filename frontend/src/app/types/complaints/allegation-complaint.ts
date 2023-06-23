import { ComplaintStatusCode } from "../code-tables/complaint-status-code";
import { ViolationCode } from "../code-tables/violation-code";

export interface AllegationComplaint {
  complaint_identifier: {
    complaint_identifier: string;
    geo_organization_unit_code: { short_description: string };
    incident_datetime: string;
    incident_reported_datetime: string;
    location_summary_text: string;
    create_user_id: string;
    create_timestamp: string;
    update_user_id: string;
    update_timestamp: string;
    complaint_status_code: ComplaintStatusCode;
    person_complaint_xref: [{person_guid: {first_name: string, last_name: string}}],complaint_identifier: string, geo_organization_unit_code:{short_description: string}, incident_datetime: string, incident_reported_datetime: string, location_summary_text:string, update_user_id:string, update_timestamp:string, complaint_status_code:{long_description:string}};
  };
  violation_code: ViolationCode;
  in_progress_ind: string | boolean;
  observed_ind: boolean;
  suspect_witnesss_dtl_text?: string
  update_timestamp: string;
}