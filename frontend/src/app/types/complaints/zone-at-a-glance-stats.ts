export interface ZoneAtAGlanceStats {
  total: number;
  assigned: number;
  unassigned: number;
  offices: OfficeStats[];
}

export interface OfficeStats {
  name: string;
  assigned: number;
  unassigned: number;
  appUsers: OfficerStats[]; // Renamed from officers
  officeGuid?: string;
}

export interface OfficerStats {
  name: string;
  hwcrAssigned: number;
  allegationAssigned: number;
}
