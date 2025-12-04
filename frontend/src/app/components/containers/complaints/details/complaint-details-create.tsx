import { FC, useCallback, useEffect, useMemo, useState } from "react";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { CompSelect } from "@components/common/comp-select";
import { bcUtmZoneNumbers, formatLatLongCoordinate } from "@common/methods";
import { ValidationTextArea } from "@common/validation-textarea";
import Select from "react-select";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import { CompInput } from "@components/common/comp-input";
import { ValidationPhoneInput } from "@common/validation-phone-input";
import Option from "@apptypes/app/option";
import { Coordinates } from "@apptypes/app/coordinate-type";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { openModal, selectActiveTab, userId } from "@store/reducers/app";
import notificationInvalid from "@assets/images/notification-invalid.png";
import { CompCoordinateInput } from "@components/common/comp-coordinate-input";

import {
  selectAttractantCodeDropdown,
  selectCommunityCodeDropdown,
  selectComplaintReceivedMethodDropdown,
  selectCreatableComplaintTypeDropdown,
  selectGirTypeCodeDropdown,
  selectHwcrNatureOfComplaintCodeDropdown,
  selectPrivacyDropdown,
  selectReportedByDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
} from "@store/reducers/code-table";
import { selectOfficersByAgency } from "@store/reducers/officer";
import { AppUser, Delegate } from "@apptypes/app/app_user/app_user";
import { CreateComplaintHeader } from "./create-complaint-header";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { createComplaint, selectComplaintDetails, setComplaint } from "@store/reducers/complaints";
import { from } from "linq-to-typescript";
import { ToggleError } from "@common/toast";
import { useNavigate } from "react-router-dom";
import { AttachmentsCarousel } from "@components/common/attachments-carousel";
import { COMSObject } from "@apptypes/coms/object";
import { handleAddAttachments, handleDeleteAttachments, handlePersistAttachments } from "@common/attachment-utils";

import { WildlifeComplaint } from "@apptypes/app/complaints/wildlife-complaint";
import { AllegationComplaint } from "@apptypes/app/complaints/allegation-complaint";
import { GeneralIncidentComplaint } from "@apptypes/app/complaints/general-complaint";
import { Complaint } from "@apptypes/app/complaints/complaint";
import { UUID } from "node:crypto";
import { AttractantXref } from "@apptypes/app/complaints/attractant-xref";
import { ComplaintAlias } from "@apptypes/app/aliases";
import AttachmentEnum from "@constants/attachment-enum";
import UserService, { getUserAgency } from "@service/user-service";
import { useSelector } from "react-redux";
import { Roles } from "@/app/types/app/roles";
import { RootState } from "@/app/store/store";
import { ParkSelect } from "@/app/components/common/park-select";
import { isValidEmail } from "@/app/common/validate-email";
import { AgencyType } from "@/app/types/app/agency-types";
import { CompDateTimePicker } from "@/app/components/common/comp-date-time-picker";

