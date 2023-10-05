import { FC, useState } from "react";
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
import { AgencyCode } from "../../../../types/code-tables/agency-code";
import Option from "../../../../types/app/option";
import { HwcrComplaint } from "../../../../types/complaints/hwcr-complaint";
import config from "../../../../../config";
import axios from "axios";
import { AllegationComplaint } from "../../../../types/complaints/allegation-complaint";
import { cloneDeep } from "lodash";
import { PersonComplaintXref } from "../../../../types/complaints/person-complaint-xref";
import { Coordinates } from "../../../../types/app/coordinate-type";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { openModal, userId } from "../../../../store/reducers/app";
import notificationInvalid from "../../../../../assets/images/notification-invalid.png";
import { useSelector } from "react-redux";
import { selectAgencyDropdown, selectAreaCodeDropdown, selectAttractantCodeDropdown, selectComplaintStatusCodeDropdown, selectHwcrNatureOfComplaintCodeDropdown, selectSpeciesCodeDropdown, selectViolationCodeDropdown } from "../../../../store/reducers/code-table";
import { Officer } from "../../../../types/person/person";
import { selectOfficersByZone } from "../../../../store/reducers/officer";
import { CreateComplaintHeader } from "./create-complaint-header";
import { Button } from "react-bootstrap";
import { CancelConfirm } from "../../../../types/modal/modal-types";
import { useNavigate } from "react-router-dom";
import { createWildlifeComplaint, getWildlifeComplaintByComplaintIdentifierSetUpdate } from "../../../../store/reducers/complaints";

