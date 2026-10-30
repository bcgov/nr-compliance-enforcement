import { GraphQLError } from "graphql";
import { adminRoles, coreRoles } from "../../../enum/role.enum";
import { ClientRoles } from "../../../pg-session-extension/agency-from-roles";
import { hasRole } from "../../../common/has-role";
import { AppUser } from "../dto/app_user";

// Users without a core or admin role may only look up their own user record
export const validateAppUserAccess = (clientRoles: ClientRoles, userGuid: string, appUser: AppUser | null): void => {
  if (hasRole(clientRoles, [...coreRoles, ...adminRoles]) || !appUser) {
    return;
  }

  if (appUser.authUserGuid?.replaceAll("-", "").toUpperCase() !== userGuid.replaceAll("-", "").toUpperCase()) {
    throw new GraphQLError("You can only view your own user record.", {});
  }
};
