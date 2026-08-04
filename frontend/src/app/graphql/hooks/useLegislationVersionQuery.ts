import { useGraphQLQuery } from "@/app/graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { gql } from "graphql-request";

export type ImportStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface LegislationVersion {
  legislationVersionGuid: string;
  legislationSourceGuid: string;
  parentLegislationVersionGuid: string | null;
  effectiveDate: string;
  importStatus: ImportStatus;
  sourceUrl: string | null;
  sourceEffectiveDate: string | null;
  lastImportTimestamp: string | null;
  lastImportLog: string | null;
  createUserId?: string;
  createUtcTimestamp?: string;
}

export interface ContraventionStats {
  count: number;
  earliest: string | null;
  latest: string | null;
}

const GET_LEGISLATION_VERSIONS = gql`
  query LegislationVersions($legislationSourceGuid: String!) {
    legislationVersions(legislationSourceGuid: $legislationSourceGuid) {
      legislationVersionGuid
      legislationSourceGuid
      parentLegislationVersionGuid
      effectiveDate
      importStatus
      sourceUrl
      sourceEffectiveDate
      lastImportTimestamp
      lastImportLog
      createUserId
    }
  }
`;

const GET_LEGISLATION_VERSION_CONTRAVENTION_STATS = gql`
  query LegislationVersionContraventionStats($legislationVersionGuid: String!) {
    legislationVersionContraventionStats(legislationVersionGuid: $legislationVersionGuid) {
      count
      earliest
      latest
    }
  }
`;

const GET_REFERENCED_LEGISLATION_GUIDS = gql`
  query ReferencedLegislationGuids($legislationGuids: [String!]!) {
    referencedLegislationGuids(legislationGuids: $legislationGuids)
  }
`;

const CREATE_LEGISLATION_VERSION = gql`
  mutation CreateLegislationVersion($legislationSourceGuid: String!, $effectiveDate: String!) {
    createLegislationVersion(legislationSourceGuid: $legislationSourceGuid, effectiveDate: $effectiveDate) {
      legislationVersionGuid
      legislationSourceGuid
      effectiveDate
      importStatus
      sourceUrl
    }
  }
`;

const UPDATE_LEGISLATION_VERSION = gql`
  mutation UpdateLegislationVersion($legislationVersionGuid: String!, $effectiveDate: String!) {
    updateLegislationVersion(legislationVersionGuid: $legislationVersionGuid, effectiveDate: $effectiveDate) {
      legislationVersionGuid
      legislationSourceGuid
      effectiveDate
      importStatus
      sourceUrl
    }
  }
`;

const RESET_LEGISLATION_VERSION = gql`
  mutation ResetLegislationVersion($legislationVersionGuid: String!) {
    resetLegislationVersion(legislationVersionGuid: $legislationVersionGuid)
  }
`;

const DELETE_LEGISLATION_VERSION = gql`
  mutation DeleteLegislationVersion($legislationVersionGuid: String!) {
    deleteLegislationVersion(legislationVersionGuid: $legislationVersionGuid)
  }
`;

export const useLegislationVersions = (legislationSourceGuid: string | undefined) => {
  const { data, isLoading, error, refetch } = useGraphQLQuery<{ legislationVersions: LegislationVersion[] }>(
    GET_LEGISLATION_VERSIONS,
    {
      queryKey: ["legislationVersions", legislationSourceGuid],
      variables: { legislationSourceGuid },
      enabled: !!legislationSourceGuid,
    },
  );
  return { data: data?.legislationVersions, isLoading, error, refetch };
};

export const useLegislationVersionContraventionStats = (legislationVersionGuid: string | undefined) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislationVersionContraventionStats: ContraventionStats }>(
    GET_LEGISLATION_VERSION_CONTRAVENTION_STATS,
    {
      queryKey: ["legislationVersionContraventionStats", legislationVersionGuid],
      variables: { legislationVersionGuid },
      enabled: !!legislationVersionGuid,
    },
  );
  return { data: data?.legislationVersionContraventionStats, isLoading, error };
};

export const useReferencedLegislationGuids = (legislationGuids: string[]) => {
  const { data, isLoading, error } = useGraphQLQuery<{ referencedLegislationGuids: string[] }>(
    GET_REFERENCED_LEGISLATION_GUIDS,
    {
      queryKey: ["referencedLegislationGuids", legislationGuids],
      variables: { legislationGuids },
      enabled: legislationGuids.length > 0,
    },
  );
  return { data: data?.referencedLegislationGuids, isLoading, error };
};

export const useCreateLegislationVersion = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useGraphQLMutation<
    { createLegislationVersion: LegislationVersion },
    Error,
    { legislationSourceGuid: string; effectiveDate: string }
  >(CREATE_LEGISLATION_VERSION, {
    invalidateQueries: ["legislationVersions", "legislationSources"],
    ...options,
  });
};

export const useUpdateLegislationVersion = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useGraphQLMutation<
    { updateLegislationVersion: LegislationVersion },
    Error,
    { legislationVersionGuid: string; effectiveDate: string }
  >(UPDATE_LEGISLATION_VERSION, {
    invalidateQueries: ["legislationVersions", "legislationSources"],
    ...options,
  });
};

export const useResetLegislationVersion = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useGraphQLMutation<{ resetLegislationVersion: boolean }, Error, { legislationVersionGuid: string }>(
    RESET_LEGISLATION_VERSION,
    {
      invalidateQueries: ["legislationVersions", "legislationSources"],
      ...options,
    },
  );
};

export const useDeleteLegislationVersion = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useGraphQLMutation<{ deleteLegislationVersion: boolean }, Error, { legislationVersionGuid: string }>(
    DELETE_LEGISLATION_VERSION,
    {
      invalidateQueries: ["legislationVersions", "legislationSources"],
      ...options,
    },
  );
};
