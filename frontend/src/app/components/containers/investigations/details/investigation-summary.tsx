import { Investigation } from "@/generated/graphql";
import { FC } from "react";
import { Link } from "react-router-dom";

interface InvestigationSummaryProps {
  investigationData?: Investigation;
  investigationGuid: string;
  caseGuid: string;
  caseName?: string;
}

export const InvestigationSummary: FC<InvestigationSummaryProps> = ({
  investigationData,
  investigationGuid,
  caseGuid,
  caseName,
}) => {
  return (
    <div className="comp-details-view">
      <div className="comp-details-content">
        <h3>Investigation Details</h3>
        {!investigationData && <p>No data found for ID: {investigationGuid}</p>}
        {investigationData && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Investigation Identifier:</strong>
                  <p>{investigationData.investigationGuid || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Case ID:</strong>
                  {caseGuid ? (
                    <p>
                      <Link to={`/case/${caseGuid}`}>{caseName || caseGuid}</Link>
                    </p>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </div>
            </div>
            {investigationData.description && (
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <strong>Description:</strong>
                    <p>{investigationData.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigationSummary;
