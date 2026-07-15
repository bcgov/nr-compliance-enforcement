import { FC, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectorComplaint } from "@/app/types/app/complaints/sector-complaint";
import { CaseHeader } from "./case-header";
import { useCaseActivities } from "@/app/hooks/use-case-activities";
import {
  ComplaintColumn,
  InvestigationColumn,
  InspectionColumn,
  CaseRecordsTab,
  CaseHistoryTab,
  CaseMapTab,
} from "./components";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";

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

  const lastUpdatedDisplay = useMemo(() => {
    if (!caseData) return undefined;
    const times: number[] = [];
    const pushTime = (value: string | Date | undefined) => {
      if (value == null) return;
      const ms = new Date(value).getTime();
      if (!Number.isNaN(ms)) times.push(ms);
    };

    pushTime(caseData.updatedTimestamp);
    for (const c of linkedComplaints ?? []) {
      pushTime((c as SectorComplaint & { updatedOn: string | Date }).updatedOn);
    }
    for (const inv of investigations ?? []) {
      pushTime(inv.updatedTimestamp);
    }
    for (const ins of inspections ?? []) {
      pushTime(ins.updatedTimestamp);
    }

    if (times.length === 0) return undefined;
    return new Date(Math.max(...times)).toString();
  }, [caseData, linkedComplaints, investigations, inspections]);

  const renderTabContent = () => {
    if (currentTab === "history") {
      return <CaseHistoryTab caseIdentifier={id} />;
    }
    if (currentTab === "records") {
      return <CaseRecordsTab />;
    }
    if (currentTab === "map") {
      return <CaseMapTab />;
    }

    return (
      <div className="container-fluid px-5 py-3">
        <div className="row mb-2">
          <div className="comp-details-section-header">
            <FeatureFlag feature={FEATURE_TYPES.LEGACY_CASE_VIEW}>
              <div>
                <h5 className="fw-bold">Case description</h5>
                <p>{caseData?.description}</p>
              </div>
            </FeatureFlag>
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
          <CaseHeader
            caseData={caseData}
            lastUpdatedDisplay={lastUpdatedDisplay}
          />
          {renderTabContent()}
        </div>
      )}
    </>
  );
};
