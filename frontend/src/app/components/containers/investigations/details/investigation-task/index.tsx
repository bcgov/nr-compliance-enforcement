import { FC, useEffect, useRef, useState } from "react";
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
  const targetRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (showAddCard && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showAddCard]);

  return (
    <div className="comp-details-view">
      <div className="row my-2">
        <div className="col-auto">
          <h3>Tasks</h3>
        </div>
        <div className="col-auto">
          <Button
            id="add-task-button"
            variant="primary"
            size="sm"
            onClick={() => {
              setshowAddCard(true);
              targetRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <i className="bi bi-plus-circle me-1" /> {/**/}
            Add task
          </Button>
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
              />
            ) : (
              <TaskItem
                task={task as Task}
                investigationData={investigationData}
                canEdit={!editingTaskId}
                onEdit={handleEditTask}
              />
            )}
          </div>
        ))}
      </div>
      <div
        ref={targetRef}
        className="scroll-target"
      >
        {showAddCard && (
          <TaskForm
            investigationGuid={investigationGuid}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};

export default InvestigationTasks;
