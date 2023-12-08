import { FC, useEffect, useState } from "react";
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
import { HwcrComplaint } from "../../../../types/complaints/hwcr-complaint";
import { AllegationComplaint } from "../../../../types/complaints/allegation-complaint";
import { cloneDeep } from "lodash";
import { Coordinates } from "../../../../types/app/coordinate-type";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { openModal, userId } from "../../../../store/reducers/app";
import notificationInvalid from "../../../../../assets/images/notification-invalid.png";
import { useSelector } from "react-redux";
import {
  selectAgencyDropdown,
  selectAttractantCodeDropdown,
  selectCommunityCodeDropdown,
  selectComplaintTypeDropdown,
  selectHwcrNatureOfComplaintCodeDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
} from "../../../../store/reducers/code-table";
import { Officer } from "../../../../types/person/person";
import { selectOfficers } from "../../../../store/reducers/officer";
import { CreateComplaintHeader } from "./create-complaint-header";
import { CancelConfirm } from "../../../../types/modal/modal-types";
import {
  createAllegationComplaint,
  createWildlifeComplaint,
  getAllegationComplaintByComplaintIdentifierSetUpdate,
  getWildlifeComplaintByComplaintIdentifierSetUpdate,
  setComplaint,
} from "../../../../store/reducers/complaints";
import { from } from "linq-to-typescript";
import { Complaint } from "../../../../types/complaints/complaint";
import { ToggleError } from "../../../../common/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ComplaintLocation } from "./complaint-location";
import { AttachmentsCarousel } from "../../../common/attachments-carousel";
import { COMSObject } from "../../../../types/coms/object";
import { deleteAttachments, saveAttachments } from "../../../../store/reducers/attachments";
import { handleAttachments } from "../../../../common/attachment-utils";

