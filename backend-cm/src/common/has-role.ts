import { Role } from "../enum/role.enum";
import { ClientRoles, normalizeRoles } from "../pg-session-extension/agency-from-roles";

export const hasRole = (clientRoles: ClientRoles, roles: Role[]): boolean =>
  roles.some((role) => normalizeRoles(clientRoles).includes(role));
