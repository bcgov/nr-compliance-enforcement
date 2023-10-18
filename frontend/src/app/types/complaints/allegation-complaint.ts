import { AgencyCode } from "../code-tables/agency-code";
import { ComplaintStatusCode } from "../code-tables/complaint-status-code";
import { GeoOrganizationUnitCode } from "../code-tables/geo-organization-unit-code";
import { TimezoneCode } from "../code-tables/timezone-code";
import { ViolationCode } from "../code-tables/violation-code";
import { LocationGeometryPoint } from "./complaint";
import { PersonComplaintXref } from "./person-complaint-xref";

export interface AllegationComplaint {
  complaint_identifier: {
    complaint_identifier: string;
    geo_organization_unit_code: GeoOrganizationUnitCode;
    location_geometry_point: LocationGeometryPoint;
    incident_utc_datetime: Date;
    timezone_code: TimezoneCode;
    incident_reported_utc_timestmp: string;
    location_summary_text: string;
    location_detailed_text: string;
    detail_text: string;
    create_user_id: string;
    create_utc_timestamp: string;
    update_user_id: string;
    update_utc_timestamp: string;
    complaint_status_code: ComplaintStatusCode;
    caller_name: string;
    caller_address: string;
    caller_email: string;
    caller_phone_1: string;
    caller_phone_2: string;
    caller_phone_3: string;
    referred_by_agency_code: AgencyCode;
    cos_geo_org_unit: {
      zone_code: string;
      office_location_name: string;
      area_name: string;
      area_code: string;
    };
    person_complaint_xref: PersonComplaintXref[];
  };
  violation_code: ViolationCode;
  in_progress_ind: string | boolean;
  observed_ind: boolean;
  suspect_witnesss_dtl_text: string;
  update_utc_timestamp: string;
  allegation_complaint_guid: string;
}
