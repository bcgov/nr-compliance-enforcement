import { UUID } from "crypto";

export interface ZoneAtAGlanceStats  { 
    total: number,
    assigned: number,
    unassigned: number,
    offices?: OfficeStats[]
}

export interface OfficeStats  { 
    name: string,
    assigned: number,
    unassigned: number,
    officers?: OfficerStats[]
    officeGuid: UUID;
}

export interface OfficerStats  { 
    name: string,
    hwcrAssigned: number
    allegationAssigned: number
    officerGuid: UUID;
}