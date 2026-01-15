import { applyStatusClass, formatDate } from "@/app/common/methods";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { selectTaskCategory, selectTaskStatus, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { DELETE_CONFIRM } from "@/app/types/modal/modal-types";
import { DiaryDate, Investigation, Task } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useCallback, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { GET_DIARY_DATES_BY_TASK } from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { useLocation } from "react-router-dom";

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
  const { hash, search } = useLocation();
  const { data: diaryDatesData } = useGraphQLQuery<{ diaryDatesByTask: DiaryDate[] }>(GET_DIARY_DATES_BY_TASK, {
    queryKey: ["diaryDatesByTask", task.taskIdentifier],
    variables: { taskGuid: task.taskIdentifier },
    enabled: !!task.taskIdentifier,
  });
  const diaryDates = diaryDatesData?.diaryDatesByTask || [];

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

  // Effects
  useEffect(() => {
    //Scroll to specific task item if hash matches
    const params = new URLSearchParams(search);
    const section = params.get("section");

    if (section) {
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [hash, search]);

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
    <section
      className="comp-details-section"
      id={`task-item-${task.taskNumber}`}
    >
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
            <div
              style={{ fontSize: "14px", color: "#7a7a7a" }}
            >{`Added on ${formatDate(task.createdDate)} by ${createdOfficer?.last_name}, ${createdOfficer?.first_name} (${createdOfficer?.agency_code?.shortDescription})`}</div>

            {diaryDates.length > 0 && (
              <>
                <hr className="m-0"></hr>
                <div style={{ gap: "8px", alignItems: "center" }}>
                  <i className="bi bi-calendar3-week"></i>
                  <h5 className="fw-bold m-0">Diary Dates</h5>
                </div>
                <div>
                  <dt></dt>
                  <dd>
                    <pre id="comp-task-category">
                      {diaryDates.map((diaryDate) => {
                        const diaryDateCreatedOfficer = officerList?.find(
                          (officer) => officer.app_user_guid === diaryDate.addedUserGuid,
                        );
                        return (
                          <div
                            className="mb-3"
                            key={diaryDate.diaryDateGuid}
                          >
                            <div>
                              <strong>{formatDate(diaryDate.dueDate)}</strong>
                              <span className="m-3">{diaryDate.description}</span>
                            </div>
                            <div
                              style={{ fontSize: "14px", color: "#7a7a7a" }}
                            >{`Added on ${formatDate(diaryDate.addedTimestamp)} by ${diaryDateCreatedOfficer?.last_name}, ${diaryDateCreatedOfficer?.first_name} (${createdOfficer?.agency_code?.shortDescription})`}</div>
                          </div>
                        );
                      })}
                    </pre>
                  </dd>
                </div>
              </>
            )}
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
