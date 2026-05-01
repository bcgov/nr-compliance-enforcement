import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { gql } from "graphql-request";
import { useInvestigationSearch } from "../../../hooks/use-investigation-search";
import { Task } from "@/generated/graphql";
import type { CreateUpdateTaskInput } from "@/generated/graphql";
import { applyStatusClass } from "@/app/common/methods";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { Button } from "react-bootstrap";
import { exportTask } from "@/app/store/reducers/documents-thunks";
import { ChangeStatusModal } from "@/app/components/common/change-status-modal";

const UPDATE_TASK = gql`
  mutation UpdateTask($input: CreateUpdateTaskInput!) {
    updateTask(input: $input) {
      taskIdentifier
    }
  }
`;

interface TaskDetailHeaderProps {
  task?: Task;
  investigationGuid: string;
  onStatusUpdated?: () => void;
}

export const TaskDetailHeader: FC<TaskDetailHeaderProps> = ({ task, investigationGuid, onStatusUpdated }) => {
  const dispatch = useAppDispatch();
  const taskStatuses = useAppSelector(selectTaskStatus);
  const status = taskStatuses.find((s) => s.value === task?.taskStatusCode);
  const taskDisplay = task ? `Task #${task.taskNumber}` : "Task";
  const { searchURL: investigationSearchURL } = useInvestigationSearch();

  const [showStatusModal, setShowStatusModal] = useState(false);

  const updateStatusMutation = useGraphQLMutation(UPDATE_TASK, {
    onSuccess: () => {
      ToggleSuccess("Task status updated successfully");
      setShowStatusModal(false);
      onStatusUpdated?.();
    },
    onError: () => {
      ToggleError("Failed to update task status");
    },
  });

  const handleExportTask = () => {
    dispatch(exportTask(task!.investigationIdentifier, task!.taskIdentifier, task!.taskNumber));
  };

  const handleOpenStatusModal = () => setShowStatusModal(true);
  const handleCloseStatusModal = () => setShowStatusModal(false);
  const handleSaveStatus = async (input: CreateUpdateTaskInput) => {
    await updateStatusMutation.mutateAsync({ input });
  };

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
          {task && (
            <div className="comp-header-actions-desktop ms-auto">
              <Button
                id="task-details-update-status-button"
                title="Update status"
                variant="outline-light"
                size="sm"
                onClick={handleOpenStatusModal}
              >
                <i className="bi bi-arrow-repeat" />
                <span>Update status</span>
              </Button>
              <Button
                id="task-details-export-task-button"
                title="Export task"
                variant="outline-light"
                size="sm"
                onClick={handleExportTask}
              >
                <i className="bi bi-file-earmark-pdf" />
                <span>Export task</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <ChangeStatusModal
        show={showStatusModal}
        onHide={handleCloseStatusModal}
        onSave={handleSaveStatus}
        data={task}
        type="task"
        isSaving={updateStatusMutation.isPending}
      />
    </div>
  );
};
