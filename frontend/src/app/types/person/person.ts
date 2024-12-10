import { AgencyCode } from "@apptypes/code-tables/agency-code";
import { ReportedByCode } from "@apptypes/code-tables/reported-by-code";

export interface Person {
  person_guid: string;
  first_name: string;
  middle_name_1: null;
  middle_name_2: null;
  last_name: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  updateTimestamp: Date;
  officer: Officer;
}

export interface Officer {
  officer_guid: string;
  user_id: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  auth_user_guid: string;
  office_guid: OfficeGUID;
  person_guid: Person;
  user_roles: string[];
  coms_enrolled_ind: boolean;
}

export interface OfficeGUID {
  office_guid: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  cos_geo_org_unit: CosGeoOrgUnit;
  agency_code: AgencyCode;
  reported_by_code: ReportedByCode;
}

export interface CosGeoOrgUnit {
  region_code: string;
  region_name: string;
  zone_code: string;
  zone_name: string;
  office_location_code: string;
  office_location_name: string;
  area_code: string;
  area_name: string;
  administrative_office_ind: boolean;
}
