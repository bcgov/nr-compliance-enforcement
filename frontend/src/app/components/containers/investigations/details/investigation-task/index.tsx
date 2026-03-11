import { FC } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TaskList } from "@/app/components/containers/investigations/details/investigation-task/task-list";
import { Investigation, Task } from "@/generated/graphql";

interface InvestigationTasksNewProps {
  investigationGuid: string;
  investigationData?: Investigation;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const InvestigationTasksNew: FC<InvestigationTasksNewProps> = ({ investigationGuid, investigationData }) => {
  const tasks = (investigationData?.tasks as Task[]) ?? [];

  return (
    <div className="comp-details-section--list-view">
      <div className="d-flex align-items-center justify-content-between my-2">
        <h3>Tasks</h3>
        <Button
          id="add-task-button"
          as={Link as any}
          to={`/investigation/${investigationGuid}/task/create`}
          variant="primary"
          size="sm"
        >
          <i className="bi bi-plus-circle me-1" /> Add task
        </Button>
      </div>

      <div className="comp-data-container">
        <div className="comp-data-list-map">
          <TaskList
            tasks={tasks}
            investigationGuid={investigationGuid}
          />
        </div>
      </div>
    </div>
  );
};
