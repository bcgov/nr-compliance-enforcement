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
  query Legislations($agencyCode: String!, $legislationTypeCodes: [String], $ancestorGuid: String) {
    legislations(agencyCode: $agencyCode, legislationTypeCodes: $legislationTypeCodes, ancestorGuid: $ancestorGuid) {
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
  query Legislation($legislationGuid: String!, $includeAncestors: Boolean) {
    legislation(legislationGuid: $legislationGuid, includeAncestors: $includeAncestors) {
      legislationTypeCode
      fullCitation
      alternateText
      legislationText
      ancestors {
        legislationTypeCode
        legislationGuid
      }
    }
  }
`;

export const useLegislation = (legislationGuid: string | undefined, includeAncestors: boolean) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislation: Legislation }>(GET_LEGISLATION, {
    queryKey: ["legislation", legislationGuid, includeAncestors],
    variables: {
      legislationGuid: legislationGuid,
      includeAncestors: includeAncestors,
    },
    enabled: !!legislationGuid, // only run this is we have a guid
    placeholderData: (previousData) => previousData,
  });
  return { data, isLoading, error };
};

export const useLegislationSearchQuery = (searchParams: LegislationSearchParams) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislations: Legislation[] }>(SEARCH_LEGISLATION, {
    queryKey: ["legislations", searchParams.agencyCode, searchParams.legislationTypeCodes, searchParams.ancestorGuid],
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

export const convertLegislationToOption = (legislation: Legislation[] | undefined): Option[] => {
  return (
    legislation?.map((legislation) => ({
      label: legislation.sectionTitle ?? legislation.legislationText ?? "", // If there is a section title we want this instead for dropdowns.
      value: legislation.legislationGuid ?? "",
    })) ?? []
  );
};
