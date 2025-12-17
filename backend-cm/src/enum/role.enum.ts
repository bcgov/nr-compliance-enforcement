export enum Role {
  COS = "COS",
  COS_ADMIN = "COS Admin",
  CEEB = "CEEB",
  READ_ONLY = "READ ONLY",
  PARKS = "PARKS",
  SECTOR = "SECTOR",
  TEMPORARY_TEST_ADMIN = "TEMPORARY_TEST_ADMIN",
}

export const coreRoles: Role[] = [Role.COS, Role.CEEB, Role.PARKS, Role.SECTOR];
export const adminRoles: Role[] = [Role.TEMPORARY_TEST_ADMIN];
