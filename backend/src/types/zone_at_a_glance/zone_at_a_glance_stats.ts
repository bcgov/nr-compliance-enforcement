import { UUID } from "crypto";

export interface ZoneAtAGlanceStats {
  total: number;
  assigned: number;
  unassigned: number;
  offices?: OfficeStats[];
}

export interface OfficeStats {
  name: string;
  assigned: number;
  unassigned: number;
  appUsers?: OfficerStats[]; // Using OfficerStats for backward compatibility, but represents app users
  officeGuid: UUID;
}

export interface OfficerStats {
  name: string;
  hwcrAssigned: number;
  allegationAssigned: number;
  appUserGuid: UUID; // Renamed from officerGuid to match new app_user structure
}
