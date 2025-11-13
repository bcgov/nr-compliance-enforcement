import { Inspection } from "@/generated/graphql";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapObjectLocation } from "@/app/components/mapping/map-object-location";
import { CompLocationInfo } from "@/app/components/common/comp-location-info";
import { selectAgencyDropdown } from "@/app/store/reducers/code-table";
import { useAppSelector } from "@/app/hooks/hooks";
import { formatDate, formatTime, getAvatarInitials } from "@common/methods";
import Option from "@apptypes/app/option";
import { Button } from "react-bootstrap";
import { MapObjectType } from "@/app/types/maps/map-element";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";

interface InspectionSummaryProps {
  inspectionData?: Inspection;
  inspectionGuid: string;
  caseGuid: string;
  caseName?: string;
}

export const InspectionSummary: FC<InspectionSummaryProps> = ({
  inspectionData,
  inspectionGuid,
  caseGuid,
  caseName,
}) => {
  const navigate = useNavigate();

  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const agencyText = leadAgencyOptions.find((option: Option) => option.value === inspectionData?.leadAgency);
  const leadAgency = agencyText ? agencyText.label : "Unknown";

  const dateLogged = inspectionData?.openedTimestamp ? new Date(inspectionData.openedTimestamp).toString() : undefined;
  const lastUpdated = inspectionData?.openedTimestamp ? new Date(inspectionData.openedTimestamp).toString() : undefined;
  const officerAssigned = "Not Assigned";

  const createdByUser = useAppSelector(selectOfficerByAppUserGuid(inspectionData?.createdByAppUserGuid));
  const createdBy = createdByUser?.user_id || "Unknown";

  const editButtonClick = () => {
    navigate(`/inspection/${inspectionGuid}/edit`);
  };

  return (
    <>
      <div className="comp-header-status-container">
        <div className="comp-details-status">
          <dl>
            <dt>Lead agency</dt>
            <dd>
              <div className="comp-lead-agency">
                <i className="bi bi-building"></i>
                <span
                  id="comp-details-lead-agency-text-id"
                  className="comp-lead-agency-name"
                >
                  {leadAgency}
                </span>
              </div>
            </dd>
          </dl>
          <dl className="comp-details-date-logged">
            <dt>Date logged</dt>
            <dd className="comp-date-time-value">
              {dateLogged && (
                <>
                  <div id="case-date-logged">
                    <i className="bi bi-calendar"></i>
                    {formatDate(dateLogged)}
                  </div>
                  <div>
                    <i className="bi bi-clock"></i>
                    {formatTime(dateLogged)}
                  </div>
                </>
              )}
              {!dateLogged && <>N/A</>}
            </dd>
          </dl>

          <dl className="comp-details-date-assigned">
            <dt>Last updated</dt>
            <dd className="comp-date-time-value">
              {lastUpdated && (
                <>
                  <div>
                    <i className="bi bi-calendar"></i>
                    {formatDate(lastUpdated)}
                  </div>
                  <div>
                    <i className="bi bi-clock"></i>
                    {formatTime(lastUpdated)}
                  </div>
                </>
              )}
              {!lastUpdated && <>N/A</>}
            </dd>
          </dl>

          <dl>
            <dt>Officer assigned</dt>
            <dd>
              <div
                data-initials-sm={getAvatarInitials(officerAssigned)}
                className="comp-avatar comp-avatar-sm comp-avatar-orange"
              >
                <div>
                  <span id="comp-details-assigned-officer-name-text-id">{officerAssigned}</span>
                </div>
              </div>
            </dd>
          </dl>

          <dl>
            <dt>Created by</dt>
            <dd>
              <div
                data-initials-sm={getAvatarInitials(createdBy)}
                className="comp-avatar comp-avatar-sm comp-avatar-blue"
              >
                <span>{createdBy}</span>
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <hr className="mt-4 mb-4 border-2"></hr>
      <div className="comp-details-view">
        <div className="comp-details-content">
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
    </>
  );
};

export default InspectionSummary;
