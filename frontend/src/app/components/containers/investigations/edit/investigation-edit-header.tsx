import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface InvestigationEditHeaderProps {
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
  isEditMode?: boolean;
  caseIdentifier?: string;
  investigationGuid?: string;
}

export const InvestigationEditHeader: FC<InvestigationEditHeaderProps> = ({
  cancelButtonClick,
  saveButtonClick,
  isEditMode = false,
  caseIdentifier,
  investigationGuid,
}) => {
  return (
    <div className="comp-details-header">
      <div className="comp-container">
        {/* <!-- breadcrumb start --> */}
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to="/investigations">Investigations</Link>
              </li>
              {caseIdentifier && (
                <li className="breadcrumb-item comp-nav-item-name-inverted">
                  <Link to={`/investigations/${investigationGuid}`}>{investigationGuid}</Link>
                </li>
              )}
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {isEditMode ? "Edit investigation" : "Create investigation"}
              </li>
            </ol>
          </nav>
        </div>
        {/* <!-- breadcrumb end --> */}

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              {isEditMode && investigationGuid ? (
                <span>Investigation #{investigationGuid}</span>
              ) : (
                <span>{isEditMode ? "Edit investigation" : "Create investigation"} </span>
              )}
            </h1>
          </div>
          <div className="comp-header-actions">
            <Button
              id="details-screen-cancel-edit-button-top"
              title={isEditMode ? "Cancel edit Investigation" : "Cancel create investigation"}
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
