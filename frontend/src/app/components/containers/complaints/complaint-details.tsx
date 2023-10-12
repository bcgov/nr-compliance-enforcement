import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";

import { CallDetails, CallerInformation, ComplaintHeader } from "./details";
import {
  getAllegationComplaintByComplaintIdentifierSetUpdate,
  getWildlifeComplaintByComplaintIdentifierSetUpdate,
  selectComplaint,
  setComplaint,
  setComplaintLocation,
  updateAllegationComplaint,
  updateWildlifeComplaint,
  selectComplaintDetails
} from "../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { SuspectWitnessDetails } from "./details/suspect-witness-details";
import { Button } from "react-bootstrap";
import { ComplaintDetailsEdit } from "./details/complaint-details-edit";
import { openModal, userId } from "../../../store/reducers/app";
import { CancelConfirm } from "../../../types/modal/modal-types";
import { ComplaintLocation } from "./details/complaint-location";
import { HwcrComplaint } from "../../../types/complaints/hwcr-complaint";
import { AllegationComplaint } from "../../../types/complaints/allegation-complaint";
import { cloneDeep } from "lodash";
import { bcBoundaries } from "../../../common/methods";
import Option from "../../../types/app/option";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Coordinates } from "../../../types/app/coordinate-type";
import { from } from "linq-to-typescript";
import { selectOfficersByZone } from "../../../store/reducers/officer";
import { ToggleError } from "../../../common/toast";

