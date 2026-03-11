import { FC, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { ActivityNote } from "@/generated/graphql";
import { formatDate, formatTime, formatDateTime, parseUTCDateTimeToLocal } from "@/app/common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";
import {
  GET_ACTIVITY_NOTES_BY_TASK,
  SAVE_ACTIVITY_NOTE,
} from "@/app/components/common/activity-note";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { TaskActionModal } from "./task-action-modal";

interface TaskActionsProps {
  investigationGuid: string;
  taskIdentifier: string | undefined;
  onEdit?: (taskAction: ActivityNote) => void;
}

const TaskActionRow: FC<{
  taskAction: ActivityNote;
  onEdit?: (taskAction: ActivityNote) => void;
}> = ({ taskAction, onEdit }) => {
  const actionedByUser = useAppSelector(selectOfficerByAppUserGuid(taskAction.actionedAppUserGuidRef ?? undefined));
  const addedByUser = useAppSelector(selectOfficerByAppUserGuid(taskAction.reportedAppUserGuidRef ?? undefined));

  const actionedDateTimeStr = (() => {
    const d = parseUTCDateTimeToLocal(taskAction.actionedDate, taskAction.actionedTime);
    if (!d) return "";
    const s = d.toISOString?.() ?? d.toString();
    return taskAction.actionedTime ? `${formatDate(s)} ${formatTime(s)}` : formatDate(s);
  })();

  const actionedOfficerStr = actionedByUser
    ? `${actionedByUser.last_name}, ${actionedByUser.first_name}`
    : "-";

  const addedOnStr = addedByUser
    ? `${addedByUser.last_name}, ${addedByUser.first_name} (${addedByUser.agency_code?.shortDescription ?? addedByUser.agency_code_ref})`
    : "Unknown";
  const reportedTimestampStr = taskAction.reportedTimestamp
    ? formatDateTime(new Date(taskAction.reportedTimestamp).toISOString())
    : "";

  const description = taskAction.contentText?.trim() || "(No description)";

  return (
    <tr>
      <td>
        <div className="text-muted small mb-1">
          <span className="text-nowrap">Date/time actioned</span>{" "}
          <span className="text-dark">{actionedDateTimeStr}</span>
          {"  |  "}
          <span className="text-nowrap">Officer</span>{" "}
          <span className="text-dark">{actionedOfficerStr}</span>
        </div>
        <div className="mb-1">{description}</div>
        <div className="text-muted small mt-1 mb-0">
          Added on {reportedTimestampStr} by {addedOnStr}
        </div>
      </td>
      <td className="align-top text-end">
        <button
          type="button"
          className="btn btn-outline-primary rounded p-2"
          onClick={() => onEdit?.(taskAction)}
          title="Edit task action"
          aria-label="Edit task action"
        >
          <i className="bi bi-pencil ms-1 me-1" />
        </button>
      </td>
    </tr>
  );  
};

export const TaskActions: FC<TaskActionsProps> = ({
  investigationGuid,
  taskIdentifier,
  onEdit,
}) => {
  const [editingTaskAction, setEditingTaskAction] = useState<ActivityNote | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, refetch } = useGraphQLQuery<{ getActivityNotesByTask: ActivityNote[] }>(
    GET_ACTIVITY_NOTES_BY_TASK,
    {
      queryKey: ["getActivityNotesByTask", taskIdentifier],
      variables: { taskGuid: taskIdentifier ?? "" },
      enabled: !!taskIdentifier,
    },
  );

  const saveMutation = useGraphQLMutation(SAVE_ACTIVITY_NOTE, {
    onSuccess: () => {
      ToggleSuccess("Task action saved successfully");
      setShowModal(false);
      setEditingTaskAction(null);
      refetch();
    },
    onError: () => {
      ToggleError("Failed to save task action");
    },
  });

  const taskActions = data?.getActivityNotesByTask ?? [];

  const handleEditClick = (taskAction: ActivityNote) => {
    setEditingTaskAction(taskAction);
    setShowModal(true);
    onEdit?.(taskAction);
  };

  const handleAddClick = () => {
    setEditingTaskAction(null);
    setShowModal(true);
  };

  const handleSave = async (input: Parameters<typeof saveMutation.mutateAsync>[0]["input"]) => {
    await saveMutation.mutateAsync({ input });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTaskAction(null);
  };

  return (
    <div className="comp-details-section">
      <div className="d-flex align-items-center justify-content-between gap-4 mb-0">
        <h3 className="mb-0">Task actions</h3>
        {taskIdentifier && (
          <Button variant="primary" size="sm" onClick={handleAddClick}>
            <i className="bi bi-plus-circle" />
            <span>Add task action</span>
          </Button>
        )}
      </div>
      <Card className="mb-3 mt-3" border="default">
        <Card.Body>
          {taskActions.length === 0 ? (
            <p className="text-muted mb-0">No task actions</p>
          ) : (
            <Table className="mb-0 table-borderless diary-dates-table">
              <tbody>
                {taskActions.map((ta) => (
                  <TaskActionRow
                    key={ta.activityNoteGuid}
                    taskAction={ta}
                    onEdit={handleEditClick}
                  />
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      {taskIdentifier && (
        <TaskActionModal
          show={showModal}
          onHide={handleCloseModal}
          onSave={handleSave}
          investigationGuid={investigationGuid}
          taskIdentifier={taskIdentifier}
          taskAction={editingTaskAction}
          isSaving={saveMutation.isPending}
        />
      )}
    </div>
  );
};