export const CreateComplaint: FC = () => {
  const dispatch = useAppDispatch();
  const userid = useAppSelector(userId);
  const officerList = useAppSelector(selectOfficers);
  let assignableOfficers: Option[] =
    officerList !== null
      ? officerList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
      : [];

  const navigate = useNavigate();

  const emptyComplaint: Complaint = {
      complaint_identifier: "",
      geo_organization_unit_code: {
        geo_organization_unit_code: "",
        short_description: "",
        long_description: "",
        display_order: "",
        active_ind: "",
        create_user_id: "",
        create_utc_timestamp: null,
        update_user_id: "",
        update_utc_timestamp: null
      },
      location_geometry_point: {
        type: "",
        coordinates: [0,0],
      },
      incident_utc_datetime: null,
      incident_reported_utc_timestmp: "",
      location_summary_text: "",
      location_detailed_text: "",
      detail_text: "",
      create_user_id: "",
      create_utc_timestamp: "",
      update_user_id: "",
      update_utc_timestamp: "",
      complaint_status_code: {
        complaint_status_code: "",
        short_description: "",
        long_description: "",
        display_order: 0,
        active_ind: false,
        create_user_id: "",
        create_utc_timestamp: null,
        update_user_id: "",
        update_utc_timestamp: null,
      },
      caller_name: "",
      caller_address: "",
      caller_email: "",
      caller_phone_1: "",
      caller_phone_2: "",
      caller_phone_3: "",
      referred_by_agency_code: {
        agency_code: "",
        short_description: "",
        long_description: "",
        display_order: 0,
        active_ind: false,
        create_user_id: "",
        create_utc_timestamp: null,
        update_user_id: "",
        update_utc_timestamp: null,
      },
      owned_by_agency_code: {
        agency_code: "",
        short_description: "",
        long_description: "",
        display_order: 0,
        active_ind: false,
        create_user_id: "",
        create_utc_timestamp: null,
        update_user_id: "",
        update_utc_timestamp: null,
      },
      cos_geo_org_unit: {
        zone_code: "",
        office_location_name: "",
        area_name: "",
        area_code: "",
      },
      person_complaint_xref: [],
  }

  const emptyHwcrComplaint: HwcrComplaint = {
    complaint_identifier: emptyComplaint,
    hwcr_complaint_nature_code: {
      hwcr_complaint_nature_code: "",
      short_description: "",
      long_description: "",
      display_order: 0,
      active_ind: false,
      create_user_id: "",
      create_utc_timestamp: null,
      update_user_id: "",
      update_utc_timestamp: null,
    },
    species_code: {
      species_code: "",
      legacy_code: null,
      short_description: "",
      long_description: "",
      display_order: 0,
      active_ind: false,
      create_user_id: "",
      create_utc_timestamp: null,
      update_user_id: "",
      update_utc_timestamp: null,
    },
    update_utc_timestamp: "",
    hwcr_complaint_guid: "",
    attractant_hwcr_xref: [],
  };

  const emptyAllegationComplaint: AllegationComplaint = {
    complaint_identifier: emptyComplaint,
    update_utc_timestamp: "",
    allegation_complaint_guid: "",
    violation_code: {
      violation_code: "",
      short_description: "",
      long_description: "",
      display_order: 0,
      active_ind: false,
      create_user_id: "",
      create_utc_timestamp: null,
      update_user_id: "",
      update_utc_timestamp: null,
    },
    in_progress_ind: "",
    observed_ind: false,
    suspect_witnesss_dtl_text: ""
  };

  const [complaintType, setComplaintType] = useState<string>(COMPLAINT_TYPES.HWCR);
  const [complaintTypeMsg, setComplaintTypeMsg] = useState<string>("");
  const [nocErrorMsg, setNOCErrorMsg] = useState<string>("");
  const [violationTypeErrorMsg, setViolationTypeErrorMsg] = useState<string>("");
  const [speciesErrorMsg, setSpeciesErrorMsg] = useState<string>("");
  const [statusErrorMsg, setStatusErrorMsg] = useState<string>("");
  const [complaintDescErrorMsg, setComplaintDescErrorMsg] =
    useState<string>("");
  const [attractantsErrorMsg, setAttractantsErrorMsg] = useState<string>("");
  const [communityErrorMsg, setCommunityErrorMsg] = useState<string>("");
  const [geoPointXMsg, setGeoPointXMsg] = useState<string>("");
  const [geoPointYMsg, setGeoPointYMsg] = useState<string>("");
  const [emailMsg, setEmailMsg] = useState<string>("");
  const [primaryPhoneMsg, setPrimaryPhoneMsg] = useState<string>("");
  const [secondaryPhoneMsg, setSecondaryPhoneMsg] = useState<string>("");
  const [alternatePhoneMsg, setAlternatePhoneMsg] = useState<string>("");
  const [selectedIncidentDateTime, setSelectedIncidentDateTime] =
    useState<Date>();

  const [errorNotificationClass, setErrorNotificationClass] = useState(
    "comp-complaint-error display-none",
  );

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
      dispatch(setComplaint(null));
      setLatitude("");
      setLongitude("");
  }, [dispatch]);
  
  const newEmptyComplaint = (COMPLAINT_TYPES.HWCR ? emptyHwcrComplaint : emptyAllegationComplaint);

  const [createComplaint, setCreateComplaint] = useState<
    HwcrComplaint | AllegationComplaint
  >(newEmptyComplaint);

    // files to add to COMS when complaint is saved
    const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);

    // files to remove from COMS when complaint is saved
    const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  
    const handleAddAttachments = (selectedFiles: File[]) => {
      setAttachmentsToAdd(prevFiles => prevFiles ? [...prevFiles, ...selectedFiles] : selectedFiles);
    };
  
    const handleDeleteAttachment = (fileToDelete: COMSObject) => {
      if (!fileToDelete.pendingUpload) {
        setAttachmentsToDelete(prevFiles => prevFiles ? [...prevFiles, fileToDelete] : [fileToDelete]);
      } else if (attachmentsToAdd) { // we're deleting an attachment that wasn't uploaded, so remove the attachment from the "attachmentsToDelete" state
        setAttachmentsToAdd(prevAttachments => prevAttachments ? prevAttachments.filter(file => file.name !== fileToDelete.name) : null);     
      }
    };
  

  function noErrors() {
    let noErrors = false;
    if (
      statusErrorMsg === "" &&
      complaintDescErrorMsg === "" &&
      attractantsErrorMsg === "" &&
      communityErrorMsg === "" &&
      geoPointXMsg === "" &&
      geoPointYMsg === "" &&
      emailMsg === "" &&
      primaryPhoneMsg === "" &&
      secondaryPhoneMsg === "" &&
      alternatePhoneMsg === ""
    ) {
      if(complaintType === COMPLAINT_TYPES.HWCR)
      {
        if(nocErrorMsg === "" &&
          speciesErrorMsg === "")
        {
          noErrors = true;
        }
      }
      else if(complaintType === COMPLAINT_TYPES.ERS)
      {
        if(violationTypeErrorMsg === "")
        {
          noErrors = true;
        }
      }
    }
    return noErrors;
  }

  const handleComplaintChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;
      if (!value) {
        setComplaintTypeMsg("Required");
      } else {
        setComplaintTypeMsg("");
        if(value !== complaintType)
        {
          setComplaintType(value);
          if(value === COMPLAINT_TYPES.HWCR && createComplaint && createComplaint.complaint_identifier)
          {
            let resetComplaint = emptyHwcrComplaint;
            resetComplaint.complaint_identifier = cloneDeep(createComplaint.complaint_identifier);
            setCreateComplaint(resetComplaint);
          }
          else if(value === COMPLAINT_TYPES.ERS && createComplaint && createComplaint.complaint_identifier)
          {
            let resetComplaint = emptyAllegationComplaint;
            resetComplaint.complaint_identifier = cloneDeep(createComplaint.complaint_identifier);
            setCreateComplaint(resetComplaint);
          }
        }
      }
    }
  };

  const handleNOCChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;
      if (!value) {
        setNOCErrorMsg("Required");
      } else {
        setNOCErrorMsg("");

        let update = { ...createComplaint } as HwcrComplaint;

        const { hwcr_complaint_nature_code: source } = update;
        const updatedEntity = {
          ...source,
          short_description: value,
          long_description: label as string,
          hwcr_complaint_nature_code: value,
        };

        update.hwcr_complaint_nature_code = updatedEntity;
        setCreateComplaint(update);
      }
    }
  };

  const handleSpeciesChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;
      if (!value) {
        setSpeciesErrorMsg("Required");
      } else {
        setSpeciesErrorMsg("");

        let update = { ...createComplaint } as HwcrComplaint;

        const { species_code: source } = update;
        const updatedEntity = {
          ...source,
          short_description: value,
          long_description: label as string,
          species_code: value,
        };

        update.species_code = updatedEntity;
        setCreateComplaint(update);
      }
    }
  };

  const handleViolationTypeChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;

      if (!value) {
        setViolationTypeErrorMsg("Required");
      } else {
        setViolationTypeErrorMsg("");

        let update = { ...createComplaint } as AllegationComplaint;

        const { violation_code: source } = update;
        const updatedEntity = {
          ...source,
          short_description: value,
          long_description: label as string,
          violation_code: value,
        };

        update.violation_code = updatedEntity;
        setCreateComplaint(update);
      }
    }
  };

  const handleAssignedOfficerChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      let update = { ...createComplaint } as
        | HwcrComplaint
        | AllegationComplaint;

      const { complaint_identifier: identifier } = update;
      let { person_complaint_xref: source, complaint_identifier: id } =
        identifier;
      if (value !== "Unassigned") {
        const selectedOfficer = officerList?.find(
          ({ person_guid: { person_guid: id } }) => {
            return id === value;
          },
        );

        const { person_guid: officer } = selectedOfficer as any;

        if (from(source).any() && from(source).elementAt(0)) {
          const assigned = { ...source[0], person_guid: officer };
          source = [assigned];
        } else {
          const assigned = {
            person_guid: officer,
            create_user_id: userid,
            update_user_id: userid,
            complaint_identifier: id,
            active_ind: true,
            person_complaint_xref_code: "ASSIGNEE",
          };
          source = [assigned];
        }

        const updatedParent = {
          ...identifier,
          person_complaint_xref: source,
        };

        update.complaint_identifier = updatedParent;

        setCreateComplaint(update);
      } else if (from(source).any() && from(source).elementAt(0)) {
        const assigned = { ...source[0], active_ind: false };
        source = [assigned];

        const updatedParent = {
          ...identifier,
          person_complaint_xref: source,
        };

        update.complaint_identifier = updatedParent;
        setCreateComplaint(update);
      }
    }
  };

  function handleComplaintDescChange(value: string) {
    if (value === "") {
      setComplaintDescErrorMsg("Required");
    } else {
      setComplaintDescErrorMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint,
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.detail_text = value;
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint,
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.detail_text = value;
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  function handleLocationDescriptionChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint,
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.location_detailed_text = value;
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint,
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.location_detailed_text = value;
      setCreateComplaint(allegationComplaint);
    }
  }

  function handleViolationInProgessChange(selectedOption: Option | null) {
    let allegationComplaint: AllegationComplaint = cloneDeep(
      createComplaint,
    ) as AllegationComplaint;
    allegationComplaint.in_progress_ind = selectedOption?.value === "Yes";
    setCreateComplaint(allegationComplaint);
  }

  function handleViolationObservedChange(selectedOption: Option | null) {
    let allegationComplaint: AllegationComplaint = cloneDeep(
      createComplaint,
    ) as AllegationComplaint;
    allegationComplaint.observed_ind = selectedOption?.value === "Yes";
    setCreateComplaint(allegationComplaint);
  }

  function handleLocationChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint,
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.location_summary_text = value ?? "";
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint,
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.location_summary_text =
        value ?? "";
      setCreateComplaint(allegationComplaint);
    }
  }

  async function handleAttractantsChange(selectedOptions: Option[] | null) {
    if (!selectedOptions) {
      return;
    }
    let update = { ...createComplaint } as HwcrComplaint;
    const { attractant_hwcr_xref: currentAttactants } = update;

    let newAttractants = new Array<any>();

    selectedOptions.forEach((selectedOption) => {
      let match = false;

      currentAttactants.forEach((item) => {
        if (selectedOption.value === item.attractant_code?.attractant_code) {
          match = true;
          const attractant = {
            attractant_hwcr_xref_guid: item.attractant_hwcr_xref_guid,
            attractant_code: item.attractant_code,
            hwcr_complaint_guid: update.hwcr_complaint_guid,
            create_user_id: userid,
            active_ind: true,
          };
          newAttractants.push(attractant);
        }
      });

      if (!match) {
        const { label, value } = selectedOption;

        const attractant = {
          attractant_hwcr_xref_guid: undefined,
          attractant_code: {
            active_ind: true,
            attractant_code: value as string,
            short_description: label as string,
            long_description: label as string,
          },
          hwcr_complaint_guid: update.hwcr_complaint_guid,
          create_user_id: userid,
          active_ind: true,
        };
        newAttractants.push(attractant);
      }
    });

    currentAttactants.forEach((current) => {
      let match = false;

      newAttractants.forEach((item) => {
        if (current.attractant_code === item.attractant_code) {
          match = true;
        }
      });

      if (!match) {
        const attractant = {
          attractant_hwcr_xref_guid: current.attractant_hwcr_xref_guid,
          attractant_code: current.attractant_code,
          hwcr_complaint_guid: update.hwcr_complaint_guid,
          create_user_id: userid,
          active_ind: false,
        };
        newAttractants.push(attractant);
      }
    });

    update.attractant_hwcr_xref = newAttractants;
    setAttractantsErrorMsg("");
    setCreateComplaint(update);
  }

  function handleCommunityChange(selectedOption: Option | null) {
    if (!selectedOption) {
      return;
    }
    if (selectedOption.value === "") {
      setCommunityErrorMsg("Required");
    } else {
      setCommunityErrorMsg("");
      if (selectedOption.value) {
        const geoOrgCode = {
          geo_organization_unit_code: selectedOption.value,
          short_description: "",
          long_description: selectedOption.label ? selectedOption.label : "",
          display_order: "",
          active_ind: "",
          create_user_id: "",
          create_utc_timestamp: null,
          update_user_id: "",
          update_utc_timestamp: null,
        };
        createComplaint.complaint_identifier.cos_geo_org_unit.area_code =
          selectedOption.value;
          createComplaint.complaint_identifier.geo_organization_unit_code =
          geoOrgCode;
      }
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint,
        ) as HwcrComplaint;
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint,
        ) as AllegationComplaint;
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  const handleGeoPointChange = async (latitude: string, longitude: string) => {
    //-- clear errors
    setGeoPointXMsg("");
    setGeoPointYMsg("");

    //-- clone the complaint
    const complaint =
      complaintType === COMPLAINT_TYPES.HWCR
        ? (cloneDeep(createComplaint) as HwcrComplaint)
        : (cloneDeep(createComplaint) as AllegationComplaint);

    //-- verify latitude and longitude
    if (latitude && !Number.isNaN(latitude)) {
      const item = parseFloat(latitude);
      if (item > bcBoundaries.maxLatitude || item < bcBoundaries.minLatitude) {
        setGeoPointYMsg(
          `Value must be between ${bcBoundaries.maxLatitude} and ${bcBoundaries.minLatitude} degrees`,
        );
      }
    }

    if (longitude && !Number.isNaN(longitude)) {
      const item = parseFloat(longitude);
      if (
        item > bcBoundaries.maxLongitude ||
        item < bcBoundaries.minLongitude
      ) {
        setGeoPointXMsg(
          `Value must be between ${bcBoundaries.minLongitude} and ${bcBoundaries.maxLongitude} degrees`,
        );
      }
    }

    //-- update coordinates
    if (
      latitude &&
      longitude &&
      !Number.isNaN(latitude) &&
      !Number.isNaN(longitude)
    ) {
      complaint.complaint_identifier.location_geometry_point.coordinates[
        Coordinates.Longitude
      ] = parseFloat(longitude);
      complaint.complaint_identifier.location_geometry_point.coordinates[
        Coordinates.Latitude
      ] = parseFloat(latitude);
      setCreateComplaint(complaint);
    } else if (latitude === "" && longitude === "") {
      complaint.complaint_identifier.location_geometry_point.coordinates[
        Coordinates.Longitude
      ] = 0;
      complaint.complaint_identifier.location_geometry_point.coordinates[
        Coordinates.Latitude
      ] = 0;
      setCreateComplaint(complaint);
    }
  };

  function handleNameChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint,
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.caller_name = value;
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint,
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.caller_name = value;
      setCreateComplaint(allegationComplaint);
    }
  }

  function handleAddressChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint,
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.caller_address = value;
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint,
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.caller_address = value;
      setCreateComplaint(allegationComplaint);
    }
  }

  function handlePrimaryPhoneChange(value: string) {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setPrimaryPhoneMsg("Phone number must be 10 digits");
    } else if (
      value !== undefined &&
      (value.startsWith("+11") || value.startsWith("+10"))
    ) {
      setPrimaryPhoneMsg("Invalid Format");
    } else {
      setPrimaryPhoneMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint,
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_1 = value ?? "";
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint,
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_1 = value ?? "";
        setCreateComplaint(allegationComplaint);
      }
    }
  }
  function handleSecondaryPhoneChange(value: string) {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setSecondaryPhoneMsg("Phone number must be 10 digits");
    } else if (
      value !== undefined &&
      (value.startsWith("+11") || value.startsWith("+10"))
    ) {
      setSecondaryPhoneMsg("Invalid Format");
    } else {
      setSecondaryPhoneMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint,
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_2 = value ?? "";
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint,
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_2 = value ?? "";
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  function handleAlternatePhoneChange(value: string) {
    if (value !== undefined && value.length !== 0 && value.length !== 12) {
      setAlternatePhoneMsg("Phone number must be 10 digits");
    } else if (
      value !== undefined &&
      (value.startsWith("+11") || value.startsWith("+10"))
    ) {
      setAlternatePhoneMsg("Invalid Format");
    } else {
      setAlternatePhoneMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint,
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_3 = value ?? "";
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint,
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_3 = value ?? "";
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  function handleEmailChange(value: string) {
    let re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (value !== undefined && value !== "" && !re.test(value)) {
      setEmailMsg("Please enter a vaild email");
    } else {
      setEmailMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint,
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_email = value;
        setCreateComplaint(hwcrComplaint);
      }
      if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint,
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_email = value;
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  const handleReferredByChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;

      let update = cloneDeep(createComplaint) as
        | HwcrComplaint
        | AllegationComplaint;

      const { complaint_identifier: identifier } = update;
      const { referred_by_agency_code: source } = identifier;

      const updatedEntity = value
        ? {
            ...source,
            short_description: value,
            long_description: label as string,
            agency_code: value,
          }
        : {
            agency_code: "",
            short_description: "",
            long_description: "",
            display_order: 0,
            active_ind: true,
            create_user_id: "",
            create_utc_timestamp: null,
            update_user_id: "",
            update_utc_timestamp: null,
          };

      const updatedParent = {
        ...identifier,
        referred_by_agency_code: updatedEntity,
      };

      update.complaint_identifier = updatedParent;

      setCreateComplaint(update);
    }
  };

  function handleSuspectDetailsChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint =
        createComplaint as AllegationComplaint;
      allegationComplaint.suspect_witnesss_dtl_text = value;
      setCreateComplaint(allegationComplaint);
    }
  }
  // Get the code table lists to populate the Selects
  const speciesCodes = useSelector(selectSpeciesCodeDropdown) as Option[];
  const hwcrNatureOfComplaintCodes = useSelector(
    selectHwcrNatureOfComplaintCodeDropdown,
  ) as Option[];
  const complaintTypeCodes = useSelector(selectComplaintTypeDropdown) as Option[];
  const areaCodes = useAppSelector(selectCommunityCodeDropdown)
  
  const attractantCodes = useSelector(selectAttractantCodeDropdown) as Option[];
  const referredByAgencyCodes = useSelector(selectAgencyDropdown) as Option[];
  const violationTypeCodes = useSelector(
    selectViolationCodeDropdown,
  ) as Option[];

  const yesNoOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  function handleIncidentDateTimeChange(date: Date) {
      setSelectedIncidentDateTime(date);
      
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint,
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.incident_utc_datetime =
          date;
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint,
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.incident_utc_datetime =
          date;
        setCreateComplaint(allegationComplaint);
      }
  }

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
        modalType: CancelConfirm,
        data: {
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed,
        },
      }),
    );
  };

  const setErrors = async (complaint: HwcrComplaint | AllegationComplaint) => {
    let noError = true;
    if (!complaintType) {
      setComplaintTypeMsg("Required");
    }
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      const hwcrComplaint = complaint as HwcrComplaint;
      if (
        hwcrComplaint.hwcr_complaint_nature_code.hwcr_complaint_nature_code ===
        ""
      ) {
        await setNOCErrorMsg("Required");
        noError = false;
      }
      if (hwcrComplaint.species_code.species_code === "") {
        await setSpeciesErrorMsg("Required");
        noError = false;
      }
    }
    else if(complaintType === COMPLAINT_TYPES.ERS)
    {
      const allegationComplaint = complaint as AllegationComplaint;
      if(allegationComplaint.violation_code.violation_code === "")
      {
        await setViolationTypeErrorMsg("Required");
        noError = false;
      }
    }
    if (
      complaint.complaint_identifier.complaint_status_code
        .complaint_status_code === ""
    ) {
      await setStatusErrorMsg("Required");
      noError = false;
    }
    if (
      complaint.complaint_identifier.geo_organization_unit_code
        .geo_organization_unit_code === ""
    ) {
      await setCommunityErrorMsg("Required");
      noError = false;
    }
    if (complaint.complaint_identifier.detail_text === "") {
      await setComplaintDescErrorMsg("Required");
      noError = false;
    }
    return noError;
  };

  const saveButtonClick = async () => {
    if (!createComplaint) {
      return;
    }
  
    let complaint = createComplaint;
    setComplaintToOpenStatus(complaint);
  
    const noError = await setErrors(complaint);
  
    if (noError && noErrors()) {
      await handleComplaintProcessing(complaint);
    } else {
      handleFormErrors();
    }
  };
  
  const setComplaintToOpenStatus = (complaint: HwcrComplaint | AllegationComplaint) => {
    const openStatus = {
      short_description: "OPEN",
      long_description: "Open",
      complaint_status_code: "OPEN",
      display_order: 0,
      active_ind: false,
      create_user_id: "",
      create_utc_timestamp: null,
      update_user_id: "",
      update_utc_timestamp: null,
    };
    complaint.complaint_identifier.complaint_status_code = openStatus;
  };
  
  const handleComplaintProcessing = async (complaint: HwcrComplaint | AllegationComplaint) => {
    updateComplaintDetails(complaint);
    setCreateComplaint(complaint);
  
    let complaintId = await processComplaintBasedOnType(complaint);
    if (complaintId) {
      handleAttachments(dispatch, attachmentsToAdd, attachmentsToDelete, complaintId, setAttachmentsToAdd, setAttachmentsToDelete);
    }
  
    setErrorNotificationClass("comp-complaint-error display-none");
  };
  
  const updateComplaintDetails = (complaint: HwcrComplaint | AllegationComplaint) => {
    const now = new Date().toDateString();
    complaint.complaint_identifier.create_utc_timestamp = now;
    complaint.complaint_identifier.update_utc_timestamp = now;
    complaint.complaint_identifier.create_user_id = userid;
    complaint.complaint_identifier.update_user_id = userid;
    complaint.complaint_identifier.location_geometry_point.type = "Point";
  
    if (
      complaint.complaint_identifier.location_geometry_point.coordinates.length === 0
    ) {
      complaint.complaint_identifier.location_geometry_point.coordinates = [0, 0];
    }
  };
  
  const processComplaintBasedOnType = async (complaint: HwcrComplaint | AllegationComplaint) => {
    switch (complaintType) {
      case COMPLAINT_TYPES.HWCR:
        return handleHwcrComplaint(complaint);
      case COMPLAINT_TYPES.ERS:
        return handleErsComplaint(complaint);
      default:
        return null;
    }
  };
  
  const handleHwcrComplaint = async (complaint: HwcrComplaint | AllegationComplaint) => {
    const complaintId = await dispatch(
      createWildlifeComplaint(complaint as HwcrComplaint)
    );
    if (complaintId) {
      await dispatch(
        getWildlifeComplaintByComplaintIdentifierSetUpdate(
          complaintId,
          setCreateComplaint
        )
      );
  
      navigate("/complaint/" + complaintType + "/" + complaintId);
    }
    return complaintId;
  };
  
  const handleErsComplaint = async (complaint: HwcrComplaint | AllegationComplaint) => {
    const complaintId = await dispatch(
      createAllegationComplaint(complaint as AllegationComplaint)
    );
    if (complaintId) {
      await dispatch(
        getAllegationComplaintByComplaintIdentifierSetUpdate(
          complaintId,
          setCreateComplaint
        )
      );
  
      navigate("/complaint/" + complaintType + "/" + complaintId);
    }
    return complaintId;
  };
  
  const handleFormErrors = () => {
    ToggleError("Errors in form");
    setErrorNotificationClass("comp-complaint-error");
  };
  

  const maxDate = new Date();

  return (
    <div className="comp-complaint-details">
      <ToastContainer />
      <CreateComplaintHeader
        complaintType={complaintType}
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
      />
      {/* edit header block */}
      <div id="complaint-error-notification" className={errorNotificationClass}>
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
              <label id="nature-of-complaint-label-id">
                Complaint Type<span className="required-ind">*</span>
              </label>
              <ValidationSelect
                id="complaint-type-select-id"
                options={complaintTypeCodes}
                placeholder="Select"
                className="comp-details-input"
                classNamePrefix="comp-select"
                defaultValue={complaintTypeCodes.find((option) => option.value === complaintType,)}
                onChange={(e) => handleComplaintChange(e)}
                errMsg={complaintTypeMsg}
              />
            </div>
            {complaintType === COMPLAINT_TYPES.HWCR && (
              <div
                className="comp-details-label-input-pair"
                id="nature-of-complaint-pair-id"
              >
                <label id="nature-of-complaint-label-id">
                  Nature of Complaint<span className="required-ind">*</span>
                </label>
                <ValidationSelect
                  id="nature-of-complaint-select-id"
                  options={hwcrNatureOfComplaintCodes}
                  placeholder="Select"
                  className="comp-details-input"
                  classNamePrefix="comp-select"
                  onChange={(e) => handleNOCChange(e)}
                  errMsg={nocErrorMsg}
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
              <label id="officer-assigned-select-label-id">
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
            <div
                  className="comp-details-label-input-pair"
                  id="office-pair-id"
                >
                  <label>Status</label>
                  <div className="comp-details-edit-input">
                    <input
                      type="text"
                      id="status-readonly-id"
                      className="comp-form-control"
                      disabled
                      defaultValue="Open"
                    />
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
                <ValidationTextArea
                  className="comp-form-control"
                  id="complaint-description-textarea-id"
                  rows={4}
                  errMsg={complaintDescErrorMsg}
                  onChange={handleComplaintDescChange}
                  maxLength={4000}
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
                  maxDate={maxDate}
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
                      errMsg={attractantsErrorMsg}
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
                <label id="complaint-location-label-id">
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
                  onChange={(e) =>
                    handleLocationDescriptionChange(e.target.value)
                  }
                  maxLength={4000}
                />
              </div>
              <CompInput
                id="comp-details-edit-x-coordinate-input"
                divId="comp-details-edit-x-coordinate-div"
                type="input"
                label="X Coordinate"
                containerClass="comp-details-edit-input"
                formClass="comp-details-label-input-pair comp-margin-top-30"
                inputClass="comp-form-control"
                error={geoPointXMsg}
                step="any"
                onChange={(evt: any) =>
                  handleCoordinateChange(
                    evt.target.value,
                    Coordinates.Longitude,
                  )
                }
              />
              <CompInput
                id="comp-details-edit-y-coordinate-input"
                divId="comp-details-edit-y-coordinate-div"
                type="input"
                label="Y Coordinate"
                containerClass="comp-details-edit-input"
                formClass="comp-details-label-input-pair comp-margin-top-30"
                inputClass="comp-form-control"
                error={geoPointYMsg}
                step="any"
                onChange={(evt: any) =>
                  handleCoordinateChange(evt.target.value, Coordinates.Latitude)
                }
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
              <div className="comp-details-label-input-pair" id="zone-pair-id">
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
          coordinates={{ lat: +latitude, lng: +longitude }}
          complaintType={complaintType}
          draggable={false}
          hideMarker={
            !latitude || !longitude || +latitude === 0 || +longitude === 0
          }
          editComponent={false}
        />
        }
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
                <label>Address</label>
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

              <div className="comp-details-label-input-pair" id="email-pair-id">
                <label>Email</label>
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
                id="referred-pair-id"
              >
                <label>Referred by / Complaint Agency</label>
                <div className="comp-details-edit-input">
                  <CompSelect
                    id="referred-select-id"
                    classNamePrefix="comp-select"
                    className="comp-details-edit-input"
                    options={referredByAgencyCodes}
                    defaultOption={{ label: "None", value: undefined }}
                    placeholder="Select"
                    enableValidation={false}
                    onChange={(e) => handleReferredByChange(e)}
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
                    id="complaint-caller-info-name-label-id"
                    className="col-auto"
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
      <AttachmentsCarousel
            allowUpload={true}
            allowDelete={true}
            onFilesSelected={handleAddAttachments}
            onFileDeleted={handleDeleteAttachment}
          />
    </div>
  );
};
