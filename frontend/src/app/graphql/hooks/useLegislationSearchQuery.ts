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
      parentGuid
      displayOrder
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
  const { data, isLoading, error } = useGraphQLQuery<{ legislationDirectChildren: Legislation[] }>(
    GET_DIRECT_CHILDREN,
    {
      queryKey: ["legislationDirectChildren", params.agencyCode, params.parentGuid, params.legislationTypeCode],
      variables: {
        agencyCode: params.agencyCode,
        parentGuid: params.parentGuid,
        legislationTypeCode: params.legislationTypeCode,
      },
      enabled: params.enabled,
      placeholderData: (previousData) => previousData,
    },
  );
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

/**
 * Converts legislation items to hierarchical options for section dropdowns.
 * Parts/Divisions are disabled group headers; Sections show "citation title".
 */
export const convertLegislationToHierarchicalOptions = (
  legislation: Legislation[] | undefined,
  rootGuid: string | undefined,
): Option[] => {
  if (!legislation?.length) return [];

  const itemGuids = new Set(legislation.map((i) => i.legislationGuid).filter(Boolean));
  const getParentKey = (item: Legislation) =>
    item.parentGuid === rootGuid || (item.parentGuid && itemGuids.has(item.parentGuid))
      ? item.parentGuid
      : (rootGuid ?? "root");

  // Group by parent, then sort each group by displayOrder and citation
  const childrenMap = new Map<string, Legislation[]>();
  for (const item of legislation) {
    const key = getParentKey(item);
    if (!childrenMap.has(key)) childrenMap.set(key, []);
    childrenMap.get(key)!.push(item);
  }
  childrenMap.forEach((children) =>
    children.sort(
      (a, b) =>
        (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) ||
        (parseInt(a.citation?.replace(/\D/g, "") ?? "", 10) || 9999) -
          (parseInt(b.citation?.replace(/\D/g, "") ?? "", 10) || 9999),
    ),
  );

  // Flatten tree recursively
  const flatten = (parentGuid?: string): Legislation[] =>
    (childrenMap.get(parentGuid ?? "root") ?? []).flatMap((child) => [
      child,
      ...flatten(child.legislationGuid ?? undefined),
    ]);

  // Convert to options
  const formatLabel = (item: Legislation) => {
    const type = item.legislationTypeCode;
    if (type === "PART" || type === "DIV") return item.sectionTitle ?? "";
    if (type === "SEC" && item.citation) return `${item.citation} ${item.sectionTitle ?? item.legislationText ?? ""}`;
    return item.sectionTitle ?? item.legislationText ?? "";
  };

  return flatten(rootGuid).map((item) => ({
    label: formatLabel(item),
    value: item.legislationGuid ?? "",
    isDisabled: item.legislationTypeCode === "PART" || item.legislationTypeCode === "DIV",
  }));
};
