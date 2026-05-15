import { Investigation } from "@/generated/graphql";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { GET_INVESTIGATION } from "../details/investigation-details";

// used cached get to check if investigation is closed
// used by downstream components for checking if read-only mode
export const useInvestigationReadOnly = (investigationGuid: string) => {
  const { data } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
  });
  return data?.getInvestigation?.investigationStatus?.investigationStatusCode === "CLOSED";
};