type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();

  const { id = "", complaintType = "" } = useParams<ComplaintParams>();

  const complaint = useAppSelector(selectComplaint);
  const userid = useAppSelector(userId);

  const { zone_code } = useAppSelector(selectComplaintDetails(complaintType));
  const officerList = useAppSelector(selectOfficersByZone(zone_code));

  const [readOnly, setReadOnly] = useState(true);
  const [updateComplaint, setUpdateComplaint] = useState<
    HwcrComplaint | AllegationComplaint | null | undefined
  >(complaint);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaint(null));
      dispatch(setComplaintLocation(null));
    };
  }, [dispatch]);

  const editButtonClick = () => {
    setReadOnly(false);
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

  const [errorNotificationClass, setErrorNotificationClass] = useState(
    "comp-complaint-error display-none"
  );
  const saveButtonClick = async () => {
    if (updateComplaint !== null && updateComplaint !== undefined) {
      if (noErrors()) {
        if (complaintType === COMPLAINT_TYPES.HWCR) {
          let hwcrComplaint = updateComplaint as HwcrComplaint;
          dispatch(updateWildlifeComplaint(hwcrComplaint));
          dispatch(
            getWildlifeComplaintByComplaintIdentifierSetUpdate(
              hwcrComplaint.complaint_identifier.complaint_identifier,
              setUpdateComplaint
            )
          );
        } else if (complaintType === COMPLAINT_TYPES.ERS) {
          let allegationComplaint = updateComplaint as AllegationComplaint;
          dispatch(updateAllegationComplaint(allegationComplaint));
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
        ToggleError("Errors in form")
        setErrorNotificationClass("comp-complaint-error");
      }
    }
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

  const handleNOCChange = (selected: Option | null) => {
    if (selected) {
      const { label, value } = selected;
      if (!value) {
        setNOCErrorMsg("Required");
      } else {
        setNOCErrorMsg("");

        let update = { ...updateComplaint } as HwcrComplaint;

        const { hwcr_complaint_nature_code: source } = update;
        console.log(source);
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

      let update = { ...updateComplaint } as AllegationComplaint;

      const { violation_code: source } = update;
      const updatedEntity = {
        ...source,
        short_description: value as string,
        long_description: label as string,
        violation_code: value as string,
      };

      update.violation_code = updatedEntity;
      setUpdateComplaint(update);
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
      } else {
        if (from(source).any() && from(source).elementAt(0)) {
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
    allegationComplaint.in_progress_ind =
      selectedOption?.value === "Yes" ? true : false;
    setUpdateComplaint(allegationComplaint);
  }

  function handleViolationObservedChange(selectedOption: Option | null) {
    let allegationComplaint: AllegationComplaint = cloneDeep(
      updateComplaint
    ) as AllegationComplaint;
    allegationComplaint.observed_ind =
      selectedOption?.value === "Yes" ? true : false;
    setUpdateComplaint(allegationComplaint);
  }

  function handleLocationChange(value: string) {
    if (complaintType === COMPLAINT_TYPES.HWCR) {
      let hwcrComplaint: HwcrComplaint = cloneDeep(
        updateComplaint
      ) as HwcrComplaint;
      hwcrComplaint.complaint_identifier.location_summary_text =
        value === undefined ? "" : value;
      setUpdateComplaint(hwcrComplaint);
    } else if (complaintType === COMPLAINT_TYPES.ERS) {
      let allegationComplaint: AllegationComplaint = cloneDeep(
        updateComplaint
      ) as AllegationComplaint;
      allegationComplaint.complaint_identifier.location_summary_text =
        value === undefined ? "" : value;
      setUpdateComplaint(allegationComplaint);
    }
  }

  async function handleAttractantsChange(selectedOptions: Option[] | null) {
    if (selectedOptions !== null && selectedOptions !== undefined) {
      if (complaintType === COMPLAINT_TYPES.HWCR) {
        let update = { ...updateComplaint } as HwcrComplaint;
        const { attractant_hwcr_xref: currentAttactants } = update;

        let newAttractants = new Array<any>();

        selectedOptions.forEach((selectedOption) => {
          let match = false;

          currentAttactants.forEach((item) => {
            if (
              selectedOption.value === item.attractant_code?.attractant_code
            ) {
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

          if(!match){
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
              create_timestamp: "",
              update_user_id: "",
              update_timestamp: "",
            };
            hwcrComplaint.complaint_identifier.cos_geo_org_unit.area_code =
              selectedOption.value;
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
              create_timestamp: "",
              update_user_id: "",
              update_timestamp: "",
            };
            allegationComplaint.complaint_identifier.cos_geo_org_unit.area_code =
              selectedOption.value;
            allegationComplaint.complaint_identifier.geo_organization_unit_code =
              geoOrgCode;
          }
          setUpdateComplaint(allegationComplaint);
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
        hwcrComplaint.complaint_identifier.caller_phone_1 =
          value !== undefined ? value : "";
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_1 =
          value !== undefined ? value : "";
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
        hwcrComplaint.complaint_identifier.caller_phone_2 =
          value !== undefined ? value : "";
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_2 =
          value !== undefined ? value : "";
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
        hwcrComplaint.complaint_identifier.caller_phone_3 =
          value !== undefined ? value : "";
        setUpdateComplaint(hwcrComplaint);
      } else if (complaintType === COMPLAINT_TYPES.ERS) {
        let allegationComplaint: AllegationComplaint = cloneDeep(
          updateComplaint
        ) as AllegationComplaint;
        allegationComplaint.complaint_identifier.caller_phone_3 =
          value !== undefined ? value : "";
        setUpdateComplaint(allegationComplaint);
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
            create_timestamp: "",
            update_user_id: "",
            update_timestamp: "",
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
      {readOnly && (
        <ComplaintLocation complaintType={complaintType} draggable={false} />
      )}
      {readOnly && <CallerInformation />}
      {readOnly && complaintType === COMPLAINT_TYPES.ERS && (
        <SuspectWitnessDetails />
      )}
      {!readOnly && (
        <ComplaintDetailsEdit
          complaintType={complaintType}
          updateComplaint={updateComplaint}
          setUpdateComplaint={setUpdateComplaint}
          nocErrorMsg={nocErrorMsg}
          handleNOCChange={handleNOCChange}
          speciesErrorMsg={speciesErrorMsg}
          handleSpeciesChange={handleSpeciesChange}
          statusErrorMsg={statusErrorMsg}
          handleStatusChange={handleStatusChange}
          complaintDescErrorMsg={complaintDescErrorMsg}
          handleComplaintDescChange={handleComplaintDescChange}
          attractantsErrorMsg={attractantsErrorMsg}
          handleAttractantsChange={handleAttractantsChange}
          communityErrorMsg={communityErrorMsg}
          handleCommunityChange={handleCommunityChange}
          geoPointXMsg={geoPointXMsg}
          handleGeoPointChange={handleGeoPointChange}
          geoPointYMsg={geoPointYMsg}
          emailMsg={emailMsg}
          handleEmailChange={handleEmailChange}
          primaryPhoneMsg={primaryPhoneMsg}
          handlePrimaryPhoneChange={handlePrimaryPhoneChange}
          secondaryPhoneMsg={secondaryPhoneMsg}
          handleSecondaryPhoneChange={handleSecondaryPhoneChange}
          alternatePhoneMsg={alternatePhoneMsg}
          handleAlternatePhoneChange={handleAlternatePhoneChange}
          handleReferredByChange={handleReferredByChange}
          handleAssignedOfficerChange={handleAssignedOfficerChange}
          handleLocationDescriptionChange={handleLocationDescriptionChange}
          handleLocationChange={handleLocationChange}
          handleNameChange={handleNameChange}
          handleAddressChange={handleAddressChange}
          errorNotificationClass={errorNotificationClass}
          handleViolationInProgessChange={handleViolationInProgessChange}
          handleViolationObservedChange={handleViolationObservedChange}
          handleViolationTypeChange={handleViolationTypeChange}
          handleSuspectDetailsChange={handleSuspectDetailsChange}
        />
      )}
      {!readOnly && (
        <div className="comp-box-footer">
          <div className="comp-box-footer-actions">
            <Button
              id="details_screen_cancel_edit_button_footer"
              title="Cancel Edit Complaint"
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
      )}
    </div>
  );
};
