import { useEffect, useMemo } from "react";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  setComplaint,
  getCaseFileComplaints,
  selectCaseFileComplaints,
  setCaseFileComplaints,
} from "@/app/store/reducers/complaints";
import { CaseFile, CaseActivity, Inspection, Investigation } from "@/generated/graphql";

const GET_CASE_FILE = gql`
  query GetCaseFile($caseIdentifier: String!) {
    caseFile(caseIdentifier: $caseIdentifier) {
      __typename
      caseIdentifier
      name
      openedTimestamp
      description
      createdByAppUserGuid
      caseStatus {
        caseStatusCode
        shortDescription
        longDescription
      }
      leadAgency {
        agencyCode
        shortDescription
        longDescription
      }
      activities {
        activityIdentifier
        activityType {
          caseActivityTypeCode
        }
      }
    }
  }
`;

const GET_INVESTIGATIONS = gql`
  query GetInvestigations($ids: [String]) {
    getInvestigations(ids: $ids) {
      __typename
      investigationGuid
      name
      description
      openedTimestamp
      primaryInvestigatorGuid
      fileCoordinatorGuid
      discoveryDate
      discoveryTime
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      parties {
        partyIdentifier
      }
      community
    }
  }
`;

const GET_INSPECTIONS = gql`
  query GetInspections($ids: [String]) {
    getInspections(ids: $ids) {
      __typename
      inspectionGuid
      name
      description
      openedTimestamp
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      parties {
        partyIdentifier
      }
    }
  }
`;

export interface UseCaseActivitiesResult {
  caseData?: CaseFile;
  linkedComplaints?: any[];
  investigations?: Investigation[];
  inspections?: Inspection[];
  isCaseFileLoading: boolean;
  isInvestigationsLoading: boolean;
  isInspectionsLoading: boolean;
  isLoading: boolean;
}

export const useCaseActivities = (caseGuid?: string): UseCaseActivitiesResult => {
  const dispatch = useAppDispatch();

  const { data, isLoading: isCaseFileLoading } = useGraphQLQuery<{ caseFile: CaseFile }>(GET_CASE_FILE, {
    queryKey: ["caseFile", caseGuid],
    variables: { caseIdentifier: caseGuid },
    enabled: !!caseGuid,
  });

  const caseData = data?.caseFile;

  const linkedComplaintIds = useMemo(
    () =>
      caseData?.activities
        ?.filter((activity: CaseActivity | null | undefined) => activity?.activityType?.caseActivityTypeCode === "COMP")
        .map((item: CaseActivity | null | undefined) => item?.activityIdentifier)
        .filter((id): id is string => !!id) ?? [],
    [caseData?.activities],
  );

  const linkedInvestigationIds = useMemo(
    () =>
      caseData?.activities
        ?.filter(
          (activity: CaseActivity | null | undefined) => activity?.activityType?.caseActivityTypeCode === "INVSTGTN",
        )
        .map((item: CaseActivity | null | undefined) => item?.activityIdentifier)
        .filter((id): id is string => !!id) ?? [],
    [caseData?.activities],
  );

  const linkedInspectionIds = useMemo(
    () =>
      caseData?.activities
        ?.filter(
          (activity: CaseActivity | null | undefined) => activity?.activityType?.caseActivityTypeCode === "INSPECTION",
        )
        .map((item: CaseActivity | null | undefined) => item?.activityIdentifier)
        .filter((id): id is string => !!id) ?? [],
    [caseData?.activities],
  );

  useEffect(() => {
    if (!caseData) {
      return;
    }

    if (linkedComplaintIds.length > 0) {
      dispatch(getCaseFileComplaints(linkedComplaintIds));
    } else {
      dispatch(setCaseFileComplaints([]));
    }
  }, [caseData, dispatch, linkedComplaintIds]);

  const linkedComplaints = useAppSelector(selectCaseFileComplaints) ?? undefined;

  const { data: investigationsData, isLoading: isInvestigationsLoading } = useGraphQLQuery<{
    getInvestigations: Investigation[];
  }>(GET_INVESTIGATIONS, {
    queryKey: ["getInvestigations", JSON.stringify(linkedInvestigationIds)],
    variables: { ids: linkedInvestigationIds || [] },
    enabled: !!caseData && !!linkedInvestigationIds && linkedInvestigationIds.length > 0,
  });

  const { data: inspectionsData, isLoading: isInspectionsLoading } = useGraphQLQuery<{ getInspections: Inspection[] }>(
    GET_INSPECTIONS,
    {
      queryKey: ["getInspections", JSON.stringify(linkedInspectionIds)],
      variables: { ids: linkedInspectionIds || [] },
      enabled: !!caseData && !!linkedInspectionIds && linkedInspectionIds.length > 0,
    },
  );

  useEffect(() => {
    return () => {
      dispatch(setComplaint(null));
      dispatch(setCaseFileComplaints([]));
    };
  }, [dispatch]);

  return {
    caseData,
    linkedComplaints,
    investigations: investigationsData?.getInvestigations,
    inspections: inspectionsData?.getInspections,
    isCaseFileLoading,
    isInvestigationsLoading,
    isInspectionsLoading,
    isLoading: isCaseFileLoading || isInvestigationsLoading || isInspectionsLoading,
  };
};
