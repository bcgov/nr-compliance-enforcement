import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import {
  formatDate,
  formatTime,
  renderCoordinates,
} from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import {
  selectComplaintDeails,
  selectComplaintHeader,
  selectComplaintCallerInformation,
  selectComplaintSuspectWitnessDetails,
} from "../../../../store/reducers/complaints";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  selectComplaintStatusCodes,
  selectSpeciesCodes,
  selectedHwcrNatureOfComplaintCodes,
  selectedAreaCodes,
  selectedAttractantCodes,
  selectAgencyCodes,
  selectViolationCodes,
} from "../../../../store/reducers/code-tables";
import { useSelector } from "react-redux";
import {
  getOfficersInZone,
  officersInZone,
} from "../../../../store/reducers/officer";
import { Person } from "../../../../types/person/person";
import ReactDOMServer from "react-dom/server";
import { DropdownOption } from "../../../../types/code-tables/option";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { ComplaintSuspectWitness } from "../../../../types/complaints/details/complaint-suspect-witness-details";

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
    zone_code,
    office,
    attractants,
    violationInProgress,
    violationObserved,
  } = useAppSelector(selectComplaintDeails(complaintType)) as ComplaintDetails;

  const {
    loggedDate,
    createdBy,
    lastUpdated,
    personGuid,
    status,
    natureOfComplaintCode,
    speciesCode,
    violationType,
  } = useAppSelector(selectComplaintHeader(complaintType));

  const {
    name,
    primaryPhone,
    secondaryPhone,
    alternatePhone,
    address,
    email,
    referredByAgencyCode,
  } = useAppSelector(selectComplaintCallerInformation);

  const { details: complaint_witness_details } = useAppSelector(
    selectComplaintSuspectWitnessDetails
  ) as ComplaintSuspectWitness;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOfficersInZone(zone_code));
  }, [dispatch, zone_code]);

  const officersInZoneList = useAppSelector(officersInZone);

  // Transform the fetched data into the DropdownOption type
  const transformedOfficerCodeList = officersInZoneList.map(
    (officer: Person) => ({
      value: officer.person_guid,
      label: `${officer.first_name} ${officer.last_name}`,
    })
  );

  const xCoordinate = ReactDOMServer.renderToString(
    renderCoordinates(coordinates, Coordinates.Latitude)
  );
  const yCoordinate = ReactDOMServer.renderToString(
    renderCoordinates(coordinates, Coordinates.Longitude)
  );

  // Parse the string to a Date object
  const incidentDateTimeObject = new Date(
    incidentDateTime ?? ""
  );

  const [selectedIncidentDateTime, setSelectedIncidentDateTime] = useState(
    incidentDateTimeObject
  );

  // Get the code table lists to populate the Selects
  const complaintStatusCodes = useSelector(
    selectComplaintStatusCodes
  ) as DropdownOption[];
  const speciesCodes = useSelector(selectSpeciesCodes) as DropdownOption[];
  const hwcrNatureOfComplaintCodes = useSelector(
    selectedHwcrNatureOfComplaintCodes
  ) as DropdownOption[];
  const areaCodes = useSelector(selectedAreaCodes) as DropdownOption[];
  const attractantCodes = useSelector(
    selectedAttractantCodes
  ) as DropdownOption[];
  const referredByAgencyCodes = useSelector(
    selectAgencyCodes
  ) as DropdownOption[];
  const violationTypeCodes = useSelector(
    selectViolationCodes
  ) as DropdownOption[];
  const yesNoOptions: DropdownOption[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // Used to set selected values in the dropdowns
  const selectedStatus = complaintStatusCodes.find(
    (option) => option.value === status
  );
  const selectedSpecies = speciesCodes.find(
    (option) => option.value === speciesCode
  );
  const selectedNatureOfComplaint = hwcrNatureOfComplaintCodes.find(
    (option) => option.value === natureOfComplaintCode
  );
  const selectedAreaCode = areaCodes.find((option) => option.label === area);
  const selectedAssignedOfficer = transformedOfficerCodeList.find(
    (option) => option.value === personGuid
  );
  const selectedAgencyCode = referredByAgencyCodes.find(
    (option) =>
      option.value ===
      (referredByAgencyCode === undefined ? "" : referredByAgencyCode)
  );
  const selectedAttractants = attractantCodes.filter((option) =>
    attractants?.some((attractant) => attractant.description === option.value)
  );
  const selectedViolationTypeCode = violationTypeCodes.find(
    (option) => option.value === violationType
  );
  const selectedViolationInProgress = yesNoOptions.find(
    (option) => option.value === (violationInProgress ? "Yes" : "No")
  );
  const selectedViolationObserved = yesNoOptions.find(
    (option) => option.value === (violationObserved ? "Yes" : "No")
  );

  const handleIncidentDateTimeChange = (date: Date) => {
    setSelectedIncidentDateTime(date);
  };

  return (
    <div>
      {/* edit header block */}
      <div className="comp-complaint-header-edit-block">
        <div className="comp-details-edit-container">
          <div className="comp-details-edit-column">
            {complaintType === COMPLAINT_TYPES.HWCR && (
              <div
                className="comp-details-label-input-pair"
                id="nature-of-complaint-pair-id"
              >
                <label id="nature-of-complaint-label-id">
                  Nature of Complaint<span className="required-ind">*</span>
                </label>
                <Select
                  className="comp-details-input"
                  options={hwcrNatureOfComplaintCodes}
                  defaultValue={selectedNatureOfComplaint}
                  placeholder="Select"
                  classNamePrefix='ceds-select'
                  id="nature-of-complaint-select-id"
                />
              </div>
            )}
            {complaintType === COMPLAINT_TYPES.HWCR && (
              <div
                className="comp-details-label-input-pair"
                id="species-pair-id"
              >
                <label id="species-label-id">
                  Species<span className="required-ind">*</span>
                </label>
                <Select
                  className="comp-details-input"
                  options={speciesCodes}
                  defaultValue={selectedSpecies}
                  placeholder="Select"
                  id="species-select-id"
                  classNamePrefix='ceds-select'
                />
              </div>
            )}
            {complaintType === COMPLAINT_TYPES.ERS && (
              <div
                className="comp-details-label-input-pair"
                id="violation-type-pair-id"
              >
                <label id="violation-label-id">
                  Violation Type<span className="required-ind">*</span>
                </label>
                <Select
                  className="comp-details-input"
                  options={violationTypeCodes}
                  defaultValue={selectedViolationTypeCode}
                  placeholder="Select"
                  id="violation-type-select-id"
                  classNamePrefix='ceds-select'
                />
              </div>
            )}
            <div className="comp-details-label-input-pair" id="status-pair-id">
              <label id="status-label-id">
                Status<span className="required-ind">*</span>
              </label>
              <Select
                className="comp-details-input"
                options={complaintStatusCodes}
                defaultValue={selectedStatus}
                placeholder="Select"
                id="status-select-id"
                classNamePrefix='ceds-select'
              />
            </div>
            <div
              className="comp-details-label-input-pair"
              id="officer-assigned-pair-id"
            >
              <label id="officer-assigned-select-label-id">
                Officer Assigned
              </label>
              <Select
                className="comp-details-input"
                options={transformedOfficerCodeList}
                placeholder="Select"
                defaultValue={selectedAssignedOfficer}
                id="officer-assigned-select-id"
                classNamePrefix='ceds-select'
              />
            </div>
          </div>
          <div className="comp-details-edit-column comp-details-right-column">
            <div
              className="comp-details-label-input-pair"
              id="date-time-pair-id"
            >
              <label id="date-time-logged-label-id">Date / Time Logged</label>
              <div className="comp-details-input">
                <i className="bi bi-calendar comp-margin-right-xs"></i>
                {formatDate(loggedDate)}
                <i className="bi bi-clock comp-margin-left-xs comp-margin-right-xs"></i>
                {formatTime(loggedDate)}
              </div>
            </div>
            <div
              className="comp-details-label-input-pair"
              id="last-updated-pair-id"
            >
              <label id="last-updated-label-id">Last Updated</label>
              <div className="comp-details-input">
                <i className="bi bi-calendar comp-margin-right-xs"></i>
                {formatDate(lastUpdated)}
                <i className="bi bi-clock comp-margin-left-xs comp-margin-right-xs"></i>
                {formatTime(lastUpdated)}
              </div>
            </div>
            <div
              className="comp-details-label-input-pair"
              id="created-by-pair-id"
            >
              <label id="created-by-label-id">Created By</label>
              <div className="comp-padding-left-xs comp-padding-top-xs">
                {createdBy}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* edit details block */}
      <div className="comp-complaint-details-block">
        <h6>Call Details</h6>
        <div className="comp-complaint-call-information">
          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div
                className="comp-details-label-input-pair"
                id="complaint-description-pair-id"
              >
                <label
                  id="complaint-description-edit-label-id"
                  className="col-auto"
                >
                  Complaint Description<span className="required-ind">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="complaint-description-textarea-id"
                  defaultValue={details}
                  rows={4}
                />
              </div>
              <div
                className="comp-details-label-input-pair comp-margin-top-30"
                id="incident-time-pair-id"
              >
                <label>Incident Time</label>
                <DatePicker
                  showIcon
                  timeInputLabel="Time:"
                  onChange={handleIncidentDateTimeChange}
                  selected={selectedIncidentDateTime}
                  showTimeInput
                  dateFormat="yyyy-MM-dd HH:mm"
                  timeFormat="HH:mm"
                  wrapperClassName="comp-details-edit-calendar-input"
                />
              </div>
              {complaintType === COMPLAINT_TYPES.HWCR && (
                <div
                  className="comp-details-label-input-pair"
                  id="attractants-pair-id"
                >
                  <label>Attractants</label>
                  <div className="comp-details-edit-input">
                    <Select
                      options={attractantCodes}
                      defaultValue={selectedAttractants}
                      placeholder="Select"
                      id="attractants-select-id"
                      classNamePrefix='ceds-select'
                      isMulti
                    />
                  </div>
                </div>
              )}
              {complaintType === COMPLAINT_TYPES.ERS && (
                <div
                  className="comp-details-label-input-pair"
                  id="violation-in-progress-pair-id"
                >
                  <label>Violation in Progress</label>
                  <div className="comp-details-edit-input">
                    <Select
                      options={yesNoOptions}
                      defaultValue={selectedViolationInProgress}
                      placeholder="Select"
                      id="violation-in-progress-select-id"
                      classNamePrefix='ceds-select'
                    />
                  </div>
                </div>
              )}
              {complaintType === COMPLAINT_TYPES.ERS && (
                <div
                  className="comp-details-label-input-pair"
                  id="violation-observed-pair-id"
                >
                  <label>Violation Observed</label>
                  <div className="comp-details-edit-input">
                    <Select
                      options={yesNoOptions}
                      defaultValue={selectedViolationObserved}
                      placeholder="Select"
                      id="violation-observed-select-id"
                      classNamePrefix='ceds-select'
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="comp-details-edit-column comp-details-right-column">
              <div
                className="comp-details-label-input-pair"
                id="complaint-location-pair-id"
              >
                <label id="complaint-location-label-id">
                  Complaint Location
                </label>
                <input
                  type="text"
                  id="complaint-location-edit-id"
                  className="form-control"
                  value={location}
                />
              </div>
              <div
                className="comp-details-label-input-pair"
                id="location-description-pair-id"
              >
                <label>Location Description</label>
                <textarea
                  className="form-control"
                  id="complaint-location-description-textarea-id"
                  defaultValue={locationDescription}
                  rows={4}
                />
              </div>
              <div
                className="comp-details-label-input-pair comp-margin-top-30"
                id="x-coordinate-pair-id"
              >
                <label>X Coordinate</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    id="comp-details-edit-x-coordinate-input"
                    className="form-control"
                    value={xCoordinate}
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="y-coordinate-pair-id"
              >
                <label>Y Coordinate</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    id="comp-details-edit-y-coordinate-input"
                    className="form-control"
                    value={yCoordinate}
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="area-community-pair-id"
              >
                <label>
                  Area/Community<span className="required-ind">*</span>
                </label>
                <div className="comp-details-edit-input">
                  <Select
                    options={areaCodes}
                    defaultValue={selectedAreaCode}
                    id="area-select-id"
                    classNamePrefix='ceds-select'
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="office-pair-id"
              >
                <label>Office</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    id="office-edit-readonly-id"
                    className="form-control"
                    disabled
                    value={office}
                  />
                </div>
              </div>
              <div className="comp-details-label-input-pair" id="zone-pair-id">
                <label>Zone</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    id="zone-edit-readonly-id"
                    className="form-control"
                    disabled
                    value={zone}
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="region-pair-id"
              >
                <label>Region</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    id="region-edit-readonly-id"
                    className="form-control"
                    disabled
                    value={region}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* edit caller info block */}
      <div className="comp-complaint-details-block">
        <h6>Caller Information</h6>
        <div className="comp-complaint-call-information">
          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div className="comp-details-label-input-pair" id="name-pair-id">
                <label
                  id="complaint-caller-info-name-label-id"
                  className="col-auto"
                >
                  Name
                </label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    id="caller-name-id"
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="primary-phone-pair-id"
              >
                <label
                  id="complaint-caller-info-primary-phone-label-id"
                  className="col-auto"
                >
                  Primary Phone
                </label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="form-control"
                    value={primaryPhone}
                    id="caller-primary-phone-id"
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="alternate-1-phone-pair-id"
              >
                <label
                  id="complaint-caller-info-alternate1-phone-label-id"
                  className="col-auto"
                >
                  Alternate 1 Phone
                </label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="form-control"
                    value={alternatePhone}
                    id="caller-info-alternate-1-phone-id"
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="alternate-2-phone-pair-id"
              >
                <label
                  id="complaint-caller-info-alternate2-phone-label-id"
                  className="col-auto"
                >
                  Alternate 2 Phone
                </label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="form-control"
                    value={secondaryPhone}
                    id="caller-info-alternate-2-phone-id"
                  />
                </div>
              </div>
            </div>
            <div className="comp-details-edit-column comp-details-right-column">
              <div
                className="comp-details-label-input-pair"
                id="address-pair-id"
              >
                <label>Address</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    id="comlaint-address-id"
                  />
                </div>
              </div>

              <div className="comp-details-label-input-pair" id="email-pair-id">
                <label>Email</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    id="complaint-email-id"
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="referred-pair-id"
              >
                <label>Referred by / Complaint Agency</label>
                <div className="comp-details-edit-input">
                  <Select
                    placeholder="Select"
                    options={referredByAgencyCodes}
                    defaultValue={selectedAgencyCode}
                    id="referred-select-id"
                    classNamePrefix='ceds-select'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {complaintType === COMPLAINT_TYPES.ERS &&
        <div className="comp-complaint-details-block">
          <h6>Subject of Complaint/Widness Details</h6>
          <div className="comp-complaint-call-information">
            <div className="comp-suspect-witness-edit-container">
              <div className="comp-details-edit-column comp-details-right-column">
                <div
                  className="comp-details-label-input-pair"
                  id="subject-of-complaint-pair-id"
                >
                  <label
                    id="complaint-caller-info-name-label-id"
                    className="col-auto"
                  >
                    Description
                  </label>
                    <textarea
                      className="form-control"
                      id="complaint-description-textarea-id"
                      defaultValue={complaint_witness_details}
                      rows={4}
                    />
                  </div>
              </div>
              <div className="comp-details-edit-column"/>
            </div>
          </div>
        </div>
      }
    </div>
  );
};
