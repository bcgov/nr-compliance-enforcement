import { FC, useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { bcUtmZoneNumbers, getSelectedOfficer, formatLatLongCoordinate } from "@common/methods";
import { Coordinates } from "@apptypes/app/coordinate-type";
import {
  setComplaint,
  setGeocodedComplaintCoordinates,
  updateComplaintById,
  selectComplaint,
  getComplaintById,
  selectComplaintDetails,
  selectComplaintHeader,
  selectComplaintCallerInformation,
  selectComplaintSuspectWitnessDetails,
  getLinkedComplaints,
  selectLinkedComplaints,
  setLinkedComplaints,
  selectComplaintViewMode,
} from "@store/reducers/complaints";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
  selectHwcrNatureOfComplaintCodeDropdown,
  selectAttractantCodeDropdown,
  selectCommunityCodeDropdown,
  selectGirTypeCodeDropdown,
  selectReportedByDropdown,
  selectComplaintReceivedMethodDropdown,
  selectPrivacyDropdown,
} from "@store/reducers/code-table";
import { useSelector } from "react-redux";
import { Officer } from "@apptypes/person/person";
import Option from "@apptypes/app/option";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { ComplaintSuspectWitness } from "@apptypes/complaints/details/complaint-suspect-witness-details";
import { selectOfficersByAgency } from "@store/reducers/officer";
import { ComplaintLocation } from "./complaint-location";
import { ValidationTextArea } from "@common/validation-textarea";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import { ValidationPhoneInput } from "@common/validation-phone-input";
import notificationInvalid from "@assets/images/notification-invalid.png";
import { CompSelect } from "@components/common/comp-select";
import { CompInput } from "@components/common/comp-input";
import { from } from "linq-to-typescript";
import { openModal, isFeatureActive } from "@store/reducers/app";
import { useParams } from "react-router-dom";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { ToggleError } from "@common/toast";
import { ToastContainer } from "react-toastify";
import { ComplaintHeader } from "./complaint-header";
import { CallDetails } from "./call-details";
import { CallerInformation } from "./caller-information";
import { SuspectWitnessDetails } from "./suspect-witness-details";
import { AttachmentsCarousel } from "@components/common/attachments-carousel";
import { COMSObject } from "@apptypes/coms/object";
import { handleAddAttachments, handleDeleteAttachments, handlePersistAttachments } from "@common/attachment-utils";
import { Complaint as ComplaintDto } from "@apptypes/app/complaints/complaint";
import { WildlifeComplaint as WildlifeComplaintDto } from "@apptypes/app/complaints/wildlife-complaint";
import { AllegationComplaint as AllegationComplaintDto } from "@apptypes/app/complaints/allegation-complaint";
import { GeneralIncidentComplaint as GeneralInformationComplaintDto } from "@apptypes/app/complaints/general-complaint";
import { UUID } from "crypto";
import { Delegate } from "@apptypes/app/people/delegate";
import { AttractantXref } from "@apptypes/app/complaints/attractant-xref";
import { Button, Card } from "react-bootstrap";
import { HWCROutcomeReport } from "@components/containers/complaints/outcomes/hwcr-outcome-report";
import AttachmentEnum from "@constants/attachment-enum";
import { WebEOCComplaintUpdateList } from "@components/containers/complaints/webeoc-complaint-updates/webeoc-complaint-update-list";
import { getUserAgency } from "@service/user-service";
import { AgencyType } from "@apptypes/app/agency-types";
import { CeebOutcomeReport } from "@components/containers/complaints/outcomes/ceeb/ceeb-outcome-report";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { FeatureFlag } from "@components/common/feature-flag";
import { LinkedComplaintList } from "./linked-complaint-list";
import { CompCoordinateInput } from "@components/common/comp-coordinate-input";
import { ExternalFileReference } from "@components/containers/complaints/outcomes/external-file-reference";
import { getCaseFile } from "@/app/store/reducers/case-thunks";
import { GIROutcomeReport } from "@/app/components/containers/complaints/outcomes/gir-outcome-report";
import { RootState } from "@/app/store/store";
import { Roles } from "@/app/types/app/roles";
import { ParkSelect } from "@/app/components/common/park";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";
import { selectEquipment } from "@/app/store/reducers/case-selectors";

