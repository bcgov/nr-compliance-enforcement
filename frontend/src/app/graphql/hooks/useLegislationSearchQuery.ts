import { useGraphQLQuery } from "@/app/graphql/hooks/useGraphQLQuery";
import { Legislation } from "@/generated/graphql";
import { gql } from "graphql-request";
import Option from "@apptypes/app/option";

export interface LegislationSearchParams {
  agencyCode: string;
  legislationTypeCodes: string[];
  ancestorGuid?: string;
  enabled: boolean;
}

const SEARCH_LEGISLATION = gql`
  query SearchLegislation($agencyCode: String!, $legislationTypeCodes: [String], $ancestorGuid: String) {
    legislation(agencyCode: $agencyCode, legislationTypeCodes: $legislationTypeCodes, ancestorGuid: $ancestorGuid) {
      legislationGuid
      legislationText
      sectionTitle
      alternateText
      citation
      legislationTypeCode
    }
  }
`;

const GET_LEGISLATION = gql`
  query GetLegislation($legislationGuid: String!) {
    getLegislation(legislationGuid: $legislationGuid) {
      legislationTypeCode
      fullCitation
      alternateText
      legislationText
    }
  }
`;

export const useLegislationGet = (legislationGuid: string) => {
  const { data, isLoading, error } = useGraphQLQuery<{ getLegislation: Legislation }>(GET_LEGISLATION, {
    queryKey: ["getLegislation", legislationGuid],
    variables: {
      legislationGuid: legislationGuid,
    },
    enabled: true,
    placeholderData: (previousData) => previousData,
  });
  return { data, isLoading, error };
};

export const useLegislationSearchQuery = (searchParams: LegislationSearchParams) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislation: Legislation[] }>(SEARCH_LEGISLATION, {
    queryKey: [
      "searchLegislation",
      searchParams.agencyCode,
      searchParams.legislationTypeCodes,
      searchParams.ancestorGuid,
    ],
    variables: {
      agencyCode: searchParams.agencyCode,
      legislationTypeCodes: searchParams.legislationTypeCodes,
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
