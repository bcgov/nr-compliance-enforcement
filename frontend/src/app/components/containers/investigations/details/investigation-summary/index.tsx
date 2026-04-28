import { Investigation } from "@/generated/graphql";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { MapObjectLocation } from "@/app/components/mapping/map-object-location";
import { useAppSelector } from "@/app/hooks/hooks";
import { parseUTCDateTimeToLocal, formatDate, formatTime, getAvatarInitials } from "@common/methods";
import Option from "@apptypes/app/option";
import { Button } from "react-bootstrap";
import { MapObjectType } from "@/app/types/maps/map-element";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";
import DiaryDates from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { InvestigationItem } from "@/app/components/containers/investigations/details/investigation-summary/investigation-item";
import CaseActivities from "@/app/components/containers/investigations/details/investigation-summary/case-activities";
import { selectAgencyDropdown } from "@/app/store/reducers/code-table";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface InvestigationSummaryProps {
  investigationData?: Investigation;
  investigationGuid: string;
  caseGuid: string;
  caseName?: string;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const InvestigationSummary: FC<InvestigationSummaryProps> = ({
  investigationData,
  investigationGuid,
  caseGuid,
  caseName,
  onDirtyChange,
}) => {
  const navigate = useNavigate();
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const agencyText = leadAgencyOptions.find((option: Option) => option.value === investigationData?.leadAgency);
  const leadAgency = agencyText ? agencyText.label : "Unknown";

  const discoveryDate = investigationData?.discoveryDate
    ? parseUTCDateTimeToLocal(investigationData.discoveryDate, investigationData.discoveryTime)?.toString()
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

  const { handleChildDirtyChange } = useFormDirtyState(onDirtyChange);

  const editButtonClick = () => {
    navigate(`/investigation/${investigationGuid}/edit`);
  };

  return (
    <>
      <div className="comp-header-status-container">
        <div className="comp-details-status investigation-header">
          <dl>
            <dt id="comp-details-lead-agency-label-id">Lead Agency</dt>
            <dd>
              <div className="comp-lead-agency">
                <i className="bi bi-buildings"></i>
                <span
                  id="comp-details-lead-agency-text-id"
                  className="comp-lead-agency-name"
                >
                  {leadAgency}
                </span>
              </div>
            </dd>
          </dl>
          <dl className="comp-details-date-assigned">
            <dt>Discovery date</dt>
            <dd className="comp-date-time-value flex-column">
              {discoveryDate && (
                <>
                  <div>
                    <i className="bi bi-calendar"></i>
                    {formatDate(discoveryDate)}
                  </div>
                  {investigationData?.discoveryTime && (
                    <div>
                      <i className="bi bi-clock"></i>
                      {formatTime(discoveryDate)}
                    </div>
                  )}
                </>
              )}
              {!discoveryDate && <>N/A</>}
            </dd>
          </dl>

          <dl className="comp-details-date-assigned">
            <dt>Last updated</dt>
            <dd className="comp-date-time-value flex-column">
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
          {caseGuid && (
            <CaseActivities
              caseGuid={caseGuid}
              caseName={caseName}
            />
          )}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">Investigation summary</h2>
            <Button
              variant="outline-primary"
              size="sm"
              id="details-screen-edit-button"
              onClick={editButtonClick}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit Investigation</span>
            </Button>
          </div>

          {!investigationData && <p>No data found for ID: {investigationGuid}</p>}

          {investigationData && (
            <InvestigationItem
              investigationData={investigationData}
              caseGuid={caseGuid}
              caseName={caseName ?? ""}
            ></InvestigationItem>
          )}

          <DiaryDates
            investigationGuid={investigationGuid}
            investigationData={investigationData}
            onDirtyChange={(_, isDirty) => handleChildDirtyChange(1, isDirty)}
          />
          <br />
          <MapObjectLocation
            map_object_type={MapObjectType.Investigation}
            locationCoordinates={
              investigationData?.locationGeometry?.coordinates
                ? {
                    lat: investigationData.locationGeometry.coordinates[1],
                    lng: investigationData.locationGeometry.coordinates[0],
                  }
                : undefined
            }
            draggable={false}
            defaultCenter={{ lat: 55, lng: -125 }}
            defaultZoom={investigationData?.locationGeometry?.coordinates ? 12 : 5}
          />
        </div>
      </div>
    </>
  );
};

export default InvestigationSummary;
