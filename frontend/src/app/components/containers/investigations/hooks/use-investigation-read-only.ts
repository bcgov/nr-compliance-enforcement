import { Investigation } from "@/generated/graphql";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid } from "@/app/store/reducers/app";
import { GET_INVESTIGATION } from "../details/investigation-details";

// only users with a role on the investigation or added as a collaborator can edit it
export const hasInvestigationAccess = (investigation: Investigation | undefined, userGuid: string) =>
  !!investigation &&
  ([investigation.primaryInvestigatorGuid, investigation.supervisorGuid, investigation.fileCoordinatorGuid].includes(
    userGuid,
  ) ||
    !!investigation.collaborators?.some((collaborator) => collaborator?.appUserGuid === userGuid));

// used cached get to check if investigation is closed or the user has no access
// used by downstream components for checking if read-only mode
export const useInvestigationReadOnly = (investigationGuid: string) => {
  const userGuid = useAppSelector(appUserGuid);
  const { data } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
  });
  const investigation = data?.getInvestigation;
  return (
    investigation?.investigationStatus?.investigationStatusCode === "CLOSED" ||
    !hasInvestigationAccess(investigation, userGuid)
  );
};
