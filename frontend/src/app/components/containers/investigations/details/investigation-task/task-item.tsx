import { applyStatusClass, formatDate } from "@/app/common/methods";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { AttachmentsCarousel } from "@/app/components/common/attachments-carousel";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { selectTaskCategory, selectTaskStatus, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { DELETE_CONFIRM } from "@/app/types/modal/modal-types";
import { Investigation, Task } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useCallback } from "react";
import { Button, Card } from "react-bootstrap";

interface TaskItemProps {
  task: Task;
  canEdit: boolean;
  onEdit: (taskId: string) => void;
  investigationData?: Investigation;
}

const REMOVE_TASK = gql`
  mutation RemoveTask($taskId: String!) {
    removeTask(taskId: $taskId) {
      taskIdentifier
    }
  }
`;

export const TaskItem = ({ task, investigationData, canEdit, onEdit }: TaskItemProps) => {
  // State
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officerList = useAppSelector(selectOfficers);

  // Data
  const dispatch = useAppDispatch();
  const subCategory = taskSubCategories.find((subCategory) => subCategory.value === task?.taskTypeCode);
  const category = taskCategories.find((category) => category.value === subCategory?.taskCategory);
  const status = taskStatuses.find((status) => status.value === task?.taskStatusCode);
  const assignedOfficer = officerList?.find((officer) => officer.app_user_guid === task.assignedUserIdentifier);
  const createdOfficer = officerList?.find((officer) => officer.app_user_guid === task.createdByUserIdentifier);

  // Functions
  const removeTaskMutation = useGraphQLMutation(REMOVE_TASK, {
    onSuccess: () => {
      ToggleSuccess("Task removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing task:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove task");
    },
  });

  const handleRemoveTask = useCallback(
    (taskIdentifier: string, taskNumber: number) => {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: DELETE_CONFIRM,
          data: {
            title: `Remove Task ${taskNumber}`,
            description: `Are you sure you want to remove this task from this investigation? This action cannot be undone.`,
            deleteConfirmed: () => {},
          },
          callback: () => {
            removeTaskMutation.mutate({
              taskId: taskIdentifier,
            });
          },
        }),
      );
    },
    [dispatch, removeTaskMutation],
  );

  return (
    <section className="comp-details-section">
      <Card
        className="mb-3"
        border="default"
      >
        <Card.Header className="comp-card-header">
          <div className="comp-card-header-title">
            <h4>Task {task.taskNumber}</h4>
            <span className={`badge ${applyStatusClass(task.taskStatusCode)}`}>{status?.label}</span>
          </div>
          <div className="comp-card-header-actions">
            <Button
              disabled={!canEdit}
              variant="outline-primary"
              size="sm"
              id="task-edit-button"
              onClick={() => onEdit(task.taskIdentifier)} // orchestration is done via the parent component
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              id="task-remove-button"
              onClick={() => handleRemoveTask(task?.taskIdentifier, task?.taskNumber)}
            >
              <i className="bi bi-trash"></i>
              <span>Delete</span>
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="task-details">
          <dl>
            <div>
              <dt>Task category</dt>
              <dd>
                <pre id="comp-task-category">{category?.label}</pre>
              </dd>
            </div>
            <div>
              <dt>Task sub-category</dt>
              <dd>
                <pre id="comp-task-sub-category">{subCategory?.label}</pre>
              </dd>
            </div>
            <div>
              <dt>Task description</dt>
              <dd>
                <pre id="comp-task-description">{task?.description}</pre>
              </dd>
            </div>
            <div>
              <dt>Officer assigned</dt>
              <dd>
                <pre id="comp-task-assigned-user">{`${assignedOfficer?.last_name},  ${assignedOfficer?.first_name}`}</pre>
              </dd>
            </div>
            <div className="mt-3">
              <fieldset>
                <h4>Attachments ({"TBD"})</h4>
                <AttachmentsCarousel
                  attachmentType={AttachmentEnum.TASK_ATTACHMENT}
                  identifier={task?.taskIdentifier}
                  allowUpload={false}
                  allowDelete={false}
                />
              </fieldset>
            </div>
            <div
              style={{ fontSize: "14px", color: "#7a7a7a" }}
            >{`Created on ${formatDate(task.createdDate)} by ${createdOfficer?.last_name}, ${createdOfficer?.first_name} (${createdOfficer?.agency_code?.shortDescription})`}</div>
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
