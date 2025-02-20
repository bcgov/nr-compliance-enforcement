//Note: Make sure these match the Keycloak role names exactly
export enum Role {
  COS = "COS",
  COS_ADMINISTRATOR = "COS Administrator",
  CEEB = "CEEB",
  CEEB_COMPLIANCE_COORDINATOR = "CEEB Compliance Coordinator",
  CEEB_SECTION_HEAD = "CEEB Section Head",
  TEMPORARY_TEST_ADMIN = "TEMPORARY_TEST_ADMIN",
  READ_ONLY = "READ ONLY",
  PARKS = "PARKS",
}

export const coreRoles: Role[] = [Role.COS, Role.CEEB, Role.PARKS];
