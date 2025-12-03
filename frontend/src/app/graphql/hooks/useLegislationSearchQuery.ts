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

export interface LegislationChildTypesParams {
  agencyCode: string;
  parentGuid?: string;
  enabled: boolean;
}

export interface LegislationDirectChildrenParams {
  agencyCode: string;
  parentGuid: string;
  legislationTypeCode?: string;
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
  query Legislation($legislationGuid: String!) {
    legislation(legislationGuid: $legislationGuid) {
      legislationTypeCode
      fullCitation
      alternateText
      legislationText
    }
  }
`;

const GET_CHILD_TYPES = gql`
  query LegislationChildTypes($agencyCode: String!, $parentGuid: String) {
    legislationChildTypes(agencyCode: $agencyCode, parentGuid: $parentGuid)
  }
`;

const GET_DIRECT_CHILDREN = gql`
  query LegislationDirectChildren($agencyCode: String!, $parentGuid: String!, $legislationTypeCode: String) {
    legislationDirectChildren(
      agencyCode: $agencyCode
      parentGuid: $parentGuid
      legislationTypeCode: $legislationTypeCode
    ) {
      legislationGuid
      legislationText
      sectionTitle
      alternateText
      citation
      legislationTypeCode
    }
  }
`;

export const useLegislation = (legislationGuid: string) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislation: Legislation }>(GET_LEGISLATION, {
    queryKey: ["legislation", legislationGuid],
    variables: {
      legislationGuid: legislationGuid,
    },
    enabled: true,
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

export const useLegislationChildTypes = (params: LegislationChildTypesParams) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislationChildTypes: string[] }>(GET_CHILD_TYPES, {
    queryKey: ["legislationChildTypes", params.agencyCode, params.parentGuid],
    variables: {
      agencyCode: params.agencyCode,
      parentGuid: params.parentGuid,
    },
    enabled: params.enabled,
    placeholderData: (previousData) => previousData,
  });
  return { data, isLoading, error };
};

export const useLegislationDirectChildren = (params: LegislationDirectChildrenParams) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislationDirectChildren: Legislation[] }>(GET_DIRECT_CHILDREN, {
    queryKey: ["legislationDirectChildren", params.agencyCode, params.parentGuid, params.legislationTypeCode],
    variables: {
      agencyCode: params.agencyCode,
      parentGuid: params.parentGuid,
      legislationTypeCode: params.legislationTypeCode,
    },
    enabled: params.enabled,
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
