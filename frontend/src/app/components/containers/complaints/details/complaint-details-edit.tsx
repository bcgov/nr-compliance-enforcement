import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import {
  formatDate,
  formatTime,
  parseCoordinates,
} from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import {
  selectComplaintDeails,
  selectComplaintHeader,
} from "../../../../store/reducers/complaints";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  fetchCodeTablesAsync,
  selectComplaintStatusCodes,
  selectSpeciesCodes,
  selectedHwcrNatureOfComplaintCodes,
  selectedAreaCodes,
  selectedAttractantCodes,
} from "../../../../store/reducers/code-tables";
import { useSelector } from "react-redux";

interface ComplaintHeaderProps {
  complaintType: string;
}

export const ComplaintDetailsEdit: FC<ComplaintHeaderProps> = ({
  complaintType,
}) => {
  const {
    details,
    location,
    locationDescription,
    incidentDateTime,
    coordinates,
    area,
    region,
    zone,
    office,
    attractants,
    violationInProgress,
    violationObserved,
  } = useAppSelector(selectComplaintDeails(complaintType)) as ComplaintDetails;

  const {
    loggedDate,
    createdBy,
    lastUpdated,
    officerAssigned,
    status,
    natureOfComplaint,
    violationType,
    species,
  } = useAppSelector(selectComplaintHeader(complaintType));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCodeTablesAsync());
  }, [dispatch]);

  const renderCoordinates = (
    coordinates: number[] | string[] | undefined,
    coordinateType: Coordinates
  ): JSX.Element => {
    const result = parseCoordinates(coordinates, coordinateType);

    return result === 0 ? <>Not Provided</> : <>{result}</>;
  };

  const [selectedIncidentDateTime, setSelectedIncidentDateTime] =
    useState<Date | null>(null);

  // Parse the string to a Date object
  if (incidentDateTime) {
    const incidentDateTimeObject = new Date(
      incidentDateTime === undefined ? "" : incidentDateTime
    );
    //setSelectedIncidentDateTime(incidentDateTimeObject);
  }

  const complaintStatusCodes = useSelector(selectComplaintStatusCodes);
  const speciesCodes = useSelector(selectSpeciesCodes);
  const hwcrNatureOfComplaintCodes = useSelector(
    selectedHwcrNatureOfComplaintCodes
  );
  const areaCodes = useSelector(selectedAreaCodes);
  const attractantCodes = useSelector(selectedAttractantCodes);

  // Used to set selected dropdowns
  const selectedStatus = complaintStatusCodes.find(
    (option) => option.value === status
  );
  const selectedSpecies = speciesCodes.find(
    (option) => option.label === species
  );
  const selectedNatureOfComplaint = hwcrNatureOfComplaintCodes.find(
    (option) => option.label === natureOfComplaint
  );
  const selectedAreaCode = areaCodes.find((option) => option.label === area);

  const selectedAttractants = attractantCodes.filter((attractantCode) => attractants?.some((attractant) => attractant.description === attractantCode.label));

  const handleIncidentDateTimeChange = (date: Date | null) => {
    //setSelectedIncidentDateTime(date);
  };

  return (
    <div>
      { /* edit header block */ }
      <div className="comp-complaint-header-edit-block">
        <div className="comp-details-edit-row">
          <div className="comp-details-edit-label">
            <label id="nature_of_complaint_select_label_id">
              Nature of Complaint
            </label>
          </div>
          <div className="comp-details-edit-input">
            <Select
              options={hwcrNatureOfComplaintCodes}
              value={selectedNatureOfComplaint}
              placeholder="Select"
            />
          </div>
          <div className="comp-details-edit-label">
            <label>Date / Time Logged</label>
          </div>
          <div className="comp-details-content">
            <i className="bi bi-calendar comp-margin-right-xxs"></i>
            {formatDate(loggedDate)}
            <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
            {formatTime(loggedDate)}
          </div>
        </div>
        <div className="comp-details-edit-row">
          <div className="comp-details-edit-label">
            <label id="nature_of_complaint_select_label_id">Species</label>
          </div>
          <div className="comp-details-edit-input">
            <Select
              options={speciesCodes}
              value={selectedSpecies}
              placeholder="Select"
            />
          </div>
          <div className="comp-details-edit-label">
            <label>Last Updated</label>
          </div>
          <div className="comp-details-content">
            <i className="bi bi-calendar comp-margin-right-xxs"></i>
            {formatDate(lastUpdated)}
            <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
            {formatTime(lastUpdated)}
          </div>
        </div>
        <div className="comp-details-edit-row">
          <div className="comp-details-edit-label">
            <label id="nature_of_complaint_select_label_id">Status</label>
          </div>
          <div className="comp-details-edit-input">
            <Select
              options={complaintStatusCodes}
              value={selectedStatus}
              placeholder="Select"
            />
          </div>
          <div className="comp-details-edit-label">
            <label>Created By</label>
          </div>
          <div className="comp-details-edit-input">
            <div className="comp-padding-left-xs comp-padding-top-xs">
              {createdBy}
            </div>
          </div>
        </div>
        <div className="comp-details-edit-row">
          <div className="comp-details-edit-label">
            <label id="nature_of_complaint_select_label_id">
              Officer Assigned
            </label>
          </div>
          <div className="comp-details-edit-input">
            <Select options={hwcrNatureOfComplaintCodes} placeholder="Select" />
          </div>
        </div>
      </div>

      { /* edit details block */ }
      <div className="comp-complaint-details-block">
        <h6>Call Details</h6>
        <div className="comp-complaint-call-details">
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label">
              <label
                id="complaint_description_edit_label_id"
                className="col-auto"
              >
                Complaint Description
              </label>
            </div>
            <div className="comp-details-edit-input">
              <textarea
                className="form-control"
                id="complaint_description_textarea_id"
                value={details}
                rows={4}
              />
            </div>
            <div className="comp-details-edit-label">
              <label>Complaint Location</label>
            </div>
            <div className="comp-details-edit-input">
              <input
                type="text"
                id="complaint_description_edit_label_id"
                className="form-control"
                value={location}
              />
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label" />
            <div className="comp-details-edit-input" />
            <div className="comp-details-edit-label">
              <label>Location Description</label>
            </div>
            <div className="comp-details-edit-input">
              <textarea
                className="form-control"
                id="complaint_location_description_textarea_id"
                value={locationDescription}
                rows={4}
              />
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label">
              <label>Incident Time</label>
            </div>
            <div className="comp-details-edit-input">
              <DatePicker
                className="form-control"
                showIcon={true}
                showTimeSelect
                onChange={handleIncidentDateTimeChange}
                selected={selectedIncidentDateTime}
              />
            </div>
            <div className="comp-details-edit-label" />
            <div className="comp-details-edit-input" />
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label">
              <label>Attractants</label>
            </div>
            <div className="comp-details-edit-input">
              <Select options={attractantCodes} value={selectedAttractants} placeholder="Select" />
            </div>
            <div className="comp-details-edit-label">
              <label>X Coordinate</label>
            </div>
            <div className="comp-details-edit-input">
              <input
                type="text"
                id="comp-details-edit-x-coordinate-input"
                className="form-control"
              />
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label" />
            <div className="comp-details-edit-input" />
            <div className="comp-details-edit-label">
              <label>Y Coordinate</label>
            </div>
            <div className="comp-details-edit-input">
              <input
                type="text"
                id="comp-details-edit-x-coordinate-input"
                className="form-control"
              />
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label" />
            <div className="comp-details-edit-input" />
            <div className="comp-details-edit-label">
              <label>Area/Community</label>
            </div>
            <div className="comp-details-edit-input">
              <Select options={areaCodes} value={selectedAreaCode} />
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label" />
            <div className="comp-details-edit-input" />
            <div className="comp-details-edit-label">
              <label>Office</label>
            </div>
            <div className="comp-details-edit-input">
              <input
                type="text"
                id="office-edit-readonly-id"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label" />
            <div className="comp-details-edit-input" />
            <div className="comp-details-edit-label">
              <label>Zone</label>
            </div>
            <div className="comp-details-edit-input">
              <input
                type="text"
                id="zone-edit-readonly-id"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label" />
            <div className="comp-details-edit-input" />
            <div className="comp-details-edit-label">
              <label>Region</label>
            </div>
            <div className="comp-details-edit-input">
              <input
                type="text"
                id="region-edit-readonly-id"
                className="form-control"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      { /* edit caller info block */ }
      <div className="comp-complaint-details-block">
        <h6>Caller Information</h6>
        <div className="comp-complaint-call-information">
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label">
              <label
                id="complaint-caller-info-name-label-id"
                className="col-auto"
              >
                Name
              </label>
            </div>
            <div className="comp-details-edit-input">
              <input type="text" className="form-control" />
            </div>
            <div className="comp-details-edit-label">
              <label>Address</label>
            </div>
            <div className="comp-details-edit-input">
              <input type="text" className="form-control" />  
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label">
              <label
                id="complaint-caller-info-primary-phone-label-id"
                className="col-auto"
              >
                Primary Phone
              </label>
            </div>
            <div className="comp-details-edit-input">
              <input type="text" className="form-control" />
            </div>
            <div className="comp-details-edit-label">
              <label>Email</label>
            </div>
            <div className="comp-details-edit-input">
              <input type="text" className="form-control" />  
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label">
              <label
                id="complaint-caller-info-alternate1-phone-label-id"
                className="col-auto"
              >
                Alternate 1 Phone
              </label>
            </div>
            <div className="comp-details-edit-input">
              <input type="text" className="form-control" />
            </div>
            <div className="comp-details-edit-label">
              <label>Reffered by / Complaint Agency</label>
            </div>
            <div className="comp-details-edit-input">
              <input type="text" className="form-control" />  
            </div>
          </div>
          <div className="comp-details-edit-row">
            <div className="comp-details-edit-label">
              <label
                id="complaint-caller-info-alternate2-phone-label-id"
                className="col-auto"
              >
                Alternate 2 Phone
              </label>
            </div>
            <div className="comp-details-edit-input">
              <input type="text" className="form-control" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
