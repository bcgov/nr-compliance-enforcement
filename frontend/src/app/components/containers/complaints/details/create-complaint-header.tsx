import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface CreateComplaintHeaderProps {
  complaintType: string;
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
}

export const CreateComplaintHeader: FC<CreateComplaintHeaderProps> = ({
  complaintType,
  cancelButtonClick,
  saveButtonClick,
}) => {
  return (
    <div className="comp-details-header">
      <div className="comp-container">
        {/* <!-- breadcrumb start --> */}
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={`/complaints/${complaintType}`}>Complaints</Link>
              </li>
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                Create Complaint
              </li>
            </ol>
          </nav>
        </div>
        {/* <!-- breadcrumb end --> */}

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              <span>Create Complaint </span>
            </h1>
          </div>
          <div className="comp-header-actions">
            <Button
              id="details-screen-cancel-edit-button-top"
              title="Cancel Edit Complaint"
              variant="outline-light"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              id="details-screen-cancel-save-button-top"
              title="Save Complaint"
              variant="outline-light"
              onClick={saveButtonClick}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
