import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface InspectionEditHeaderProps {
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
  isEditMode?: boolean;
  caseIdentifier?: string;
  inspectionGuid?: string;
}

export const InspectionEditHeader: FC<InspectionEditHeaderProps> = ({
  cancelButtonClick,
  saveButtonClick,
  isEditMode = false,
  caseIdentifier,
  inspectionGuid,
}) => {
  return (
    <div className="comp-details-header">
      <div className="comp-container">
        {/* <!-- breadcrumb start --> */}
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to="/cases">Cases</Link>
              </li>
              {caseIdentifier && (
                <li className="breadcrumb-item comp-nav-item-name-inverted">
                  <Link to={`/case/${caseIdentifier}`}>{caseIdentifier}</Link>
                </li>
              )}
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {isEditMode ? "Edit inspection" : "Create inspection"}
              </li>
            </ol>
          </nav>
        </div>
        {/* <!-- breadcrumb end --> */}

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              {isEditMode && inspectionGuid ? (
                <span>Inspection #{inspectionGuid}</span>
              ) : (
                <span>{isEditMode ? "Edit inspection" : "Create inspection"} </span>
              )}
            </h1>
          </div>
          <div className="comp-header-actions">
            <Button
              id="details-screen-cancel-edit-button-top"
              title={isEditMode ? "Cancel Edit Inspection" : "Cancel Create Inspection"}
              variant="outline-light"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              id="details-screen-save-button-top"
              title="Save Case"
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
