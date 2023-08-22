import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";

import { CallDetails, CallerInformation, ComplaintHeader } from "./details";
import {
  getAllegationComplaintByComplaintIdentifier,
  getWildlifeComplaintByComplaintIdentifier,
  selectComplaint,
  setComplaint,
  updateWildlifeComplaint,
  updateWildlifeComplaintStatus,
} from "../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { SuspectWitnessDetails } from "./details/suspect-witness-details";
import { Button } from "react-bootstrap";
import { ComplaintDetailsEdit } from "./details/complaint-details-edit";
import { openModal } from "../../../store/reducers/app";
import { CancelConfirm } from "../../../types/modal/modal-types";
import { ComplaintLocation } from "./details/complaint-location";
import { ComplaintUpdateParams } from "../../../types/api-params/complaint-update-params";
import { HwcrComplaint } from "../../../types/complaints/hwcr-complaint";
import { AllegationComplaint } from "../../../types/complaints/allegation-complaint";

type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();
  const [readOnly, setReadOnly] = useState(true);
  let complaint = useAppSelector(selectComplaint);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaint(null));
    };
  }, [dispatch]);


  const editButtonClick = () => {
    setReadOnly(false);
  }

  const cancelConfirmed = () => {
    setReadOnly(true);
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

  const saveButtonClick = async () => {
    console.log("complaintSaveIn: " + JSON.stringify(complaint));
    if(complaint !== null && complaint !== undefined)
    {
      if(complaintType === COMPLAINT_TYPES.HWCR)
      {
        console.log("testisangsfdslfkadfjasl;kfdjfowier");
        console.log("complaint: " + complaint);
        let hwcrComplaint = complaint as HwcrComplaint;
        console.log("hwcrComplaint: " + hwcrComplaint);
        console.log("hwcr_complaint_nature_code: " + hwcrComplaint.hwcr_complaint_nature_code.hwcr_complaint_nature_code);
        /*const updateParams: ComplaintUpdateParams = 
          {
            complaint_id: hwcrComplaint.complaint_identifier.complaint_identifier, 
            complaint_status_code: hwcrComplaint.complaint_identifier.complaint_status_code.complaint_status_code, 
            nature_of_complaint: hwcrComplaint.hwcr_complaint_nature_code.hwcr_complaint_nature_code,
            species_code: hwcrComplaint.species_code.species_code,
            officer_assigned_guid: hwcrComplaint.complaint_identifier.person_complaint_xref[0].person_guid.person_guid, //this may have to be refactored once we have more types of person complaint relationships
          };*/
        await dispatch(updateWildlifeComplaint(hwcrComplaint));

        //dispatch(getWildlifeComplaintByComplaintIdentifier(complaint.complaint_identifier.complaint_identifier));
      }
      setReadOnly(true);
    }
  }

  const { id = "", complaintType = "" } = useParams<ComplaintParams>();

  useEffect(() => {
    if (
      !complaint ||
      complaint.complaint_identifier.complaint_identifier !== id
    ) {
      if (id) {
        switch (complaintType) {
          case COMPLAINT_TYPES.ERS:
            dispatch(getAllegationComplaintByComplaintIdentifier(id));
            break;
          case COMPLAINT_TYPES.HWCR:
            dispatch(getWildlifeComplaintByComplaintIdentifier(id));
            console.log("stuff1111: " + complaint);
            break;
        }
      }
    }
  }, [id, complaintType, complaint, dispatch]);
  console.log("stuff343: " + complaint);
  return (

    <div className="comp-complaint-details">
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
        <ComplaintDetailsEdit complaint={complaint} setComplaint={setComplaint} complaintType={complaintType}/>
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
