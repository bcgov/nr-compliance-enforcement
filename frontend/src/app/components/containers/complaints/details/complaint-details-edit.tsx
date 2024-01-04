import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { bcBoundaries, formatDate, formatTime } from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import {
  selectComplaintDetails,
  selectComplaintHeader,
  selectComplaintCallerInformation,
  selectComplaintSuspectWitnessDetails,
  selectComplaint,
  setComplaint,
  setGeocodedComplaintCoordinates,
  getAllegationComplaintByComplaintIdentifier,
  getWildlifeComplaintByComplaintIdentifier,
  updateComplaintById,
} from "../../../../store/reducers/complaints";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  selectComplaintStatusCodeDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
  selectHwcrNatureOfComplaintCodeDropdown,
  selectAttractantCodeDropdown,
  selectCommunityCodeDropdown,
  selectReportedByDropdown,
} from "../../../../store/reducers/code-table";
import { useSelector } from "react-redux";
import { Officer } from "../../../../types/person/person";
import Option from "../../../../types/app/option";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { ComplaintSuspectWitness } from "../../../../types/complaints/details/complaint-suspect-witness-details";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import { ComplaintLocation } from "./complaint-location";
import { ValidationSelect } from "../../../../common/validation-select";
import { HwcrComplaint } from "../../../../types/complaints/hwcr-complaint";
import { AllegationComplaint } from "../../../../types/complaints/allegation-complaint";
import { ValidationTextArea } from "../../../../common/validation-textarea";
import { ValidationMultiSelect } from "../../../../common/validation-multiselect";
import { ValidationInput } from "../../../../common/validation-input";
import { ValidationPhoneInput } from "../../../../common/validation-phone-input";
import notificationInvalid from "../../../../../assets/images/notification-invalid.png";
import { CompSelect } from "../../../common/comp-select";
import { CompInput } from "../../../common/comp-input";
import { from } from "linq-to-typescript";
import { openModal } from "../../../../store/reducers/app";
import { useParams } from "react-router-dom";
import { CANCEL_CONFIRM } from "../../../../types/modal/modal-types";
import { ToggleError } from "../../../../common/toast";
import { ToastContainer } from "react-toastify";
import { ComplaintHeader } from "./complaint-header";
import { CallDetails } from "./call-details";
import { CallerInformation } from "./caller-information";
import { SuspectWitnessDetails } from "./suspect-witness-details";
import { AttachmentsCarousel } from "../../../common/attachments-carousel";
import { COMSObject } from "../../../../types/coms/object";
import {
  handleAddAttachments,
  handleDeleteAttachments,
  handlePersistAttachments,
} from "../../../../common/attachment-utils";
import { Complaint as ComplaintDto } from "../../../../types/app/complaints/complaint";
import { WildlifeComplaint as WildlifeComplaintDto } from "../../../../types/app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "../../../../types/app/complaints/allegation-complaint";
import { UUID } from "crypto";
import { Delegate } from "../../../../types/app/people/delegate";
import { AttractantXref } from "../../../../types/app/complaints/attractant-xref";

