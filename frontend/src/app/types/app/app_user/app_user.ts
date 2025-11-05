import { UUID } from "node:crypto";
import { ReportedByCode } from "@apptypes/code-tables/reported-by-code";
import { Agency } from "@apptypes/app/code-tables/agency";

/**
 * Main AppUser type representing a user in the system
 */
export interface AppUser {
  app_user_guid: string;
  user_id: string;
  first_name: string;
  last_name: string;
  agency_code_ref: string;
  agency_code: Agency | undefined;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  auth_user_guid: string;
  office_guid: OfficeGUID;
  user_roles: string[];
  coms_enrolled_ind: boolean;
  deactivate_ind: boolean;
  park_area_guid: string | null;
}

/**
 * Office GUID with geographic organization data
 */
export interface OfficeGUID {
  office_guid: string;
  create_user_id: string;
  create_utc_timestamp: Date;
  update_user_id: string;
  update_utc_timestamp: Date;
  cos_geo_org_unit: CosGeoOrgUnit;
  agency_code_ref: string;
  reported_by_code: ReportedByCode;
}

/**
 * Geographic organization unit data
 */
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

/**
 * CSS User from Keycloak/IDIR
 */
export interface CssUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  attributes: {
    idir_user_guid: string[];
    idir_username: string[];
    display_name: string[];
  };
}

/**
 * Delegate represents a person assigned to a complaint in various roles
 * (e.g., ASSIGNEE, SUSPECT, WITNESS, etc.)
 */
export interface Delegate {
  xrefId?: UUID;
  isActive: boolean;
  type: string; // ASSIGNEE, SUSPECT, WITNESS, etc.
  appUserGuid: UUID;
}

/**
 * Office DTO with geographic organization data
 */
export interface OfficeDto extends CosGeoOrgUnit {
  id: UUID;
}
