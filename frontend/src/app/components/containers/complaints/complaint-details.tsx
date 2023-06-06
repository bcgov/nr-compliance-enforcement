import { FC } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";

export const ComplaintDetails: FC = () => {
  const dispatch = useAppDispatch();
  const { id, complaintType } = useParams();


  return <>details</>;
};