type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetailsEdit: FC = () => {
  const dispatch = useAppDispatch();

  const { id = "", complaintType = "" } = useParams<ComplaintParams>();

  //-- selectors
  const complaint = useAppSelector(selectComplaint);

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
  } = useAppSelector(selectComplaintDetails(complaintType)) as ComplaintDetails;

  const {
    loggedDate,
    createdBy,
    lastUpdated,
    personGuid,
    statusCode,
    natureOfComplaintCode,
    speciesCode,
    violationTypeCode,
  } = useAppSelector(selectComplaintHeader(complaintType));

  const {
    name,
    primaryPhone,
    secondaryPhone,
    alternatePhone,
    address,
    email,
    reportedByCode,
    ownedByAgencyCode,
  } = useAppSelector(selectComplaintCallerInformation);

  // Get the code table lists to populate the Selects
  const complaintStatusCodes = useSelector(selectComplaintStatusCodeDropdown) as Option[];
  const speciesCodes = useSelector(selectSpeciesCodeDropdown) as Option[];
  const hwcrNatureOfComplaintCodes = useSelector(selectHwcrNatureOfComplaintCodeDropdown) as Option[];

  const areaCodes = useAppSelector(selectCommunityCodeDropdown);

  const attractantCodes = useSelector(selectAttractantCodeDropdown) as Option[];
  const reportedByCodes = useSelector(selectReportedByDropdown) as Option[];
  const violationTypeCodes = useSelector(selectViolationCodeDropdown) as Option[];

  
  const officersInAgencyList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency_code));
  const officerList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency_code));
  let assignableOfficers: Option[] =
    officersInAgencyList !== null
      ? officersInAgencyList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
      : [];


  assignableOfficers.unshift({value: "Unassigned", label: "None"});

  const { details: complaint_witness_details } = useAppSelector(
    selectComplaintSuspectWitnessDetails
  ) as ComplaintSuspectWitness;

  //-- state
  const [readOnly, setReadOnly] = useState(true);

  //-- complaint update object
  const [complaintUpdate, applyComplaintUpdate] = useState<
    ComplaintDto | AllegationComplaintDto | WildlifeComplaintDto
  >();

  // files to add to COMS when complaint is saved
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  // files to remove from COMS when complaint is saved
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [errorNotificationClass, setErrorNotificationClass] = useState("comp-complaint-error display-none");
  const [natureOfComplaintError, setNatureOfComplaintError] = useState<string>("");
  const [speciesError, setSpeciesError] = useState<string>("");
  const [statusError, setStatusError] = useState<string>("");
  const [complaintDescriptionError, setComplaintDescriptionError] = useState<string>("");
  const [attractantsErrorMsg, setAttractantsErrorMsg] = useState<string>("");
  const [communityError, setCommunityError] = useState<string>("");
  const [geoPointXMsg, setGeoPointXMsg] = useState<string>("");
  const [geoPointYMsg, setGeoPointYMsg] = useState<string>("");
  const [emailMsg, setEmailMsg] = useState<string>("");
  const [primaryPhoneMsg, setPrimaryPhoneMsg] = useState<string>("");
  const [secondaryPhoneMsg, setSecondaryPhoneMsg] = useState<string>("");
  const [alternatePhoneMsg, setAlternatePhoneMsg] = useState<string>("");
  const [selectedIncidentDateTime, setSelectedIncidentDateTime] = useState<Date>();
  const [latitude, setLatitude] = useState<string>("0");
  const [longitude, setLongitude] = useState<string>("0");

  //-- use effects
  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaint(null));
      dispatch(setGeocodedComplaintCoordinates(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!complaint || complaint.complaint_identifier.complaint_identifier !== id) {
      if (id) {
        switch (complaintType) {
          case COMPLAINT_TYPES.ERS:
            dispatch(getAllegationComplaintByComplaintIdentifier(id));
            break;
          case COMPLAINT_TYPES.HWCR:
            dispatch(getWildlifeComplaintByComplaintIdentifier(id));
            break;
        }
      }
    }
  }, [id, complaintType, complaint, dispatch]);

  useEffect(() => {
    const incidentDateTimeObject = incidentDateTime ? new Date(incidentDateTime) : null;
    if (incidentDateTimeObject) {
      setSelectedIncidentDateTime(incidentDateTimeObject);
    }
  }, [incidentDateTime]);

  useEffect(() => {
    setLongitude(getEditableCoordinates(coordinates, Coordinates.Longitude));
    setLatitude(getEditableCoordinates(coordinates, Coordinates.Latitude));
  }, [coordinates]);

  //-- events
  const editButtonClick = () => {
    setReadOnly(false);

    //-- create the complaint update object
    createUpdateComplaintModel(complaintType);

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const saveButtonClick = async () => {
    if (!complaintUpdate) {
      return;
    }
    if (hasValidationErrors()) {
      debugger;
      await dispatch(updateComplaintById(complaintUpdate, complaintType));

      if (complaintType === COMPLAINT_TYPES.HWCR) {
        dispatch(getWildlifeComplaintByComplaintIdentifier(id));
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        dispatch(getAllegationComplaintByComplaintIdentifier(id));
      }
      setErrorNotificationClass("comp-complaint-error display-none");
      setReadOnly(true);

      handlePersistAttachments(
        dispatch,
        attachmentsToAdd,
        attachmentsToDelete,
        id,
        setAttachmentsToAdd,
        setAttachmentsToDelete
      );
    } else {
      ToggleError("Errors in form");
      setErrorNotificationClass("comp-complaint-error");
    }
  };

  const resetErrorMessages = () => {
    setReadOnly(true);
    setErrorNotificationClass("comp-complaint-error display-none");
    setNatureOfComplaintError("");
    setSpeciesError("");
    setStatusError("");
    setComplaintDescriptionError("");

    setAttractantsErrorMsg("");
    setCommunityError("");
    setGeoPointXMsg("");
    setGeoPointYMsg("");
    setEmailMsg("");
    setPrimaryPhoneMsg("");
    setSecondaryPhoneMsg("");
    setAlternatePhoneMsg("");
    setAttachmentsToAdd(null);
    setAttachmentsToDelete(null);
  };

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: resetErrorMessages,
        },
      })
    );
  };

  //-- this needs to be updated once the complaint findByComplaintId endpoint is updated
  const createUpdateComplaintModel = (complaintType: string) => {
    const { complaint_identifier: root } = complaint as HwcrComplaint | AllegationComplaint;

    const {
      complaint_identifier: id,
      detail_text: details,
      caller_name: name,
      caller_address: address,
      caller_email: email,
      caller_phone_1: phone1,
      caller_phone_2: phone2,
      caller_phone_3: phone3,
      location_geometry_point: location,
      location_summary_text: locationSummary,
      location_detailed_text: locationDetail,
      complaint_status_code: { complaint_status_code: status },
      reported_by_code,
      owned_by_agency_code: { agency_code: ownedBy },
      reported_by_other_text: reportedByOther,
      incident_utc_datetime: incidentDateTime,
      incident_reported_utc_timestmp: reportedOn,
      update_utc_timestamp: updatedOn,
      cos_geo_org_unit: { area_code: area, region_code: region, zone_code: zone },
      person_complaint_xref,
    } = root;

    let model: ComplaintDto = {
      id,
      details,
      name,
      address,
      email,
      phone1,
      phone2,
      phone3,
      location,
      locationSummary,
      locationDetail,
      status,
      ownedBy,
      reportedByOther,
      incidentDateTime: new Date(incidentDateTime ?? new Date()),
      reportedOn: new Date(reportedOn ?? new Date()),
      updatedOn: new Date(updatedOn ?? new Date()),
      organization: { area, region, zone },
      delegates: [],
    };

    if (reported_by_code) {
      const { reported_by_code: reportedBy } = reported_by_code;

      model = { ...model, reportedBy };
    }

    if (from(person_complaint_xref).any()) {
      const delegates = person_complaint_xref.filter((item) => item.personComplaintXrefGuid !== undefined);
      const result = delegates.map((item) => {
        const {
          personComplaintXrefGuid,
          active_ind,
          person_guid: { person_guid: id, first_name, middle_name_1, middle_name_2, last_name },
        } = item;
        const record: Delegate = {
          xrefId: personComplaintXrefGuid as UUID,
          isActive: active_ind || false,
          type: "ASSIGNEE",
          person: {
            id: id as UUID,
            firstName: first_name,
            middleName1: middle_name_1,
            middleName2: middle_name_2,
            lastName: last_name,
          },
        };

        return record;
      });

      model = { ...model, delegates: result };
    }

    switch (complaintType) {
      case "ERS": {
        const {
          violation_code: { violation_code: violation },
          in_progress_ind: isInProgress,
          observed_ind: wasObserved,
          suspect_witnesss_dtl_text: violationDetails,
          allegation_complaint_guid: ersId,
        } = complaint as AllegationComplaint;

        model = { ...model, ersId, violation, isInProgress, wasObserved, violationDetails } as AllegationComplaintDto;
        break;
      }
      case "HWCR":
      default: {
        const {
          hwcr_complaint_guid: hwcrId,
          species_code: { species_code: species },
          hwcr_complaint_nature_code: { hwcr_complaint_nature_code: natureOfComplaint },
          other_attractants_text: otherAttractants,
          attractant_hwcr_xref,
        } = complaint as HwcrComplaint;

        let attractants: Array<AttractantXref> = [];

        if (from(attractant_hwcr_xref).any()) {
          attractants = attractant_hwcr_xref.map((item) => {
            const { attractant_hwcr_xref_guid } = item;
            const attractant = item.attractant_code ? item.attractant_code.attractant_code : "";

            const record: AttractantXref = {
              xrefId: attractant_hwcr_xref_guid as UUID,
              attractant,
              isActive: true,
            };

            return record;
          });
        }

        model = { ...model, hwcrId, species, natureOfComplaint, otherAttractants, attractants } as WildlifeComplaintDto;

        break;
      }
    }

    applyComplaintUpdate(model);
  };

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  const hasValidationErrors = () => {
    let noErrors = false;
    if (
      natureOfComplaintError === "" &&
      speciesError === "" &&
      statusError === "" &&
      complaintDescriptionError === "" &&
      attractantsErrorMsg === "" &&
      communityError === "" &&
      geoPointXMsg === "" &&
      geoPointYMsg === "" &&
      emailMsg === "" &&
      primaryPhoneMsg === "" &&
      secondaryPhoneMsg === "" &&
      alternatePhoneMsg === ""
    ) {
      noErrors = true;
    }
    return noErrors;
  }


  const yesNoOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // Used to set selected values in the dropdowns
  const selectedStatus = complaintStatusCodes.find((option) => option.value === statusCode);
  const selectedSpecies = speciesCodes.find((option) => option.value === speciesCode);
  const selectedNatureOfComplaint = hwcrNatureOfComplaintCodes.find((option) => option.value === natureOfComplaintCode);
  const selectedAreaCode = areaCodes.find((option) => option.label === area);
  const selectedReportedByCode = reportedByCodes.find(
    (option) =>
      option.value ===
      (reportedByCode?.reported_by_code)
  );

  const hasAssignedOfficer = (): boolean => {
    const { delegates } = complaintUpdate as ComplaintDto;

    return from(delegates).any(({ type, isActive }) => type === "ASSIGNEE" && isActive);
  };

  const getSelectedOfficer = (officers: Option[], personGuid: UUID, update: ComplaintDto | undefined): any => {
    if (update && personGuid) {
      const { delegates } = update;

      const assignees = delegates.filter((item) => item.type === "ASSIGNEE" && item.isActive);
      if (!from(assignees).any()) {
        return undefined;
      }

      const selected = officers.find(({ value }) => {
        const first = from(assignees).firstOrDefault();
        if (first) {
          const {
            person: { id },
          } = first;
          return value === id;
        }

        return false;
      });

      return selected;
    }

    return undefined;
  };
  const selectedAssignedOfficer = getSelectedOfficer(assignableOfficers, personGuid, complaintUpdate);

  const selectedAttractants = attractantCodes.filter(
    (option) => attractants?.some((attractant) => attractant.code === option.value)
  );
  const selectedViolationTypeCode = violationTypeCodes.find((option) => option.value === violationTypeCode);
  const selectedViolationInProgress = yesNoOptions.find(
    (option) => option.value === (violationInProgress ? "Yes" : "No")
  );
  const selectedViolationObserved = yesNoOptions.find((option) => option.value === (violationObserved ? "Yes" : "No"));

  const getEditableCoordinates = (input: Array<number> | Array<string> | undefined, type: Coordinates): string => {
    if (!input) {
      return "";
    }

    let result = type === Coordinates.Longitude ? input[0] : input[1];
    return result === 0 || result === "0" ? "" : result.toString();
  };

  const handleMarkerMove = async (lat: number, lng: number) => {
    await updateCoordinates(lat, lng);
    await updateValidation(lat, lng);
  };

  const updateCoordinates = async (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  const updateValidation = async (lat: number, lng: number) => {
    handleGeoPointChange(lat.toString(), lng.toString());
  };

  //-- wildlife complaint updates
  const handleNatureOfComplaintChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;
      if (!value) {
        setNatureOfComplaintError("Required");
      } else {
        setNatureOfComplaintError("");

        let updatedComplaint = { ...complaintUpdate, natureOfComplaint: value } as WildlifeComplaintDto;
        applyComplaintUpdate(updatedComplaint);
      }
    }
  };

  const handleSpeciesChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;
      if (!value) {
        setSpeciesError("Required");
      } else {
        setSpeciesError("");

        let updatedComplaint = { ...complaintUpdate, species: value } as WildlifeComplaintDto;
        applyComplaintUpdate(updatedComplaint);
      }
    }
  };

  const handleStatusChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;
      if (!value) {
        setStatusError("Required");
      } else {
        setStatusError("");

        let updatedComplaint = { ...complaintUpdate, status: value } as WildlifeComplaintDto;
        applyComplaintUpdate(updatedComplaint);
      }
    }
  };

  //-- allegation complaint updates
  const handleViolationTypeChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;
      if (value) {
        let updatedComplaint = { ...complaintUpdate, violation: value } as AllegationComplaintDto;
        applyComplaintUpdate(updatedComplaint);
      }
    }
  };

  const handleViolationInProgessChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      const isInProgress = value?.toUpperCase() === "YES";
      let updatedComplaint = { ...complaintUpdate, isInProgress } as AllegationComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const handleViolationObservedChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      const wasObserved = value?.toUpperCase() === "YES";
      let updatedComplaint = { ...complaintUpdate, wasObserved } as AllegationComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const handleSuspectDetailsChange = (value: string) => {
    let updatedComplaint = { ...complaintUpdate, violationDetails: value } as AllegationComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handleAssignedOfficerChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      let { delegates } = complaintUpdate as ComplaintDto;
      let existing = delegates.filter(({ type }) => type !== "ASSIGNEE");
      let updatedDelegates: Array<Delegate> = [];

      //-- if the selected officer is not unassigned add the officer to the delegates collection
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

        let updatedComplaint = { ...complaintUpdate, delegates: updatedDelegates } as ComplaintDto;
        applyComplaintUpdate(updatedComplaint);
      } else if (from(delegates).any() && from(delegates).any((item) => item.type === "ASSIGNEE")) {
        let delegate = delegates.find((item) => item.type === "ASSIGNEE");
        let updatedDelegate = { ...delegate, isActive: false } as Delegate;

        updatedDelegates = [updatedDelegate];

        let updatedComplaint = { ...complaintUpdate, delegates: updatedDelegates } as ComplaintDto;
        applyComplaintUpdate(updatedComplaint);
      }
    }
  };

  const handleComplaintDescChange = (value: string) => {
    if (value === "") {
      setComplaintDescriptionError("Required");
    } else {
      setComplaintDescriptionError("");

      const updatedComplaint = { ...complaintUpdate, details: value } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const handleIncidentDateTimeChange = (date: Date) => {
    setSelectedIncidentDateTime(date);

    const updatedComplaint = { ...complaintUpdate, incidentDateTime: date } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handleAttractantsChange = async (options: Option[] | null) => {
    if (!options) {
      return;
    }

    const { attractants } = complaintUpdate as WildlifeComplaintDto;
    let updates: Array<AttractantXref> = [];

    console.log(options);

    //-- handle existing attractants
    console.log("updated list: ", updates);

    attractants.forEach((item) => {
      const { attractant, isActive, xrefId } = item;

      console.log(`xref: ${xrefId} ${attractant}: ${isActive}`);
      if (from(options).any(({ value: selected }) => selected === attractant)) {
        console.log("activate attractant");
        updates.push({ xrefId, attractant, isActive: true });
      } else {
        updates.push({ xrefId, attractant, isActive: false });
      }
    });

    options.forEach(({ value: selected }) => {
      if (!from(attractants).any(({ attractant }) => attractant === selected)) {
        console.log(`add new attractant: ${selected}`);
        const _item: AttractantXref = { attractant: selected as string, isActive: true };

        updates.push(_item);
      }
    });

    const model = { ...complaintUpdate, attractants: updates } as WildlifeComplaintDto;
    applyComplaintUpdate(model);
  };

  const handleLocationChange = (value: string) => {
    const updatedComplaint = { ...complaintUpdate, locationSummary: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handleLocationDescriptionChange = (value: string) => {
    const updatedComplaint = { ...complaintUpdate, locationDetail: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
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

  const handleGeoPointChange = (latitude: string, longitude: string) => {
    //-- clear errors
    setGeoPointXMsg("");
    setGeoPointYMsg("");

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

    if (latitude && longitude && !Number.isNaN(latitude) && !Number.isNaN(longitude)) {
      const location = { type: "point", coordinates: [parseFloat(longitude), parseFloat(latitude)] };

      const updatedComplaint = { ...complaintUpdate, location } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    } else if (latitude === "" && longitude === "") {
      const location = { type: "point", coordinates: [0, 0] };

      const updatedComplaint = { ...complaintUpdate, location } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const handleCommunityChange = (selectedOption: Option | null) => {
    if (!selectedOption) {
      return;
    }

    if (selectedOption.value === "") {
      setCommunityError("Required");
    } else {
      setCommunityError("");

      const { value } = selectedOption;
      if (value) {
        const { organization } = complaintUpdate as ComplaintDto;
        const updatedOrganization = { ...organization, area: value };

        const updatedComplaint = { ...complaintUpdate, organization: updatedOrganization } as ComplaintDto;
        applyComplaintUpdate(updatedComplaint);
      }
    }
  };

  const handleNameChange = (value: string) => {
    const updatedComplaint = { ...complaintUpdate, name: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handlePrimaryPhoneChange = (value: string) => {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setPrimaryPhoneMsg("Phone number must be 10 digits");
    } else if (value !== undefined && (value.startsWith("+11") || value.startsWith("+10"))) {
      setPrimaryPhoneMsg("Invalid Format");
    } else {
      setPrimaryPhoneMsg("");

      const updatedComplaint = { ...complaintUpdate, phone1: value ?? "" } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const handleSecondaryPhoneChange = (value: string) => {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setSecondaryPhoneMsg("Phone number must be 10 digits");
    } else if (value !== undefined && (value.startsWith("+11") || value.startsWith("+10"))) {
      setSecondaryPhoneMsg("Invalid Format");
    } else {
      setSecondaryPhoneMsg("");

      const updatedComplaint = { ...complaintUpdate, phone2: value ?? "" } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const handleAlternatePhoneChange = (value: string) => {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setAlternatePhoneMsg("Phone number must be 10 digits");
    } else if (value !== undefined && (value.startsWith("+11") || value.startsWith("+10"))) {
      setAlternatePhoneMsg("Invalid Format");
    } else {
      setAlternatePhoneMsg("");

      const updatedComplaint = { ...complaintUpdate, phone3: value ?? "" } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const handleAddressChange = (value: string) => {
    const updatedComplaint = { ...complaintUpdate, address: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  function handleEmailChange(value: string) {
    let re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (value !== undefined && value !== "" && !re.test(value)) {
      setEmailMsg("Please enter a vaild email");
    } else {
      setEmailMsg("");

      const updatedComplaint = { ...complaintUpdate, email: value } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  }

  const handleReportedByChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      const updatedComplaint = { ...complaintUpdate, reportedBy: value } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const maxDate = new Date();

  return (
    <div className="comp-complaint-details">
      <ToastContainer />
      <ComplaintHeader
        id={id}
        complaintType={complaintType}
        readOnly={readOnly}
        editButtonClick={editButtonClick}
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
      />
      {readOnly && <CallDetails complaintType={complaintType} />}
      {readOnly && <CallerInformation />}
      {readOnly && complaintType === COMPLAINT_TYPES.ERS && <SuspectWitnessDetails />}
      {!readOnly && (
        <>
          {/* edit header block */}
          <div id="complaint-error-notification" className={errorNotificationClass}>
            <img src={notificationInvalid} alt="error" className="filter-image-spacing" />
            {/*
             */}
            Errors in form
          </div>
          <div className="comp-complaint-header-edit-block">
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                {complaintType === COMPLAINT_TYPES.HWCR && (
                  <div className="comp-details-label-input-pair" id="nature-of-complaint-pair-id">
                    <label id="nature-of-complaint-label-id">
                      Nature of Complaint<span className="required-ind">*</span>
                    </label>
                    <ValidationSelect
                      id="nature-of-complaint-select-id"
                      options={hwcrNatureOfComplaintCodes}
                      placeholder="Select"
                      className="comp-details-input"
                      classNamePrefix="comp-select"
                      defaultValue={selectedNatureOfComplaint}
                      onChange={(e) => handleNatureOfComplaintChange(e)}
                      errMsg={natureOfComplaintError}
                    />
                  </div>
                )}
                {complaintType === COMPLAINT_TYPES.HWCR && (
                  <div className="comp-details-label-input-pair" id="species-pair-id">
                    <label id="species-label-id">
                      Species<span className="required-ind">*</span>
                    </label>
                    <ValidationSelect
                      className="comp-details-input"
                      options={speciesCodes}
                      defaultValue={selectedSpecies}
                      placeholder="Select"
                      id="species-select-id"
                      classNamePrefix="comp-select"
                      onChange={(e) => handleSpeciesChange(e)}
                      errMsg={speciesError}
                    />
                  </div>
                )}
                {complaintType === COMPLAINT_TYPES.ERS && (
                  <div className="comp-details-label-input-pair" id="violation-type-pair-id">
                    <label id="violation-label-id">
                      Violation Type<span className="required-ind">*</span>
                    </label>
                    <Select
                      className="comp-details-input"
                      options={violationTypeCodes}
                      defaultValue={selectedViolationTypeCode}
                      placeholder="Select"
                      id="violation-type-select-id"
                      onChange={(e) => handleViolationTypeChange(e)}
                      classNamePrefix="comp-select"
                    />
                  </div>
                )}
                <div className="comp-details-label-input-pair" id="status-pair-id">
                  <label id="status-label-id">
                    Status<span className="required-ind">*</span>
                  </label>
                  <ValidationSelect
                    className="comp-details-input"
                    options={complaintStatusCodes}
                    defaultValue={selectedStatus}
                    placeholder="Select"
                    id="status-select-id"
                    classNamePrefix="comp-select"
                    onChange={(e) => handleStatusChange(e)}
                    errMsg={statusError}
                  />
                </div>
                <div className="comp-details-label-input-pair" id="officer-assigned-pair-id">
                  <label id="officer-assigned-select-label-id">Officer Assigned</label>
                  <CompSelect
                    id="officer-assigned-select-id"
                    classNamePrefix="comp-select"
                    onChange={(e) => handleAssignedOfficerChange(e)}
                    className="comp-details-input"
                    options={assignableOfficers}
                    placeholder="Select"
                    enableValidation={false}
                    value={hasAssignedOfficer() ? selectedAssignedOfficer : { value: "Unassigned", label: "None" }}
                  />
                </div>
              </div>
              <div className="comp-details-edit-column comp-details-right-column">
                <div className="comp-details-label-input-pair" id="date-time-pair-id">
                  <label id="date-time-logged-label-id">Date / Time Logged</label>
                  <div className="comp-details-input">
                    <i className="bi bi-calendar comp-margin-right-xs"></i>
                    {formatDate(loggedDate)}
                    <i className="bi bi-clock comp-margin-left-xs comp-margin-right-xs"></i>
                    {formatTime(loggedDate)}
                  </div>
                </div>
                <div className="comp-details-label-input-pair" id="last-updated-pair-id">
                  <label id="last-updated-label-id">Last Updated</label>
                  <div className="comp-details-input">
                    <i className="bi bi-calendar comp-margin-right-xs"></i>
                    {formatDate(lastUpdated)}
                    <i className="bi bi-clock comp-margin-left-xs comp-margin-right-xs"></i>
                    {formatTime(lastUpdated)}
                  </div>
                </div>
                <div className="comp-details-label-input-pair" id="created-by-pair-id">
                  <label id="created-by-label-id">Created By</label>
                  <div className="comp-padding-left-xs comp-padding-top-xs">{createdBy}</div>
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
                  <div className="comp-details-label-input-pair" id="complaint-description-pair-id">
                    <label id="complaint-description-edit-label-id" className="col-auto">
                      Complaint Description
                      <span className="required-ind">*</span>
                    </label>
                    <ValidationTextArea
                      className="comp-form-control"
                      id="complaint-description-textarea-id"
                      defaultValue={details !== undefined ? details : ""}
                      rows={4}
                      errMsg={complaintDescriptionError}
                      onChange={handleComplaintDescChange}
                      maxLength={4000}
                    />
                  </div>
                  <div className="comp-details-label-input-pair comp-margin-top-30" id="incident-time-pair-id">
                    <label>Incident Time</label>
                    <DatePicker
                      id="complaint-incident-time"
                      showIcon
                      timeInputLabel="Time:"
                      onChange={handleIncidentDateTimeChange}
                      selected={selectedIncidentDateTime}
                      showTimeInput
                      dateFormat="yyyy-MM-dd HH:mm"
                      timeFormat="HH:mm"
                      wrapperClassName="comp-details-edit-calendar-input"
                      maxDate={maxDate}
                    />
                  </div>
                  {complaintType === COMPLAINT_TYPES.HWCR && (
                    <div className="comp-details-label-input-pair" id="attractants-pair-id">
                      <label>Attractants</label>
                      <div className="comp-details-edit-input">
                        <ValidationMultiSelect
                          className="comp-details-input"
                          options={attractantCodes}
                          defaultValue={selectedAttractants}
                          placeholder="Select"
                          id="attractants-select-id"
                          classNamePrefix="comp-select"
                          onChange={handleAttractantsChange}
                          errMsg={attractantsErrorMsg}
                        />
                      </div>
                    </div>
                  )}
                  {complaintType === COMPLAINT_TYPES.ERS && (
                    <div className="comp-details-label-input-pair" id="violation-in-progress-pair-id">
                      <label>Violation in Progress</label>
                      <div className="comp-details-edit-input">
                        <Select
                          options={yesNoOptions}
                          defaultValue={selectedViolationInProgress}
                          placeholder="Select"
                          id="violation-in-progress-select-id"
                          classNamePrefix="comp-select"
                          onChange={(e) => handleViolationInProgessChange(e)}
                        />
                      </div>
                    </div>
                  )}
                  {complaintType === COMPLAINT_TYPES.ERS && (
                    <div className="comp-details-label-input-pair" id="violation-observed-pair-id">
                      <label>Violation Observed</label>
                      <div className="comp-details-edit-input">
                        <Select
                          options={yesNoOptions}
                          defaultValue={selectedViolationObserved}
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
                  <div className="comp-details-label-input-pair" id="complaint-location-pair-id">
                    <label id="complaint-location-label-id">Complaint Location</label>
                    <div className="comp-details-edit-input">
                      <input
                        type="text"
                        id="location-edit-id"
                        className="comp-form-control"
                        defaultValue={location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        maxLength={120}
                      />
                    </div>
                  </div>
                  <div className="comp-details-label-input-pair" id="location-description-pair-id">
                    <label>Location Description</label>
                    <textarea
                      className="comp-form-control"
                      id="complaint-location-description-textarea-id"
                      defaultValue={locationDescription}
                      rows={4}
                      onChange={(e) => handleLocationDescriptionChange(e.target.value)}
                      maxLength={4000}
                    />
                  </div>
                  <CompInput
                    id="comp-details-edit-x-coordinate-input"
                    divId="comp-details-edit-x-coordinate-input-div"
                    type="input"
                    label="X Coordinate"
                    containerClass="comp-details-edit-input"
                    formClass="comp-details-label-input-pair comp-margin-top-30"
                    inputClass="comp-form-control"
                    value={longitude}
                    error={geoPointXMsg}
                    step="any"
                    onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Longitude)}
                  />
                  <CompInput
                    id="comp-details-edit-y-coordinate-input"
                    divId="comp-details-edit-y-coordinate-input-div"
                    type="input"
                    label="Y Coordinate"
                    containerClass="comp-details-edit-input"
                    formClass="comp-details-label-input-pair"
                    inputClass="comp-form-control"
                    value={latitude}
                    error={geoPointYMsg}
                    step="any"
                    onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Latitude)}
                  />
                  <div className="comp-details-label-input-pair" id="area-community-pair-id">
                    <label>
                      Community<span className="required-ind">*</span>
                    </label>
                    <div className="comp-details-edit-input">
                      <ValidationSelect
                        className="comp-details-input"
                        options={areaCodes}
                        defaultValue={selectedAreaCode}
                        placeholder="Select"
                        id="community-select-id"
                        classNamePrefix="comp-select"
                        onChange={(e) => handleCommunityChange(e)}
                        errMsg={communityError}
                      />
                    </div>
                  </div>
                  <div className="comp-details-label-input-pair" id="office-pair-id">
                    <label>Office</label>
                    <div className="comp-details-edit-input">
                      <input
                        type="text"
                        id="office-edit-readonly-id"
                        className="comp-form-control"
                        disabled
                        defaultValue={office}
                      />
                    </div>
                  </div>
                  <div className="comp-details-label-input-pair" id="zone-pair-id">
                    <label>Zone</label>
                    <div className="comp-details-edit-input">
                      <input
                        type="text"
                        id="zone-edit-readonly-id"
                        className="comp-form-control"
                        disabled
                        defaultValue={zone}
                      />
                    </div>
                  </div>
                  <div className="comp-details-label-input-pair" id="region-pair-id">
                    <label>Region</label>
                    <div className="comp-details-edit-input">
                      <input
                        type="text"
                        id="region-edit-readonly-id"
                        className="comp-form-control"
                        disabled
                        defaultValue={region}
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
                    <label id="complaint-caller-info-name-label-id" className="col-auto">
                      Name
                    </label>
                    <div className="comp-details-edit-input">
                      <input
                        type="text"
                        className="comp-form-control"
                        defaultValue={name}
                        id="caller-name-id"
                        onChange={(e) => handleNameChange(e.target.value)}
                        maxLength={120}
                      />
                    </div>
                  </div>
                  <div className="comp-details-label-input-pair" id="primary-phone-pair-id">
                    <label id="complaint-caller-info-primary-phone-label-id" className="col-auto">
                      Primary Phone
                    </label>
                    <div className="comp-details-edit-input">
                      <ValidationPhoneInput
                        className="comp-details-input"
                        defaultValue={primaryPhone}
                        onChange={handlePrimaryPhoneChange}
                        maxLength={14}
                        international={false}
                        id="caller-primary-phone-id"
                        errMsg={primaryPhoneMsg}
                      />
                    </div>
                  </div>
                  <div className="comp-details-label-input-pair" id="secondary-phone-pair-id">
                    <label id="complaint-caller-info-secondary-phone-label-id" className="col-auto">
                      Alternate 1 Phone
                    </label>
                    <div className="comp-details-edit-input">
                      <ValidationPhoneInput
                        className="comp-details-input"
                        defaultValue={secondaryPhone}
                        onChange={handleSecondaryPhoneChange}
                        maxLength={14}
                        international={false}
                        id="caller-info-secondary-phone-id"
                        errMsg={secondaryPhoneMsg}
                      />
                    </div>
                  </div>
                  <div className="comp-details-label-input-pair" id="alternate-phone-pair-id">
                    <label id="complaint-caller-info-alternate-phone-label-id" className="col-auto">
                      Alternate 2 Phone
                    </label>
                    <div className="comp-details-edit-input">
                      <ValidationPhoneInput
                        className="comp-details-input"
                        defaultValue={alternatePhone}
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
                  <div className="comp-details-label-input-pair" id="address-pair-id">
                    <label>Address</label>
                    <div className="comp-details-edit-input">
                      <input
                        type="text"
                        className="comp-form-control"
                        defaultValue={address}
                        id="complaint-address-id"
                        onChange={(e) => handleAddressChange(e.target.value)}
                        maxLength={120}
                      />
                    </div>
                  </div>

                  <div className="comp-details-label-input-pair" id="email-pair-id">
                    <label>Email</label>
                    <div className="comp-details-edit-input">
                      <ValidationInput
                        type="text"
                        className="comp-form-control"
                        defaultValue={email !== undefined ? email : ""}
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
                        defaultOption={{ label: selectedReportedByCode?.label, value: selectedReportedByCode?.value }}
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
                    <div className="comp-details-label-input-pair" id="subject-of-complaint-pair-id">
                      <label id="complaint-caller-info-name-label-id" className="col-auto">
                        Description
                      </label>
                      <textarea
                        className="comp-form-control"
                        id="complaint-witness-details-textarea-id"
                        defaultValue={complaint_witness_details}
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
          <AttachmentsCarousel
            complaintIdentifier={id}
            allowUpload={true}
            allowDelete={true}
            onFilesSelected={onHandleAddAttachments}
            onFileDeleted={onHandleDeleteAttachment}
          />
          <ComplaintLocation
            parentCoordinates={{ lat: +latitude, lng: +longitude }}
            complaintType={complaintType}
            draggable={true}
            onMarkerMove={handleMarkerMove}
            hideMarker={!latitude || !longitude || +latitude === 0 || +longitude === 0}
            editComponent={true}
          />
        </>
      )}
      {readOnly && <AttachmentsCarousel complaintIdentifier={id} />}
      {readOnly && (
        <ComplaintLocation
          parentCoordinates={{ lat: +latitude, lng: +longitude }}
          complaintType={complaintType}
          draggable={false}
          hideMarker={!latitude || !longitude || +latitude === 0 || +longitude === 0}
          editComponent={true}
        />
      )}
    </div>
  );
};
