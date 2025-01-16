import { SetMetadata } from "@nestjs/common";
import { Role } from "../../enum/role.enum";

/**
 * Roles decorator for roles based access to API.  The roles defined in role.enum are used as part of the Roles decorator.
 * For example @Roles(Role.COS) will allow users that have the COS role on the JWT claim.
 */
export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
