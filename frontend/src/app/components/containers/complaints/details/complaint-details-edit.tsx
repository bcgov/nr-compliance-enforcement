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
} from "../../../../store/reducers/code-tables";
import { useSelector } from "react-redux";
import {
  getOfficersInZone,
  officersInZone,
} from "../../../../store/reducers/officer";
import { Person } from "../../../../types/person/person";
import ReactDOMServer from "react-dom/server";
import { customStyles } from "../../../../common/custom-styles";
import { DropdownOption } from "../../../../types/code-tables/option";

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
  } = useAppSelector(selectComplaintDeails(complaintType)) as ComplaintDetails;

  const {
    loggedDate,
    createdBy,
    lastUpdated,
    personGuid,
    status,
    natureOfComplaintCode,
    speciesCode
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
  const complaintStatusCodes = useSelector(selectComplaintStatusCodes) as DropdownOption[];
  const speciesCodes = useSelector(selectSpeciesCodes) as DropdownOption[];
  const hwcrNatureOfComplaintCodes = useSelector(
    selectedHwcrNatureOfComplaintCodes
  ) as DropdownOption[];
  const areaCodes = useSelector(selectedAreaCodes) as DropdownOption[];
  const attractantCodes = useSelector(selectedAttractantCodes) as DropdownOption[];
  const referredByAgencyCodes = useSelector(selectAgencyCodes) as DropdownOption[];

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
    attractants?.some(
      (attractant) => attractant.description === option.value
    )
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
            <div className="comp-details-label-input-pair">
              <label id="nature-of-complaint-label-id">
                Nature of Complaint
              </label>
              <Select
                className="comp-details-input"
                options={hwcrNatureOfComplaintCodes}
                defaultValue={selectedNatureOfComplaint}
                placeholder="Select"
                styles={customStyles}
                id="nature_of_complaint_select_id"
              />
            </div>

            <div className="comp-details-label-input-pair">
              <label id="species-label-id">Species</label>
              <Select
                className="comp-details-input"
                options={speciesCodes}
                defaultValue={selectedSpecies}
                placeholder="Select"
                id="species_select_id"
                styles={customStyles}
              />
            </div>
            <div className="comp-details-label-input-pair">
              <label id="status-label-id">Status</label>
              <Select
                className="comp-details-input"
                options={complaintStatusCodes}
                defaultValue={selectedStatus}
                placeholder="Select"
                id="status_select_id"
                styles={customStyles}
              />
            </div>

            <div className="comp-details-label-input-pair">
              <label id="officer_assigned_select_label_id">
                Officer Assigned
              </label>
              <Select
                className="comp-details-input"
                options={transformedOfficerCodeList}
                placeholder="Select"
                defaultValue={selectedAssignedOfficer}
                id="officer_assigned_select_id"
                styles={customStyles}
              />
            </div>
          </div>
          <div className="comp-details-edit-column">
            <div className="comp-details-label-input-pair">
              <label id="date-time-logged-label-id">Date / Time Logged</label>
              <div className="comp-details-input">
                <i className="bi bi-calendar comp-margin-right-xs"></i>
                {formatDate(loggedDate)}
                <i className="bi bi-clock comp-margin-left-xs comp-margin-right-xs"></i>
                {formatTime(loggedDate)}
              </div>
            </div>
            <div className="comp-details-label-input-pair">
              <label id="last-updated-label-id">Last Updated</label>
              <div className="comp-details-input">
                <i className="bi bi-calendar comp-margin-right-xs"></i>
                {formatDate(lastUpdated)}
                <i className="bi bi-clock comp-margin-left-xs comp-margin-right-xs"></i>
                {formatTime(lastUpdated)}
              </div>
            </div>
            <div className="comp-details-label-input-pair">
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
              <div className="comp-details-label-input-pair">
                <label
                  id="complaint_description_edit_label_id"
                  className="col-auto"
                >
                  Complaint Description
                </label>
                <textarea
                  className="form-control"
                  id="complaint_description_textarea_id"
                  defaultValue={details}
                  rows={4}
                />
              </div>
              <div className="comp-details-label-input-pair comp-margin-top-80">
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
              <div className="comp-details-label-input-pair">
                <label>Attractants</label>
                <div className="comp-details-edit-input">
                  <Select
                    options={attractantCodes}
                    defaultValue={selectedAttractants}
                    placeholder="Select"
                    id="attractants_select_id"
                    styles={customStyles}
                    isMulti
                  />
                </div>
              </div>
            </div>
            <div className="comp-details-edit-column">
              <div className="comp-details-label-input-pair">
                <label id="complaint-location-label-id">Complaint Location</label>
                <input
                  type="text"
                  id="complaint_location_edit_id"
                  className="form-control"
                  value={location}
                />
              </div>
              <div className="comp-details-label-input-pair">
                <label>Location Description</label>
                <textarea
                  className="form-control"
                  id="complaint_location_description_textarea_id"
                  defaultValue={locationDescription}
                  rows={4}
                />
              </div>
              <div className="comp-details-label-input-pair comp-margin-top-80">
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
              <div className="comp-details-label-input-pair">
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
              <div className="comp-details-label-input-pair">
                <label>Area/Community</label>
                <div className="comp-details-edit-input">
                  <Select
                    options={areaCodes}
                    defaultValue={selectedAreaCode}
                    id="area_select_id"
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="comp-details-label-input-pair">
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
              <div className="comp-details-label-input-pair">
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
              <div className="comp-details-label-input-pair">
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
              <div className="comp-details-label-input-pair">
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
                    id="caller_name_id"
                  />
                </div>
              </div>
              <div className="comp-details-label-input-pair">
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
                    id="caller_primary_phone_id"
                  />
                </div>
              </div>
              <div className="comp-details-label-input-pair">
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
              <div className="comp-details-label-input-pair">
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
            <div className="comp-details-edit-column">
              <div className="comp-details-label-input-pair">
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

              <div className="comp-details-label-input-pair">
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
              <div className="comp-details-label-input-pair">
                <label>Referred by / Complaint Agency</label>
                <div className="comp-details-edit-input">
                  <Select
                    placeholder="Select"
                    options={referredByAgencyCodes}
                    defaultValue={selectedAgencyCode}
                    id="referred_select_id"
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
