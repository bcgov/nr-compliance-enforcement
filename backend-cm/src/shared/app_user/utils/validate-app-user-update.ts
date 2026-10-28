import { GraphQLError } from "graphql";
import { adminRoles } from "../../../enum/role.enum";
import { ClientRoles } from "../../../pg-session-extension/agency-from-roles";
import { hasRole } from "../../../common/has-role";
import { AppUser, UpdateAppUserInput } from "../dto/app_user";

// Users without an admin role may only update their own name, user ID and COMS enrolment, or link their auth_user_guid
export const validateAppUserUpdate = (
  clientRoles: ClientRoles,
  userGuid: string,
  idirUsername: string,
  appUser: AppUser | null,
  input: UpdateAppUserInput,
): void => {
  if (hasRole(clientRoles, adminRoles)) {
    return;
  }

  const normalizedUserGuid = userGuid.replaceAll("-", "").toUpperCase();
  const isOwnRecord = appUser?.authUserGuid
    ? appUser.authUserGuid.replaceAll("-", "").toUpperCase() === normalizedUserGuid
    : appUser?.userId?.toUpperCase() === idirUsername.toUpperCase();

  if (!isOwnRecord) {
    throw new GraphQLError("You can only update your own user record.", {});
  }

  const linksOwnGuid =
    !appUser.authUserGuid && input.authUserGuid?.replaceAll("-", "").toUpperCase() === normalizedUserGuid;
  const changesOtherFields = Object.entries(input).some(
    ([field, value]) =>
      value !== undefined &&
      !["userId", "firstName", "lastName", "comsEnrolledIndicator"].includes(field) &&
      !(field === "authUserGuid" && linksOwnGuid),
  );

  if (changesOtherFields) {
    throw new GraphQLError("Only an administrator can change these user details.", {});
  }
};
