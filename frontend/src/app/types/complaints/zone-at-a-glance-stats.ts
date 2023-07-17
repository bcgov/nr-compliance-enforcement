export interface ZoneAtAGlanceStats  { 
    total: number,
    assigned: number,
    unassigned: number,
    offices: OfficeStats[]
}

export interface OfficeStats  { 
    name: string,
    assigned: number,
    unassigned: number,
    officers: OfficerStats[]
}

export interface OfficerStats  { 
    name: string,
    assignedHwcr: number
    assignedAllegations: number
}