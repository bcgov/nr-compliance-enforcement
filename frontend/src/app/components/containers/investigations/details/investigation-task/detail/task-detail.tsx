import { FC } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { Task } from "@/generated/graphql";
import { TaskDetailHeader } from "./task-detail-header";
import { TaskAttachments } from "@/app/components/containers/investigations/details/investigation-task/detail/attachments/task-attachments";

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

        <TaskAttachments
          investigationGuid={investigationGuid}
          task={task}
        />
      </section>
    </div>
  );
};

export default TaskDetail;
