import { Investigation } from "@/generated/graphql";
import { FC } from "react";
import { Link } from "react-router-dom";
import { InvestigationLocation } from "./investigation-location";
import { CompLocationInfo } from "@/app/components/common/comp-location-info";

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
        <h3>Investigation details</h3>
        {!investigationData && <p>No data found for ID: {investigationGuid}</p>}
        {investigationData && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Investigation ID:</strong>
                  <p>{investigationData.name}</p>
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
            {investigationData.locationAddress && (<div>
              <dt>Location/address</dt>
                <dd id="comp-details-location">{investigationData.locationAddress}</dd>
              </div>
            )}
            {investigationData.locationDescription && (<div>
              <dt>Location description</dt>
                <dd id="comp-details-location-description">{investigationData.locationDescription}</dd>
              </div>
            )}
            {investigationData.locationGeometry && (
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <CompLocationInfo
                      xCoordinate={investigationData.locationGeometry.coordinates?.[0] === 0 ? "" : investigationData.locationGeometry.coordinates?.[0].toString() ?? ""}
                      yCoordinate={investigationData.locationGeometry.coordinates?.[1] === 0 ? "" : investigationData.locationGeometry.coordinates?.[1].toString() ?? ""}
                    />
                  </div>
                </div>
              </div>
            )}
          {investigationData?.locationGeometry?.coordinates && (
              <InvestigationLocation
                locationCoordinates={{
                  lat: investigationData.locationGeometry.coordinates[1],
                  lng: investigationData.locationGeometry.coordinates[0],
                }}
                draggable={false}
              />
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigationSummary;
