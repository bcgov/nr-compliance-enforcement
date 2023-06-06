import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";
import {
  selectedComplaint,
  getHwcrComplaintByComplaintIdentifier,
} from "../../../store/reducers/hwcr-complaints";
import { ComplaintDetailsHeader } from "./details/header";

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();
  const complaint = useAppSelector(selectedComplaint);

  const { id, complaintType } = useParams();

  useEffect(() => {
    if (!complaint) {
      if (id) {
        dispatch(getHwcrComplaintByComplaintIdentifier(id));
      }
    }
  });

  return (
    <div className="comp-complaint-details">
      <ComplaintDetailsHeader id={id} complaintType={complaintType} />
    </div>
  );
};
