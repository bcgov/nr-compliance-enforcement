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
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";

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
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const InvestigationTasksNew: FC<InvestigationTasksNewProps> = ({ investigationGuid, investigationData }) => {
  const navigate = useNavigate();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const tasks = (investigationData?.tasks as Task[]) ?? [];
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

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

  const handleHideAddTaskModal = () => {
    const result = hideCallback();
    if (result === false) return;
    setShowAddTaskModal(false);
  };

  return (
    <div className="comp-details-section--list-view">
      <div className="d-flex align-items-center justify-content-between my-2">
        <h3>Tasks</h3>
        <Button
          id="add-task-button"
          variant="primary"
          size="sm"
          onClick={() => setShowAddTaskModal(true)}
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

      <TaskDetailEditModal
        show={showAddTaskModal}
        onHide={handleHideAddTaskModal}
        onSave={handleSaveNewTask}
        investigationGuid={investigationGuid}
        task={undefined}
        isSaving={createTaskMutation.isPending}
        onDirtyChange={handleChildDirtyChange}
      />
    </div>
  );
};
