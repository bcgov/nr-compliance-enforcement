import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";
import {
  selectedComplaint,
  getHwcrComplaintByComplaintIdentifier,
} from "../../../store/reducers/hwcr-complaints";
import { Col, Row } from "react-bootstrap";
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
    if (!complaint) {
      if (id) {
        dispatch(getHwcrComplaintByComplaintIdentifier(id));
      }
    }
  });

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
