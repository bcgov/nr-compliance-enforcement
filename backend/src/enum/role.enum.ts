//Note: Make sure these match the Keycloak role names exactly
export enum Role {
  COS = "COS",
  COS_ADMINISTRATOR = "COS Administrator",
  CEEB = "CEEB",
  CEEB_COMPLIANCE_COORDINATOR = "CEEB Compliance Coordinator",
  CEEB_SECTION_HEAD = "CEEB Section Head",
  GLOBAL_ADMINISTRATOR = "Global Administrator",
  AGENCY_ADMINISTRATOR = "Agency Administrator",
  READ_ONLY = "READ ONLY",
  PARKS = "PARKS",
  SECTOR = "SECTOR",
}

export const coreRoles: Role[] = [Role.COS, Role.CEEB, Role.PARKS, Role.SECTOR];

export const adminRoles: Role[] = [Role.GLOBAL_ADMINISTRATOR, Role.AGENCY_ADMINISTRATOR];