export const CreateComplaint: FC = () => {
  const dispatch = useAppDispatch();
  const complaintType = COMPLAINT_TYPES.HWCR;
  const userid = useAppSelector(userId);

  const emptyComplaint: HwcrComplaint = 
  {
  complaint_identifier: {
    complaint_identifier: "",
    geo_organization_unit_code: {
        geo_organization_unit_code: "",
        short_description: "",
        long_description: "",
        display_order: "",
        active_ind: "",
        create_user_id: "",
        create_timestamp: "",
        update_user_id: "",
        update_timestamp: ""
    },
    location_geometry_point: {
        type: "",
        coordinates: []
    },
    incident_datetime: "",
    incident_reported_datetime: "",
    location_summary_text: "",
    location_detailed_text: "",
    detail_text: "",
    create_user_id: "",
    create_timestamp: "",
    update_user_id: "",
    update_timestamp: "",
    complaint_status_code: {
        complaint_status_code: "",
        short_description: "",
        long_description: "",
        display_order: 0,
        active_ind: false,
        create_user_id: "",
        create_timestamp: "",
        update_user_id: "",
        update_timestamp: ""
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
        create_timestamp: "",
        update_user_id: "",
        update_timestamp: ""
    },
    cos_geo_org_unit: {
            zone_code: "",
            office_location_name: "",
            area_name: "",
            area_code: "",
    },
    person_complaint_xref: [],
  },
  hwcr_complaint_nature_code: {
      hwcr_complaint_nature_code: "",
      short_description: "",
      long_description: "",
      display_order: 0,
      active_ind: false,
      create_user_id: "",
      create_timestamp: "",
      update_user_id: "",
      update_timestamp: ""
  },
  species_code: {
      species_code: "",
      legacy_code: null,
      short_description: "",
      long_description: "",
      display_order: 0,
      active_ind: false,
      create_user_id: "",
      create_timestamp: "",
      update_user_id: "",
      update_timestamp: ""
  },
  update_timestamp: "",
  hwcr_complaint_guid: "",
  attractant_hwcr_xref: [],
};

  const [createComplaint, setCreateComplaint] = useState<
  HwcrComplaint | AllegationComplaint | null | undefined
>(emptyComplaint);

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
  const [selectedIncidentDateTime, setSelectedIncidentDateTime] = useState<Date>();

  const [errorNotificationClass, setErrorNotificationClass] = useState(
    "comp-complaint-error display-none"
  );
  

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

  async function handleNOCChange(selectedOption: Option | null) {
    if (selectedOption !== null && selectedOption !== undefined) {
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        if (selectedOption.value === "") {
          setNOCErrorMsg("Required");
        } else {
          setNOCErrorMsg("");
          let hwcrComplaint: HwcrComplaint = {
            ...createComplaint,
          } as HwcrComplaint;
          axios
            .get(
              `${config.API_BASE_URL}/v1/hwcr-complaint-nature-code/` +
                selectedOption.value
            )
            .then((response) => {
              hwcrComplaint.hwcr_complaint_nature_code = response.data;
              setCreateComplaint(hwcrComplaint);
            });
        }
      }
    }
  }

  function handleIncidentDateTimeChange(date: Date) {
    setSelectedIncidentDateTime(date);
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.incident_datetime =
        date.toDateString();
        setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.incident_datetime =
        date.toDateString();
        setCreateComplaint(allegationComplaint);
    }
  }

  function handleSpeciesChange(selectedOption: Option | null) {
    if (selectedOption !== null && selectedOption !== undefined) {
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        if (selectedOption.value === "") {
          setSpeciesErrorMsg("Required");
        } else {
          setSpeciesErrorMsg("");
          let hwcrComplaint: HwcrComplaint = {
            ...createComplaint,
          } as HwcrComplaint;
          axios
            .get(
              `${config.API_BASE_URL}/v1/species-code/` + selectedOption.value
            )
            .then((response) => {
              hwcrComplaint.species_code = response.data;
              setCreateComplaint(hwcrComplaint);
            });
        }
      }
    }
  }

  function handleViolationTypeChange(selectedOption: Option | null) {
    if (selectedOption !== null && selectedOption !== undefined) {
      if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = {
          ...createComplaint,
        } as AllegationComplaint;
        axios
          .get(
            `${config.API_BASE_URL}/v1/violation-code/` + selectedOption.value
          )
          .then((response) => {
            allegationComplaint.violation_code = response.data;
            setCreateComplaint(allegationComplaint);
          });
      }
    }
  }

  function handleStatusChange(selectedOption: Option | null) {
    if (selectedOption !== null && selectedOption !== undefined) {
      if (selectedOption.value === "") {
        setStatusErrorMsg("Required");
      } else {
        setStatusErrorMsg("");
        if (complaintType === COMPLAINT_TYPES.HWCR) {
          let hwcrComplaint: HwcrComplaint = cloneDeep(
            createComplaint
          ) as HwcrComplaint;
          axios
            .get(
              `${config.API_BASE_URL}/v1/complaint-status-code/` +
                selectedOption.value
            )
            .then((response) => {
              hwcrComplaint.complaint_identifier.complaint_status_code =
                response.data;
              setCreateComplaint(hwcrComplaint);
            });
        } else if (complaintType === COMPLAINT_TYPES.ERS) {
          let allegationComplaint: AllegationComplaint = cloneDeep(
            createComplaint
          ) as AllegationComplaint;
          axios
            .get(
              `${config.API_BASE_URL}/v1/complaint-status-code/` +
                selectedOption.value
            )
            .then((response) => {
              allegationComplaint.complaint_identifier.complaint_status_code =
                response.data;
              setCreateComplaint(allegationComplaint);
            });
        }
      }
    }
  }

  function handleAssignedOfficerChange(selectedOption: Option | null) {
    if (selectedOption !== null && selectedOption !== undefined) {
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint
        ) as HwcrComplaint;
        if (selectedOption.value !== "Unassigned") {
          axios
            .get(`${config.API_BASE_URL}/v1/person/` + selectedOption.value)
            .then((response) => {
              //change assignee
              if (
                hwcrComplaint.complaint_identifier.person_complaint_xref[0] !==
                undefined
              ) {
                hwcrComplaint.complaint_identifier.person_complaint_xref[0].person_guid =
                  response.data;
              }
              // create new assignee
              else {
                let personComplaintXref: PersonComplaintXref = {
                  person_guid: response.data,
                  create_user_id: userid,
                  update_user_id: userid,
                  complaint_identifier:
                    hwcrComplaint.complaint_identifier.complaint_identifier,
                  active_ind: true,
                  person_complaint_xref_code: "ASSIGNEE",
                };
                hwcrComplaint.complaint_identifier.person_complaint_xref.push(
                  personComplaintXref
                );
              }
              setCreateComplaint(hwcrComplaint);
            });
        } else {
          //unasignee complaint
          if (
            hwcrComplaint.complaint_identifier.person_complaint_xref[0] !==
            undefined
          ) {
            hwcrComplaint.complaint_identifier.person_complaint_xref[0].active_ind =
              false;
            setCreateComplaint(hwcrComplaint);
          }
        }
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint
        ) as AllegationComplaint;
        if (selectedOption.value !== "Unassigned") {
          axios
            .get(`${config.API_BASE_URL}/v1/person/` + selectedOption.value)
            .then((response) => {
              //change assignee
              if (
                allegationComplaint.complaint_identifier
                  .person_complaint_xref[0] !== undefined
              ) {
                allegationComplaint.complaint_identifier.person_complaint_xref[0].person_guid =
                  response.data;
              }
              // create new assignee
              else {
                let personComplaintXref: PersonComplaintXref = {
                  person_guid: response.data,
                  create_user_id: userid,
                  update_user_id: userid,
                  complaint_identifier:
                    allegationComplaint.complaint_identifier
                      .complaint_identifier,
                  active_ind: true,
                  person_complaint_xref_code: "ASSIGNEE",
                };
                allegationComplaint.complaint_identifier.person_complaint_xref.push(
                  personComplaintXref
                );
              }
              setCreateComplaint(allegationComplaint);
            });
        } else {
          //unasignee complaint
          if (
            allegationComplaint.complaint_identifier
              .person_complaint_xref[0] !== undefined
          ) {
            allegationComplaint.complaint_identifier.person_complaint_xref[0].active_ind =
              false;
            setCreateComplaint(allegationComplaint);
          }
        }
      }
    }
  }

  function handleComplaintDescChange(value: string) {
    if (value === "") {
      setComplaintDescErrorMsg("Required");
    } else {
      setComplaintDescErrorMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.detail_text = value;
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.detail_text = value;
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  function handleLocationDescriptionChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.location_detailed_text = value;
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.location_detailed_text = value;
      setCreateComplaint(allegationComplaint);
    }
  }

  function handleViolationInProgessChange(selectedOption: Option | null) {
    let allegationComplaint: AllegationComplaint = cloneDeep(
      createComplaint
    ) as AllegationComplaint;
    allegationComplaint.in_progress_ind =
      selectedOption?.value === "Yes" ? true : false;
    setCreateComplaint(allegationComplaint);
  }

  function handleViolationObservedChange(selectedOption: Option | null) {
    let allegationComplaint: AllegationComplaint = cloneDeep(
      createComplaint
    ) as AllegationComplaint;
    allegationComplaint.observed_ind =
      selectedOption?.value === "Yes" ? true : false;
    setCreateComplaint(allegationComplaint);
  }

  function handleLocationChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.location_summary_text =
        value === undefined ? "" : value;
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.location_summary_text =
        value === undefined ? "" : value;
      setCreateComplaint(allegationComplaint);
    }
  }

  async function handleAttractantsChange(selectedOptions: Option[] | null) {
    if (selectedOptions !== null && selectedOptions !== undefined) {
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = {
          ...createComplaint,
        } as HwcrComplaint;
        const formerAttractants = hwcrComplaint.attractant_hwcr_xref;
        let newAttractants = [];
        //this is ugly - might want a refactor, maybe there's a way to parametertize the changed option instead of the entire array?
        for (var i = 0; i < selectedOptions.length; i++) {
          const selectedOption = selectedOptions[i];
          let match = false;
          for (var j = 0; j < formerAttractants.length; j++) {
            //keep same xref
            if (
              selectedOption.value ===
              formerAttractants[j].attractant_code?.attractant_code
            ) {
              match = true;
              const attractant = {
                attractant_hwcr_xref_guid:
                  formerAttractants[j].attractant_hwcr_xref_guid,
                attractant_code: formerAttractants[j].attractant_code,
                hwcr_complaint_guid: hwcrComplaint.hwcr_complaint_guid,
                create_user_id: userid,
                active_ind: true,
              };
              newAttractants.push(attractant);
              break;
            }
          }
          //create new xref
          if (!match) {
            await axios
              .get(
                `${config.API_BASE_URL}/v1/attractant-code/` +
                  selectedOptions[i].value
              )
              .then((response) => {
                const attractant = {
                  attractant_hwcr_xref_guid: undefined,
                  attractant_code: response.data,
                  hwcr_complaint_guid: hwcrComplaint.hwcr_complaint_guid,
                  create_user_id: userid,
                  active_ind: true,
                };
                newAttractants.push(attractant);
              });
          }
        }
        for (i = 0; i < formerAttractants.length; i++) {
          let match = false;
          for (j = 0; j < newAttractants.length; j++) {
            if (
              formerAttractants[i].attractant_code ===
              newAttractants[j].attractant_code
            ) {
              match = true;
              break;
            }
          }
          //deactivate xref
          if (!match) {
            const attractant = {
              attractant_hwcr_xref_guid:
                formerAttractants[i].attractant_hwcr_xref_guid,
              attractant_code: formerAttractants[i].attractant_code,
              hwcr_complaint_guid: hwcrComplaint.hwcr_complaint_guid,
              create_user_id: userid,
              active_ind: false,
            };
            newAttractants.push(attractant);
          }
        }
        hwcrComplaint.attractant_hwcr_xref = newAttractants;
        setCreateComplaint(hwcrComplaint);
      }
    }
  }

  function handleCommunityChange(selectedOption: Option | null) {
    if (selectedOption !== null && selectedOption !== undefined) {
      if (selectedOption.value === "") {
        setCommunityErrorMsg("Required");
      } else {
        setCommunityErrorMsg("");
        if (complaintType === COMPLAINT_TYPES.HWCR) {
          let hwcrComplaint: HwcrComplaint = cloneDeep(
            createComplaint
          ) as HwcrComplaint;
          if (selectedOption.value !== undefined) {
            const geoOrgCode = {
              geo_organization_unit_code: selectedOption.value,
              short_description: "",
              long_description: "",
              display_order: "",
              active_ind: "",
              create_user_id: "",
              create_timestamp: "",
              update_user_id: "",
              update_timestamp: "",
            };
            hwcrComplaint.complaint_identifier.cos_geo_org_unit.area_code =
              selectedOption.value;
            hwcrComplaint.complaint_identifier.geo_organization_unit_code =
              geoOrgCode;
          }
          setCreateComplaint(hwcrComplaint);
        } else if (complaintType === COMPLAINT_TYPES.ERS) {
          let allegationComplaint: AllegationComplaint = cloneDeep(
            createComplaint
          ) as AllegationComplaint;
          if (selectedOption.value !== undefined) {
            const geoOrgCode = {
              geo_organization_unit_code: selectedOption.value,
              short_description: "",
              long_description: "",
              display_order: "",
              active_ind: "",
              create_user_id: "",
              create_timestamp: "",
              update_user_id: "",
              update_timestamp: "",
            };
            allegationComplaint.complaint_identifier.cos_geo_org_unit.area_code =
              selectedOption.value;
            allegationComplaint.complaint_identifier.geo_organization_unit_code =
              geoOrgCode;
          }
          setCreateComplaint(allegationComplaint);
        }
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
        ? (cloneDeep(createComplaint) as HwcrComplaint)
        : (cloneDeep(createComplaint) as AllegationComplaint);

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
      setCreateComplaint(complaint);
    }
  };

  function handleNameChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.caller_name = value;
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.caller_name = value;
      setCreateComplaint(allegationComplaint);
    }
  }

  function handleAddressChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        createComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.caller_address = value;
      setCreateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        createComplaint
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
          createComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_1 =
          value !== undefined ? value : "";
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_1 =
          value !== undefined ? value : "";
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
          createComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_2 =
          value !== undefined ? value : "";
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_2 =
          value !== undefined ? value : "";
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
          createComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_phone_3 =
          value !== undefined ? value : "";
        setCreateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_3 =
          value !== undefined ? value : "";
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  function handleEmailChange(value: string) {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value !== undefined && value !== "" && !re.test(value)) {
      setEmailMsg("Please enter a vaild email");
    } else {
      setEmailMsg("");
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint
        ) as HwcrComplaint;
        hwcrComplaint.complaint_identifier.caller_email = value;
        setCreateComplaint(hwcrComplaint);
      }
      if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_email = value;
        setCreateComplaint(allegationComplaint);
      }
    }
  }

  function handleReferredByChange(selectedOption: Option | null) {
    if (selectedOption !== null && selectedOption !== undefined) {
      const emptyOption: AgencyCode = {
        agency_code: "",
        short_description: "",
        long_description: "",
        display_order: 0,
        active_ind: true,
        create_user_id: "",
        create_timestamp: "",
        update_user_id: "",
        update_timestamp: "",
      };
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let hwcrComplaint: HwcrComplaint = cloneDeep(
          createComplaint
        ) as HwcrComplaint;
        debugger;
        if (selectedOption.value) {
          axios
            .get(
              `${config.API_BASE_URL}/v1/agency-code/` + selectedOption.value
            )
            .then((response) => {
              hwcrComplaint.complaint_identifier.referred_by_agency_code =
                response.data;
              setCreateComplaint(hwcrComplaint);
            });
        } else {
          hwcrComplaint.complaint_identifier.referred_by_agency_code =
            emptyOption;
          setCreateComplaint(hwcrComplaint);
        }
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          createComplaint
        ) as AllegationComplaint;
        if (selectedOption.value) {
          axios
            .get(
              `${config.API_BASE_URL}/v1/agency-code/` + selectedOption.value
            )
            .then((response) => {
              allegationComplaint.complaint_identifier.referred_by_agency_code =
                response.data;
              setCreateComplaint(allegationComplaint);
            });
        } else {
          allegationComplaint.complaint_identifier.referred_by_agency_code =
            emptyOption;
          setCreateComplaint(allegationComplaint);
        }
      }
    }
  }

  function handleSuspectDetailsChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint =
        createComplaint as AllegationComplaint;
      allegationComplaint.suspect_witnesss_dtl_text = value;
      setCreateComplaint(allegationComplaint);
    }
  }

  const officersInZoneList = useAppSelector(selectOfficersByZone("NCHKOLKS"));
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
  const hwcrOption: Option = {value: "HWCR", label: "Human Wildlife Conflicts"};
  const allegationOption: Option = {value: "ERS", label: "Enforcement"};
  const complaintTypeCodes = [hwcrOption, allegationOption]
  const areaCodes = useSelector(selectAreaCodeDropdown) as Option[];
  const attractantCodes = useSelector(selectAttractantCodeDropdown) as Option[];
  const referredByAgencyCodes = useSelector(selectAgencyDropdown) as Option[];
  const violationTypeCodes = useSelector(
    selectViolationCodeDropdown
  ) as Option[];

  const yesNoOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const navigate = useNavigate();

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
      })
    );
  };

  const saveButtonClick = async () => {
    if (createComplaint !== null && createComplaint !== undefined) {
        if (noErrors()) {
          if (complaintType === COMPLAINT_TYPES.HWCR) {
            let hwcrComplaint = createComplaint as HwcrComplaint;
            hwcrComplaint.complaint_identifier.complaint_identifier = "TEST-11";
            hwcrComplaint.complaint_identifier.create_timestamp = hwcrComplaint.complaint_identifier.update_timestamp = (new Date()).toDateString();
            hwcrComplaint.complaint_identifier.create_user_id = hwcrComplaint.complaint_identifier.update_user_id = userid;
            await dispatch(createWildlifeComplaint(hwcrComplaint));
            await dispatch(
              getWildlifeComplaintByComplaintIdentifierSetUpdate(
                "TEST-11",
                setCreateComplaint
              )
            );
          } 
          /*else if (complaintType === COMPLAINT_TYPES.ERS) {
            let allegationComplaint = createComplaint as AllegationComplaint;
            const complaint_identifier = await dispatch(createAllegationComplaint(allegationComplaint));
            await dispatch(
              getAllegationComplaintByComplaintIdentifierSetUpdate(
                complaint_identifier,
                setCreateComplaint
              )
            );
          }*/
        }
      }
  };


  return <div className="comp-complaint-details">
        <CreateComplaintHeader
          complaintType={COMPLAINT_TYPES.HWCR}
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
            <Select
              id="complaint-type-select-id"
              options={complaintTypeCodes}
              placeholder="Select"
              className="comp-details-input"
              classNamePrefix='comp-complaint-type-select'
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
              classNamePrefix='comp-nature-select'
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
            <Select
              className="comp-details-input"
              options={violationTypeCodes}
              placeholder="Select"
              id="violation-type-select-id"
              onChange={e => handleViolationTypeChange(e)}
              classNamePrefix='comp-violation-select'
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
            classNamePrefix='comp-officer-select'
            onChange={e => handleAssignedOfficerChange(e)}
            className="comp-details-input"
            options={assignableOfficers}
            defaultOption={{ label: "None", value: "Unassigned" }}
            placeholder="Select"
            enableValidation={false}
          />
        </div>
      </div>
      <div className="comp-details-edit-column comp-details-right-column">
        <div className="comp-details-label-input-pair">

        </div>
      {complaintType === COMPLAINT_TYPES.HWCR && (
            <>
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
              classNamePrefix='comp-species-select'
              onChange={e => handleSpeciesChange(e)}
              errMsg={speciesErrorMsg}
            />
          </div>
             <div className="comp-details-label-input-pair" id="status-pair-id">
             <label id="status-label-id">
               Status<span className="required-ind">*</span>
             </label>
             <ValidationSelect
               className="comp-details-input"
               options={complaintStatusCodes}
               placeholder="Select"
               id="status-select-id"
               classNamePrefix='comp-status-select'
               onChange={e => handleStatusChange(e)}
               errMsg={statusErrorMsg}
             />
           </div>
           </>
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
            >
              Complaint Description<span className="required-ind">*</span>
            </label>
            <ValidationTextArea
              className="comp-form-control"
              id="complaint-description-textarea-id"
              rows={4}
              errMsg={complaintDescErrorMsg}
              onChange={handleComplaintDescChange}
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
                  classNamePrefix='comp-attractants-select'
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
                  classNamePrefix="comp-violation-ip-select"
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
                  classNamePrefix="comp-violation-observed-select"
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
            />
          </div>
          <CompInput
            id="comp-details-edit-x-coordinate-input"
            divId="x-coordinate-pair-id"
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
                Coordinates.Longitude
              )
            }
          />
          <CompInput
            id="comp-details-edit-x-coordinate-input"
            divId="y-coordinate-pair-id"
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
              classNamePrefix='comp-community-select'
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
  {/*
  <ComplaintLocation
    complaintType={complaintType}
    draggable={true}
    onMarkerMove={handleMarkerMove}
        />*/}
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
                country="CA"
                className="comp-details-input"
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
                country="CA"
                className="comp-details-input"
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
                country="CA"
                className="comp-details-input"
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
                onChange={e => handleAddressChange(e.target.value)}
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
                classNamePrefix='comp-referred-select'
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
              />
            </div>
          </div>
          <div className="comp-details-edit-column" />
        </div>
      </div>
    </div>
  )}
   <div className="comp-box-footer">
          <div className="comp-box-footer-actions">
            <Button
              id="details_screen_cancel_edit_button_footer"
              title="Cancel Create Complaint"
              variant="outline-primary"
              onClick={cancelButtonClick}
            >
              <span>Cancel</span>
            </Button>
            <Button
              id="details_screen_cancel_save_button_footer"
              title="Save Complaint"
              variant="primary"
              onClick={saveButtonClick}
            >
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
</div>
};

