import { GraphQLError } from "graphql";
import { Role } from "../../../enum/role.enum";
import { agenciesFromRoles, ClientRoles, normalizeRoles } from "../../../pg-session-extension/agency-from-roles";

// Agency administrators may only manage legislation for their own agency
export const validateAgencyAccess = (clientRoles: ClientRoles, agencyCode: string): void => {
  if (normalizeRoles(clientRoles).includes(Role.GLOBAL_ADMINISTRATOR)) {
    return;
  }

  const agencies = agenciesFromRoles(clientRoles);

  if (agencies.length !== 1) {
    throw new GraphQLError("Your account is not associated with a single agency and cannot manage legislation.", {});
  }

  if (agencies[0] !== agencyCode) {
    throw new GraphQLError("You can only manage legislation belonging to your own agency.", {});
  }
};
