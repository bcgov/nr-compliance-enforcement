import { useGraphQLQuery } from "@/app/graphql/hooks/useGraphQLQuery";
import { Legislation } from "@/generated/graphql";
import { gql } from "graphql-request";
import Option from "@apptypes/app/option";

export interface LegislationSearchParams {
  agencyCode: string;
  legislationTypeCodes: string[];
  ancestorGuid?: string;
  excludeRegulations?: boolean;
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
  query Legislations(
    $agencyCode: String!
    $legislationTypeCodes: [String]
    $ancestorGuid: String
    $excludeRegulations: Boolean
  ) {
    legislations(
      agencyCode: $agencyCode
      legislationTypeCodes: $legislationTypeCodes
      ancestorGuid: $ancestorGuid
      excludeRegulations: $excludeRegulations
    ) {
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
    queryKey: [
      "legislations",
      searchParams.agencyCode,
      searchParams.legislationTypeCodes,
      searchParams.ancestorGuid,
      searchParams.excludeRegulations,
    ],
    variables: {
      agencyCode: searchParams.agencyCode,
      legislationTypeCodes: searchParams.legislationTypeCodes,
      ancestorGuid: searchParams.ancestorGuid,
      excludeRegulations: searchParams.excludeRegulations,
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
  const getParentKey = (item: Legislation): string => {
    if (item.parentGuid === rootGuid) return rootGuid ?? "root";
    if (item.parentGuid && itemGuids.has(item.parentGuid)) return item.parentGuid;
    return rootGuid ?? "root";
  };

  // Sort comparator: by displayOrder, then by numeric citation
  const sortByDisplayOrderAndCitation = (a: Legislation, b: Legislation) =>
    (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) ||
    (parseFloat(a.citation ?? "") || 9999) - (parseFloat(b.citation ?? "") || 9999);

  // Group by parent, then sort each group
  const childrenMap = new Map<string, Legislation[]>();
  for (const item of legislation) {
    const key = getParentKey(item);
    if (!childrenMap.has(key)) childrenMap.set(key, []);
    childrenMap.get(key)!.push(item);
  }
  childrenMap.forEach((children, key) => {
    childrenMap.set(key, children.toSorted(sortByDisplayOrderAndCitation));
  });

  // Flatten tree recursively
  const flatten = (parentGuid?: string): Legislation[] =>
    (childrenMap.get(parentGuid ?? "root") ?? []).flatMap((child) => [
      child,
      ...flatten(child.legislationGuid ?? undefined),
    ]);

  // Convert to options
  const formatLabel = (item: Legislation) => {
    const type = item.legislationTypeCode;
    if (type === "PART") {
      const base = item.citation ? `Part ${item.citation}` : "Part";
      return item.sectionTitle ? `${base} - ${item.sectionTitle}` : base;
    }
    if (type === "DIV") {
      const base = item.citation ? `Division ${item.citation}` : "Division";
      return item.sectionTitle ? `${base} - ${item.sectionTitle}` : base;
    }
    if (type === "SCHED") {
      // Schedules use sectionTitle for their name (e.g., "Schedule A")
      return item.sectionTitle ?? (item.citation ? `Schedule ${item.citation}` : "Schedule");
    }
    if (type === "SEC" && item.citation) return `${item.citation} ${item.sectionTitle ?? item.legislationText ?? ""}`;
    return item.sectionTitle ?? item.legislationText ?? "";
  };

  return flatten(rootGuid).map((item) => ({
    label: formatLabel(item),
    value: item.legislationGuid ?? "",
    isDisabled: item.legislationTypeCode === "PART" || item.legislationTypeCode === "DIV" || item.legislationTypeCode === "SCHED",
  }));
};
