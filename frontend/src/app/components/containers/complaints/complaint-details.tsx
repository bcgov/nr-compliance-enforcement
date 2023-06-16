import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";
import {
  selectedComplaint as selectHwcrComplaint,
  getHwcrComplaintByComplaintIdentifier,
} from "../../../store/reducers/hwcr-complaints";
import { CallDetails, CallerInformation, ComplaintHeader } from "./details";
import ComplaintTypes from "../../../types/app/complaint-types";
import {
  getEcrComplaintByComplaintIdentifier,
  selectedComplaint as selectErsComplaint,
} from "../../../store/reducers/allegation-complaint";

type TestType = {
  id: string;
  complaintType: string;
};

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();

  const { id = "", complaintType = "" } = useParams<TestType>();
  
  //-- this is a temporary hack to handle the selected details
  const hwcrComplaint = useAppSelector(selectHwcrComplaint)
  const ersComplaint = useAppSelector(selectErsComplaint);

  const complaint =
    complaintType === ComplaintTypes.HWCR
      ? hwcrComplaint
      : ersComplaint

  useEffect(() => {
    if (
      !complaint ||
      complaint.complaint_identifier.complaint_identifier !== id
    ) {
      if (id) {
        if (complaintType === ComplaintTypes.HWCR) {
          dispatch(getHwcrComplaintByComplaintIdentifier(id));
        } else {
          dispatch(getEcrComplaintByComplaintIdentifier(id));
        }
      }
    }
  }, [complaint]);

console.log(hwcrComplaint)
console.log(ersComplaint)

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
