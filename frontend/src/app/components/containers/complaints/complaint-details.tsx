import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";

import { CallDetails, CallerInformation, ComplaintHeader } from "./details";
import {
  getAllegationComplaintByComplaintIdentifier,
  getComplaintLocation,
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
import { ComplaintLocation } from "./details/complaint-location";

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
      if (id) {
        switch (complaintType) {
          case COMPLAINT_TYPES.ERS:
            dispatch(getAllegationComplaintByComplaintIdentifier(id));
            break;
          case COMPLAINT_TYPES.HWCR:
            dispatch(getWildlifeComplaintByComplaintIdentifier(id));
            break;
        }

    if (complaint) {
      const { complaint_identifier: ceComplaint }: any = complaint;

      if (ceComplaint) {
        const {
          location_summary_text,
          cos_geo_org_unit: {
            area_name,
          },
        } = ceComplaint;

        dispatch(
          getComplaintLocation(`${ location_summary_text} ${area_name}`));

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
        <ComplaintLocation complaintType={complaintType} draggable={false}/>
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
