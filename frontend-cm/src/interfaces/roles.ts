//Note - these must match exactly the name of the role in Keycloak
enum Roles {
  CEEB = 'CEEB',
  CEEB_COMPLIANCE_COORDINATOR = 'CEEB Compliance Coordinator',
  CEEB_SECTION_HEAD = 'CEEB Section Head',
  SYSTEM_ADMINISTRATOR = 'System Administrator',
  COS_ADMINISTRATOR = 'COS Administrator',
  COS = 'COS',
  TEMPORARY_TEST_ADMIN = 'TEMPORARY_TEST_ADMIN',
  READ_ONLY = 'READ ONLY',
  INSPECTOR = 'Inspector',
  PROVINCE_WIDE = 'Province-wide',
  PARKS = 'PARKS',
  HWCR_ONLY = 'HWCR only',
}

const coreRoles: Roles[] = [Roles.COS, Roles.CEEB, Roles.PARKS]

export { Roles, coreRoles }
