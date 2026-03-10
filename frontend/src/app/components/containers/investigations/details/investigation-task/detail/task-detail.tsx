import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { Task } from "@/generated/graphql";
import { TaskDetailHeader } from "./task-detail-header";
import { Button } from "react-bootstrap";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_EDIT_TASK_ATTACHMENT } from "@/app/types/modal/modal-types";
import {
  Attachment,
  useInvestigationAttachments,
} from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { useDocumentationSearch } from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-documentation-search";
import { TaskAttachmentList } from "@/app/components/containers/investigations/details/investigation-task/detail/attachments/attachment-list";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";

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

const TaskDetail: FC = () => {
  const dispatch = useAppDispatch();
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

  const { investigationGuid = "", taskId = "" } = useParams<{
    investigationGuid: string;
    taskId: string;
  }>();

  const { searchValues } = useDocumentationSearch();

  const { data, isLoading } = useGraphQLQuery<{ task: Task }>(GET_TASK, {
    queryKey: ["getTask", taskId],
    variables: { taskId },
    enabled: !!taskId,
  });

  const task = data?.task;

  const { attachments } = useInvestigationAttachments({
    investigationIdentifier: investigationGuid,
    tasks: task ? [task] : [],
    search: searchValues.search,
    taskFilter: searchValues.taskFilter,
    sortBy: searchValues.sortBy,
    sortOrder: searchValues.sortOrder,
    page: searchValues.page,
    pageSize: searchValues.pageSize,
    enabled: !!investigationGuid,
  });

  const handleAddAttachment = () => {
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_EDIT_TASK_ATTACHMENT,
        data: {
          title: "Upload attachment",
          investigationIdentifier: investigationGuid,
          taskIdentifier: task?.taskIdentifier,
          existingAttachments: attachments,
          defaultAssignee: task?.assignedUserIdentifier,
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const handleEditAttachment = (attachment: Attachment) => {
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_EDIT_TASK_ATTACHMENT,
        data: {
          title: "Edit attachment",
          investigationIdentifier: investigationGuid,
          taskIdentifier: task?.taskIdentifier,
          existingAttachments: attachments,
          attachment,
        },
        hideCallback,
      }),
    );
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
      />
      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Task details</h2>
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center my-2">
            <h4>Attachments</h4>
            {attachments.length > 0 && (
              <Button
                id="add-task-attachment"
                title="Add attachment"
                variant="primary"
                size="sm"
                onClick={handleAddAttachment}
                className="mb-3"
              >
                <i className="bi bi-upload"></i>
                <span>Add attachment</span>
              </Button>
            )}
          </div>

          {attachments.length === 0 ? (
            <div>
              <Button
                id="add-task-attachment"
                title="Add attachment"
                variant="primary"
                size="sm"
                onClick={handleAddAttachment}
              >
                <i className="bi bi-upload"></i>
                <span>Add attachment</span>
              </Button>
            </div>
          ) : (
            <div className="comp-data-container">
              <TaskAttachmentList
                attachments={attachments}
                isLoading={isLoading}
                onEdit={handleEditAttachment}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TaskDetail;
