import {
  applyStatusClass,
  parseUTCDateTimeToLocal,
  formatDate,
  formatDateTime,
  formatTime,
} from "@/app/common/methods";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { Attachments } from "@/app/components/common/attachments-carousel";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { selectTaskCategory, selectTaskStatus, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import { DELETE_CONFIRM } from "@/app/types/modal/modal-types";
import { ActivityNote, DiaryDate, Investigation, Task } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useCallback, useEffect, useState } from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import {
  GET_DIARY_DATES_BY_TASK,
  DELETE_DIARY_DATES_BY_TASK,
} from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { useLocation } from "react-router-dom";
import { ReportRenderer } from "@/app/components/containers/investigations/details/investigation-continuation/report-renderer";
import { GET_ACTIVITY_NOTES_BY_TASK } from "@/app/components/common/activity-note";

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
  const { data: taskActionData } = useGraphQLQuery<{ getActivityNotesByTask: ActivityNote[] }>(
    GET_ACTIVITY_NOTES_BY_TASK,
    {
      queryKey: ["getActivityNotesByTask", task.taskIdentifier],
      variables: { taskGuid: task.taskIdentifier },
      enabled: !!task.taskIdentifier,
    },
  );
  const diaryDates = diaryDatesData?.diaryDatesByTask || [];
  const taskActions = taskActionData?.getActivityNotesByTask || [];

  // State
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officerList = useAppSelector(selectOfficers);
  const [attachmentCount, setAttachmentCount] = useState<number>(0);
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string>("0");

  // Data
  const dispatch = useAppDispatch();
  const subCategory = taskSubCategories.find((subCategory) => subCategory.value === task?.taskTypeCode);
  const category = taskCategories.find((category) => category.value === subCategory?.taskCategory);
  const status = taskStatuses.find((status) => status.value === task?.taskStatusCode);
  const assignedOfficer = officerList?.find((officer) => officer.app_user_guid === task.assignedUserIdentifier);
  const createdOfficer = officerList?.find((officer) => officer.app_user_guid === task.createdByUserIdentifier);
  const taskIdentifier = task.taskIdentifier;

  // Use Effects
  useEffect(() => {
    const subscription = attachmentUploadComplete$.subscribe((id) => {
      if (id === taskIdentifier) {
        setAttachmentRefreshKey((k) => k + 1);
      }
    });

    return () => subscription.unsubscribe();
  }, [taskIdentifier]);

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

  const removeDiaryDatesByTaskMutation = useGraphQLMutation(DELETE_DIARY_DATES_BY_TASK, {
    onSuccess: () => {
      ToggleSuccess("Diary dates within task removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing task:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove task");
    },
  });

  const handleSlideCountChange = useCallback(
    (count: number) => {
      setAttachmentCount(count);
    },
    [setAttachmentCount],
  );

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
            // Remove any diary dates associated with this task
            if (diaryDates.length > 0) {
              removeDiaryDatesByTaskMutation.mutate({
                taskGuid: taskIdentifier,
              });
            }
          },
        }),
      );
    },
    [dispatch, removeTaskMutation],
  );
  const isExpanded = activeKey === task.taskNumber?.toString();
  return (
    <section
      className="comp-details-section"
      id={`task-item-${task.taskNumber}`}
    >
      <Accordion
        onSelect={(key) => setActiveKey(key as string)}
        activeKey={activeKey}
      >
        <Accordion.Item eventKey={task.taskNumber?.toString()}>
          <Card
            className="mb-2"
            border="default"
          >
            <Card.Header className="comp-card-header align-items-center">
              <div className="comp-card-header-title">
                <h4 className="text-nowrap overflow-hidden">Task {task.taskNumber}</h4>
                <span className={`badge ${applyStatusClass(task.taskStatusCode)}`}>{status?.label}</span>
                <pre className="mx-1 text-nowrap overflow-hidden">
                  <b>{category?.label}</b>
                  {`  |  ${subCategory?.label}`}
                </pre>
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
                <button
                  onClick={() => setActiveKey(task.taskNumber?.toString())}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      setActiveKey(task.taskNumber?.toString());
                      e.preventDefault();
                    }
                  }}
                  className="d-flex flex-row gap-3 text-style-button"
                >
                  <dt>Task description</dt>
                  <dd>
                    <div className={(isExpanded ? "" : "content-fade") + " overflow-hidden"}>
                      <pre id="comp-task-description">{task?.description}</pre>
                    </div>
                  </dd>
                </button>
                <div>
                  <dt>Officer assigned</dt>
                  <dd>
                    <pre id="comp-task-assigned-user">{`${assignedOfficer?.last_name},  ${assignedOfficer?.first_name}`}</pre>
                  </dd>
                </div>
              </dl>
              <Accordion.Body className="comp-details-section px-0">
                <dl>
                  <hr className="m-0"></hr>
                  <div className="gap-2 align-items-center">
                    <i className="bi bi-calendar3-week"></i>
                    <h5 className="fw-bold m-0">Diary dates</h5>
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
                              <div className="small gray-text">{`Added on ${formatDate(diaryDate.addedTimestamp)} by ${diaryDateCreatedOfficer?.last_name}, ${diaryDateCreatedOfficer?.first_name} (${createdOfficer?.agency_code?.shortDescription})`}</div>
                            </div>
                          );
                        })}
                      </pre>
                    </dd>
                  </div>

                  <hr className="m-0"></hr>
                  <div className="gap-2 align-items-center">
                    <i className="bi bi-file-text"></i>
                    <h5 className="fw-bold m-0">Task actions</h5>
                  </div>
                  <div className="task-actions-view">
                    {taskActions.map((taskAction) => {
                      const taskActionCreatedOfficer = officerList?.find(
                        (officer) => officer.app_user_guid === taskAction.reportedAppUserGuidRef,
                      );
                      const taskActionActionedOfficer = officerList?.find(
                        (officer) => officer.app_user_guid === taskAction.actionedAppUserGuidRef,
                      );
                      return (
                        <div
                          key={taskAction.activityNoteGuid}
                          className="mb-3"
                        >
                          <dl>
                            <div>
                              <dt>Task action</dt>
                              <dd>
                                <pre id="comp-task-action">
                                  <b>Description </b>
                                  <ReportRenderer
                                    style={{ display: "inline-block" }}
                                    json={taskAction.contentJson ? JSON.parse(taskAction.contentJson) : {}}
                                  />
                                </pre>
                                <pre id="comp-task-action">
                                  <b>Date/time actioned </b>
                                  {(() => {
                                    const d = parseUTCDateTimeToLocal(taskAction.actionedDate, taskAction.actionedTime);
                                    if (!d) return "";
                                    const s = d.toString();
                                    return taskAction.actionedTime
                                      ? `${formatDate(s)} ${formatTime(s)}`
                                      : formatDate(s);
                                  })()}
                                </pre>
                                <pre id="comp-task-action">
                                  <b>Officer </b>
                                  {`${taskActionActionedOfficer?.last_name}, ${taskActionActionedOfficer?.first_name}`}
                                </pre>

                                <div className="small gray-text">
                                  {`Added on ${formatDate(taskAction.reportedTimestamp)} by ${taskActionCreatedOfficer?.last_name}, ${taskActionCreatedOfficer?.first_name} (${taskActionCreatedOfficer?.agency_code?.shortDescription})`}
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      );
                    })}
                  </div>

                  <hr className="m-0"></hr>
                  <div className="gap-2 align-items-center">
                    <i className="bi bi-file-image"></i>
                    <h5 className="fw-bold m-0">Attachments</h5>
                  </div>
                  <div className="mt-3">
                    <fieldset className="comp-carousel-fieldset-no-preview">
                      <Attachments
                        attachmentType={AttachmentEnum.TASK_ATTACHMENT}
                        identifier={investigationData?.investigationGuid ?? ""}
                        subIdentifier={task?.taskIdentifier}
                        allowUpload={false}
                        allowDelete={false}
                        refreshKey={attachmentRefreshKey}
                        onSlideCountChange={handleSlideCountChange}
                        showPreview={false}
                      />
                    </fieldset>
                  </div>
                </dl>
              </Accordion.Body>
            </Card.Body>
            <Accordion.Header
              className={`d-flex align-items-center w-100 ${
                isExpanded ? "justify-content-center" : "justify-content-between"
              }`}
              ref={(el: any) => {
                if (el) {
                  const button = el.querySelector(".accordion-button") as HTMLElement;
                  if (button) {
                    button.style.setProperty("background-color", "#e4e4e4", "important");
                    if (isExpanded) {
                      button.style.setProperty("justify-content", "center");
                    } else {
                      button.style.setProperty("justify-content", "space-between");
                    }
                  }
                }
              }}
            >
              {isExpanded ? (
                <i className="bi bi-chevron-up fs-1"></i>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mx-3 task-item-body">
                    <div className="d-flex align-items-center gap-2 text-nowrap">
                      <i className="bi bi-table fs-5"></i>
                      <small>Diary dates: {diaryDates.length}</small>
                      <small className="text-danger">
                        <b></b>
                      </small>
                    </div>

                    <div className="d-flex align-items-center gap-2 text-nowrap">
                      <i className="bi bi-file-text fs-5"></i>
                      <small>Task Actions: {taskActions.length} </small>
                      <small className="text-danger">
                        <b></b>
                      </small>
                    </div>

                    <div className="d-flex align-items-center gap-2 text-nowrap">
                      <i className="bi bi-file-image fs-5"></i>
                      <small>Attachments: {attachmentCount}</small>
                      <small className="text-danger">
                        <b></b>
                      </small>
                    </div>
                  </div>
                  <i className="bi bi-chevron-down fs-1"></i>
                </>
              )}
            </Accordion.Header>
          </Card>
        </Accordion.Item>
      </Accordion>
      <div className="mb-3 small gray-text">{`Created on ${formatDateTime(task.createdDate)} by ${createdOfficer?.last_name}, ${createdOfficer?.first_name} (${createdOfficer?.agency_code?.shortDescription})`}</div>
    </section>
  );
};
