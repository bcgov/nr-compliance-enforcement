import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface PartyEditHeaderProps {
  isEditMode?: boolean;
  cancelButtonClick: () => void;
  partyIdentifier?: string;
  saveButtonClick: () => void;
}

export const PartyEditHeader: FC<PartyEditHeaderProps> = ({
  cancelButtonClick,
  saveButtonClick,
  isEditMode = false,
  partyIdentifier,
}) => {
  return (
    <div className="comp-details-header">
      <div className="comp-container">
        {/* <!-- breadcrumb start --> */}
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link
                  to=""
                  onClick={() => window.alert("Navigating to the list of parties")}
                >
                  Parties
                </Link>
              </li>
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {isEditMode ? "Edit party" : "Create party"}
              </li>
            </ol>
          </nav>
        </div>
        {/* <!-- breadcrumb end --> */}

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              {isEditMode && partyIdentifier ? (
                <span>Party of interest #{partyIdentifier}</span>
              ) : (
                <span>{isEditMode ? "Edit party" : "Create party"} </span>
              )}
            </h1>
          </div>
          <div className="comp-header-actions">
            <Button
              id="details-screen-cancel-edit-button-top"
              title={isEditMode ? "Cancel Edit Party" : "Cancel Create Party"}
              variant="outline-light"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              id="details-screen-save-button-top"
              title="Save Party"
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
