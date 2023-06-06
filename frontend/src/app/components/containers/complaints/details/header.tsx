import { FC } from "react";
import { ComplaintDetailsBreadcrumb } from "./breadcrumb";
import { complaintTypeToName } from "../../../../types/app/complaint-types";

export const ComplaintDetailsHeader: FC<{
  id: string | undefined;
  complaintType: string | undefined;
}> = ({ id, complaintType }) => {

  return (
    <>
      <ComplaintDetailsBreadcrumb id={id} complaintType={complaintType} />
      <div className="comp-details-header">
        <h3>Complaint #{id}</h3>{" "}
        <span>{complaintTypeToName(complaintType)}</span>
        <span></span>
      </div>
    </>
  );
};
