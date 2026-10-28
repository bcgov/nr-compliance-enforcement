//Note: Make sure these match the Keycloak role names exactly
export enum Role {
  COS = "COS",
  CEEB = "CEEB",
  CEEB_COMPLIANCE_COORDINATOR = "CEEB Compliance Coordinator",
  CEEB_SECTION_HEAD = "CEEB Section Head",
  NROS = "NROS",
  MINES = "MINES",
  FCBC = "FCBC",
  WEB = "WEB",
  BCCEA = "BCCEA",
  ECCC = "ECCC",
  DFO = "DFO",
  POL = "POL",
  GLOBAL_ADMINISTRATOR = "Global Administrator",
  AGENCY_ADMINISTRATOR = "Agency Administrator",
  READ_ONLY = "READ ONLY",
  PARKS = "PARKS",
  SECTOR = "SECTOR",
  PARTY_ACCESS = "Party Access",
}

export const coreRoles: Role[] = [Role.COS, Role.CEEB, Role.PARKS, Role.NROS, Role.MINES, Role.SECTOR];

export const adminRoles: Role[] = [Role.GLOBAL_ADMINISTRATOR, Role.AGENCY_ADMINISTRATOR];
