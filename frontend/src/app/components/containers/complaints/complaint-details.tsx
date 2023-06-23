import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";

import { CallDetails, CallerInformation, ComplaintHeader } from "./details";
import {
  getErsComplaintByComplaintIdentifier,
  getHwcrComplaintByComplaintIdentifier,
  selectComplaint,
} from "../../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { SuspectWitnessDetails } from "./details/suspect-witness-details";

type ComplaintParams = {
  id: string;
  complaintType: string;
};

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();
  const complaint = useAppSelector(selectComplaint);

  const { id = "", complaintType = "" } = useParams<ComplaintParams>();

  useEffect(() => {
    if (
      !complaint ||
      complaint.complaint_identifier.complaint_identifier !== id
    ) {
      if (id) {
        switch (complaintType) {
          case COMPLAINT_TYPES.ERS:
            dispatch(getErsComplaintByComplaintIdentifier(id));
            break;
          case COMPLAINT_TYPES.HWCR:
            dispatch(getHwcrComplaintByComplaintIdentifier(id));
            break;
        }
      }
    }
  }, [id, complaintType, complaint, dispatch]);

  return (
    <div className="comp-complaint-details">
      <ComplaintHeader id={id} complaintType={complaintType} />
      <CallDetails complaintType={complaintType} />
      <CallerInformation />
      {complaintType === COMPLAINT_TYPES.ERS && (
        <SuspectWitnessDetails />
      )}
    </div>
  );
};
