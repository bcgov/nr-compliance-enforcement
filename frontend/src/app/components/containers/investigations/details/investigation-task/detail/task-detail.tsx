import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { Task } from "@/generated/graphql";
import { TaskDetailHeader } from "./task-detail-header";
import { TaskActions } from "./task-actions";
import { TaskDetailEditModal } from "./task-detail-edit-modal";
import { DiaryDates } from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { Card } from "react-bootstrap";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { TaskAttachments } from "@/app/components/containers/investigations/details/investigation-task/detail/attachments/task-attachments";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { TaskExhibits } from "@/app/components/containers/investigations/details/investigation-task/detail/exhibit/task-exhibits";
import { useInvestigationReadOnly } from "../../../hooks/use-investigation-read-only";

const GET_TASK = gql`
  query GetTask($taskId: String!) {
    task(taskId: $taskId) {
      taskIdentifier
      investigationIdentifier
      investigationLabel
      taskTypeCode
      taskStatusCode
      assignedUserIdentifier
      createdByUserIdentifier
      createdDate
      updatedDate
      taskNumber
      description
      activeIndicator
      taskCategoryTypeCode
      remarks
      dueDate
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
}

//-----------TASK DETAIL SECTION----------------
const TaskDetailSection: FC<TaskDetailSectionProps> = ({ task }) => {
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const officers = useAppSelector(selectOfficers);

  const category = taskCategories.find((c) => c.value === task?.taskCategoryTypeCode);
  const subCategory = taskSubCategories.find((s) => s.value === task?.taskTypeCode);
  const categoryLabel = category?.label ?? "-";
  const subCategoryLabel = subCategory?.label && subCategory?.label !== "None" ? subCategory.label : "-";
  const assignedOfficer = officers?.find((o) => o.app_user_guid === task?.assignedUserIdentifier);
  const assignedOfficerName = assignedOfficer ? `${assignedOfficer.last_name}, ${assignedOfficer.first_name}` : "-";

  const dueDateObj = new Date(task?.dueDate);

  return (
    <div className="comp-details-section">
      <h3 className="mb-0">Task details</h3>
      <Card
        className="mb-3 mt-3"
        border="default"
      >
        <Card.Body>
          <dl>
            <div>
              <dt>Category</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-category` : undefined}>{categoryLabel}</dd>
            </div>
            <div>
              <dt>Sub Category</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-sub-category` : undefined}>
                {subCategoryLabel}
              </dd>
            </div>
            <div>
              <dt>Remarks</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-remarks` : undefined}>{task?.remarks ?? "-"}</dd>
            </div>
            <div>
              <dt>Officer Assigned</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-officer-assigned` : undefined}>
                {assignedOfficerName}
              </dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-due-date` : undefined}>
                {dueDateObj.toISOString().split("T")[0] ?? "-"}
              </dd>
            </div>
            <div>
              <dt>Task Details</dt>
              <dd id={task?.taskIdentifier ? `${task.taskIdentifier}-task-detail-description` : undefined}>
                {task?.description ?? "-"}
              </dd>
            </div>
          </dl>
        </Card.Body>
      </Card>
    </div>
  );
};

//-----------TASK DETAIL COMPONENT----------------
const TaskDetail: FC = () => {
  const { investigationGuid = "", taskId = "" } = useParams<{
    investigationGuid: string;
    taskId: string;
  }>();

  const [showTaskDetailEditModal, setShowTaskDetailEditModal] = useState(false);
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

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

  const task = useMemo(() => data?.task, [data]);
  const investigationReadOnly = useInvestigationReadOnly(investigationGuid);
  const isReadOnly = investigationReadOnly || task?.taskStatusCode === "CLOSED";

  const handleHideTaskDetailEditModal = () => {
    const result = hideCallback();
    if (result === false) return;
    setShowTaskDetailEditModal(false);
  };

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
        onEdit={() => setShowTaskDetailEditModal(true)}
        isReadOnly={isReadOnly}
      />
      <section className="comp-details-body comp-details-form comp-container">
        <TaskDetailSection task={task} />
        <TaskDetailEditModal
          show={showTaskDetailEditModal}
          onHide={handleHideTaskDetailEditModal}
          onSave={(input) => updateTaskMutation.mutateAsync({ input })}
          investigationGuid={investigationGuid}
          task={task}
          isSaving={updateTaskMutation.isPending}
          onDirtyChange={handleChildDirtyChange}
        />
        <DiaryDates
          investigationGuid={investigationGuid}
          investigationData={task ? { tasks: [task] } : undefined}
          taskGuid={task?.taskIdentifier}
          isReadOnly={isReadOnly}
        />
        <TaskActions
          investigationGuid={investigationGuid}
          taskIdentifier={task?.taskIdentifier}
          taskAssignedUserGuid={task?.assignedUserIdentifier}
          isReadOnly={isReadOnly}
        />
        <TaskExhibits
          investigationGuid={investigationGuid}
          task={task}
          taskAssignedUserGuid={task?.assignedUserIdentifier}
          isReadOnly={isReadOnly}
        />
        <TaskAttachments
          investigationGuid={investigationGuid}
          task={task}
          isReadOnly={isReadOnly}
        />
      </section>
    </div>
  );
};

export default TaskDetail;
