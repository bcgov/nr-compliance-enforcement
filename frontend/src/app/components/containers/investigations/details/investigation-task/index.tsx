import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "graphql-request";
import { Button } from "react-bootstrap";
import { TaskList } from "@/app/components/containers/investigations/details/investigation-task/task-list";
import { TaskDetailEditModal } from "@/app/components/containers/investigations/details/investigation-task/detail/task-detail-edit-modal";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { Investigation, Task } from "@/generated/graphql";
import type { CreateUpdateTaskInput } from "@/generated/graphql";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateUpdateTaskInput!) {
    createTask(input: $input) {
      taskIdentifier
    }
  }
`;

interface InvestigationTasksNewProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

export const InvestigationTasksNew: FC<InvestigationTasksNewProps> = ({ investigationGuid, investigationData }) => {
  const navigate = useNavigate();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const tasks = (investigationData?.tasks as Task[]) ?? [];

  const createTaskMutation = useGraphQLMutation<{ createTask: { taskIdentifier: string } }>(CREATE_TASK, {
    onSuccess: (data) => {
      ToggleSuccess("Task created successfully");
      setShowAddTaskModal(false);
      const taskId = data?.createTask?.taskIdentifier;
      if (taskId) {
        navigate(`/investigation/${investigationGuid}/task/${taskId}`);
      }
    },
    onError: () => {
      ToggleError("Failed to create task");
    },
  });

  const handleSaveNewTask = async (input: CreateUpdateTaskInput) => {
    await createTaskMutation.mutateAsync({ input });
  };

  return (
    <div className="comp-details-view">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Tasks</h3>
        <Button
          id="add-task-button"
          variant="primary"
          size="sm"
          onClick={() => setShowAddTaskModal(true)}
        >
          <i className="bi bi-plus-circle me-1" /> Add task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        investigationGuid={investigationGuid}
      />

      <TaskDetailEditModal
        show={showAddTaskModal}
        onHide={() => setShowAddTaskModal(false)}
        onSave={handleSaveNewTask}
        investigationGuid={investigationGuid}
        task={undefined}
        isSaving={createTaskMutation.isPending}
      />
    </div>
  );
};
