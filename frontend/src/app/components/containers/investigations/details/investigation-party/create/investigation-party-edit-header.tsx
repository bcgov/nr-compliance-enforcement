import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useInvestigationSearch } from "../../../hooks/use-investigation-search";

interface InvestigationPartyEditHeaderProps {
  isEditMode: boolean;
  title: string;
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
  investigationGuid: string;
  investigationLabel?: string;
}

export const InvestigationPartyEditHeader: FC<InvestigationPartyEditHeaderProps> = ({
  isEditMode,
  title,
  cancelButtonClick,
  saveButtonClick,
  investigationGuid,
  investigationLabel,
}) => {
  const { searchURL: investigationSearchURL } = useInvestigationSearch();

  return (
    <div className="comp-details-header">
      <div className="comp-container">
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={investigationSearchURL}>Investigations</Link>
              </li>
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={`/investigation/${investigationGuid}`}>{investigationLabel ?? "Investigation"}</Link>
              </li>
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={`/investigation/${investigationGuid}/parties`}>Parties</Link>
              </li>
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {title}
              </li>
            </ol>
          </nav>
        </div>

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              <span>{title}</span>
            </h1>
          </div>
          <div className="comp-header-actions">
            <Button
              id="party-cancel-button"
              title={isEditMode ? "Cancel edit party" : "Cancel new party"}
              variant="outline-light"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              id="party-save-button"
              title="Save party"
              variant="outline-light"
              onClick={saveButtonClick}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPartyEditHeader;
