import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { Task } from "@/generated/graphql";
import { TaskDetailHeader } from "./task-detail-header";
import { TaskActions } from "./task-actions";
import { TaskDetailEditModal } from "./task-detail-edit-modal";
import { DiaryDates } from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { Button, Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";

const GET_TASK = gql`
  query GetTask($taskId: String!) {
    task(taskId: $taskId) {
      taskIdentifier
      investigationIdentifier
      taskTypeCode
      taskStatusCode
      assignedUserIdentifier
      createdByUserIdentifier
      createdDate
      updatedDate
      taskNumber
      description
      activeIndicator
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($input: CreateUpdateTaskInput!) {
    updateTask(input: $input) {
      taskIdentifier
    }
  }
`;

interface TaskDetailSectionProps {
  task?: Task;
  investigationGuid: string;
  onEditClick?: () => void;
}

const TaskDetailSection: FC<TaskDetailSectionProps> = ({ task, investigationGuid, onEditClick }) => {
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const officers = useAppSelector(selectOfficers);

  const subCategory = taskSubCategories.find((s) => s.value === task?.taskTypeCode);
  const category = taskCategories.find((c) => c.value === subCategory?.taskCategory);
  const categoryLabel = category?.label ?? "-";
  const subCategoryLabel = subCategory?.label ?? "-";
  const assignedOfficer = officers?.find((o) => o.app_user_guid === task?.assignedUserIdentifier);
  const assignedOfficerName = assignedOfficer ? `${assignedOfficer.last_name}, ${assignedOfficer.first_name}` : "-";

  return (
    <div className="comp-details-section">
      <h2 className="mb-0">Task details</h2>
      <Card
        className="mb-3 mt-3 position-relative"
        border="default"
      >
        {task?.taskIdentifier && onEditClick && (
          <Button
            id="task-edit-button"
            type="button"
            variant="outline-primary"
            size="sm"
            title="Edit task"
            className="position-absolute top-0 end-0 m-2"
            onClick={onEditClick}
          >
            <i className="bi bi-pencil" />
            <span>Edit</span>
          </Button>
        )}
        <Card.Body>
          <dl>
            <div>
              <dt>Category</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-category` : undefined}>{categoryLabel}</dd>
            </div>
            <div>
              <dt>Sub Category</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-sub-category` : undefined}>{subCategoryLabel}</dd>
            </div>
            <div>
              <dt>Officer Assigned</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-officer-assigned` : undefined}>{assignedOfficerName}</dd>
            </div>
            <div>
              <dt>Task Details</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-detail-description` : undefined}>{task?.description ?? "-"}</dd>
            </div>
          </dl>
        </Card.Body>
      </Card>
    </div>
  );
};

const TaskDetail: FC = () => {
  const { investigationGuid = "", taskId = "" } = useParams<{
    investigationGuid: string;
    taskId: string;
  }>();

  const [showTaskDetailEditModal, setShowTaskDetailEditModal] = useState(false);

  const { data, isLoading, refetch } = useGraphQLQuery<{ task: Task }>(GET_TASK, {
    queryKey: ["getTask", taskId],
    variables: { taskId },
    enabled: !!taskId,
  });

  const updateTaskMutation = useGraphQLMutation(UPDATE_TASK, {
    onSuccess: () => {
      ToggleSuccess("Task updated successfully");
      setShowTaskDetailEditModal(false);
      refetch();
    },
    onError: () => {
      ToggleError("Failed to update task");
    },
  });

  const task = data?.task;

  if (isLoading) {
    return (
      <div className="comp-complaint-details">
        <TaskDetailHeader investigationGuid={investigationGuid} />
        <section className="comp-details-body comp-container">
          <div className="comp-details-content">
            <p>Loading task details...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="comp-complaint-details">
      <TaskDetailHeader
        task={task}
        investigationGuid={investigationGuid}
        onStatusUpdated={refetch}
      />
      <section className="comp-details-body comp-details-form comp-container">
        <TaskDetailSection
          task={task}
          investigationGuid={investigationGuid}
          onEditClick={() => setShowTaskDetailEditModal(true)}
        />
        <TaskDetailEditModal
          show={showTaskDetailEditModal}
          onHide={() => setShowTaskDetailEditModal(false)}
          onSave={(input) => updateTaskMutation.mutateAsync({ input })}
          investigationGuid={investigationGuid}
          task={task}
          isSaving={updateTaskMutation.isPending}
        />
        <DiaryDates
          investigationGuid={investigationGuid}
          investigationData={task ? { tasks: [task] } : undefined}
          taskGuid={task?.taskIdentifier}
        />
        <TaskActions
          investigationGuid={investigationGuid}
          taskIdentifier={task?.taskIdentifier}
        />

      </section>
    </div>
  );
};

export default TaskDetail;
