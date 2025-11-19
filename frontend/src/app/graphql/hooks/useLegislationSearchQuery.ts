import { useGraphQLQuery } from "@/app/graphql/hooks/useGraphQLQuery";
import { Legislation } from "@/generated/graphql";
import { gql } from "graphql-request";
import Option from "@apptypes/app/option";

export interface LegislationSearchParams {
  agencyCode: string;
  legislationTypeCode: string;
  ancestorGuid?: string;
  enabled: boolean;
}

const GET_ACTS = gql`
  query GetLegislation($agencyCode: String!, $legislationTypeCode: String, $ancestorGuid: String) {
    legislation(agencyCode: $agencyCode, legislationTypeCode: $legislationTypeCode, ancestorGuid: $ancestorGuid) {
      legislationGuid
      legislationText
      sectionTitle
      alternateText
    }
  }
`;

export const useLegislationSearchQuery = (searchParams: LegislationSearchParams) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislation: Legislation[] }>(GET_ACTS, {
    queryKey: [
      "searchLegislationActs",
      searchParams.agencyCode,
      searchParams.legislationTypeCode,
      searchParams.ancestorGuid,
    ],
    variables: {
      agencyCode: searchParams.agencyCode,
      legislationTypeCode: searchParams.legislationTypeCode,
      ancestorGuid: searchParams.ancestorGuid,
    },
    enabled: searchParams.enabled,
    placeholderData: (previousData) => previousData,
  });
  return { data, isLoading, error };
};

export const convertLegislationToOption = (legislation: Legislation[]): Option[] => {
  return (
    legislation?.map((legislation) => ({
      label: legislation.sectionTitle ?? legislation.legislationText ?? "", // If there is a section title we want this instead for dropdowns.
      value: legislation.legislationGuid ?? "",
    })) ?? []
  );
};
