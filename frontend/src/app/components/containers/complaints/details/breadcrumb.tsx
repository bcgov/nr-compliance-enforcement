import { FC } from "react";
import { complaintTypeToName } from "../../../../types/app/complaint-types";
import { Link } from "react-router-dom";

export const ComplaintDetailsBreadcrumb: FC<{
  id: string | undefined;
  complaintType: string | undefined;
}> = ({ id, complaintType }) => {

  return (
    <div className="comp-complaint-breadcrumb">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <i className="bi bi-house-door"></i> Home
          </li>
          <li className="breadcrumb-item">
            <Link to={`/complaints/${complaintType}`}>
              {complaintTypeToName(complaintType)}
            </Link>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            {id}
          </li>
        </ol>
      </nav>
    </div>
  );
};
