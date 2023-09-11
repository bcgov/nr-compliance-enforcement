import { ComplaintStatusCode } from "../code-tables/complaint-status-code";
import { ViolationCode } from "../code-tables/violation-code";
import { LocationGeometryPoint } from "./complaint";

export interface AllegationComplaint {
  complaint_identifier: {
    complaint_identifier: string;
    geo_organization_unit_code: { short_description: string };
    cos_geo_org_unit: {
      zone_code: string;
      office_location_name: string;
      area_name: string;
    },
    location_geometry_point: LocationGeometryPoint;
    incident_datetime: string;
    incident_reported_datetime: string;
    location_summary_text: string;
    create_user_id: string;
    create_timestamp: string;
    update_user_id: string;
    update_timestamp: string;
    complaint_status_code: ComplaintStatusCode;
    person_complaint_xref: [{person_guid: {first_name: string, last_name: string},active_ind: boolean}]},
  violation_code: ViolationCode;
  in_progress_ind: string | boolean;
  observed_ind: boolean;
  suspect_witnesss_dtl_text?: string
  update_timestamp: string;
  allegation_complaint_guid: string
}