import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import {
  bcBoundaries,
  formatDate,
  formatTime,
} from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";
import {
  selectComplaintDetails,
  selectComplaintHeader,
  selectComplaintCallerInformation,
  selectComplaintSuspectWitnessDetails,
  selectComplaint,
  setComplaint,
  setGeocodedComplaintCoordinates,
  updateWildlifeComplaint,
  getWildlifeComplaintByComplaintIdentifierSetUpdate,
  updateAllegationComplaint,
  getAllegationComplaintByComplaintIdentifierSetUpdate,
} from "../../../../store/reducers/complaints";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  selectAgencyDropdown,
  selectComplaintStatusCodeDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
  selectHwcrNatureOfComplaintCodeDropdown,
  selectAttractantCodeDropdown,
  selectCommunityCodeDropdown,
} from "../../../../store/reducers/code-table";
import { useSelector } from "react-redux";
import { Officer } from "../../../../types/person/person";
import Option from "../../../../types/app/option";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { ComplaintSuspectWitness } from "../../../../types/complaints/details/complaint-suspect-witness-details";
import { selectOfficersByZone } from "../../../../store/reducers/officer";
import { ComplaintLocation } from "./complaint-location";
import { ValidationSelect } from "../../../../common/validation-select";
import { HwcrComplaint } from "../../../../types/complaints/hwcr-complaint";
import { AllegationComplaint } from "../../../../types/complaints/allegation-complaint";
import { cloneDeep } from "lodash";
import { ValidationTextArea } from "../../../../common/validation-textarea";
import { ValidationMultiSelect } from "../../../../common/validation-multiselect";
import { ValidationInput } from "../../../../common/validation-input";
import { ValidationPhoneInput } from "../../../../common/validation-phone-input";
import notificationInvalid from "../../../../../assets/images/notification-invalid.png";
import { CompSelect } from "../../../common/comp-select";
import { CompInput } from "../../../common/comp-input";
import { from } from "linq-to-typescript";
import { openModal, userId } from "../../../../store/reducers/app";
import { useParams } from "react-router-dom";
import { CancelConfirm } from "../../../../types/modal/modal-types";
import { ToggleError } from "../../../../common/toast";
import { ToastContainer } from "react-toastify";
import { ComplaintHeader } from "./complaint-header";
import { CallDetails } from "./call-details";
import { CallerInformation } from "./caller-information";
import { SuspectWitnessDetails } from "./suspect-witness-details";
import { AttachmentsCarousel } from "../../../common/attachments-carousel";
import { generateApiParameters, putFile } from "../../../../common/api";
import config from "../../../../../config";

