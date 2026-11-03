import { GraphQLError } from "graphql";
import { coreRoles } from "../../../enum/role.enum";
import { ClientRoles } from "../../../pg-session-extension/agency-from-roles";
import { hasRole } from "../../../common/has-role";

// Users without a core role (eg. party only users) must set a targetId to search events
export const validateEventSearch = (clientRoles: ClientRoles, targetId?: string): void => {
  if (hasRole(clientRoles, coreRoles)) {
    return;
  }

  if (!targetId) {
    throw new GraphQLError("You can only search the events of a party.", {});
  }
};
