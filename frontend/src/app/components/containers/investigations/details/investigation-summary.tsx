import { Investigation } from "@/generated/graphql";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapObjectLocation } from "@/app/components/mapping/map-object-location";
import { CompLocationInfo } from "@/app/components/common/comp-location-info";
import { useAppSelector } from "@/app/hooks/hooks";
import { formatDate, formatTime, getAvatarInitials } from "@common/methods";
import { Button, Card } from "react-bootstrap";
import { MapObjectType } from "@/app/types/maps/map-element";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";
import { DiaryDates } from "./investigation-diary-dates";

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
  const navigate = useNavigate();

  const discoveryDate = investigationData?.discoveryDate
    ? new Date(investigationData.discoveryDate).toString()
    : undefined;
  const dateLogged = investigationData?.openedTimestamp
    ? new Date(investigationData.openedTimestamp).toString()
    : undefined;
  const lastUpdated = investigationData?.openedTimestamp
    ? new Date(investigationData.openedTimestamp).toString()
    : undefined;

  const primaryInvestigatorObj = useAppSelector(selectOfficerByAppUserGuid(investigationData?.primaryInvestigatorGuid));
  const primaryInvestigator = primaryInvestigatorObj
    ? `${primaryInvestigatorObj?.last_name}, ${primaryInvestigatorObj?.first_name}`
    : "Not Assigned";

  const fileCoordinatorObj = useAppSelector(selectOfficerByAppUserGuid(investigationData?.fileCoordinatorGuid));
  const fileCoordinator = fileCoordinatorObj
    ? `${fileCoordinatorObj?.last_name}, ${fileCoordinatorObj?.first_name}`
    : "Not Assigned";

  const supervisorObj = useAppSelector(selectOfficerByAppUserGuid(investigationData?.supervisorGuid));
  const supervisor = supervisorObj ? `${supervisorObj?.last_name}, ${supervisorObj?.first_name}` : "Not Assigned";

  const editButtonClick = () => {
    navigate(`/investigation/${investigationGuid}/edit`);
  };

  return (
    <>
      <div className="comp-header-status-container">
        <div className="comp-details-status investigation-header">
          <dl className="comp-details-date-assigned">
            <dt>Discovery date</dt>
            <dd className="comp-date-time-value">
              {discoveryDate && (
                <>
                  <div>
                    <i className="bi bi-calendar"></i>
                    {formatDate(discoveryDate)}
                  </div>
                  <div>
                    <i className="bi bi-clock"></i>
                    {formatTime(discoveryDate)}
                  </div>
                </>
              )}
              {!discoveryDate && <>N/A</>}
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
            <dt>Primary investigator</dt>
            <dd>
              <div
                data-initials-sm={getAvatarInitials(primaryInvestigator)}
                className="comp-avatar comp-avatar-sm comp-avatar-orange"
              >
                <div>
                  <span id="comp-details-assigned-officer-name-text-id">{primaryInvestigator}</span>
                </div>
              </div>
            </dd>
          </dl>

          <dl>
            <dt>Supervisor</dt>
            <dd>
              <div
                data-initials-sm={getAvatarInitials(supervisor)}
                className="comp-avatar comp-avatar-sm comp-avatar-orange"
              >
                <span>{supervisor}</span>
              </div>
            </dd>
          </dl>

          <dl>
            <dt>File coordinator</dt>
            <dd>
              <div
                data-initials-sm={getAvatarInitials(fileCoordinator)}
                className="comp-avatar comp-avatar-sm comp-avatar-orange"
              >
                <div>
                  <span id="comp-details-assigned-officer-name-text-id">{fileCoordinator}</span>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <hr className="mt-4 mb-4 border-2"></hr>
      <div className="comp-details-view">
        <div className="comp-details-content">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">Investigation summary</h3>
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
          {!investigationData && <p>No data found for ID: {investigationGuid}</p>}
          {investigationData && (
            <section className="comp-details-section">
              <Card
                className="mb-3"
                border="default"
              >
                <Card.Body>
                  <dl>
                    <div>
                      <dt>Investigation ID</dt>
                      <dd>
                        <pre id="investigation-summary-id">{investigationData.name}</pre>
                      </dd>
                    </div>
                    <div>
                      <dt>Case ID</dt>
                      <dd>
                        <pre id="investigation-summary-case-id">
                          {caseGuid ? <Link to={`/case/${caseGuid}`}>{caseName || caseGuid}</Link> : "N/A"}
                        </pre>
                      </dd>
                    </div>
                    {investigationData.description && (
                      <div>
                        <dt>Investigation description</dt>
                        <dd>
                          <pre id="investigation-summary-description">{investigationData.description}</pre>
                        </dd>
                      </div>
                    )}
                    {investigationData.locationAddress && (
                      <div>
                        <dt>Location/address</dt>
                        <dd>
                          <pre id="investigation-summary-location">{investigationData.locationAddress}</pre>
                        </dd>
                      </div>
                    )}
                    {investigationData.locationDescription && (
                      <div>
                        <dt>Location description</dt>
                        <dd>
                          <pre id="investigation-summary-description">{investigationData.locationDescription}</pre>
                        </dd>
                      </div>
                    )}
                    {investigationData.locationGeometry && (
                      <CompLocationInfo
                        xCoordinate={
                          investigationData.locationGeometry.coordinates?.[0] === 0
                            ? ""
                            : (investigationData.locationGeometry.coordinates?.[0].toString() ?? "")
                        }
                        yCoordinate={
                          investigationData.locationGeometry.coordinates?.[1] === 0
                            ? ""
                            : (investigationData.locationGeometry.coordinates?.[1].toString() ?? "")
                        }
                      />
                    )}
                  </dl>
                </Card.Body>
              </Card>
            </section>
          )}

          <DiaryDates investigationGuid={investigationGuid} />
          <br />
          {investigationData?.locationGeometry?.coordinates && (
            <MapObjectLocation
              map_object_type={MapObjectType.Investigation}
              locationCoordinates={{
                lat: investigationData.locationGeometry.coordinates[1],
                lng: investigationData.locationGeometry.coordinates[0],
              }}
              draggable={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default InvestigationSummary;
