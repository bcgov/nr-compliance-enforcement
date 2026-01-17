import { useGraphQLQuery } from "@/app/graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { gql } from "graphql-request";

export type ImportStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface LegislationSource {
  legislationSourceGuid: string;
  shortDescription: string;
  longDescription: string | null;
  sourceUrl: string;
  regulationsSourceUrl: string | null;
  agencyCode: string;
  activeInd: boolean;
  importedInd: boolean;
  importStatus: ImportStatus | null;
  lastImportTimestamp: string | null;
  lastImportLog: string | null;
  createUserId?: string;
  createUtcTimestamp?: string;
}

export interface CreateLegislationSourceInput {
  shortDescription: string;
  longDescription?: string;
  sourceUrl: string;
  regulationsSourceUrl?: string;
  agencyCode: string;
}

export interface UpdateLegislationSourceInput {
  legislationSourceGuid: string;
  shortDescription?: string;
  longDescription?: string;
  sourceUrl?: string;
  regulationsSourceUrl?: string;
  agencyCode?: string;
  activeInd?: boolean;
  importedInd?: boolean;
}

const GET_LEGISLATION_SOURCES = gql`
  query LegislationSources {
    legislationSources {
      legislationSourceGuid
      shortDescription
      longDescription
      sourceUrl
      regulationsSourceUrl
      agencyCode
      activeInd
      importedInd
      importStatus
      lastImportTimestamp
      lastImportLog
    }
  }
`;

const GET_LEGISLATION_SOURCE = gql`
  query LegislationSource($legislationSourceGuid: String!) {
    legislationSource(legislationSourceGuid: $legislationSourceGuid) {
      legislationSourceGuid
      shortDescription
      longDescription
      sourceUrl
      regulationsSourceUrl
      agencyCode
      activeInd
      importedInd
      importStatus
      lastImportTimestamp
      lastImportLog
    }
  }
`;

const CREATE_LEGISLATION_SOURCE = gql`
  mutation CreateLegislationSource($input: CreateLegislationSourceInput!) {
    createLegislationSource(input: $input) {
      legislationSourceGuid
      shortDescription
      longDescription
      sourceUrl
      regulationsSourceUrl
      agencyCode
      activeInd
      importedInd
    }
  }
`;

const UPDATE_LEGISLATION_SOURCE = gql`
  mutation UpdateLegislationSource($input: UpdateLegislationSourceInput!) {
    updateLegislationSource(input: $input) {
      legislationSourceGuid
      shortDescription
      longDescription
      sourceUrl
      regulationsSourceUrl
      agencyCode
      activeInd
      importedInd
    }
  }
`;

const DELETE_LEGISLATION_SOURCE = gql`
  mutation DeleteLegislationSource($legislationSourceGuid: String!) {
    deleteLegislationSource(legislationSourceGuid: $legislationSourceGuid)
  }
`;

export const useLegislationSources = () => {
  const { data, isLoading, error, refetch } = useGraphQLQuery<{ legislationSources: LegislationSource[] }>(
    GET_LEGISLATION_SOURCES,
    {
      queryKey: ["legislationSources"],
    },
  );
  return { data: data?.legislationSources, isLoading, error, refetch };
};

export const useLegislationSource = (legislationSourceGuid: string | undefined) => {
  const { data, isLoading, error } = useGraphQLQuery<{ legislationSource: LegislationSource }>(GET_LEGISLATION_SOURCE, {
    queryKey: ["legislationSource", legislationSourceGuid],
    variables: { legislationSourceGuid },
    enabled: !!legislationSourceGuid,
  });
  return { data: data?.legislationSource, isLoading, error };
};

export const useCreateLegislationSource = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useGraphQLMutation<
    { createLegislationSource: LegislationSource },
    Error,
    { input: CreateLegislationSourceInput }
  >(CREATE_LEGISLATION_SOURCE, {
    invalidateQueries: ["legislationSources"],
    ...options,
  });
};

export const useUpdateLegislationSource = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useGraphQLMutation<
    { updateLegislationSource: LegislationSource },
    Error,
    { input: UpdateLegislationSourceInput }
  >(UPDATE_LEGISLATION_SOURCE, {
    invalidateQueries: ["legislationSources"],
    ...options,
  });
};

export const useDeleteLegislationSource = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useGraphQLMutation<{ deleteLegislationSource: boolean }, Error, { legislationSourceGuid: string }>(
    DELETE_LEGISLATION_SOURCE,
    {
      invalidateQueries: ["legislationSources"],
      ...options,
    },
  );
};
