import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Task } from "@/generated/graphql";
import { applyStatusClass } from "@/app/common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskStatus } from "@/app/store/reducers/code-table-selectors";

interface TaskDetailHeaderProps {
  task?: Task;
  investigationGuid: string;
}

export const TaskDetailHeader: FC<TaskDetailHeaderProps> = ({ task, investigationGuid }) => {
  const taskStatuses = useAppSelector(selectTaskStatus);
  const status = taskStatuses.find((s) => s.value === task?.taskStatusCode);
  const taskDisplay = task ? `Task #${task.taskNumber}` : "Task";

  return (
    <div className="comp-details-header">
      <div className="comp-container">
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to="/investigations">Investigations</Link>
              </li>
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to={`/investigation/${investigationGuid}/tasks`}>Tasks</Link>
              </li>
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {taskDisplay}
              </li>
            </ol>
          </nav>
        </div>

        <div className="comp-details-title-container">
          <div className="comp-details-title-info">
            <h1 className="comp-box-complaint-id">
              <span>{taskDisplay}</span>
            </h1>
            {task?.taskStatusCode && status && (
              <span className={`badge ${applyStatusClass(task.taskStatusCode)}`}>{status.label}</span>
            )}
          </div>
          <div className="comp-header-actions">
            {task?.taskIdentifier && (
              <Button
                id="task-edit-button"
                as={Link as any}
                to={`/investigation/${investigationGuid}/task/${task.taskIdentifier}/edit`}
                title="Edit task"
                variant="outline-light"
              >
                <i className="bi bi-pencil me-1" /> Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
