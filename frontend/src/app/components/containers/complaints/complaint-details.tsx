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
} from "../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { SuspectWitnessDetails } from "./details/suspect-witness-details";
import { Button } from "react-bootstrap";
import { ComplaintDetailsEdit } from "./details/complaint-details-edit";
import { openModal } from "../../../store/reducers/app";
import { CancelConfirm } from "../../../types/modal/modal-types";
import { ComplaintLocation } from "./details/complaint-location";
import { HwcrComplaint } from "../../../types/complaints/hwcr-complaint";
import { AllegationComplaint } from "../../../types/complaints/allegation-complaint";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetails: FC = () => {
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
      dispatch(setComplaintLocation(null));
    };
  }, [dispatch]);


  const editButtonClick = () => {
    setReadOnly(false);
  }

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
  }

  const cancelButtonClick = () => {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: CancelConfirm,
          data: {
            title: "Cancel Changes?",
            description: "Your changes will be lost.",
            cancelConfirmed,
          }
        })
      );
    };

  const [errorNotificationClass, setErrorNotificationClass] = useState("comp-complaint-error display-none");
  const saveButtonClick = async () => {
    if(updateComplaint !== null && updateComplaint !== undefined)
    {
      if(noErrors())
      {
        if(complaintType === COMPLAINT_TYPES.HWCR)
        {
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
  }

  useEffect(() => {
    if (
      !complaint ||
      complaint.complaint_identifier.complaint_identifier !== id
    ) {
      if (id) {
        switch (complaintType) {
          case COMPLAINT_TYPES.ERS:
            dispatch(getAllegationComplaintByComplaintIdentifierSetUpdate(id, setUpdateComplaint));
            break;
          case COMPLAINT_TYPES.HWCR:
            dispatch(getWildlifeComplaintByComplaintIdentifierSetUpdate(id, setUpdateComplaint));
            break;
        }
      }
    }
  }, [id, complaintType, complaint, dispatch]);

  const [nocErrorMsg, setNOCErrorMsg] = useState<string>("");
  const [speciesErrorMsg, setSpeciesErrorMsg] = useState<string>("");
  const [statusErrorMsg, setStatusErrorMsg] = useState<string>("");
  const [complaintDescErrorMsg, setComplaintDescErrorMsg] = useState<string>("");
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
    if(nocErrorMsg === "" &&
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
        alternatePhoneMsg === "")
        {
          noErrors = true;
        }
    return noErrors;
  }

  return (

    <div className="comp-complaint-details">
      <ToastContainer 
      />
      <ComplaintHeader id={id} complaintType={complaintType} readOnly={readOnly} editButtonClick={editButtonClick} cancelButtonClick={cancelButtonClick} saveButtonClick={saveButtonClick} />
      { readOnly &&
       <CallDetails complaintType={complaintType}/>
      }
      { readOnly &&
        <ComplaintLocation complaintType={complaintType} draggable={false}/>
      }
      { readOnly &&
      <CallerInformation/>
      }
      { readOnly && complaintType === COMPLAINT_TYPES.ERS && (
        <SuspectWitnessDetails />
      )}
      { !readOnly &&
        <ComplaintDetailsEdit complaintType={complaintType} updateComplaint={updateComplaint} setUpdateComplaint={setUpdateComplaint}
          nocErrorMsg={nocErrorMsg} setNOCErrorMsg={setNOCErrorMsg}
          speciesErrorMsg={speciesErrorMsg} setSpeciesErrorMsg={setSpeciesErrorMsg}
          statusErrorMsg={statusErrorMsg} setStatusErrorMsg={setStatusErrorMsg}
          complaintDescErrorMsg={complaintDescErrorMsg} setComplaintDescErrorMsg={setComplaintDescErrorMsg}
          attractantsErrorMsg={attractantsErrorMsg} setAttractantsErrorMsg={setAttractantsErrorMsg}
          communityErrorMsg={communityErrorMsg} setCommunityErrorMsg={setCommunityErrorMsg}
          geoPointXMsg={geoPointXMsg} setGeoPointXMsg={setGeoPointXMsg}
          geoPointYMsg={geoPointYMsg} setGeoPointYMsg={setGeoPointYMsg}
          emailMsg={emailMsg} setEmailMsg={setEmailMsg}
          primaryPhoneMsg={primaryPhoneMsg} setPrimaryPhoneMsg={setPrimaryPhoneMsg}
          secondaryPhoneMsg={secondaryPhoneMsg} setSecondaryPhoneMsg={setSecondaryPhoneMsg}
          alternatePhoneMsg={alternatePhoneMsg} setAlternatePhoneMsg={setAlternatePhoneMsg}
          errorNotificationClass={errorNotificationClass} setErrorNotificationClass={setErrorNotificationClass}
          />
      }
      { !readOnly && 
        <div className="comp-box-footer">
          <div className="comp-box-footer-actions">
            <Button id="details_screen_cancel_edit_button_footer" title="Cancel Edit Complaint" variant="outline-primary" onClick={cancelButtonClick}><span>Cancel</span></Button>
            <Button id="details_screen_cancel_save_button_footer" title="Save Complaint" variant="primary" onClick={saveButtonClick}><span>Save Changes</span></Button>
          </div>
        </div>
      }


    </div>

)};
