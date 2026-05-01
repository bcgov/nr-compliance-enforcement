import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useInvestigationSearch } from "../../../hooks/use-investigation-search";

interface TaskCreateHeaderProps {
  isEditMode: boolean;
  cancelButtonClick: () => void;
  saveButtonClick: () => void;
  investigationGuid: string;
}

export const TaskCreateHeader: FC<TaskCreateHeaderProps> = ({
  isEditMode,
  cancelButtonClick,
  saveButtonClick,
  investigationGuid,
}) => {
  const pageTitle = isEditMode ? "Edit task" : "Create task";
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
                <Link to={`/investigation/${investigationGuid}/tasks`}>Tasks</Link>
              </li>
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {pageTitle}
              </li>
            </ol>
          </nav>
        </div>

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              <span>{pageTitle}</span>
            </h1>
          </div>
          <div className="comp-header-actions">
            <Button
              id="task-cancel-button"
              title={`Cancel ${pageTitle.toLowerCase()}`}
              variant="outline-light"
              onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              id="task-save-button"
              title="Save task"
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
