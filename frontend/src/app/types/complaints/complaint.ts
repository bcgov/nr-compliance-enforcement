import { AgencyCode } from "../code-tables/agency-code";
import { GeoOrganizationUnitCode } from "../code-tables/geo-organization-unit-code";
import { PersonComplaintXref } from "./person-complaint-xref";

export interface Complaint {
  complaint_identifier: string;
    geo_organization_unit_code: GeoOrganizationUnitCode;
    location_geometry_point: LocationGeometryPoint;
    incident_utc_datetime: Date | null;
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
    owned_by_agency_code: AgencyCode;
    cos_geo_org_unit: {
      zone_code: string;
      office_location_name: string;
      area_name: string;
      area_code: string;
      region_code: string;
    };
    person_complaint_xref: PersonComplaintXref[];
    referred_by_agency_other_text: string;
}

export interface ComplaintStatusCode {
  complaint_status_code: string;
  short_description: string;
  long_description: string;
  display_order: number;
  active_ind: boolean;
  create_user_id: string;
  create_utc_timestamp: Date | null;
  update_user_id: string;
  update_utc_timestamp: Date | null;
}

export interface LocationGeometryPoint {
  type: string;
  coordinates: number[];
}
