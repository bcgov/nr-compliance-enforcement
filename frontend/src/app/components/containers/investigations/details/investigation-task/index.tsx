import { FC, useState } from "react";
import { Button } from "react-bootstrap";
import { TaskItem } from "@/app/components/containers/investigations/details/investigation-task/task-item";
import { TaskForm } from "@/app/components/containers/investigations/details/investigation-task/task-form";
import { Investigation, Task } from "@/generated/graphql";

interface InvestigationTasksProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

export const InvestigationTasks: FC<InvestigationTasksProps> = ({ investigationGuid, investigationData }) => {
  // State
  const [showAddCard, setshowAddCard] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [attachmentRefreshToken, setAttachmentRefreshToken] = useState<{ [taskId: string]: number }>({});

  // Data
  const tasks = investigationData?.tasks;

  // Functions
  const handleCloseForm = (newTask?: Task) => {
    setshowAddCard(false);
    setEditingTaskId(null);

    if (newTask) {
      // bump the refresh token for the new task
      setAttachmentRefreshToken((prev) => ({
        ...prev,
        [newTask.taskIdentifier]: 1,
      }));
    }
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  return (
    <div className="comp-details-view">
      <div className="row">
        <div className="col-12">
          <h3>Tasks</h3>
        </div>
      </div>

      <div className="task-list">
        {tasks?.map((task) => (
          <div key={task?.taskIdentifier}>
            {editingTaskId === task?.taskIdentifier ? (
              <TaskForm
                investigationGuid={investigationGuid}
                task={task}
                onClose={handleCloseForm}
                onAttachmentsChanged={() => {
                  setAttachmentRefreshToken((prev) => ({
                    ...prev,
                    [task.taskIdentifier]: (prev[task.taskIdentifier] || 0) + 1,
                  }));
                }}
              />
            ) : (
              <TaskItem
                task={task as Task}
                investigationData={investigationData}
                canEdit={!editingTaskId}
                onEdit={handleEditTask}
                refreshToken={attachmentRefreshToken[task?.taskIdentifier ?? ""] || 0}
              />
            )}
          </div>
        ))}
      </div>

      {showAddCard && (
        <TaskForm
          investigationGuid={investigationGuid}
          onClose={handleCloseForm}
        />
      )}

      <div className="row">
        <div className="col-12">
          <Button
            id="add-task-button"
            variant="primary"
            size="sm"
            onClick={() => setshowAddCard(true)}
          >
            <i className="bi bi-plus-circle me-1" /> {/**/}
            Add task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvestigationTasks;
