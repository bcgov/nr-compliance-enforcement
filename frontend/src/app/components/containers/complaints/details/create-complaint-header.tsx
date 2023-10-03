import { FC } from "react";

interface CreateComplaintHeaderProps {
  complaintType: string;
}

export const CreateComplaintHeader: FC<CreateComplaintHeaderProps> = ({
  complaintType,
}) => {

  return (
    <>
      {/* <!-- breadcrumb start --> */}
      <div className="comp-complaint-breadcrumb">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="bi bi-house-door"></i> Home
            </li>
            <li className="breadcrumb-item" aria-current="page">
              Create Complaint
            </li>
          </ol>
        </nav>
      </div>
      {/* <!-- breadcrumb end --> */}

      {/* <!-- complaint info start --> */}
      <div className="comp-details-create-header">
        <div className="comp-complaint-info">
          <div className="comp-box-complaint-id">Create Complaint</div>
        </div>
      </div>
    </>
  );
};
