export enum Role {
  COS = "COS",
  COS_ADMIN = "COS Admin",
  CEEB = "CEEB",
  READ_ONLY = "READ ONLY",
  PARKS = "PARKS",
  SECTOR = "SECTOR",
  GLOBAL_ADMINISTRATOR = "Global Administrator",
  AGENCY_ADMINISTRATOR = "Agency Administrator",
  NROS = "NROS",
}

export const coreRoles: Role[] = [Role.COS, Role.CEEB, Role.PARKS, Role.NROS, Role.SECTOR];
export const adminRoles: Role[] = [Role.GLOBAL_ADMINISTRATOR, Role.AGENCY_ADMINISTRATOR];
