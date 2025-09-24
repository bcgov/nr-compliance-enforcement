import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CaseHeader } from "./case-header";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { CaseFile, Inspection, Investigation } from "@/generated/graphql";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { getComplaintById, selectComplaint, setComplaint } from "@/app/store/reducers/complaints";
import { Complaint } from "@/app/types/app/complaints/complaint";
import { ComplaintColumn, InvestigationColumn, InspectionColumn, RecordColumn } from "./components";

const GET_CASE_FILE = gql`
  query GetCaseFile($caseIdentifier: String!) {
    caseFile(caseIdentifier: $caseIdentifier) {
      __typename
      caseIdentifier
      openedTimestamp
      description
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
      description
      openedTimestamp
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      leadAgency
    }
  }
`;

const GET_INSPECTIONS = gql`
  query GetInspections($ids: [String]) {
    getInspections(ids: $ids) {
      __typename
      inspectionGuid
      description
      openedTimestamp
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
    }
  }
`;

export type CaseParams = {
  id: string;
};

export const CaseView: FC = () => {
  const dispatch = useAppDispatch();
  const { id = "" } = useParams<CaseParams>();
  const navigate = useNavigate();

  const { data, isLoading } = useGraphQLQuery<{ caseFile: CaseFile }>(GET_CASE_FILE, {
    queryKey: ["caseFile", id],
    variables: { caseIdentifier: id },
    enabled: !!id,
  });

  const complaintData = useAppSelector(selectComplaint) as Complaint;

  const caseData = data?.caseFile;

  const linkedComplaintIds = caseData?.activities
    ?.filter((activity) => activity?.activityType?.caseActivityTypeCode === "COMP")
    .map((item) => {
      return item?.activityIdentifier;
    });

  const linkedInvestigationIds = caseData?.activities
    ?.filter((activity) => activity?.activityType?.caseActivityTypeCode === "INVSTGTN")
    .map((item) => {
      return item?.activityIdentifier;
    });

  const linkedInspectionIds = caseData?.activities
    ?.filter((activity) => activity?.activityType?.caseActivityTypeCode === "INSPECTION")
    .map((item) => {
      return item?.activityIdentifier;
    });

  const [linkedComplaints, setLinkedComplaints] = useState<Complaint[]>([]);

  const { data: investigationsData, isLoading: investigationsLoading } = useGraphQLQuery<{
    getInvestigations: Investigation[];
  }>(GET_INVESTIGATIONS, {
    queryKey: ["getInvestigations", JSON.stringify(linkedInvestigationIds)],
    variables: { ids: linkedInvestigationIds || [] },
    enabled: !!caseData && !!linkedInvestigationIds && linkedInvestigationIds.length > 0,
  });

  const { data: inspectionsData, isLoading: inspectionsLoading } = useGraphQLQuery<{
    getInspections: Inspection[];
  }>(GET_INSPECTIONS, {
    queryKey: ["getInspections", JSON.stringify(linkedInspectionIds)],
    variables: { ids: linkedInspectionIds || [] },
    enabled: !!caseData && !!linkedInspectionIds && linkedInspectionIds.length > 0,
  });

  useEffect(() => {
    if (complaintData != null) {
      setLinkedComplaints((prev) =>
        prev.some((item) => item.id === complaintData.id) ? prev : [...prev, complaintData],
      );
    }
  }, [complaintData?.id]);

  useEffect(() => {
    return () => {
      dispatch(setComplaint(null));
      setLinkedComplaints([]);
    };
  }, [dispatch]);

  useEffect(() => {
    linkedComplaintIds?.map((id) => {
      if (id) {
        dispatch(getComplaintById(id, "SECTOR"));
      }
    });
  }, [caseData, dispatch]);

  const editButtonClick = () => {
    navigate(`/case/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <CaseHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading case details...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      {!caseData && <div className="m-auto">No data found for case: {id}</div>}
      {caseData && (
        <div className="comp-complaint-details">
          <CaseHeader caseData={caseData} />

          <div className="container-fluid px-4 py-3">
            <div className="row g-3">
              <ComplaintColumn complaints={linkedComplaints} />
              <InvestigationColumn
                investigations={investigationsData?.getInvestigations}
                isLoading={investigationsLoading && linkedInvestigationIds && linkedInvestigationIds.length > 0}
              />
              <InspectionColumn
                inspections={inspectionsData?.getInspections}
                isLoading={inspectionsLoading && linkedInspectionIds && linkedInspectionIds.length > 0}
              />
              <RecordColumn />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
