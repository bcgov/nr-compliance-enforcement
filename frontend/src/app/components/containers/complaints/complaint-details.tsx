import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";
import {
  selectedComplaint,
  getHwcrComplaintByComplaintIdentifier,
} from "../../../store/reducers/hwcr-complaints";
import { CallDetails, CallerInformation, ComplaintHeader } from "./details";

type TestType = {
  id: string;
  complaintType: string;
};

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();
  const complaint = useAppSelector(selectedComplaint);

  const { id = "", complaintType = "" } = useParams<TestType>();

  useEffect(() => {
    if (!complaint || complaint.complaint_identifier.complaint_identifier !== id) {
      if (id) {
        dispatch(getHwcrComplaintByComplaintIdentifier(id));
      }
    }
  }, [complaint]);

  return (
    <div className="comp-complaint-details">
      {complaint && (
        <>
          <ComplaintHeader id={id} complaintType={complaintType} />
          <CallDetails />
          <CallerInformation />
        </>
      )}
    </div>
  );
};
