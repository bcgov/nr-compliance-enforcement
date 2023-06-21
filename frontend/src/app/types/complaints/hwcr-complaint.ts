import { ComplaintStatusCode } from "../code-tables/complaint-status-code";
import { HwcrComplaintNatureCode } from "../code-tables/hwcr-complaint-nature-code";
import { SpeciesCode } from "../code-tables/species-code";

export interface HwcrComplaint {
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
  };
  hwcr_complaint_nature_code: HwcrComplaintNatureCode;
  species_code: SpeciesCode
  update_timestamp: string;
}
