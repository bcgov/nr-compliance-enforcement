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

  // Data
  const tasks = investigationData?.tasks;

  // Functions
  const handleCloseForm = () => {
    setshowAddCard(false);
    setEditingTaskId(null);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  return (
    <>
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
                  task={task as Task}
                  onClose={handleCloseForm}
                />
              ) : (
                <TaskItem
                  task={task as Task}
                  investigationData={investigationData}
                  onEdit={handleEditTask}
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
              variant="primary"
              size="sm"
              onClick={() => setshowAddCard(true)}
            >
              <i className="bi bi-plus-circle me-1" /> {/**/}
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestigationTasks;
