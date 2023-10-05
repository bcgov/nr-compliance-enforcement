import { FC } from "react";
import { Button } from "react-bootstrap";

interface CreateComplaintHeaderProps {
  complaintType: string,
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
}

export const CreateComplaintHeader: FC<CreateComplaintHeaderProps> = ({
  complaintType,
  cancelButtonClick,
  saveButtonClick
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
                <div className="comp-box-actions">
                    <Button id="details-screen-cancel-edit-button-top" title="Cancel Edit Complaint" variant="outline-primary" onClick={cancelButtonClick}>Cancel</Button>
                    <Button id="details-screen-cancel-save-button-top" title="Save Complaint" variant="outline-primary" onClick={saveButtonClick}>Save Changes</Button>
                    </div>
        </div>
      </div>
    </>
  );
};
