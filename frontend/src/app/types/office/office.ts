import { AgencyCode } from "@apptypes/code-tables/agency-code";
import { CosGeoOrgUnit, Officer } from "@apptypes/person/person";

export interface Office {
  office_guid: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  updateTimestamp: Date;
  cos_geo_org_unit: CosGeoOrgUnit;
  agency_code: AgencyCode;
  officers: Officer[];
}
