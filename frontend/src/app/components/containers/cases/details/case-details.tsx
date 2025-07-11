import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CaseHeader } from "./case-header";

export type CaseParams = {
  id: string;
};

export const CaseDetails: FC = () => {
  const { id = "" } = useParams<CaseParams>();

  useEffect(() => {
    // Future: dispatch case data fetch
    console.log(`Loading case details for ID: ${id}`);
  }, [id]);

  return (
    <div className="comp-complaint-details">
      <CaseHeader caseId={id} />

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        <div className="comp-details-section-header">
          <h2>Case details</h2>
        </div>

        {/* Case Details (View) */}
        <div className="comp-details-view">
          <div className="comp-details-content">
            <h3>Case Information</h3>
            <p>Lorem ipsum!</p>
          </div>
        </div>
      </section>
    </div>
  );
};
