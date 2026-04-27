import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CaseHeader } from "./case-header";
import { Button } from "react-bootstrap";
import { useCaseActivities } from "@/app/hooks/use-case-activities";
import {
  ComplaintColumn,
  InvestigationColumn,
  InspectionColumn,
  CaseRecordsTab,
  CaseHistoryTab,
  CaseMapTab,
} from "./components";

export type CaseParams = {
  id: string;
  tabKey?: string;
};

export const CaseView: FC = () => {
  const { id = "", tabKey } = useParams<CaseParams>();
  const navigate = useNavigate();

  const currentTab = tabKey || "summary";

  const {
    caseData,
    linkedComplaints,
    investigations,
    inspections,
    isCaseFileLoading,
    isInvestigationsLoading,
    isInspectionsLoading,
  } = useCaseActivities(id);

  const editButtonClick = () => {
    navigate(`/case/${id}/edit`);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "records":
        return <CaseRecordsTab />;
      case "history":
        return <CaseHistoryTab caseIdentifier={id} />;
      case "map":
        return <CaseMapTab />;
      default:
        return (
          <div className="container-fluid px-5 py-3">
            <div className="row mb-2">
              <div className="comp-details-section-header">
                <div>
                  <h5 className="fw-bold">Case description</h5>
                  <p>{caseData?.description}</p>
                </div>
                <div className="comp-details-section-header-actions align-self-center text-nowrap">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    id="details-screen-edit-button"
                    onClick={editButtonClick}
                  >
                    {" "}
                    <i className="bi bi-pencil" /> Edit case
                  </Button>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <ComplaintColumn
                complaints={linkedComplaints}
                caseName={caseData?.name ?? undefined}
                caseIdentifier={id}
              />
              <InspectionColumn
                inspections={inspections}
                isLoading={isInspectionsLoading}
              />
              <InvestigationColumn
                investigations={investigations}
                isLoading={isInvestigationsLoading}
                disableBorder={true}
              />
            </div>
          </div>
        );
    }
  };

  if (isCaseFileLoading) {
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
          {renderTabContent()}
        </div>
      )}
    </>
  );
};
