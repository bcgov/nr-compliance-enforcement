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
    <div className="comp-details-view">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Tasks</h3>
        <Button
          id="add-task-button"
          as={Link as any}
          to={`/investigation/${investigationGuid}/task/create`}
          variant="primary"
          size="sm"
        >
          <i className="bi bi-plus-circle me-1" />
          Add task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        investigationGuid={investigationGuid}
      />
    </div>
  );
};