export const CreateComplaint: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userid = useAppSelector(userId);
  const agency = getUserAgency();
  const officerList = useSelector((state: RootState) => selectOfficersByAgency(state, agency));
  const [assignableOfficers, setAssignableOfficers] = useState<Option[]>([]);
  const [assignedOfficer, setAssignedOfficer] = useState<Option | null>(null);
  const speciesCodes = useAppSelector(selectSpeciesCodeDropdown) as Option[];
  const hwcrNatureOfComplaintCodes = useAppSelector(selectHwcrNatureOfComplaintCodeDropdown) as Option[];
  const complaintTypeCodes = useAppSelector(selectCreatableComplaintTypeDropdown);
  const areaCodes = useAppSelector(selectCommunityCodeDropdown);
  const attractantCodes = useAppSelector(selectAttractantCodeDropdown) as Option[];
  const reportedByCodes = useAppSelector(selectReportedByDropdown) as Option[];
  const violationTypeCodes = useAppSelector(selectViolationCodeDropdown(agency)) as Option[];
  const generalIncidentTypeCodes = useAppSelector(selectGirTypeCodeDropdown) as Option[];
  const [complaintAttachmentCount, setComplaintAttachmentCount] = useState<number>(0);
  const activeTab = useAppSelector(selectActiveTab);

  const handleSlideCountChange = useCallback(
    (count: number) => {
      setComplaintAttachmentCount(count);
    },
    [setComplaintAttachmentCount],
  );

  //Only remove all options but HWCR for HWCR only
  let selectableComplaintTypeCodes = complaintTypeCodes;
  if (UserService.hasRole(Roles.HWCR_ONLY)) {
    selectableComplaintTypeCodes = complaintTypeCodes.filter(
      (complaintType) => complaintType.value === COMPLAINT_TYPES.HWCR,
    );
  }

  const yesNoOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const privacyDropdown = useAppSelector(selectPrivacyDropdown);
  const enablePrivacyFeature = agency && agency === AgencyType.CEEB;
  const enableOfficeFeature = agency && agency !== AgencyType.CEEB;

  const currentDate = useMemo(() => new Date(), []);

  const [complaintData, applyComplaintData] = useState<ComplaintAlias>();

  let initialComplaintType: string = COMPLAINT_TYPES.HWCR;
  if (agency === AgencyType.CEEB) {
    initialComplaintType = COMPLAINT_TYPES.ERS;
  } else if (agency === AgencyType.COS || agency === AgencyType.PARKS) {
    switch (activeTab) {
      case COMPLAINT_TYPES.ERS:
        initialComplaintType = COMPLAINT_TYPES.ERS;
        break;
      case COMPLAINT_TYPES.GIR:
        initialComplaintType = COMPLAINT_TYPES.GIR;
        break;
      default:
        initialComplaintType = COMPLAINT_TYPES.HWCR;
        break;
    }
  }

  const [complaintType, setComplaintType] = useState<string>(initialComplaintType);
  const [complaintTypeMsg, setComplaintTypeMsg] = useState<string>("");
  const [natureOfComplaintErrorMsg, setNatureOfComplaintErrorMsg] = useState<string>("");
  const [violationTypeErrorMsg, setViolationTypeErrorMsg] = useState<string>("");
  const [generalIncidentTypeErrorMsg, setGeneralIncidentTypeErrorMsg] = useState<string>("");
  const [speciesErrorMsg, setSpeciesErrorMsg] = useState<string>("");
  const [complaintDescriptionErrorMsg, setComplaintDescriptionErrorMsg] = useState<string>("");
  const [communityErrorMsg, setCommunityErrorMsg] = useState<string>("");
  const [coordinateErrorsInd, setCoordinateErrorsInd] = useState<boolean>(false);
  const [emailMsg, setEmailMsg] = useState<string>("");
  const [primaryPhoneMsg, setPrimaryPhoneMsg] = useState<string>("");
  const [secondaryPhoneMsg, setSecondaryPhoneMsg] = useState<string>("");
  const [alternatePhoneMsg, setAlternatePhoneMsg] = useState<string>("");
  const [selectedIncidentDateTime, setSelectedIncidentDateTime] = useState<Date>();
  const [incidentDateTimeErrorMsg, setIncidentDateTimeErrorMsg] = useState<string>("");
  const complaintMethodReceivedCodes = useSelector(selectComplaintReceivedMethodDropdown);
  const { complaintMethodReceivedCode } = useAppSelector((state) => selectComplaintDetails(state, complaintType));
  const selectedComplaintMethodReceivedCode = complaintMethodReceivedCodes.find(
    (option) => option.value === complaintMethodReceivedCode?.complaintMethodReceivedCode,
  );

  const [errorNotificationClass, setErrorNotificationClass] = useState("comp-complaint-error display-none");

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  // Initialize the assignableOfficers when the page first loads
  useEffect(() => {
    if (officerList) {
      const initialAssignableOfficers = officerList
        .filter(
          (officer: AppUser) => complaintType === COMPLAINT_TYPES.HWCR || !officer.user_roles.includes(Roles.HWCR_ONLY),
        ) // Filter out officers with the specified role
        .map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }));

      setAssignableOfficers(initialAssignableOfficers);
    }
  }, [officerList, complaintType]);

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
      const model = {
        id: "",
        webeocId: "",
        referenceNumber: "",
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
        ownedBy: agency,
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
        complaintMethodReceivedCode: "",
        isPrivacyRequested: "U",
        type: "",
      };

      applyComplaintData(model);
    }
  }, [agency, complaintData, currentDate, userid]);

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
    if (selected?.value && selected?.value !== "") {
      const { value } = selected;

      setComplaintTypeMsg("");
      setComplaintType(value);

      //-- remove all of the properties associated with a wildlife or allegation complaint
      const {
        ersId,
        hwcrId,
        girId,
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

      //-- clear the assigned officer (remove the ASSIGNEE delegate)
      const { delegates } = complaintData as Complaint;
      let updatedDelegates = delegates.filter(({ type }) => type !== "ASSIGNEE");

      const complaint = { ...complaintData, delegates: updatedDelegates } as Complaint;
      applyComplaintData(complaint);
      handleAssignedOfficerChange(null);
    } else {
      setComplaintTypeMsg("Required");
      setComplaintType("");
    }
  };

  const handleNatureOfComplaintChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setNatureOfComplaintErrorMsg("");
    } else {
      setNatureOfComplaintErrorMsg("Required");
    }

    const complaint = { ...complaintData, natureOfComplaint: value } as WildlifeComplaint;
    applyComplaintData(complaint);
  };

  const handleComplaintReceivedMethodChange = (selected: Option | null) => {
    let value = null;
    if (selected) {
      value = selected.value;
    }
    const complaint = { ...complaintData, complaintMethodReceivedCode: value } as Complaint;
    applyComplaintData(complaint);
  };

  const handleSpeciesChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setSpeciesErrorMsg("");
    } else {
      setSpeciesErrorMsg("Required");
    }

    const complaint = { ...complaintData, species: value } as WildlifeComplaint;
    applyComplaintData(complaint);
  };

  const handleViolationTypeChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setViolationTypeErrorMsg("");
    } else {
      setViolationTypeErrorMsg("Required");
    }

    const complaint = { ...complaintData, violation: value } as AllegationComplaint;
    applyComplaintData(complaint);
  };

  const handleGeneralIncidentTypeChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setGeneralIncidentTypeErrorMsg("");
    } else {
      setGeneralIncidentTypeErrorMsg("Required");
    }

    const complaint = { ...complaintData, girType: value } as GeneralIncidentComplaint;
    applyComplaintData(complaint);
  };

  const handleAssignedOfficerChange = (selected: Option | null) => {
    const { delegates } = complaintData as Complaint;
    if (selected) {
      const { value } = selected;

      let existing = delegates.filter(({ type }) => type !== "ASSIGNEE");
      let updatedDelegates: Array<Delegate> = [];

      if (value !== "Unassigned") {
        //-- get the new officer from state
        const officer = officerList?.find(({ app_user_guid: id }) => {
          return id === value;
        });

        if (!officer) return;

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
          appUserGuid: officer.app_user_guid as UUID,
        };

        updatedDelegates = [...updatedDelegates, ...existing, delegate];

        const complaint = { ...complaintData, delegates: updatedDelegates } as Complaint;
        applyComplaintData(complaint);
        setAssignedOfficer(selected);
      } else if (from(delegates).any() && from(delegates).any((item) => item.type === "ASSIGNEE")) {
        let delegate = delegates.find((item) => item.type === "ASSIGNEE");
        let updatedDelegate = { ...delegate, isActive: false } as Delegate;

        updatedDelegates = [updatedDelegate];

        const complaint = { ...complaintData, delegates: updatedDelegates } as Complaint;
        applyComplaintData(complaint);
        setAssignedOfficer(null);
      }
    } else {
      let updatedDelegates = delegates.filter(({ type }) => type !== "ASSIGNEE");
      const complaint = { ...complaintData, delegates: updatedDelegates } as Complaint;
      applyComplaintData(complaint);
      setAssignedOfficer(null);
    }
  };

  const handleComplaintDescriptionChange = (value: string) => {
    if (value === "") {
      setComplaintDescriptionErrorMsg("Required");
    } else {
      setComplaintDescriptionErrorMsg("");

      const complaint = { ...complaintData, details: value?.trim() } as Complaint;
      applyComplaintData(complaint);
    }
  };

  const handleLocationDescriptionChange = (value: string) => {
    const complaint = { ...complaintData, locationDetail: value?.trim() } as Complaint;
    applyComplaintData(complaint);
  };

  const handleParkChange = (value?: string) => {
    const updatedComplaint = { ...complaintData, parkGuid: value } as Complaint;
    applyComplaintData(updatedComplaint);
  };

  const handleViolationInProgessChange = (selected: Option | null) => {
    let value: string = "No";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
    }
    const complaint = { ...complaintData, isInProgress: value === "Yes" } as AllegationComplaint;
    applyComplaintData(complaint);
  };

  const handleViolationObservedChange = (selected: Option | null) => {
    let value: string = "No";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
    }
    const complaint = { ...complaintData, wasObserved: value === "Yes" } as AllegationComplaint;
    applyComplaintData(complaint);
  };

  const handlePrivacyRequestedChange = (selected: Option | null) => {
    let value: string = "U";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
    }
    const complaint = { ...complaintData, isPrivacyRequested: value } as Complaint;
    applyComplaintData(complaint);
  };

  const handleLocationChange = (value: string) => {
    const complaint = { ...complaintData, locationSummary: value?.trim() } as Complaint;
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
    const model = { ...complaintData, attractants: updates } as WildlifeComplaint;
    applyComplaintData(model);
  };

  const handleCommunityChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setCommunityErrorMsg("");
    } else {
      setCommunityErrorMsg("Required");
    }
    const { organization } = complaintData as Complaint;
    const update = { ...organization, area: value };

    const complaint = { ...complaintData, organization: update } as Complaint;
    applyComplaintData(complaint);
  };

  const syncCoordinates = (yCoordinate: string | undefined, xCoordinate: string | undefined) => {
    let coordinates: Array<number> = [0, 0];
    setLongitude(xCoordinate ?? "0");
    setLatitude(yCoordinate ?? "0");

    if (yCoordinate && xCoordinate && !Number.isNaN(yCoordinate) && !Number.isNaN(xCoordinate)) {
      coordinates[Coordinates.Longitude] = parseFloat(formatLatLongCoordinate(xCoordinate) ?? "");
      coordinates[Coordinates.Latitude] = parseFloat(formatLatLongCoordinate(yCoordinate) ?? "");
    }
    const complaint = { ...complaintData, location: { type: "Point", coordinates } } as Complaint;
    applyComplaintData(complaint);
  };

  const throwError = (hasError: boolean) => {
    setCoordinateErrorsInd(hasError);
  };

  const handleNameChange = (value: string) => {
    const complaint = { ...complaintData, name: value?.trim() } as Complaint;
    applyComplaintData(complaint);
  };

  const handleAddressChange = (value: string) => {
    const complaint = { ...complaintData, address: value?.trim() } as Complaint;
    applyComplaintData(complaint);
  };

  const handlePrimaryPhoneChange = (value: string) => {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setPrimaryPhoneMsg("Phone number must be 10 digits");
    } else if (value !== undefined && (value.startsWith("+11") || value.startsWith("+10"))) {
      setPrimaryPhoneMsg("Invalid Format");
    } else {
      setPrimaryPhoneMsg("");

      const complaint = { ...complaintData, phone1: value } as Complaint;
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

      const complaint = { ...complaintData, phone2: value } as Complaint;
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

      const complaint = { ...complaintData, phone3: value } as Complaint;
      applyComplaintData(complaint);
    }
  };

  const handleEmailChange = (value: string) => {
    if (value !== undefined && value !== "" && !isValidEmail(value)) {
      setEmailMsg("Please enter a vaild email");
    } else {
      setEmailMsg("");

      const complaint = { ...complaintData, email: value?.trim() } as Complaint;
      applyComplaintData(complaint);
    }
  };

  const handleReportedByChange = (selected: Option | null) => {
    let value = null;
    if (selected) {
      value = selected.value;
    }
    const complaint = { ...complaintData, reportedBy: value } as Complaint;
    applyComplaintData(complaint);
  };

  const handleSuspectDetailsChange = (value: string) => {
    const complaint = { ...complaintData, violationDetails: value?.trim() } as AllegationComplaint;
    applyComplaintData(complaint);
  };

  const handleIncidentDateTimeChange = (date: Date) => {
    const complaint = { ...complaintData, incidentDateTime: date } as Complaint;
    applyComplaintData(complaint);
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
          title: "Cancel changes?",
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
    } = complaintData as Complaint;

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
        const { violation } = complaintData as AllegationComplaint;

        if (!violation) {
          setViolationTypeErrorMsg("Required");
          result = true;
        }
        break;
      }
      case "GIR": {
        const { girType } = complaintData as GeneralIncidentComplaint;

        if (!girType) {
          setGeneralIncidentTypeErrorMsg("Required");
          result = true;
        }

        break;
      }
      case "HWCR":
      default: {
        const { species, natureOfComplaint } = complaintData as WildlifeComplaint;

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

    if (coordinateErrorsInd) {
      result = true;
    }

    if (incidentDateTimeErrorMsg !== "") {
      result = true;
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
      handlePersistAttachments({
        dispatch,
        attachmentsToAdd,
        attachmentsToDelete,
        complaintIdentifier: complaintId,
        setAttachmentsToAdd,
        setAttachmentsToDelete,
        attachmentType: AttachmentEnum.COMPLAINT_ATTACHMENT,
        complaintType,
      });
    }

    setErrorNotificationClass("comp-complaint-error display-none");
  };

  const handleHwcrComplaint = async (complaint: ComplaintAlias) => {
    const complaintId = await dispatch(createComplaint(complaintType, complaint));
    if (complaintId) {
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
      <CreateComplaintHeader
        complaintType={complaintType}
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Complaint details</h2>
        </div>

        {/* Error Alert */}
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

        <fieldset>
          {/* Complaint Type */}
          {(agency === "COS" || agency === "PARKS") && (
            <div
              className="comp-details-form-row"
              id="nature-of-complaint-pair-id"
            >
              <label
                id="nature-of-complaint-label-id"
                htmlFor="complaint-type-select-id"
              >
                Complaint type<span className="required-ind">*</span>
              </label>
              <div className="comp-details-edit-input">
                <CompSelect
                  id="complaint-type-select-id"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  onChange={(e) => handleComplaintChange(e)}
                  className="comp-details-input"
                  options={selectableComplaintTypeCodes}
                  defaultOption={selectableComplaintTypeCodes.find((option) => option.value === complaintType)}
                  placeholder="Select"
                  enableValidation={true}
                  errorMessage={complaintTypeMsg}
                  isClearable={true}
                />
              </div>
            </div>
          )}
          <div
            className="comp-details-form-row"
            id="officer-assigned-pair-id"
          >
            <label
              id="officer-assigned-select-label-id"
              htmlFor="officer-assigned-select-id"
            >
              Officer assigned
            </label>
            <div className="comp-details-edit-input">
              <CompSelect
                id="officer-assigned-select-id"
                showInactive={false}
                classNamePrefix="comp-select"
                onChange={(e) => handleAssignedOfficerChange(e)}
                className="comp-details-input"
                options={assignableOfficers}
                placeholder="Select"
                enableValidation={false}
                isClearable={true}
                value={assignedOfficer}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Call details</legend>

          {/* HWCR Species and Nature of Complaint */}
          {complaintType === COMPLAINT_TYPES.HWCR && (
            <>
              <div
                className="comp-details-form-row"
                id="species-pair-id"
              >
                <label id="species-label-id">
                  Species<span className="required-ind">*</span>
                </label>
                <div className="comp-details-edit-input">
                  <CompSelect
                    id="species-select-id"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    onChange={(e) => handleSpeciesChange(e)}
                    className="comp-details-input"
                    options={speciesCodes}
                    placeholder="Select"
                    enableValidation={true}
                    errorMessage={speciesErrorMsg}
                    isClearable={true}
                  />
                </div>
              </div>
              <div
                className="comp-details-form-row"
                id="nature-of-complaint-pair-id"
              >
                <label
                  id="nature-of-complaint-label-id"
                  htmlFor="nature-of-complaint-select-id"
                >
                  Nature of complaint<span className="required-ind">*</span>
                </label>
                <div className="comp-details-edit-input">
                  <CompSelect
                    id="nature-of-complaint-select-id"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    onChange={(e) => handleNatureOfComplaintChange(e)}
                    className="comp-details-input"
                    options={hwcrNatureOfComplaintCodes}
                    placeholder="Select"
                    enableValidation={true}
                    errorMessage={natureOfComplaintErrorMsg}
                    isClearable={true}
                  />
                </div>
              </div>
            </>
          )}

          {/* ERS Violation Type */}
          {complaintType === COMPLAINT_TYPES.ERS && (
            <div
              className="comp-details-form-row"
              id="violation-type-pair-id"
            >
              <label id="violation-label-id">
                Violation type<span className="required-ind">*</span>
              </label>
              <div className="comp-details-edit-input">
                <CompSelect
                  id="violation-type-select-id"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  onChange={(e) => handleViolationTypeChange(e)}
                  className="comp-details-input"
                  options={violationTypeCodes}
                  placeholder="Select"
                  enableValidation={true}
                  errorMessage={violationTypeErrorMsg}
                  isClearable={true}
                />
              </div>
            </div>
          )}

          {complaintType === COMPLAINT_TYPES.GIR && (
            <div
              className="comp-details-form-row"
              id="general-incident-type-type-pair-id"
            >
              <label
                id="general-incident-type-label-id"
                htmlFor="general-incident-type-type-select-id"
              >
                General incident type<span className="required-ind">*</span>
              </label>
              <div className="comp-details-edit-input">
                <CompSelect
                  id="general-incident-type-type-select-id"
                  classNamePrefix="comp-select"
                  onChange={(e) => handleGeneralIncidentTypeChange(e)}
                  className="comp-details-input"
                  options={generalIncidentTypeCodes}
                  placeholder="Select"
                  enableValidation={true}
                  errorMessage={generalIncidentTypeErrorMsg}
                  showInactive={false}
                  isClearable={true}
                />
              </div>
            </div>
          )}

          <div
            className="comp-details-form-row"
            id="complaint-description-pair-id"
          >
            <label
              id="complaint-description-edit-label-id"
              className="col-auto"
              htmlFor="complaint-description-textarea-id"
            >
              Complaint description<span className="required-ind">*</span>
            </label>
            <div className="comp-details-edit-input">
              <ValidationTextArea
                className="comp-form-control"
                id="complaint-description-textarea-id"
                rows={4}
                errMsg={complaintDescriptionErrorMsg}
                onChange={handleComplaintDescriptionChange}
              />
            </div>
          </div>

          <div
            className="comp-details-form-row"
            id="incident-time-pair-id"
          >
            <label htmlFor="complaint-incident-time">Incident date/time</label>
            <div className="comp-details-edit-input">
              <CompDateTimePicker
                value={selectedIncidentDateTime}
                onChange={handleIncidentDateTimeChange}
                maxDate={currentDate}
                onErrorChange={setIncidentDateTimeErrorMsg}
              />
            </div>
          </div>

          {complaintType === COMPLAINT_TYPES.HWCR && (
            <div
              className="comp-details-form-row"
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
                  isClearable={true}
                />
              </div>
            </div>
          )}
          {complaintType === COMPLAINT_TYPES.ERS && (
            <>
              <div
                className="comp-details-form-row"
                id="violation-in-progress-pair-id"
              >
                <label>Violation in progress</label>
                <div className="comp-details-edit-input">
                  <Select
                    options={yesNoOptions}
                    placeholder="Select"
                    id="violation-in-progress-select-id"
                    classNamePrefix="comp-select"
                    onChange={(e) => handleViolationInProgessChange(e)}
                    isClearable={true}
                  />
                </div>
              </div>
              <div
                className="comp-details-form-row"
                id="violation-observed-pair-id"
              >
                <label>Violation observed</label>
                <div className="comp-details-edit-input">
                  <Select
                    options={yesNoOptions}
                    placeholder="Select"
                    id="violation-observed-select-id"
                    classNamePrefix="comp-select"
                    onChange={(e) => handleViolationObservedChange(e)}
                    isClearable={true}
                  />
                </div>
              </div>
            </>
          )}
          <div
            className="comp-details-form-row"
            id="complaint-location-pair-id"
          >
            <label
              id="complaint-location-label-id"
              htmlFor="location-edit-id"
            >
              Location/address
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
            className="comp-details-form-row"
            id="location-description-pair-id"
          >
            <label>Location description</label>
            <div className="comp-details-edit-input">
              <textarea
                className="comp-form-control"
                id="complaint-location-description-textarea-id"
                rows={4}
                onChange={(e) => handleLocationDescriptionChange(e.target.value)}
                maxLength={4000}
              />
            </div>
          </div>
          <CompCoordinateInput
            id="create-complaint-coordinates"
            mode="complaint"
            utmZones={bcUtmZoneNumbers.map((zone: string) => {
              return { value: zone, label: zone } as Option;
            })}
            initXCoordinate={longitude}
            initYCoordinate={latitude}
            syncCoordinates={syncCoordinates}
            throwError={throwError}
            enableCopyCoordinates={false}
            validationRequired={false}
            sourceXCoordinate={longitude ?? "0"}
            sourceYCoordinate={latitude ?? "0"}
          />

          <div
            className="comp-details-form-row"
            id="park"
          >
            <label htmlFor="complaint-park">Park</label>
            <div className="comp-details-edit-input">
              <ParkSelect
                id="complaint-park"
                onChange={(e) => handleParkChange(e?.value)}
                isInEdit={true}
              />
            </div>
          </div>

          <div
            className="comp-details-form-row"
            id="area-community-pair-id"
          >
            <label>
              Community<span className="required-ind">*</span>
            </label>
            <div className="comp-details-edit-input">
              <CompSelect
                id="community-select-id"
                showInactive={false}
                classNamePrefix="comp-select"
                onChange={(e) => handleCommunityChange(e)}
                className="comp-details-input"
                options={areaCodes}
                placeholder="Select"
                enableValidation={true}
                errorMessage={communityErrorMsg}
                isClearable={true}
              />
            </div>
          </div>
          {enableOfficeFeature && (
            <div
              className="comp-details-form-row"
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
          )}
          <div
            className="comp-details-form-row"
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
            className="comp-details-form-row"
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
          <div
            className="comp-details-form-row"
            id="complaint-received-method-pair-id"
          >
            <label htmlFor="complaint-received-method-label-id">Method complaint was received</label>
            <div className="comp-details-edit-input">
              <CompSelect
                id="complaint-received-method-select-id"
                showInactive={false}
                classNamePrefix="comp-select"
                className="comp-details-input"
                defaultOption={selectedComplaintMethodReceivedCode}
                placeholder="Select"
                options={complaintMethodReceivedCodes}
                enableValidation={false}
                onChange={(e) => handleComplaintReceivedMethodChange(e)}
                isClearable={true}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Caller information</legend>
          {enablePrivacyFeature && (
            <div
              className="comp-details-form-row"
              id="privacy-requested-id"
            >
              <label
                id="complaint-caller-info-privacy-label-id"
                className="col-auto"
                htmlFor="caller-privacy-id"
              >
                Privacy requested
              </label>
              <div className="comp-details-edit-input">
                <Select
                  options={privacyDropdown}
                  placeholder="Select"
                  id="caller-privacy-id"
                  classNamePrefix="comp-select"
                  onChange={(e) => handlePrivacyRequestedChange(e)}
                  isClearable={true}
                />
              </div>
            </div>
          )}

          <div
            className="comp-details-form-row"
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
            className="comp-details-form-row"
            id="primary-phone-pair-id"
          >
            <label
              id="complaint-caller-info-primary-phone-label-id"
              htmlFor="caller-primary-phone-id"
            >
              Primary phone
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
            className="comp-details-form-row"
            id="secondary-phone-pair-id"
          >
            <label
              id="complaint-caller-info-secondary-phone-label-id"
              htmlFor="caller-info-secondary-phone-id"
            >
              Alternate phone 1
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
            className="comp-details-form-row"
            id="alternate-phone-pair-id"
          >
            <label
              id="complaint-caller-info-alternate-phone-label-id"
              htmlFor="caller-info-alternate-phone-id"
            >
              Alternate phone 2
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
          <div
            className="comp-details-form-row"
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
            className="comp-details-form-row"
            id="email-pair-id"
          >
            <label htmlFor="complaint-email-id">Email</label>
            <div className="comp-details-edit-input">
              <CompInput
                id="complaint-email-id"
                divid="complaint-email-id-value"
                type="input"
                inputClass="comp-form-control"
                error={emailMsg}
                maxLength={120}
                onChange={(evt: any) => handleEmailChange(evt.target.value)}
              />
            </div>
          </div>
          <div
            className="comp-details-form-row"
            id="reported-pair-id"
          >
            <label htmlFor="reported-select-id">Organization reporting the complaint</label>
            <div className="comp-details-edit-input">
              <CompSelect
                id="reported-select-id"
                showInactive={false}
                classNamePrefix="comp-select"
                className="comp-details-edit-input"
                options={reportedByCodes}
                defaultOption={{ label: "None", value: undefined }}
                placeholder="Select"
                enableValidation={false}
                onChange={(e) => handleReportedByChange(e)}
                isClearable={true}
              />
            </div>
          </div>
        </fieldset>

        {complaintType === COMPLAINT_TYPES.ERS && (
          <fieldset>
            <legend>Subject of complaint/witness details</legend>
            <div
              className="comp-details-form-row"
              id="subject-of-complaint-pair-id"
            >
              <label
                id="complaint-witness-details-label-id"
                htmlFor="complaint-witness-details-textarea-id"
              >
                Description
              </label>
              <div className="comp-details-edit-input">
                <textarea
                  className="comp-form-control"
                  id="complaint-witness-details-textarea-id"
                  rows={4}
                  onChange={(e) => handleSuspectDetailsChange(e.target.value)}
                  maxLength={4000}
                />
              </div>
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend>Complainant attachments ({complaintAttachmentCount})</legend>
          <AttachmentsCarousel
            attachmentType={AttachmentEnum.COMPLAINT_ATTACHMENT}
            allowUpload={true}
            allowDelete={true}
            onFilesSelected={onHandleAddAttachments}
            onFileDeleted={onHandleDeleteAttachment}
            onSlideCountChange={handleSlideCountChange}
          />
        </fieldset>
      </section>
    </div>
  );
};
