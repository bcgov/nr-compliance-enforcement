//Note - these must match exactly the name of the role in Keycloak
enum Roles {
  CEEB = "CEEB",
  CEEB_COMPLIANCE_COORDINATOR = "CEEB Compliance Coordinator",
  CEEB_SECTION_HEAD = "CEEB Section Head",
  COS_ADMINISTRATOR = "COS Administrator",
  COS = "COS",
  GLOBAL_ADMINISTRATOR = "Global Administrator",
  AGENCY_ADMINISTRATOR = "Agency Administrator",
  READ_ONLY = "READ ONLY",
  INSPECTOR = "Inspector",
  PROVINCE_WIDE = "Province-wide",
  PARKS = "PARKS",
  HWCR_ONLY = "HWCR only",
  SECTOR = "SECTOR",
}

const coreRoles: Roles[] = [Roles.COS, Roles.CEEB, Roles.PARKS, Roles.SECTOR];

const adminRoles: Roles[] = [Roles.GLOBAL_ADMINISTRATOR, Roles.AGENCY_ADMINISTRATOR];

export { Roles, coreRoles, adminRoles };
