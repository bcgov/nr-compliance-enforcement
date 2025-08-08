import { FC, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CaseHeader } from "./case-header";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { CaseMomsSpaghettiFile } from "@/generated/graphql";
import { Badge, Button } from "react-bootstrap";
import { applyStatusClass, getSpeciesBySpeciesCode } from "@common/methods";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { getComplaintById, selectComplaint, setComplaint } from "@/app/store/reducers/complaints";
import { WildlifeComplaint } from "@/app/types/app/complaints/wildlife-complaint";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";

const GET_CASE_FILE = gql`
  query GetCaseMomsSpaghetttiFile($caseIdentifier: String!) {
    caseMomsSpaghettiFile(caseIdentifier: $caseIdentifier) {
      __typename
      caseIdentifier
      caseOpenedTimestamp
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
      caseActivities {
        __typename
        caseActivityIdentifier
        caseActivityType {
          caseActivityTypeCode
        }
      }
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

  const { data, isLoading } = useGraphQLQuery<{ caseMomsSpaghettiFile: CaseMomsSpaghettiFile }>(GET_CASE_FILE, {
    queryKey: ["caseMomsSpaghettiFile", id],
    variables: { caseIdentifier: id },
    enabled: !!id, // Only refresh query if id is provided
  });

  const complaintData = useAppSelector(selectComplaint) as WildlifeComplaint;
  const speciesCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.SPECIES));

  const caseData = data?.caseMomsSpaghettiFile;
  const linkedComplaintIds = caseData?.caseActivities
    ?.filter((activity) => activity?.caseActivityType?.caseActivityTypeCode === "COMP")
    .map((item) => {
      return item?.caseActivityIdentifier;
    });

  const [linkedComplaints, setLinkedComplaints] = useState<WildlifeComplaint[]>([]);

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
        dispatch(getComplaintById(id, "HWCR"));
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
      {!caseData && <div className="case-not-found">No data found for ID: {id}</div>}
      {caseData && (
        <div className="comp-complaint-details">
          <CaseHeader caseData={caseData} />
          <section
            className="comp-details-body comp-container"
            style={{ paddingBottom: "0" }}
          >
            <hr className="comp-details-body-spacer"></hr>

            <div className="comp-details-section-header">
              <h2>Case details</h2>
              <div className="comp-details-section-header-actions">
                <Button
                  variant="outline-primary"
                  size="sm"
                  id="details-screen-edit-button"
                  onClick={editButtonClick}
                >
                  <i className="bi bi-pencil"></i>
                  <span>Edit case</span>
                </Button>
              </div>
            </div>
          </section>
          <div className="row case-activities-container">
            <div className="d-flex flex-column flex-md-row p-2">
              <div className="col-lg-3  px-2">
                <div className="fw-bold py-2">Complaints</div>
                <div className="border-end px-2 case-activities-outer-cell">
                  {linkedComplaints && linkedComplaints?.length > 0
                    ? linkedComplaints
                        ?.sort((left, right) => left.id.localeCompare(right.id))
                        .map((complaint) => (
                          <div
                            className="col-sm-12 border p-2 my-2"
                            key={complaint?.id}
                          >
                            <div className="comp-details-badge-container case-activities-badge-container">
                              <Link to={`/complaint/HWCR/${complaint?.id}`}>{complaint?.id}</Link>
                              {getSpeciesBySpeciesCode(complaint?.species, speciesCodes)}
                              <Badge className={`badge ${applyStatusClass("Open")}`}>{complaint?.status}</Badge>
                            </div>
                          </div>
                        ))
                    : null}
                  <div className="col-sm-12 border p-2 my-2 case-activities-action-cell">
                    <i className="comp-sidenav-item-icon bi bi-plus-circle"></i>&nbsp;&nbsp;Add complaint
                  </div>
                  <div className="case-activities-footer-cell"></div>
                </div>
              </div>
              <div className="col-lg-3 p-2">
                <div className="fw-bold py-2">Investigations</div>
                <div className="border-end px-2">
                  <div className="case-activities-footer-cell"></div>
                  <div className="case-activities-footer-cell"></div>
                </div>
              </div>
              <div className="col-lg-3 p-2">
                <div className="fw-bold py-2">Inspections</div>
                <div className="border-end px-2">
                  <div className="case-activities-footer-cell"></div>
                  <div className="case-activities-footer-cell"></div>
                </div>
              </div>
              <div className="col-lg-3 p-2">
                <div className="fw-bold py-2">Records</div>
                <div className="border-end px-2">
                  <div className="case-activities-footer-cell"></div>
                  <div className="case-activities-footer-cell"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
