import { UUID } from "node:crypto";

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
  appUsers?: OfficerStats[];
  officeGuid: UUID;
}

export interface OfficerStats {
  name: string;
  hwcrAssigned: number;
  allegationAssigned: number;
  appUserGuid: UUID;
}
