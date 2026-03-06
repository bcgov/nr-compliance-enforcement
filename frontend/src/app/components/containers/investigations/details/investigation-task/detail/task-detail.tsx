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

  const { investigationGuid = "", taskId = "" } = useParams<{
    investigationGuid: string;
    taskId: string;
  }>();

  const { data, isLoading } = useGraphQLQuery<{ task: Task }>(GET_TASK, {
    queryKey: ["getTask", taskId],
    variables: { taskId },
    enabled: !!taskId,
  });

  const task = data?.task;

  const toggleAddAttachment = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: ADD_EDIT_TASK_ATTACHMENT,
        data: {
          title: "Upload attachment",
          investigationIdentifier: investigationGuid,
          taskIdentifier: task?.taskIdentifier,
        },
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
          <h4>Attachments</h4>
          <Button
            id="add-task-attachment"
            title="Add attachment"
            variant="primary"
            size="sm"
            onClick={toggleAddAttachment}
          >
            <i className="bi bi-upload"></i>
            <span>Add attachment</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TaskDetail;
