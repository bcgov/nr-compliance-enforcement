import { FC, useEffect, useMemo, useState } from "react";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { ValidationSelect } from "../../../../common/validation-select";
import { CompSelect } from "../../../common/comp-select";
import { bcBoundaries } from "../../../../common/methods";
import { ValidationTextArea } from "../../../../common/validation-textarea";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { ValidationMultiSelect } from "../../../../common/validation-multiselect";
import { CompInput } from "../../../common/comp-input";
import { ValidationPhoneInput } from "../../../../common/validation-phone-input";
import { ValidationInput } from "../../../../common/validation-input";
import Option from "../../../../types/app/option";
import { Coordinates } from "../../../../types/app/coordinate-type";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { openModal, selectOfficerAgency, userId } from "../../../../store/reducers/app";
import notificationInvalid from "../../../../../assets/images/notification-invalid.png";

import {
  selectAttractantCodeDropdown,
  selectCommunityCodeDropdown,
  selectComplaintTypeDropdown,
  selectHwcrNatureOfComplaintCodeDropdown,
  selectReportedByDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
} from "../../../../store/reducers/code-table";
import { Officer } from "../../../../types/person/person";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import { CreateComplaintHeader } from "./create-complaint-header";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { createComplaint, getComplaintById, setComplaint } from "../../../../store/reducers/complaints";
import { from } from "linq-to-typescript";
import { ToggleError } from "../../../../common/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ComplaintLocation } from "./complaint-location";
import { AttachmentsCarousel } from "../../../common/attachments-carousel";
import { COMSObject } from "../../../../types/coms/object";
import {
  handleAddAttachments,
  handleDeleteAttachments,
  handlePersistAttachments,
} from "../../../../common/attachment-utils";

import { WildlifeComplaint as WildlifeComplaintDto } from "../../../../types/app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "../../../../types/app/complaints/allegation-complaint";
import { Complaint as ComplaintDto } from "../../../../types/app/complaints/complaint";
import { Delegate } from "../../../../types/app/people/delegate";
import { UUID } from "crypto";
import { AttractantXref } from "../../../../types/app/complaints/attractant-xref";
import { ComplaintAlias } from "../../../../types/app/aliases";
import AttachmentEnum from "../../../../constants/attachment-enum";

