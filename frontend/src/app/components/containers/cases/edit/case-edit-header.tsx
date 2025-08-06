import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface CaseEditHeaderProps {
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
  isEditMode?: boolean;
  caseFileGuid?: string;
}

export const CaseEditHeader: FC<CaseEditHeaderProps> = ({
  cancelButtonClick,
  saveButtonClick,
  isEditMode = false,
  caseFileGuid,
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
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {isEditMode ? "Edit case" : "Create case"}
              </li>
            </ol>
          </nav>
        </div>
        {/* <!-- breadcrumb end --> */}

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              {isEditMode && caseFileGuid ? (
                <span>Case #{caseFileGuid}</span>
              ) : (
                <span>{isEditMode ? "Edit case" : "Create case"} </span>
              )}
            </h1>
          </div>
          <div className="comp-header-actions">
            <Button
              id="details-screen-cancel-edit-button-top"
              title={isEditMode ? "Cancel Edit Case" : "Cancel Create Case"}
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
