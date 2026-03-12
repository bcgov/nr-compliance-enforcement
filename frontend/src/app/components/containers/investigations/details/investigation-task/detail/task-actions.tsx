import { FC } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { ActivityNote } from "@/generated/graphql";
import { formatDate, formatTime, formatDateTime, parseUTCDateTimeToLocal } from "@/app/common/methods";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";
import { GET_ACTIVITY_NOTES_BY_TASK } from "@/app/components/common/activity-note";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_EDIT_TASK_ACTION } from "@/app/types/modal/modal-types";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";

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
  const dispatch = useAppDispatch();
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

  const { data, refetch } = useGraphQLQuery<{ getActivityNotesByTask: ActivityNote[] }>(
    GET_ACTIVITY_NOTES_BY_TASK,
    {
      queryKey: ["getActivityNotesByTask", taskIdentifier],
      variables: { taskGuid: taskIdentifier ?? "" },
      enabled: !!taskIdentifier,
    },
  );

  const taskActions = data?.getActivityNotesByTask ?? [];
  const hasTaskActions = taskActions.length > 0;

  const handleEditClick = (taskAction: ActivityNote) => {
    onEdit?.(taskAction);
    if (!taskIdentifier) return;
    dispatch(
      openModal({
        modalType: ADD_EDIT_TASK_ACTION,
        modalSize: "lg",
        data: {
          investigationGuid,
          taskIdentifier,
          taskAction,
          onDirtyChange: handleChildDirtyChange,
        },
        callback: refetch,
        hideCallback,
      }),
    );
  };

  const handleAddClick = () => {
    if (!taskIdentifier) return;
    dispatch(
      openModal({
        modalType: ADD_EDIT_TASK_ACTION,
        modalSize: "lg",
        data: {
          investigationGuid,
          taskIdentifier,
          taskAction: null,
          onDirtyChange: handleChildDirtyChange,
        },
        callback: refetch,
        hideCallback,
      }),
    );
  };

  const taskActionsTable = (
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
  );

  return (
    <div className="comp-details-section">
      <div className="d-flex align-items-center justify-content-between gap-4 mb-0">
        <h3 className="mb-0">Task actions</h3>
        {taskIdentifier && hasTaskActions && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddClick}
          >
            <i className="bi bi-plus-circle" />
            <span>Add task action</span>
          </Button>
        )}
      </div>

      {taskIdentifier ? (
        hasTaskActions ? (
          <Card className="mb-3 mt-3" border="default">
            <Card.Body>{taskActionsTable}</Card.Body>
          </Card>
        ) : (
          <div className="mt-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddClick}
            >
              <i className="bi bi-plus-circle" />
              <span>Add task action</span>
            </Button>
          </div>
        )
      ) : (
        <Card className="mb-3 mt-3" border="default">
          <Card.Body>
            {hasTaskActions ? taskActionsTable : <p className="text-muted mb-0">No task actions</p>}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
