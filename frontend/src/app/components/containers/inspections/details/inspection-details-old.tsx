import { FC } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { CaseFile, Inspection } from "@/generated/graphql";
import { InspectionHeader } from "@/app/components/containers/inspections/details/inspection-header";
import Button from "react-bootstrap/esm/Button";
import { CompLocationInfo } from "@/app/components/common/comp-location-info";
import { MapObjectLocation } from "@/app/components/mapping/map-object-location";
import { MapObjectType } from "@/app/types/maps/map-element";

const GET_INSPECTION = gql`
  query GetInspection($inspectionGuid: String!) {
    getInspection(inspectionGuid: $inspectionGuid) {
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
      locationAddress
      locationDescription
      locationGeometry
    }
    caseFilesByActivityIds(activityIdentifiers: [$inspectionGuid]) {
      caseIdentifier
      name
    }
  }
`;

export type InspectionParams = {
  inspectionGuid: string;
};

export const InspectionDetails: FC = () => {
  const navigate = useNavigate();
  const { inspectionGuid = "" } = useParams<InspectionParams>();
  const { data, isLoading } = useGraphQLQuery<{
    getInspection: Inspection;
    caseFilesByActivityIds: CaseFile[];
  }>(GET_INSPECTION, {
    queryKey: ["getInspection", inspectionGuid],
    variables: { inspectionGuid: inspectionGuid },
    enabled: !!inspectionGuid, // Only refresh query if id is provided
  });

  const inspectionData = data?.getInspection;
  const caseIdentifier = data?.caseFilesByActivityIds?.[0]?.caseIdentifier;
  const caseName = data?.caseFilesByActivityIds?.[0]?.name;

  const editButtonClick = () => {
    navigate(`/inspection/${inspectionGuid}/edit`);
  };

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <InspectionHeader />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading inspection details...</p>
          </div>
        </section>
      </div>
    );
  }
  return (
    <div className="comp-complaint-details">
      <InspectionHeader inspection={inspectionData} />

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        <div className="d-flex align-items-center gap-4 mb-3">
          <h3 className="mb-0">Inspection details</h3>
          <Button
            variant="outline-primary"
            size="sm"
            id="details-screen-edit-button"
            onClick={editButtonClick}
          >
            <i className="bi bi-pencil"></i>
            <span>Edit</span>
          </Button>
        </div>

        {/* Inspection Details (View) */}
        <div className="comp-details-view">
          <div className="comp-details-content">
            <h3>Inspection Information</h3>
            {!inspectionData && <p>No data found for ID: {inspectionGuid}</p>}
            {inspectionData && (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Inspection ID</strong>
                      <p>{inspectionData.name}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Case ID</strong>
                      <p>
                        {caseIdentifier ? (
                          <Link to={`/case/${caseIdentifier}`}>{caseName || caseIdentifier}</Link>
                        ) : (
                          <p>N/A</p>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {inspectionData.description && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <strong>Description</strong>
                        <p>{inspectionData.description}</p>
                      </div>
                    </div>
                  </div>
                )}
                {inspectionData.locationAddress && (
                  <div>
                    <dt>Location/address</dt>
                    <dd id="comp-details-location">{inspectionData.locationAddress}</dd>
                  </div>
                )}
                {inspectionData.locationDescription && (
                  <div>
                    <dt>Location description</dt>
                    <dd id="comp-details-location-description">{inspectionData.locationDescription}</dd>
                  </div>
                )}
                {inspectionData.locationGeometry && (
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <CompLocationInfo
                          xCoordinate={
                            inspectionData.locationGeometry.coordinates?.[0] === 0
                              ? ""
                              : (inspectionData.locationGeometry.coordinates?.[0].toString() ?? "")
                          }
                          yCoordinate={
                            inspectionData.locationGeometry.coordinates?.[1] === 0
                              ? ""
                              : (inspectionData.locationGeometry.coordinates?.[1].toString() ?? "")
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
                {inspectionData?.locationGeometry?.coordinates && (
                  <MapObjectLocation
                    map_object_type={MapObjectType.Inspection}
                    locationCoordinates={{
                      lat: inspectionData.locationGeometry.coordinates[1],
                      lng: inspectionData.locationGeometry.coordinates[0],
                    }}
                    draggable={false}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
