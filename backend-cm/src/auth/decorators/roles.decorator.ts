import { SetMetadata } from "@nestjs/common";
import { Role } from "../../enum/role.enum";

/**
 * Roles decorator for roles based access to API.  The roles defined in role.enum are used as part of the Roles decorator.
 * For example @Roles(Role.COS) will allow users that have the COS role on the JWT claim.
 */
export const ROLES_KEY = "roles";
export const Roles = (...roles: (Role[] | Role)[]) => {
  // Three possible scenarios here
  // @Roles(Role.COS_ADMIN)
  // @Roles(coreRoles) which is an array
  // @Roles(coreRoles, Roles.COS_ADMIN)
  // To handle all cases we accept an array of stuff and then flatten it down.
  const flattenedRoles = roles.flat();
  return SetMetadata(ROLES_KEY, flattenedRoles);
};
