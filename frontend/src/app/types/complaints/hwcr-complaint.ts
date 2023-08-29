import { ComplaintStatusCode } from "../code-tables/complaint-status-code";
import { GeoOrganizationUnitCode } from "../code-tables/geo-organization-unit-code";
import { HwcrComplaintNatureCode } from "../code-tables/hwcr-complaint-nature-code";
import { SpeciesCode } from "../code-tables/species-code";

export interface HwcrComplaint {
  complaint_identifier: {
    complaint_identifier: string;
    geo_organization_unit_code: GeoOrganizationUnitCode;
    incident_datetime: string;
    incident_reported_datetime: string;
    location_summary_text: string;
    location_detailed_text: string;
    detail_text: string;
    create_user_id: string;
    create_timestamp: string;
    update_user_id: string;
    update_timestamp: string;
    complaint_status_code: ComplaintStatusCode;
    cos_geo_org_unit: {
            zone_code: string;
            office_location_name: string;
            area_name: string;
            area_code: string;
    },
    person_complaint_xref: {person_guid: {person_complaint_xref_guid: string, person_guid: string, first_name: string, last_name: string}, active_ind: boolean, complaint_identifier: string, person_complaint_xref_code: string}[];
  }
  hwcr_complaint_nature_code: HwcrComplaintNatureCode;
  species_code: SpeciesCode
  update_timestamp: string;
  hwcr_complaint_guid: string;
  attractant_hwcr_xref: {attractant_code: string, hwcr_complaint_guid: string, create_user_id: string}[];
}