type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetailsEdit: FC = () => {
  const dispatch = useAppDispatch();

  const { id = "", complaintType = "" } = useParams<ComplaintParams>();

  const complaint = useAppSelector(selectComplaint);

  const [readOnly, setReadOnly] = useState(true);
  const [updateComplaint, setUpdateComplaint] = useState<
    HwcrComplaint | AllegationComplaint | null | undefined
  >(complaint);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaint(null));
      dispatch(setGeocodedComplaintCoordinates(null));
    };
  }, [dispatch]);

  const editButtonClick = () => {
    setReadOnly(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const cancelConfirmed = () => {
    setReadOnly(true);
    setErrorNotificationClass("comp-complaint-error display-none");
    setNOCErrorMsg("");
    setSpeciesErrorMsg("");
    setStatusErrorMsg("");
    setComplaintDescErrorMsg("");
    setAttractantsErrorMsg("");
    setCommunityErrorMsg("");
    setGeoPointXMsg("");
    setGeoPointYMsg("");
    setEmailMsg("");
    setPrimaryPhoneMsg("");
    setSecondaryPhoneMsg("");
    setAlternatePhoneMsg("");
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
      })
    );
  };

  const [attachments, setAttachments] = useState<FileList | null>(null);

  const handleAddAttachments = (selectedFiles: FileList) => {
    setAttachments(selectedFiles);
  };

  const handleUpload = async () => {
    debugger;
    if (attachments) {
      const attachmentsArray = Array.from(attachments);
      attachmentsArray.forEach((attachment) => {
        const header = {
          "x-amz-meta-complaint-id": id,
          "Content-Disposition": `attachment; filename=${attachment?.name}`,
          "Content-Type": attachment?.type,
        };

        const formData = new FormData();
        formData.append("file", attachment);

        try {
          const parameters = generateApiParameters(
            `${config.COMS_URL}/object?bucketId=${config.COMS_BUCKET}`
          );

          const response = putFile<string>(
            dispatch,
            parameters,
            header,
            attachment
          );
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      });
    }
  };

  const [errorNotificationClass, setErrorNotificationClass] = useState(
    "comp-complaint-error display-none"
  );
  const saveButtonClick = async () => {
    if (!updateComplaint) {
      return;
    }
    if (noErrors()) {
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint = updateComplaint as HwcrComplaint;
        await dispatch(updateWildlifeComplaint(hwcrComplaint));
        dispatch(
          getWildlifeComplaintByComplaintIdentifierSetUpdate(
            hwcrComplaint.complaint_identifier.complaint_identifier,
            setUpdateComplaint
          )
        );
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint = updateComplaint as AllegationComplaint;
        await dispatch(updateAllegationComplaint(allegationComplaint));
        dispatch(
          getAllegationComplaintByComplaintIdentifierSetUpdate(
            allegationComplaint.complaint_identifier.complaint_identifier,
            setUpdateComplaint
          )
        );
      }
      setErrorNotificationClass("comp-complaint-error display-none");
      setReadOnly(true);
    } else {
      ToggleError("Errors in form");
      setErrorNotificationClass("comp-complaint-error");
    };
    handleUpload();
  };

  useEffect(() => {
    if (
      !complaint ||
      complaint.complaint_identifier.complaint_identifier !== id
    ) {
      if (id) {
        switch (complaintType) {
          case COMPLAINT_TYPES.ERS:
            dispatch(
              getAllegationComplaintByComplaintIdentifierSetUpdate(
                id,
                setUpdateComplaint
              )
            );
            break;
          case COMPLAINT_TYPES.HWCR:
            dispatch(
              getWildlifeComplaintByComplaintIdentifierSetUpdate(
                id,
                setUpdateComplaint
              )
            );
            break;
        }
      }
    }
  }, [id, complaintType, complaint, dispatch]);

  const [nocErrorMsg, setNOCErrorMsg] = useState<string>("");
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

  function noErrors() {
    let noErrors = false;
    if (
      nocErrorMsg === "" &&
      speciesErrorMsg === "" &&
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
      noErrors = true;
    }
    return noErrors;
  }

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
    referredByAgencyCode,
  } = useAppSelector(selectComplaintCallerInformation);

  const userid = useAppSelector(userId);

  const officerList = useAppSelector(selectOfficersByZone(zone_code));

  const { details: complaint_witness_details } = useAppSelector(
    selectComplaintSuspectWitnessDetails
  ) as ComplaintSuspectWitness;

  const officersInZoneList = useAppSelector(selectOfficersByZone(zone_code));

  useEffect(() => {
    const incidentDateTimeObject = incidentDateTime
      ? new Date(incidentDateTime)
      : null;
    if (incidentDateTimeObject) {
      setSelectedIncidentDateTime(incidentDateTimeObject);
    }
  }, [incidentDateTime]);

  const [selectedIncidentDateTime, setSelectedIncidentDateTime] =
    useState<Date>();

  // Transform the fetched data into the DropdownOption type

  let assignableOfficers: Option[] =
    officersInZoneList !== null
      ? officersInZoneList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
      : [];

  // Get the code table lists to populate the Selects
  const complaintStatusCodes = useSelector(
    selectComplaintStatusCodeDropdown
  ) as Option[];
  const speciesCodes = useSelector(selectSpeciesCodeDropdown) as Option[];
  const hwcrNatureOfComplaintCodes = useSelector(
    selectHwcrNatureOfComplaintCodeDropdown
  ) as Option[];

  const areaCodes = useAppSelector(selectCommunityCodeDropdown);

  const attractantCodes = useSelector(selectAttractantCodeDropdown) as Option[];
  const referredByAgencyCodes = useSelector(selectAgencyDropdown) as Option[];
  const violationTypeCodes = useSelector(
    selectViolationCodeDropdown
  ) as Option[];

  const yesNoOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // Used to set selected values in the dropdowns
  const selectedStatus = complaintStatusCodes.find(
    (option) => option.value === statusCode
  );
  const selectedSpecies = speciesCodes.find(
    (option) => option.value === speciesCode
  );
  const selectedNatureOfComplaint = hwcrNatureOfComplaintCodes.find(
    (option) => option.value === natureOfComplaintCode
  );
  const selectedAreaCode = areaCodes.find((option) => option.label === area);
  const selectedAssignedOfficer = assignableOfficers?.find(
    (option) => option.value === personGuid
  );
  const selectedAgencyCode = referredByAgencyCodes.find(
    (option) =>
      option.value ===
      (referredByAgencyCode?.agency_code === undefined
        ? ""
        : referredByAgencyCode.agency_code)
  );
  const selectedAttractants = attractantCodes.filter(
    (option) =>
      attractants?.some((attractant) => attractant.code === option.value)
  );
  const selectedViolationTypeCode = violationTypeCodes.find(
    (option) => option.value === violationTypeCode
  );
  const selectedViolationInProgress = yesNoOptions.find(
    (option) => option.value === (violationInProgress ? "Yes" : "No")
  );
  const selectedViolationObserved = yesNoOptions.find(
    (option) => option.value === (violationObserved ? "Yes" : "No")
  );

  //--
  const getEditableCoordinates = (
    input: Array<number> | Array<string> | undefined,
    type: Coordinates
  ): string => {
    if (!input) {
      return "";
    }

    let result = type === Coordinates.Longitude ? input[0] : input[1];
    return result === 0 || result === "0" ? "" : result.toString();
  };

  const [latitude, setLatitude] = useState<string>("0");
  const [longitude, setLongitude] = useState<string>("0");

  useEffect(() => {
    setLongitude(getEditableCoordinates(coordinates, Coordinates.Longitude));
    setLatitude(getEditableCoordinates(coordinates, Coordinates.Latitude));
  }, [coordinates]);

  const handleMarkerMove = async (lat: number, lng: number) => {
    await updateCoordinates(lat, lng);
    await updateValidation(lat, lng);
  };

  async function updateCoordinates(lat: number, lng: number) {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  }

  async function updateValidation(lat: number, lng: number) {
    handleGeoPointChange(lat.toString(), lng.toString());
  }

  function handleIncidentDateTimeChange(date: Date) {
    setSelectedIncidentDateTime(date);
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        updateComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.incident_utc_datetime = date;
      setUpdateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        updateComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.incident_utc_datetime = date;
      setUpdateComplaint(allegationComplaint);
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

  const handleNOCChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;
      if (!value) {
        setNOCErrorMsg("Required");
      } else {
        setNOCErrorMsg("");

        let update = { ...updateComplaint } as HwcrComplaint;

        const { hwcr_complaint_nature_code: source } = update;
        const updatedEntity = {
          ...source,
          short_description: value,
          long_description: label as string,
          hwcr_complaint_nature_code: value,
        };

        update.hwcr_complaint_nature_code = updatedEntity;
        setUpdateComplaint(update);
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

        let update = { ...updateComplaint } as HwcrComplaint;

        const { species_code: source } = update;
        const updatedEntity = {
          ...source,
          short_description: value,
          long_description: label as string,
          species_code: value,
        };

        update.species_code = updatedEntity;
        setUpdateComplaint(update);
      }
    }
  };

  const handleViolationTypeChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;
      if (value) {
        let update = { ...updateComplaint } as AllegationComplaint;

        const { violation_code: source } = update;
        const updatedEntity = {
          ...source,
          short_description: value,
          long_description: label as string,
          violation_code: value,
        };

        update.violation_code = updatedEntity;
        setUpdateComplaint(update);
      }
    }
  };

  const handleStatusChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;
      if (!value) {
        setStatusErrorMsg("Required");
      } else {
        setStatusErrorMsg("");

        let update = { ...updateComplaint } as
          | HwcrComplaint
          | AllegationComplaint;

        const { complaint_identifier: identifier } = update;
        const { complaint_status_code: source } = identifier;

        const updatedEntity = {
          ...source,
          short_description: value,
          long_description: label as string,
          complaint_status_code: value,
        };

        const updatedParent = {
          ...identifier,
          complaint_status_code: updatedEntity,
        };
        update.complaint_identifier = updatedParent;

        setUpdateComplaint(update);
      }
    }
  };

  const handleAssignedOfficerChange = (selected: Option | null) => {
    if (selected) {
      const { value } = selected;

      let update = { ...updateComplaint } as
        | HwcrComplaint
        | AllegationComplaint;

      const { complaint_identifier: identifier } = update;
      let { person_complaint_xref: source, complaint_identifier: id } =
        identifier;
      if (value !== "Unassigned") {
        const selectedOfficer = officerList?.find(
          ({ person_guid: { person_guid: id } }) => {
            return id === value;
          }
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

        setUpdateComplaint(update);
      } else if (from(source).any() && from(source).elementAt(0)) {
        const assigned = { ...source[0], active_ind: false };
        source = [assigned];

        const updatedParent = {
          ...identifier,
          person_complaint_xref: source,
        };

        update.complaint_identifier = updatedParent;
        setUpdateComplaint(update);
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
          updateComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.detail_text = value;
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.detail_text = value;
        setUpdateComplaint(allegationComplaint);
      }
    }
  }

  function handleLocationDescriptionChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        updateComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.location_detailed_text = value;
      setUpdateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        updateComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.location_detailed_text = value;
      setUpdateComplaint(allegationComplaint);
    }
  }

  function handleViolationInProgessChange(selectedOption: Option | null) {
    let allegationComplaint: AllegationComplaint = cloneDeep(
      updateComplaint
    ) as AllegationComplaint;
    allegationComplaint.in_progress_ind = selectedOption?.value === "Yes";
    setUpdateComplaint(allegationComplaint);
  }

  function handleViolationObservedChange(selectedOption: Option | null) {
    let allegationComplaint: AllegationComplaint = cloneDeep(
      updateComplaint
    ) as AllegationComplaint;
    allegationComplaint.observed_ind = selectedOption?.value === "Yes";
    setUpdateComplaint(allegationComplaint);
  }

  function handleLocationChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        updateComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.location_summary_text = value ?? "";
      setUpdateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        updateComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.location_summary_text =
        value ?? "";
      setUpdateComplaint(allegationComplaint);
    }
  }

  async function handleAttractantsChange(selectedOptions: Option[] | null) {
    if (!selectedOptions) {
      return;
    }
    let update = { ...updateComplaint } as HwcrComplaint;
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
    setUpdateComplaint(update);
  }

  function handleCommunityChange(selectedOption: Option | null) {
    if (!selectedOption) {
      return;
    }
    if (selectedOption.value === "") {
      setCommunityErrorMsg("Required");
    } else {
      setCommunityErrorMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          updateComplaint
        ) as HwcrComplaint;
        if (selectedOption.value !== undefined) {
          const geoOrgCode = {
            geo_organization_unit_code: selectedOption.value,
            short_description: "",
            long_description: "",
            display_order: "",
            active_ind: "",
            create_user_id: "",
            create_utc_timestamp: null,
            update_user_id: "",
            update_utc_timestamp: null,
          };

          hwcrComplaint.complaint_identifier.cos_geo_org_unit = {
            zone_code: "",
            office_location_name: "",
            area_code: selectedOption.value,
            area_name: "",
          };

          hwcrComplaint.complaint_identifier.geo_organization_unit_code =
            geoOrgCode;
        }
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        if (selectedOption.value !== undefined) {
          const geoOrgCode = {
            geo_organization_unit_code: selectedOption.value,
            short_description: "",
            long_description: "",
            display_order: "",
            active_ind: "",
            create_user_id: "",
            create_utc_timestamp: null,
            update_user_id: "",
            update_utc_timestamp: null,
          };

          allegationComplaint.complaint_identifier.cos_geo_org_unit = {
            zone_code: "",
            office_location_name: "",
            area_code: selectedOption.value,
            area_name: "",
          };

          allegationComplaint.complaint_identifier.geo_organization_unit_code =
            geoOrgCode;
        }
        setUpdateComplaint(allegationComplaint);
      }
    }
  }

  const handleGeoPointChange = (latitude: string, longitude: string) => {
    //-- clear errors
    setGeoPointXMsg("");
    setGeoPointYMsg("");

    //-- clone the complaint
    const complaint =
      complaintType === COMPLAINT_TYPES.HWCR
        ? (cloneDeep(updateComplaint) as HwcrComplaint)
        : (cloneDeep(updateComplaint) as AllegationComplaint);

    //-- verify latitude and longitude
    if (latitude && !Number.isNaN(latitude)) {
      const item = parseFloat(latitude);
      if (item > bcBoundaries.maxLatitude || item < bcBoundaries.minLatitude) {
        setGeoPointYMsg(
          `Value must be between ${bcBoundaries.maxLatitude} and ${bcBoundaries.minLatitude} degrees`
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
          `Value must be between ${bcBoundaries.minLongitude} and ${bcBoundaries.maxLongitude} degrees`
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
      setUpdateComplaint(complaint);
    } else if (latitude === "" && longitude === "") {
      complaint.complaint_identifier.location_geometry_point.coordinates[
        Coordinates.Longitude
      ] = 0;
      complaint.complaint_identifier.location_geometry_point.coordinates[
        Coordinates.Latitude
      ] = 0;
      setUpdateComplaint(complaint);
    }
  };

  function handleNameChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        updateComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.caller_name = value;
      setUpdateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        updateComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.caller_name = value;
      setUpdateComplaint(allegationComplaint);
    }
  }

  function handleAddressChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        updateComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.caller_address = value;
      setUpdateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        updateComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.caller_address = value;
      setUpdateComplaint(allegationComplaint);
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
          updateComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_1 = value ?? "";
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_1 = value ?? "";
        setUpdateComplaint(allegationComplaint);
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
          updateComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_2 = value ?? "";
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_2 = value ?? "";
        setUpdateComplaint(allegationComplaint);
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
          updateComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_3 = value ?? "";
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_3 = value ?? "";
        setUpdateComplaint(allegationComplaint);
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
          updateComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_email = value;
        setUpdateComplaint(hwcrComplaint);
      }
      if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_email = value;
        setUpdateComplaint(allegationComplaint);
      }
    }
  }

  const handleReferredByChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;

      let update = cloneDeep(updateComplaint) as
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

      setUpdateComplaint(update);
    }
  };

  function handleSuspectDetailsChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint =
        updateComplaint as AllegationComplaint;
      allegationComplaint.suspect_witnesss_dtl_text = value;
      setUpdateComplaint(allegationComplaint);
    }
  }

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
      {readOnly && complaintType === COMPLAINT_TYPES.ERS && (
        <SuspectWitnessDetails />
      )}
      {!readOnly && (
        <>
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
                    <ValidationSelect
                      id="nature-of-complaint-select-id"
                      options={hwcrNatureOfComplaintCodes}
                      placeholder="Select"
                      className="comp-details-input"
                      classNamePrefix="comp-select"
                      defaultValue={selectedNatureOfComplaint}
                      onChange={(e) => handleNOCChange(e)}
                      errMsg={nocErrorMsg}
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
                    <ValidationSelect
                      className="comp-details-input"
                      options={speciesCodes}
                      defaultValue={selectedSpecies}
                      placeholder="Select"
                      id="species-select-id"
                      classNamePrefix="comp-select"
                      onChange={(e) => handleSpeciesChange(e)}
                      errMsg={speciesErrorMsg}
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
                      onChange={(e) => handleViolationTypeChange(e)}
                      classNamePrefix="comp-select"
                    />
                  </div>
                )}
                <div
                  className="comp-details-label-input-pair"
                  id="status-pair-id"
                >
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
                    errMsg={statusErrorMsg}
                  />
                </div>
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
                    value={selectedAssignedOfficer}
                  />
                </div>
              </div>
              <div className="comp-details-edit-column comp-details-right-column">
                <div
                  className="comp-details-label-input-pair"
                  id="date-time-pair-id"
                >
                  <label id="date-time-logged-label-id">
                    Date / Time Logged
                  </label>
                  <div className="comp-details-input">
                    <i className="bi bi-calendar comp-margin-right-xs"></i>
                    {formatDate(loggedDate)}
                    <i className="bi bi-clock comp-margin- left-xs comp-margin-right-xs"></i>
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
                      Complaint Description
                      <span className="required-ind">*</span>
                    </label>
                    <ValidationTextArea
                      className="comp-form-control"
                      id="complaint-description-textarea-id"
                      defaultValue={details !== undefined ? details : ""}
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
                    <div
                      className="comp-details-label-input-pair"
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
                        defaultValue={location}
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
                      defaultValue={locationDescription}
                      rows={4}
                      onChange={(e) =>
                        handleLocationDescriptionChange(e.target.value)
                      }
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
                    onChange={(evt: any) =>
                      handleCoordinateChange(
                        evt.target.value,
                        Coordinates.Longitude
                      )
                    }
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
                    onChange={(evt: any) =>
                      handleCoordinateChange(
                        evt.target.value,
                        Coordinates.Latitude
                      )
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
                        defaultValue={selectedAreaCode}
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
                        defaultValue={office}
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
                        defaultValue={zone}
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
                  <div
                    className="comp-details-label-input-pair"
                    id="name-pair-id"
                  >
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
                        defaultValue={name}
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
                  <div
                    className="comp-details-label-input-pair"
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

                  <div
                    className="comp-details-label-input-pair"
                    id="email-pair-id"
                  >
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
                        value={selectedAgencyCode}
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
                        defaultValue={complaint_witness_details}
                        rows={4}
                        onChange={(e) =>
                          handleSuspectDetailsChange(e.target.value)
                        }
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
            onFilesSelected={handleAddAttachments}
          />
          <ComplaintLocation
            coordinates={{ lat: +latitude, lng: +longitude }}
            complaintType={complaintType}
            draggable={true}
            onMarkerMove={handleMarkerMove}
            hideMarker={
              !latitude || !longitude || +latitude === 0 || +longitude === 0
            }
            editComponent={true}
          />
        </>
      )}
      {readOnly && <AttachmentsCarousel complaintIdentifier={id} />}
      {readOnly && (
        <ComplaintLocation
          coordinates={{ lat: +latitude, lng: +longitude }}
          complaintType={complaintType}
          draggable={false}
          hideMarker={
            !latitude || !longitude || +latitude === 0 || +longitude === 0
          }
          editComponent={true}
        />
      )}
    </div>
  );
};
