import { GraphQLError } from "graphql";
import { getRequest } from "../../../pg-session-extension/request-interceptor";

// Only users with a role on the activity or added as a collaborator can edit it
export const validateActivityAccess = (activityIdentifier: string): void => {
  if (!getRequest()?.user?.app_user_activity_identifiers?.includes(activityIdentifier)) {
    throw new GraphQLError("You can only change activities you are assigned to or collaborating on.", {});
  }
};