export const CreateComplaint: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userid = useAppSelector(userId);
  const agency = useAppSelector(selectOfficerAgency);
  const officerList = useAppSelector(selectOfficersByAgency(agency));
  const speciesCodes = useAppSelector(selectSpeciesCodeDropdown) as Option[];
  const hwcrNatureOfComplaintCodes = useAppSelector(selectHwcrNatureOfComplaintCodeDropdown) as Option[];
  const complaintTypeCodes = useAppSelector(selectComplaintTypeDropdown) as Option[];
  const areaCodes = useAppSelector(selectCommunityCodeDropdown);
  const attractantCodes = useAppSelector(selectAttractantCodeDropdown) as Option[];
  const reportedByCodes = useAppSelector(selectReportedByDropdown) as Option[];
  const violationTypeCodes = useAppSelector(selectViolationCodeDropdown) as Option[];
  const [complaintAttachmentCount, setComplaintAttachmentCount] = useState<number>(0);

  const handleSlideCountChange = (count: number) => {
    setComplaintAttachmentCount(count);
  };

  let assignableOfficers: Option[] = officerList
    ? officerList.map((officer: Officer) => ({
        value: officer.person_guid.person_guid,
        label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
      }))
    : [];

  const yesNoOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const currentDate = useMemo(() => new Date(), []);

  const [complaintData, applyComplaintData] = useState<ComplaintAlias>();

  const [complaintType, setComplaintType] = useState<string>(COMPLAINT_TYPES.HWCR);
  const [complaintTypeMsg, setComplaintTypeMsg] = useState<string>("");
  const [natureOfComplaintErrorMsg, setNatureOfComplaintErrorMsg] = useState<string>("");
  const [violationTypeErrorMsg, setViolationTypeErrorMsg] = useState<string>("");
  const [speciesErrorMsg, setSpeciesErrorMsg] = useState<string>("");
  const [complaintDescriptionErrorMsg, setComplaintDescriptionErrorMsg] = useState<string>("");
  const [communityErrorMsg, setCommunityErrorMsg] = useState<string>("");
  const [geoPointXMsg, setGeoPointXMsg] = useState<string>("");
  const [geoPointYMsg, setGeoPointYMsg] = useState<string>("");
  const [emailMsg, setEmailMsg] = useState<string>("");
  const [primaryPhoneMsg, setPrimaryPhoneMsg] = useState<string>("");
  const [secondaryPhoneMsg, setSecondaryPhoneMsg] = useState<string>("");
  const [alternatePhoneMsg, setAlternatePhoneMsg] = useState<string>("");
  const [selectedIncidentDateTime, setSelectedIncidentDateTime] = useState<Date>();

  const [errorNotificationClass, setErrorNotificationClass] = useState("comp-complaint-error display-none");

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    dispatch(setComplaint(null));
    setLatitude("");
    setLongitude("");
  }, [dispatch]);

  useEffect(() => {
    //-- when there isn't an active new complaint, create one use
    //-- default values for the complaint
    if (!complaintData) {
      const model: ComplaintDto = {
        id: "",
        details: "",
        name: "",
        address: "",
        email: "",
        phone1: "",
        phone2: "",
        phone3: "",
        location: { type: "Point", coordinates: [0, 0] },
        locationSummary: "",
        locationDetail: "",
        status: "OPEN",
        ownedBy: "COS",
        reportedByOther: "",
        reportedOn: currentDate,
        updatedOn: currentDate,
        organization: {
          area: "",
          zone: "",
          region: "",
        },
        delegates: [],
        createdBy: userid,
        updatedBy: userid,
      };

      applyComplaintData(model);
    }
  }, [complaintData, currentDate, userid]);

  // files to add to COMS when complaint is saved
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);

  // files to remove from COMS when complaint is saved
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  const handleComplaintChange = (selected: Option | null) => {
    if (selected?.value) {
      const { value } = selected;

      setComplaintTypeMsg("");
      setComplaintType(value);

      //-- remove all of the properties associated with a wildlife or allegation complaint
      const {
        ersId,
        hwcrId,
        violation,
        isInProgress,
        wasObserved,
        species,
        natureOfComplaint,
        attractants,
        otherAttractants,
        ...rest
      } = complaintData as any;
      applyComplaintData(rest);
    } else {
      setComplaintTypeMsg("Required");
    }
  };

  const handleNatureOfComplaintChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      if (!value) {
        setNatureOfComplaintErrorMsg("Required");
      } else {
        setNatureOfComplaintErrorMsg("");

        const complaint = { ...complaintData, natureOfComplaint: value } as WildlifeComplaintDto;
        applyComplaintData(complaint);
      }
    }
  };

  const handleSpeciesChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      if (!value) {
        setSpeciesErrorMsg("Required");
      } else {
        setSpeciesErrorMsg("");

        const complaint = { ...complaintData, species: value } as WildlifeComplaintDto;
        applyComplaintData(complaint);
      }
    }
  };

  const handleViolationTypeChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      if (!value) {
        setNatureOfComplaintErrorMsg("Required");
      } else {
        setNatureOfComplaintErrorMsg("");

        const complaint = { ...complaintData, violation: value } as AllegationComplaintDto;
        applyComplaintData(complaint);
      }
    }
  };

  const handleAssignedOfficerChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      const { delegates } = complaintData as ComplaintDto;
      let existing = delegates.filter(({ type }) => type !== "ASSIGNEE");
      let updatedDelegates: Array<Delegate> = [];

      if (value !== "Unassigned") {
        //-- get the new officer from state
        const officer = officerList?.find(({ person_guid: { person_guid: id } }) => {
          return id === value;
        });

        const { person_guid: person } = officer as any;
        const { person_guid: id, first_name, last_name, middle_name_1, middle_name_2 } = person;

        //-- if there's already an assignee mark the officer as inactive
        if (from(delegates).any() && from(delegates).any((item) => item.type === "ASSIGNEE")) {
          let delegate = delegates.find((item) => item.type === "ASSIGNEE");
          let updatedDelegate = { ...delegate, isActive: false } as Delegate;

          updatedDelegates = [updatedDelegate];
        }

        //-- create a new assigned officer delegate
        let delegate: Delegate = {
          isActive: true,
          type: "ASSIGNEE",
          person: {
            id: id as UUID,
            firstName: first_name,
            middleName1: middle_name_1,
            middleName2: middle_name_2,
            lastName: last_name,
          },
        };

        updatedDelegates = [...updatedDelegates, ...existing, delegate];

        const complaint = { ...complaintData, delegates: updatedDelegates } as ComplaintDto;
        applyComplaintData(complaint);
      } else if (from(delegates).any() && from(delegates).any((item) => item.type === "ASSIGNEE")) {
        let delegate = delegates.find((item) => item.type === "ASSIGNEE");
        let updatedDelegate = { ...delegate, isActive: false } as Delegate;

        updatedDelegates = [updatedDelegate];

        const complaint = { ...complaintData, delegates: updatedDelegates } as ComplaintDto;
        applyComplaintData(complaint);
      }
    }
  };

  const handleComplaintDescriptionChange = (value: string) => {
    if (value === "") {
      setComplaintDescriptionErrorMsg("Required");
    } else {
      setComplaintDescriptionErrorMsg("");

      const complaint = { ...complaintData, details: value?.trim() } as ComplaintDto;
      applyComplaintData(complaint);
    }
  };

  const handleLocationDescriptionChange = (value: string) => {
    const complaint = { ...complaintData, locationDetail: value?.trim() } as ComplaintDto;
    applyComplaintData(complaint);
  };

  const handleViolationInProgessChange = (selected: Option | null) => {
    if (selected?.value) {
      const { value } = selected;

      const complaint = { ...complaintData, isInProgress: value === "Yes" } as AllegationComplaintDto;
      applyComplaintData(complaint);
    }
  };

  const handleViolationObservedChange = (selected: Option | null) => {
    if (selected?.value) {
      const { value } = selected;

      const complaint = { ...complaintData, wasObserved: value === "Yes" } as AllegationComplaintDto;
      applyComplaintData(complaint);
    }
  };

  const handleLocationChange = (value: string) => {
    const complaint = { ...complaintData, locationSummary: value?.trim() } as ComplaintDto;
    applyComplaintData(complaint);
  };

  const handleAttractantsChange = async (selectedItems: Array<Option> | null) => {
    if (!selectedItems) {
      return;
    }
    let updates: Array<AttractantXref> = [];
    selectedItems.forEach(({ value: selected }) => {
      const record: AttractantXref = { attractant: selected as string, isActive: true };
      updates.push(record);
    });
    const model = { ...complaintData, attractants: updates } as WildlifeComplaintDto;
    applyComplaintData(model);
  };

  const handleCommunityChange = (selected: Option | null) => {
    if (!selected) {
      return;
    }

    if (selected.value === "") {
      setCommunityErrorMsg("Required");
    } else {
      setCommunityErrorMsg("");
      if (selected.value) {
        const { value } = selected;
        const { organization } = complaintData as ComplaintDto;
        const update = { ...organization, area: value };

        const complaint = { ...complaintData, organization: update } as ComplaintDto;
        applyComplaintData(complaint);
      }
    }
  };

  const handleGeoPointChange = async (latitude: string, longitude: string) => {
    //-- clear errors
    setGeoPointXMsg("");
    setGeoPointYMsg("");

    let coordinates: Array<number> = [0, 0];

    //-- verify latitude and longitude
    if (latitude && !Number.isNaN(latitude)) {
      const item = parseFloat(latitude);
      if (item > bcBoundaries.maxLatitude || item < bcBoundaries.minLatitude) {
        setGeoPointYMsg(`Value must be between ${bcBoundaries.maxLatitude} and ${bcBoundaries.minLatitude} degrees`);
      }
    }

    if (longitude && !Number.isNaN(longitude)) {
      const item = parseFloat(longitude);
      if (item > bcBoundaries.maxLongitude || item < bcBoundaries.minLongitude) {
        setGeoPointXMsg(`Value must be between ${bcBoundaries.minLongitude} and ${bcBoundaries.maxLongitude} degrees`);
      }
    }

    //-- update coordinates
    if (latitude && longitude && !Number.isNaN(latitude) && !Number.isNaN(longitude)) {
      coordinates[Coordinates.Longitude] = parseFloat(longitude);
      coordinates[Coordinates.Latitude] = parseFloat(latitude);
    }

    const complaint = { ...complaintData, location: { type: "Point", coordinates } } as ComplaintDto;
    applyComplaintData(complaint);
  };

  const handleNameChange = (value: string) => {
    const complaint = { ...complaintData, name: value?.trim() } as ComplaintDto;
    applyComplaintData(complaint);
  };

  const handleAddressChange = (value: string) => {
    const complaint = { ...complaintData, address: value?.trim() } as ComplaintDto;
    applyComplaintData(complaint);
  };

  const handlePrimaryPhoneChange = (value: string) => {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setPrimaryPhoneMsg("Phone number must be 10 digits");
    } else if (value !== undefined && (value.startsWith("+11") || value.startsWith("+10"))) {
      setPrimaryPhoneMsg("Invalid Format");
    } else {
      setPrimaryPhoneMsg("");

      const complaint = { ...complaintData, phone1: value } as ComplaintDto;
      applyComplaintData(complaint);
    }
  };
  const handleSecondaryPhoneChange = (value: string) => {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setSecondaryPhoneMsg("Phone number must be 10 digits");
    } else if (value !== undefined && (value.startsWith("+11") || value.startsWith("+10"))) {
      setSecondaryPhoneMsg("Invalid Format");
    } else {
      setSecondaryPhoneMsg("");

      const complaint = { ...complaintData, phone2: value } as ComplaintDto;
      applyComplaintData(complaint);
    }
  };

  const handleAlternatePhoneChange = (value: string) => {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setAlternatePhoneMsg("Phone number must be 10 digits");
    } else if (value !== undefined && (value.startsWith("+11") || value.startsWith("+10"))) {
      setAlternatePhoneMsg("Invalid Format");
    } else {
      setAlternatePhoneMsg("");

      const complaint = { ...complaintData, phone3: value } as ComplaintDto;
      applyComplaintData(complaint);
    }
  };

  const handleEmailChange = (value: string) => {
    let re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (value !== undefined && value !== "" && !re.test(value)) {
      setEmailMsg("Please enter a vaild email");
    } else {
      setEmailMsg("");

      const complaint = { ...complaintData, email: value?.trim() } as ComplaintDto;
      applyComplaintData(complaint);
    }
  };

  const handleReportedByChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      const complaint = { ...complaintData, reportedBy: value } as ComplaintDto;
      applyComplaintData(complaint);
    }
  };

  const handleSuspectDetailsChange = (value: string) => {
    const complaint = { ...complaintData, violationDetails: value?.trim() } as AllegationComplaintDto;
    applyComplaintData(complaint);
  };

  const handleIncidentDateTimeChange = (date: Date) => {
    setSelectedIncidentDateTime(date);

    const complaint = { ...complaintData, incidentDateTime: date } as ComplaintDto;
    applyComplaintData(complaint);
  };

  const handleCoordinateChange = (input: string, type: Coordinates) => {
    if (type === Coordinates.Latitude) {
      setLatitude(input);
      handleGeoPointChange(input, longitude);
    } else {
      setLongitude(input);
      handleGeoPointChange(latitude, input);
    }
  };

  const cancelConfirmed = () => {
    navigate(`/`);
  };

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed,
        },
      }),
    );
  };

  const hasErrors = (complaintType: string): boolean => {
    let result: boolean = false;

    const {
      organization: { area },
      details,
    } = complaintData as ComplaintDto;

    if (!area) {
      setCommunityErrorMsg("Required");
      result = true;
    }

    if (!details) {
      setComplaintDescriptionErrorMsg("Required");
      result = true;
    }

    switch (complaintType) {
      case "ERS": {
        const { violation } = complaintData as AllegationComplaintDto;

        if (!violation) {
          setViolationTypeErrorMsg("Required");
          result = true;
        }

        break;
      }
      case "HWCR":
      default: {
        const { species, natureOfComplaint } = complaintData as WildlifeComplaintDto;

        if (!species) {
          setSpeciesErrorMsg("Required");
          result = true;
        }

        if (!natureOfComplaint) {
          setNatureOfComplaintErrorMsg("Required");
          result = true;
        }
        break;
      }
    }

    return result;
  };

  const saveButtonClick = async () => {
    if (!complaintData) {
      return;
    }

    if (!hasErrors(complaintType)) {
      await handleComplaintProcessing(complaintData);
    } else {
      handleFormErrors();
    }
  };

  const handleComplaintProcessing = async (complaint: ComplaintAlias) => {
    let complaintId = await handleHwcrComplaint(complaint);
    if (complaintId) {
      handlePersistAttachments(
        dispatch,
        attachmentsToAdd,
        attachmentsToDelete,
        complaintId,
        setAttachmentsToAdd,
        setAttachmentsToDelete,
        AttachmentEnum.COMPLAINT_ATTACHMENT,
      );
    }

    setErrorNotificationClass("comp-complaint-error display-none");
  };

  const handleHwcrComplaint = async (complaint: ComplaintAlias) => {
    const complaintId = await dispatch(createComplaint(complaintType, complaint));
    if (complaintId) {
      await dispatch(getComplaintById(complaintId, complaintType));

      navigate(`/complaint/${complaintType}/${complaintId}`);
    }
    return complaintId;
  };

  const handleFormErrors = () => {
    ToggleError("Errors in form");
    setErrorNotificationClass("comp-complaint-error");
  };

  return (
    <div className="comp-complaint-details">
      <ToastContainer />
      <CreateComplaintHeader
        complaintType={complaintType}
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
      />
      {/* edit header block */}
      <div
        id="complaint-error-notification"
        className={errorNotificationClass}
      >
        <img
          src={notificationInvalid}
          alt="error"
          className="filter-image-spacing"
        />
        {/*
         */}
        Errors in form
      </div>
      <div className="comp-complaint-details-block header-spacing">
        <h6>Complaint Details</h6>
      </div>
      <div className="comp-complaint-header-edit-block">
        <div className="comp-details-edit-container">
          <div className="comp-details-edit-column">
            <div
              className="comp-details-label-input-pair"
              id="nature-of-complaint-pair-id"
            >
              <label
                id="nature-of-complaint-label-id"
                htmlFor="complaint-type-select-id"
              >
                Complaint Type<span className="required-ind">*</span>
              </label>
              <ValidationSelect
                id="complaint-type-select-id"
                options={complaintTypeCodes}
                placeholder="Select"
                className="comp-details-input"
                classNamePrefix="comp-select"
                defaultValue={complaintTypeCodes.find((option) => option.value === complaintType)}
                onChange={(e) => handleComplaintChange(e)}
                errMsg={complaintTypeMsg}
              />
            </div>
            {complaintType === COMPLAINT_TYPES.HWCR && (
              <div
                className="comp-details-label-input-pair"
                id="nature-of-complaint-pair-id"
              >
                <label
                  id="nature-of-complaint-label-id"
                  htmlFor="nature-of-complaint-select-id"
                >
                  Nature of Complaint<span className="required-ind">*</span>
                </label>
                <ValidationSelect
                  id="nature-of-complaint-select-id"
                  options={hwcrNatureOfComplaintCodes}
                  placeholder="Select"
                  className="comp-details-input"
                  classNamePrefix="comp-select"
                  onChange={(e) => handleNatureOfComplaintChange(e)}
                  errMsg={natureOfComplaintErrorMsg}
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
                <ValidationSelect
                  className="comp-details-input"
                  options={violationTypeCodes}
                  placeholder="Select"
                  id="violation-type-select-id"
                  onChange={(e) => handleViolationTypeChange(e)}
                  classNamePrefix="comp-select"
                  errMsg={violationTypeErrorMsg}
                />
              </div>
            )}
            <div
              className="comp-details-label-input-pair"
              id="officer-assigned-pair-id"
            >
              <label
                id="officer-assigned-select-label-id"
                htmlFor="officer-assigned-select-id"
              >
                Officer Assigned
              </label>
              <CompSelect
                id="officer-assigned-select-id"
                classNamePrefix="comp-select"
                onChange={(e) => handleAssignedOfficerChange(e)}
                className="comp-details-input"
                options={assignableOfficers}
                defaultOption={{ label: "None", value: "Unassigned" }}
                placeholder="Select"
                enableValidation={false}
              />
            </div>
          </div>
          <div className="comp-details-edit-column comp-details-right-column">
            <div className="comp-details-label-input-pair"></div>
            {complaintType === COMPLAINT_TYPES.HWCR && (
              <div
                className="comp-details-label-input-pair"
                id="species-pair-id"
              >
                <label id="species-label-id">
                  Species<span className="required-ind">*</span>
                </label>
                <ValidationSelect
                  className="comp-details-input"
                  options={speciesCodes}
                  placeholder="Select"
                  id="species-select-id"
                  classNamePrefix="comp-select"
                  onChange={(e) => handleSpeciesChange(e)}
                  errMsg={speciesErrorMsg}
                />
              </div>
            )}
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
                  htmlFor="complaint-description-textarea-id"
                >
                  Complaint Description<span className="required-ind">*</span>
                </label>
                <ValidationTextArea
                  className="comp-form-control"
                  id="complaint-description-textarea-id"
                  rows={4}
                  errMsg={complaintDescriptionErrorMsg}
                  onChange={handleComplaintDescriptionChange}
                />
              </div>
              <div
                className="comp-details-label-input-pair comp-margin-top-30"
                id="incident-time-pair-id"
              >
                <label>Incident Time</label>
                <DatePicker
                  showTimeInput
                  id="complaint-incident-time"
                  showIcon
                  timeInputLabel="Time:"
                  onChange={handleIncidentDateTimeChange}
                  selected={selectedIncidentDateTime}
                  dateFormat="yyyy-MM-dd HH:mm"
                  timeFormat="HH:mm"
                  wrapperClassName="comp-details-edit-calendar-input"
                  maxDate={currentDate}
                />
              </div>
              {complaintType === COMPLAINT_TYPES.HWCR && (
                <div
                  className="comp-details-label-input-pair"
                  id="attractants-pair-id"
                >
                  <label>Attractants</label>
                  <div className="comp-details-edit-input">
                    <ValidationMultiSelect
                      className="comp-details-input"
                      options={attractantCodes}
                      placeholder="Select"
                      id="attractants-select-id"
                      classNamePrefix="comp-select"
                      onChange={handleAttractantsChange}
                      errMsg={""}
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
                      placeholder="Select"
                      id="violation-in-progress-select-id"
                      classNamePrefix="comp-select"
                      onChange={(e) => handleViolationInProgessChange(e)}
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
                      placeholder="Select"
                      id="violation-observed-select-id"
                      classNamePrefix="comp-select"
                      onChange={(e) => handleViolationObservedChange(e)}
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
                <label
                  id="complaint-location-label-id"
                  htmlFor="location-edit-id"
                >
                  Complaint Location
                </label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    id="location-edit-id"
                    className="comp-form-control"
                    onChange={(e) => handleLocationChange(e.target.value)}
                    maxLength={120}
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="location-description-pair-id"
              >
                <label>Location Description</label>
                <textarea
                  className="comp-form-control"
                  id="complaint-location-description-textarea-id"
                  rows={4}
                  onChange={(e) => handleLocationDescriptionChange(e.target.value)}
                  maxLength={4000}
                />
              </div>
              <CompInput
                id="comp-details-edit-x-coordinate-input"
                divid="comp-details-edit-x-coordinate-div"
                type="input"
                label="X Coordinate"
                containerClass="comp-details-edit-input"
                formClass="comp-details-label-input-pair comp-margin-top-30"
                inputClass="comp-form-control"
                error={geoPointXMsg}
                step="any"
                onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Longitude)}
              />
              <CompInput
                id="comp-details-edit-y-coordinate-input"
                divid="comp-details-edit-y-coordinate-div"
                type="input"
                label="Y Coordinate"
                containerClass="comp-details-edit-input"
                formClass="comp-details-label-input-pair comp-margin-top-30"
                inputClass="comp-form-control"
                error={geoPointYMsg}
                step="any"
                onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Latitude)}
              />
              <div
                className="comp-details-label-input-pair"
                id="area-community-pair-id"
              >
                <label>
                  Community<span className="required-ind">*</span>
                </label>
                <div className="comp-details-edit-input">
                  <ValidationSelect
                    className="comp-details-input"
                    options={areaCodes}
                    placeholder="Select"
                    id="community-select-id"
                    classNamePrefix="comp-select"
                    onChange={(e) => handleCommunityChange(e)}
                    errMsg={communityErrorMsg}
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
                    className="comp-form-control"
                    disabled
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="zone-pair-id"
              >
                <label>Zone</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    id="zone-edit-readonly-id"
                    className="comp-form-control"
                    disabled
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
                    className="comp-form-control"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        <ComplaintLocation
          parentCoordinates={{ lat: +latitude, lng: +longitude }}
          complaintType={complaintType}
          draggable={false}
          hideMarker={!latitude || !longitude || +latitude === 0 || +longitude === 0}
          editComponent={false}
        />
      }
      {/* edit caller info block */}
      <div className="comp-complaint-details-block">
        <h6>Caller Information</h6>
        <div className="comp-complaint-call-information">
          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div
                className="comp-details-label-input-pair"
                id="name-pair-id"
              >
                <label
                  id="complaint-caller-info-name-label-id"
                  className="col-auto"
                  htmlFor="caller-name-id"
                >
                  Name
                </label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="comp-form-control"
                    id="caller-name-id"
                    onChange={(e) => handleNameChange(e.target.value)}
                    maxLength={120}
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
                  htmlFor="caller-primary-phone-id"
                >
                  Primary Phone
                </label>
                <div className="comp-details-edit-input">
                  <ValidationPhoneInput
                    className="comp-details-input"
                    defaultValue=""
                    onChange={handlePrimaryPhoneChange}
                    maxLength={14}
                    international={false}
                    id="caller-primary-phone-id"
                    errMsg={primaryPhoneMsg}
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="secondary-phone-pair-id"
              >
                <label
                  id="complaint-caller-info-secondary-phone-label-id"
                  className="col-auto"
                  htmlFor="caller-info-secondary-phone-id"
                >
                  Alternate 1 Phone
                </label>
                <div className="comp-details-edit-input">
                  <ValidationPhoneInput
                    className="comp-details-input"
                    defaultValue=""
                    onChange={handleSecondaryPhoneChange}
                    maxLength={14}
                    international={false}
                    id="caller-info-secondary-phone-id"
                    errMsg={secondaryPhoneMsg}
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="alternate-phone-pair-id"
              >
                <label
                  id="complaint-caller-info-alternate-phone-label-id"
                  className="col-auto"
                  htmlFor="caller-info-alternate-phone-id"
                >
                  Alternate 2 Phone
                </label>
                <div className="comp-details-edit-input">
                  <ValidationPhoneInput
                    className="comp-details-input"
                    defaultValue=""
                    onChange={handleAlternatePhoneChange}
                    maxLength={14}
                    international={false}
                    id="caller-info-alternate-phone-id"
                    errMsg={alternatePhoneMsg}
                  />
                </div>
              </div>
            </div>
            <div className="comp-details-edit-column comp-details-right-column">
              <div
                className="comp-details-label-input-pair"
                id="address-pair-id"
              >
                <label htmlFor="complaint-address-id">Address</label>
                <div className="comp-details-edit-input">
                  <input
                    type="text"
                    className="comp-form-control"
                    id="complaint-address-id"
                    onChange={(e) => handleAddressChange(e.target.value)}
                    maxLength={120}
                  />
                </div>
              </div>

              <div
                className="comp-details-label-input-pair"
                id="email-pair-id"
              >
                <label htmlFor="complaint-email-id">Email</label>
                <div className="comp-details-edit-input">
                  <ValidationInput
                    type="text"
                    className="comp-form-control"
                    id="complaint-email-id"
                    onChange={handleEmailChange}
                    errMsg={emailMsg}
                    maxLength={120}
                  />
                </div>
              </div>
              <div
                className="comp-details-label-input-pair"
                id="reported-pair-id"
              >
                <label>Reported By</label>
                <div className="comp-details-edit-input">
                  <CompSelect
                    id="reported-select-id"
                    classNamePrefix="comp-select"
                    className="comp-details-edit-input"
                    options={reportedByCodes}
                    defaultOption={{ label: "None", value: undefined }}
                    placeholder="Select"
                    enableValidation={false}
                    onChange={(e) => handleReportedByChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {complaintType === COMPLAINT_TYPES.ERS && (
        <div className="comp-complaint-details-block">
          <h6>Subject of Complaint/Witness Details</h6>
          <div className="comp-complaint-call-information">
            <div className="comp-suspect-witness-edit-container">
              <div className="comp-details-edit-column comp-details-right-column">
                <div
                  className="comp-details-label-input-pair"
                  id="subject-of-complaint-pair-id"
                >
                  <label
                    id="complaint-witness-details-label-id"
                    className="col-auto"
                    htmlFor="complaint-witness-details-textarea-id"
                  >
                    Description
                  </label>
                  <textarea
                    className="comp-form-control"
                    id="complaint-witness-details-textarea-id"
                    rows={4}
                    onChange={(e) => handleSuspectDetailsChange(e.target.value)}
                    maxLength={4000}
                  />
                </div>
              </div>
              <div className="comp-details-edit-column" />
            </div>
          </div>
        </div>
      )}
      <div className="comp-complaint-details-block">
        <h6>Complainant attachments ({complaintAttachmentCount})</h6>
        <div className="comp-attachments">
          <AttachmentsCarousel
            attachmentType={AttachmentEnum.COMPLAINT_ATTACHMENT}
            allowUpload={true}
            allowDelete={true}
            onFilesSelected={onHandleAddAttachments}
            onFileDeleted={onHandleDeleteAttachment}
            onSlideCountChange={handleSlideCountChange}
          />
        </div>
      </div>
    </div>
  );
};
