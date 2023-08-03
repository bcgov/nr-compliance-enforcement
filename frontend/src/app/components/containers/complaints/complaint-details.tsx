import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";

import { CallDetails, CallerInformation, ComplaintHeader } from "./details";
import {
  getAllegationComplaintByComplaintIdentifier,
  getWildlifeComplaintByComplaintIdentifier,
  selectComplaint,
  setComplaint,
} from "../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { SuspectWitnessDetails } from "./details/suspect-witness-details";
import { Button } from "react-bootstrap";
import { ComplaintDetailsEdit } from "./details/complaint-details-edit";
import { openModal } from "../../../store/reducers/app";
import { CancelConfirm } from "../../../types/modal/modal-types";

type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();
  const complaint = useAppSelector(selectComplaint);
  const [readOnly, setReadOnly] = useState(true);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaint(null))
    };
  }, []);


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

  const saveButtonClick = () => {
    setReadOnly(true);
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
            break;
        }
      }
    }
  }, [id, complaintType, complaint, dispatch]);

  return (

    <div className="comp-complaint-details">
      <ComplaintHeader id={id} complaintType={complaintType} readOnly={readOnly} editButtonClick={editButtonClick} cancelButtonClick={cancelButtonClick} saveButtonClick={saveButtonClick} />
      { readOnly &&
       <CallDetails complaintType={complaintType}/>
      }
      { readOnly &&
      <CallerInformation/>
      }
      { readOnly && complaintType === COMPLAINT_TYPES.ERS && (
        <SuspectWitnessDetails />
      )}
      { !readOnly &&
        <ComplaintDetailsEdit complaintType={complaintType}/>
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