export type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetailsEdit: FC = () => {
  const dispatch = useAppDispatch();

  const { id = "", complaintType = "" } = useParams<ComplaintParams>();

  useEffect(() => {
    dispatch(getCaseFile(id));
  }, [id, dispatch]);

  //-- selectors
  const data = useAppSelector(selectComplaint);
  const privacyDropdown = useAppSelector(selectPrivacyDropdown);
  const enablePrivacyFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.PRIV_REQ));
  const isReadOnly = useAppSelector(selectComplaintViewMode);

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
    girType,
    complaintMethodReceivedCode,
    park,
  } = useAppSelector((state) => selectComplaintDetails(state, complaintType));

  const { personGuid, natureOfComplaintCode, speciesCode, violationTypeCode } = useAppSelector(
    selectComplaintHeader(complaintType),
  );

  const {
    name,
    primaryPhone,
    secondaryPhone,
    alternatePhone,
    address,
    email,
    reportedByCode,
    ownedByAgencyCode,
    isPrivacyRequested,
  } = useAppSelector(selectComplaintCallerInformation);

  // Get the code table lists to populate the Selects
  const speciesCodes = useSelector(selectSpeciesCodeDropdown) as Option[];
  const hwcrNatureOfComplaintCodes = useSelector(selectHwcrNatureOfComplaintCodeDropdown) as Option[];

  const areaCodes = useAppSelector(selectCommunityCodeDropdown);

  const attractantCodes = useSelector(selectAttractantCodeDropdown) as Option[];
  const reportedByCodes = useSelector(selectReportedByDropdown) as Option[];
  const complaintMethodReceivedCodes = useSelector(selectComplaintReceivedMethodDropdown) as Option[];

  const agency = getUserAgency();
  const violationTypeCodes = useSelector(selectViolationCodeDropdown(agency)) as Option[];
  const girTypeCodes = useSelector(selectGirTypeCodeDropdown) as Option[];

  const officersInAgencyList = useSelector((state: RootState) =>
    selectOfficersByAgency(state, ownedByAgencyCode?.agency),
  );
  const officerList = useSelector((state: RootState) => selectOfficersByAgency(state, ownedByAgencyCode?.agency));

  let assignableOfficers: Option[] =
    officersInAgencyList !== null
      ? officersInAgencyList
          .filter(
            (officer: Officer) =>
              complaintType === COMPLAINT_TYPES.HWCR || !officer.user_roles.includes(Roles.HWCR_ONLY),
          ) // Keep the officer if the complaint type is HWCR or if they don't have the HWCR_ONLY role for non-HWCR
          .map((officer: Officer) => ({
            value: officer.person_guid.person_guid,
            label: `${officer.person_guid.last_name}, ${officer.person_guid.first_name}`,
          }))
      : [];

  const { details: complaint_witness_details } = useAppSelector(
    selectComplaintSuspectWitnessDetails,
  ) as ComplaintSuspectWitness;

  const linkedComplaintData = useAppSelector(selectLinkedComplaints);
  const parkGuid = park?.parkGuid;

  const equipmentList = useAppSelector(selectEquipment);

  //-- state
  const [readOnly, setReadOnly] = useState(true);

  //-- complaint update object
  const [complaintUpdate, applyComplaintUpdate] = useState<
    ComplaintDto | AllegationComplaintDto | WildlifeComplaintDto | GeneralInformationComplaintDto
  >();

  // files to add to COMS when complaint is saved
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  // files to remove from COMS when complaint is saved
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [errorNotificationClass, setErrorNotificationClass] = useState("comp-complaint-error display-none");
  const [natureOfComplaintError, setNatureOfComplaintError] = useState<string>("");
  const [speciesError, setSpeciesError] = useState<string>("");
  const [complaintDescriptionError, setComplaintDescriptionError] = useState<string>("");
  const [attractantsErrorMsg, setAttractantsErrorMsg] = useState<string>("");
  const [communityError, setCommunityError] = useState<string>("");
  const [coordinateErrorsInd, setCoordinateErrorsInd] = useState<boolean>(false);
  const [violationTypeErrorMsg, setViolationTypeErrorMsg] = useState<string>("");
  const [generalIncidentTypeErrorMsg, setGeneralIncidentTypeErrorMsg] = useState<string>("");
  const [emailMsg, setEmailMsg] = useState<string>("");
  const [primaryPhoneMsg, setPrimaryPhoneMsg] = useState<string>("");
  const [secondaryPhoneMsg, setSecondaryPhoneMsg] = useState<string>("");
  const [alternatePhoneMsg, setAlternatePhoneMsg] = useState<string>("");
  const [selectedIncidentDateTime, setSelectedIncidentDateTime] = useState<Date>();
  const [latitude, setLatitude] = useState<string>("0");
  const [longitude, setLongitude] = useState<string>("0");
  const parentCoordinates = useMemo(() => ({ lat: +latitude, lng: +longitude }), [latitude, longitude]);

  const [complaintAttachmentCount, setComplaintAttachmentCount] = useState<number>(0);
  const [mapElements, setMapElements] = useState<MapElement[]>([]);

  const handleSlideCountChange = useCallback(
    (count: number) => {
      setComplaintAttachmentCount(count);
    },
    [setComplaintAttachmentCount],
  );

  //-- use effects
  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaint(null));
      dispatch(setGeocodedComplaintCoordinates(null));
      dispatch(setLinkedComplaints([]));
    };
  }, [dispatch]);

  useEffect(() => {
    if (id && (!data || data.id !== id)) {
      dispatch(getComplaintById(id, complaintType));
    }
  }, [id, parkGuid, complaintType, data, dispatch]);

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

  useEffect(() => {
    //getLinkedComplaints api only applies for hwcr, for now
    if (complaintType === "HWCR") {
      dispatch(getLinkedComplaints(id));
    }
  }, [dispatch, id, complaintType, details]);

  //-- events
  const editButtonClick = () => {
    setReadOnly(false);

    //-- create the complaint update object
    if (data) {
      applyComplaintUpdate(data);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveButtonClick = async () => {
    if (!complaintUpdate) {
      return;
    }
    if (hasValidationErrors()) {
      await dispatch(updateComplaintById(complaintUpdate, complaintType));

      dispatch(getComplaintById(id, complaintType));

      setErrorNotificationClass("comp-complaint-error display-none");
      setReadOnly(true);

      handlePersistAttachments({
        dispatch,
        attachmentsToAdd,
        attachmentsToDelete,
        complaintIdentifier: id,
        setAttachmentsToAdd,
        setAttachmentsToDelete,
        attachmentType: AttachmentEnum.COMPLAINT_ATTACHMENT,
        complaintType,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
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
    setComplaintDescriptionError("");
    setAttractantsErrorMsg("");
    setCommunityError("");
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
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: resetErrorMessages,
        },
        hideCallback: () => {
          // Set these values back to the originally saved values as this is a 'cancel pending changes' action
          setLongitude(getEditableCoordinates(coordinates, Coordinates.Longitude));
          setLatitude(getEditableCoordinates(coordinates, Coordinates.Latitude));
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      }),
    );
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
      complaintDescriptionError === "" &&
      attractantsErrorMsg === "" &&
      communityError === "" &&
      coordinateErrorsInd === false &&
      emailMsg === "" &&
      primaryPhoneMsg === "" &&
      secondaryPhoneMsg === "" &&
      alternatePhoneMsg === "" &&
      generalIncidentTypeErrorMsg === "" &&
      violationTypeErrorMsg === ""
    ) {
      noErrors = true;
    }
    return noErrors;
  };

  const yesNoOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // Used to set selected values in the dropdowns
  const selectedSpecies = speciesCodes.find((option) => option.value === speciesCode);
  const selectedNatureOfComplaint = hwcrNatureOfComplaintCodes.find((option) => option.value === natureOfComplaintCode);
  const selectedAreaCode = areaCodes.find((option) => option.label === area);

  const selectedReportedByCode = reportedByCodes.find((option) => option.value === reportedByCode?.reportedBy);

  const hasAssignedOfficer = (): boolean => {
    const { delegates } = complaintUpdate as ComplaintDto;

    return from(delegates).any(({ type, isActive }) => type === "ASSIGNEE" && isActive);
  };

  const selectedAssignedOfficer = getSelectedOfficer(assignableOfficers, personGuid, complaintUpdate);

  const selectedAttractants = attractantCodes.filter((option) =>
    attractants?.some((attractant) => attractant.code === option.value),
  );
  const selectedViolationTypeCode = violationTypeCodes.find((option) => option.value === violationTypeCode);
  const selectedViolationInProgress = yesNoOptions.find(
    (option) => option.value === (violationInProgress ? "Yes" : "No"),
  );
  const selectedViolationObserved = yesNoOptions.find((option) => option.value === (violationObserved ? "Yes" : "No"));
  const selectedGirTypeCode = girTypeCodes.find((option) => option.label === girType);

  const selectedComplaintMethodReceivedCode = complaintMethodReceivedCodes.find(
    (option) => option.value === complaintMethodReceivedCode?.complaintMethodReceivedCode,
  );

  const getEditableCoordinates = (input: Array<number> | Array<string> | undefined, type: Coordinates): string => {
    if (!input) {
      return "";
    }

    let result = type === Coordinates.Longitude ? input[0] : input[1];
    return result === 0 || result === "0" ? "" : result.toString();
  };

  const handleMarkerMove = async (lat: number, lng: number) => {
    await updateCoordinates(lat, lng);
  };

  const updateCoordinates = async (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  //-- general incident complaint updates
  const handleGirTypeChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setGeneralIncidentTypeErrorMsg("");
    } else {
      setGeneralIncidentTypeErrorMsg("Required");
    }

    let updatedComplaint = { ...complaintUpdate, girType: value } as GeneralInformationComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };
  //-- wildlife complaint updates
  const handleNatureOfComplaintChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setNatureOfComplaintError("");
    } else {
      setNatureOfComplaintError("Required");
    }

    let updatedComplaint = { ...complaintUpdate, natureOfComplaint: value } as WildlifeComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handleSpeciesChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setSpeciesError("");
    } else {
      setSpeciesError("Required");
    }

    let updatedComplaint = { ...complaintUpdate, species: value } as WildlifeComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  //-- allegation complaint updates
  const handleViolationTypeChange = (selected: Option | null) => {
    let value: string = "";
    if (selected?.value && selected?.value !== "") {
      value = selected.value;
      setViolationTypeErrorMsg("");
    } else {
      setViolationTypeErrorMsg("Required");
    }

    let updatedComplaint = { ...complaintUpdate, violation: value } as AllegationComplaintDto;
    applyComplaintUpdate(updatedComplaint);
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
    let { delegates } = complaintUpdate as ComplaintDto;
    if (selected) {
      const { value } = selected;
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
    } else {
      let updatedDelegates = delegates.filter(({ type }) => type !== "ASSIGNEE");
      let updatedComplaint = { ...complaintUpdate, delegates: updatedDelegates } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
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
    const { attractants } = complaintUpdate as WildlifeComplaintDto;
    let updates: Array<AttractantXref> = [];

    if (options && options.length > 0) {
      attractants.forEach((item) => {
        const { attractant, xrefId } = item;

        if (from(options).any(({ value: selected }) => selected === attractant)) {
          updates.push({ xrefId, attractant, isActive: true });
        } else {
          updates.push({ xrefId, attractant, isActive: false });
        }
      });

      options.forEach(({ value: selected }) => {
        if (!from(attractants).any(({ attractant }) => attractant === selected)) {
          const _item: AttractantXref = { attractant: selected as string, isActive: true };
          updates.push(_item);
        }
      });
    } else {
      updates = attractants.map((item) => {
        return { attractant: item.attractant, xrefId: item.xrefId, isActive: false };
      });
    }

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

  const handleParkChange = (value?: string) => {
    const updatedComplaint = { ...complaintUpdate, parkGuid: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handleCommunityChange = (selectedOption: Option | null) => {
    let value: string = "";
    if (selectedOption?.value && selectedOption?.value !== "") {
      value = selectedOption.value;
      setCommunityError("");
    } else {
      setCommunityError("Required");
    }
    const { organization } = complaintUpdate as ComplaintDto;
    const updatedOrganization = { ...organization, area: value };

    const updatedComplaint = { ...complaintUpdate, organization: updatedOrganization } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handleNameChange = (value: string) => {
    const updatedComplaint = { ...complaintUpdate, name: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handlePrivacyRequestedChange = (selected: Option | null) => {
    let value = null;
    if (selected) {
      value = selected.value;
    }
    let updatedComplaint = {
      ...complaintUpdate,
      isPrivacyRequested: value,
    } as ComplaintDto;
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
    let value = null;
    if (selected) {
      value = selected.value;
    }
    const updatedComplaint = { ...complaintUpdate, reportedBy: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const handleComplaintReceivedMethodChange = (selected: Option | null) => {
    let value = null;
    if (selected) {
      value = selected.value;
    }
    const updatedComplaint = { ...complaintUpdate, complaintMethodReceivedCode: value } as ComplaintDto;
    applyComplaintUpdate(updatedComplaint);
  };

  const maxDate = new Date();

  const syncCoordinates = (yCoordinate: string | undefined, xCoordinate: string | undefined) => {
    setLongitude(xCoordinate ?? "0");
    setLatitude(yCoordinate ?? "0");

    if (yCoordinate && xCoordinate && !Number.isNaN(yCoordinate) && !Number.isNaN(xCoordinate)) {
      const location = {
        type: "point",
        coordinates: [
          parseFloat(formatLatLongCoordinate(xCoordinate) ?? ""),
          parseFloat(formatLatLongCoordinate(yCoordinate) ?? ""),
        ],
      };

      const updatedComplaint = { ...complaintUpdate, location } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    } else if (yCoordinate === "" && xCoordinate === "") {
      const location = { type: "point", coordinates: [0, 0] };

      const updatedComplaint = { ...complaintUpdate, location } as ComplaintDto;
      applyComplaintUpdate(updatedComplaint);
    }
  };

  const throwError = (hasError: boolean) => {
    setCoordinateErrorsInd(hasError);
  };

  useEffect(() => {
    let mapElements: MapElement[] = [];
    mapElements.push({
      objectType: MapObjectType.Complaint,
      name: "Complaint",
      description: "",
      isActive: true,
      location: {
        lat: parentCoordinates.lat,
        lng: parentCoordinates.lng,
      },
    } as MapElement);
    if (equipmentList && equipmentList.length > 0) {
      let equipmentMapElements: MapElement[] = equipmentList
        .filter((equipment) => equipment.activeIndicator === true)
        .map((equipment) => {
          let equipmentItem: any = equipment;
          return {
            objectType: MapObjectType.Equipment,
            name: equipmentItem.typeDescription,
            description: "",
            isActive:
              equipment.actions?.filter((action) => action.actionCode === "REMEQUIPMT")?.length === 0 &&
              !["K9UNT", "LLTHL"].includes(equipmentItem.typeCode),
            location: {
              lat: +equipment.yCoordinate,
              lng: +equipment.xCoordinate,
            },
          } as MapElement;
        });
      mapElements = [...mapElements, ...equipmentMapElements];
    }
    setMapElements(mapElements);
  }, [equipmentList, parentCoordinates]);
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

      <section className="comp-details-body comp-container">
        <hr className="comp-details-body-spacer"></hr>

        {readOnly && linkedComplaintData.length > 0 && (
          <LinkedComplaintList linkedComplaintData={linkedComplaintData} />
        )}
        {readOnly && <WebEOCComplaintUpdateList complaintIdentifier={id} />}

        <div className="comp-details-section-header">
          <h2>Complaint details</h2>
          {readOnly && (
            <div className="comp-details-section-header-actions">
              <Button
                variant="outline-primary"
                size="sm"
                id="details-screen-edit-button"
                onClick={editButtonClick}
                disabled={isReadOnly}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit complaint</span>
              </Button>
            </div>
          )}
        </div>

        {/* Complaints Details (View) */}
        <div className="comp-details-view">
          {/* Call Details */}
          {readOnly && <CallDetails complaintType={complaintType} />}

          {/* Suspect / Witness Details */}
          {readOnly && complaintType === COMPLAINT_TYPES.ERS && <SuspectWitnessDetails />}

          {/* Caller Information */}
          {readOnly && <CallerInformation />}

          {/* Attachments */}
          {readOnly && (
            <section id="complaint_attachments_div_id">
              <h3>Complainant attachments ({complaintAttachmentCount})</h3>
              <Card>
                <Card.Body>
                  <div className={complaintAttachmentCount > 0 ? "comp-details-attachments" : ""}>
                    <AttachmentsCarousel
                      attachmentType={AttachmentEnum.COMPLAINT_ATTACHMENT}
                      complaintIdentifier={id}
                      onSlideCountChange={handleSlideCountChange}
                    />
                  </div>
                </Card.Body>
              </Card>
            </section>
          )}

          {/* Map */}
          {readOnly && (
            <ComplaintLocation
              complaintType={complaintType}
              draggable={false}
              editComponent={true}
              mapElements={mapElements}
            />
          )}
        </div>

        {/* Complaint Details (Edit) */}
        {!readOnly && (
          <div className="comp-details-form">
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

            {/* Admnistrative */}
            <fieldset>
              <div
                className="comp-details-form-row"
                id="officer-assigned-pair-id"
              >
                <label id="officer-assigned-select-label-id">Officer assigned</label>
                <CompSelect
                  id="officer-assigned-select-id"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  onChange={(e) => handleAssignedOfficerChange(e)}
                  className="comp-details-input full-width"
                  options={assignableOfficers}
                  placeholder="Select"
                  enableValidation={false}
                  value={hasAssignedOfficer() ? selectedAssignedOfficer : null}
                  isClearable={true}
                />
              </div>
            </fieldset>

            {/* Call Details */}
            <fieldset>
              <h3>Call details</h3>
              {complaintType === COMPLAINT_TYPES.HWCR && (
                <>
                  <div
                    className="comp-details-form-row"
                    id="species-pair-id"
                  >
                    <label id="species-label-id">
                      Species<span className="required-ind">*</span>
                    </label>
                    <CompSelect
                      id="species-select-id"
                      showInactive={false}
                      classNamePrefix="comp-select"
                      onChange={(e) => handleSpeciesChange(e)}
                      className="comp-details-input full-width"
                      options={speciesCodes}
                      defaultOption={selectedSpecies}
                      placeholder="Select"
                      enableValidation={true}
                      errorMessage={speciesError}
                      isClearable={true}
                    />
                  </div>
                  <div
                    className="comp-details-form-row"
                    id="nature-of-complaint-pair-id"
                  >
                    <label id="nature-of-complaint-label-id">
                      Nature of complaint<span className="required-ind">*</span>
                    </label>
                    <CompSelect
                      id="nature-of-complaint-select-id"
                      showInactive={false}
                      classNamePrefix="comp-select"
                      onChange={(e) => handleNatureOfComplaintChange(e)}
                      className="comp-details-input full-width"
                      options={hwcrNatureOfComplaintCodes}
                      defaultOption={selectedNatureOfComplaint}
                      placeholder="Select"
                      enableValidation={true}
                      errorMessage={natureOfComplaintError}
                      isClearable={true}
                    />
                  </div>
                </>
              )}

              {complaintType === COMPLAINT_TYPES.ERS && (
                <div
                  className="comp-details-form-row"
                  id="violation-type-pair-id"
                >
                  <label id="violation-label-id">
                    Violation type<span className="required-ind">*</span>
                  </label>
                  <CompSelect
                    id="violation-type-select-id"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    onChange={(e) => handleViolationTypeChange(e)}
                    className="comp-details-input full-width"
                    options={violationTypeCodes}
                    defaultOption={selectedViolationTypeCode}
                    placeholder="Select"
                    enableValidation={true}
                    errorMessage={violationTypeErrorMsg}
                    isClearable={true}
                  />
                </div>
              )}

              {complaintType === COMPLAINT_TYPES.GIR && (
                <div
                  className="comp-details-form-row"
                  id="general-incident-type-pair-id"
                >
                  <label id="general-incident-label-id">
                    General incident type<span className="required-ind">*</span>
                  </label>
                  <CompSelect
                    id="gir-type-select-id"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    onChange={(e) => handleGirTypeChange(e)}
                    className="comp-details-input full-width"
                    options={girTypeCodes}
                    defaultOption={selectedGirTypeCode}
                    placeholder="Select"
                    enableValidation={true}
                    errorMessage={generalIncidentTypeErrorMsg}
                    isClearable={true}
                  />
                </div>
              )}
              <div
                className="comp-details-form-row"
                id="complaint-description-pair-id"
              >
                <label
                  id="complaint-description-edit-label-id"
                  htmlFor="complaint-description-textarea-id"
                >
                  Complaint description
                  <span className="required-ind">*</span>
                </label>
                <div className="comp-details-edit-input">
                  <ValidationTextArea
                    className="comp-form-control"
                    id="complaint-description-textarea-id"
                    defaultValue={details !== undefined ? details : ""}
                    rows={4}
                    errMsg={complaintDescriptionError}
                    onChange={handleComplaintDescChange}
                  />
                </div>
              </div>
              <div
                className="comp-details-form-row"
                id="incident-time-pair-id"
              >
                <label>Incident date/time</label>
                <div className="comp-details-edit-input">
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
                    monthsShown={2}
                    showPreviousMonths
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
                      defaultValue={selectedAttractants}
                      placeholder="Select"
                      id="attractants-select-id"
                      classNamePrefix="comp-select"
                      onChange={handleAttractantsChange}
                      errMsg={attractantsErrorMsg}
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
                        defaultValue={selectedViolationInProgress}
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
                        defaultValue={selectedViolationObserved}
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
                    defaultValue={location}
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
                <textarea
                  className="comp-form-control"
                  id="complaint-location-description-textarea-id"
                  defaultValue={locationDescription}
                  rows={4}
                  onChange={(e) => handleLocationDescriptionChange(e.target.value)}
                  maxLength={4000}
                />
              </div>

              <CompCoordinateInput
                id="edit-complaint-coordinates"
                utmZones={bcUtmZoneNumbers.map((zone: string) => {
                  return { value: zone, label: zone } as Option;
                })}
                initXCoordinate={longitude}
                initYCoordinate={latitude}
                syncCoordinates={syncCoordinates}
                throwError={throwError}
                enableCopyCoordinates={false}
                validationRequired={false}
              />

              <div
                className="comp-details-form-row"
                id="park"
              >
                <label htmlFor="complaint-park">Park</label>
                <div className="comp-details-edit-input">
                  <ParkSelect
                    id="complaint-park"
                    initialParkGuid={parkGuid}
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
                    defaultOption={selectedAreaCode}
                    placeholder="Select"
                    enableValidation={true}
                    errorMessage={communityError}
                    isClearable={true}
                  />
                </div>
              </div>
              <FeatureFlag feature={FEATURE_TYPES.ENABLE_OFFICE}>
                <div
                  className="comp-details-form-row"
                  id="office-pair-id"
                >
                  <label>Office</label>
                  <input
                    type="text"
                    id="office-edit-readonly-id"
                    className="comp-form-control"
                    disabled
                    defaultValue={office}
                  />
                </div>
              </FeatureFlag>
              <div
                className="comp-details-form-row"
                id="zone-pair-id"
              >
                <label>Zone</label>
                <input
                  type="text"
                  id="zone-edit-readonly-id"
                  className="comp-form-control"
                  disabled
                  defaultValue={zone}
                />
              </div>
              <div
                className="comp-details-form-row"
                id="region-pair-id"
              >
                <label>Region</label>
                <input
                  type="text"
                  id="region-edit-readonly-id"
                  className="comp-form-control"
                  disabled
                  defaultValue={region}
                />
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

            {/* Call Information */}
            <fieldset>
              <h3>Caller information</h3>

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
                      defaultValue={privacyDropdown.find((item) => item.value === isPrivacyRequested)}
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
                    defaultValue={name}
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
                  className="col-auto"
                  htmlFor="caller-primary-phone-id"
                >
                  Primary phone
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

              <div
                className="comp-details-form-row"
                id="secondary-phone-pair-id"
              >
                <label
                  id="complaint-caller-info-secondary-phone-label-id"
                  className="col-auto"
                  htmlFor="caller-info-secondary-phone-id"
                >
                  Alternate phone 1
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

              <div
                className="comp-details-form-row"
                id="alternate-phone-pair-id"
              >
                <label
                  id="complaint-caller-info-alternate-phone-label-id"
                  className="col-auto"
                  htmlFor="caller-info-alternate-phone-id"
                >
                  Alternate phone 2
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

              {/* Address */}
              <div
                className="comp-details-form-row"
                id="address-pair-id"
              >
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

              {/* Email Address */}
              <div
                className="comp-details-form-row"
                id="email-pair-id"
              >
                <label>Email</label>
                <div className="comp-details-edit-input">
                  <CompInput
                    id="complaint-email-id"
                    divid="complaint-email-id-value"
                    type="input"
                    inputClass="comp-form-control"
                    defaultValue={email !== undefined ? email : ""}
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
                    className="comp-details-input"
                    defaultOption={selectedReportedByCode}
                    placeholder="Select"
                    options={reportedByCodes}
                    enableValidation={false}
                    onChange={(e) => handleReportedByChange(e)}
                    isClearable={true}
                  />
                </div>
              </div>
            </fieldset>

            {/* ERS - Subject of Complaint */}
            {complaintType === COMPLAINT_TYPES.ERS && (
              <fieldset>
                <h3>Subject of complaint/witness details</h3>
                <div
                  className="comp-details-form-row"
                  id="subject-of-complaint-pair-id"
                >
                  <label
                    className="col-auto"
                    htmlFor="complaint-witness-details-textarea-id"
                  >
                    Description
                  </label>
                  <textarea
                    className="comp-form-control"
                    id="complaint-witness-details-textarea-id"
                    defaultValue={complaint_witness_details}
                    rows={4}
                    onChange={(e) => handleSuspectDetailsChange(e.target.value)}
                    maxLength={4000}
                    placeholder="Enter details (e.g. vehicle, license plate, features, clothing, weapons, name, address)"
                  />
                </div>
              </fieldset>
            )}

            {/* Attachments */}
            <fieldset>
              <h3>Complainant attachments ({complaintAttachmentCount})</h3>
              <div>
                <AttachmentsCarousel
                  attachmentType={AttachmentEnum.COMPLAINT_ATTACHMENT}
                  complaintIdentifier={id}
                  allowUpload={true}
                  allowDelete={true}
                  onFilesSelected={onHandleAddAttachments}
                  onFileDeleted={onHandleDeleteAttachment}
                  onSlideCountChange={handleSlideCountChange}
                />
              </div>
            </fieldset>

            {/* Location Map */}
            <ComplaintLocation
              complaintType={complaintType}
              draggable={true}
              onMarkerMove={handleMarkerMove}
              editComponent={true}
              mapElements={
                !coordinateErrorsInd
                  ? [
                      {
                        objectType: MapObjectType.Complaint,
                        name: "Complaint",
                        description: "Complaint Description",
                        isActive: true,
                        location: {
                          lat: parentCoordinates.lat,
                          lng: parentCoordinates.lng,
                        },
                      } as MapElement,
                    ]
                  : []
              }
            />
          </div>
        )}
      </section>

      {/* HWCR Outcome Report and File Linkage */}
      {readOnly && complaintType === COMPLAINT_TYPES.HWCR && (
        <>
          <HWCROutcomeReport />
          <FeatureFlag feature={FEATURE_TYPES.EXTERNAL_FILE_REFERENCE}>
            <ExternalFileReference />
          </FeatureFlag>
        </>
      )}

      {/* CEEB ERS Outcome Report */}
      {readOnly && complaintType === COMPLAINT_TYPES.ERS && agency === AgencyType.CEEB && <CeebOutcomeReport />}

      {/* COS ERS File Linkage */}
      {readOnly && complaintType === COMPLAINT_TYPES.ERS && (
        <FeatureFlag feature={FEATURE_TYPES.EXTERNAL_FILE_REFERENCE}>
          <ExternalFileReference />
        </FeatureFlag>
      )}

      {readOnly && complaintType === COMPLAINT_TYPES.GIR && <GIROutcomeReport />}
    </div>
  );
};
