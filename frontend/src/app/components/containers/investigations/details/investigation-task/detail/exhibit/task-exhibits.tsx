import { useAppDispatch } from "@/app/hooks/hooks";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { openModal } from "@/app/store/reducers/app";
import { ADD_EDIT_TASK_EXHIBIT } from "@/app/types/modal/modal-types";
import { Exhibit, Task } from "@/generated/graphql";
import { FC, useMemo } from "react";
import { Button } from "react-bootstrap";
import { TaskExhibitList } from "./exhibit-list";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@/app/graphql/hooks";

interface TaskExhibitsProps {
  investigationGuid: string;
  task: Task | undefined;
}

export const GET_EXHIBITS_BY_TASK = gql`
  query GetExhibitsByTask($taskId: String!) {
    getExhibitsByTask(taskId: $taskId) {
      exhibitGuid
      taskGuid
      investigationGuid
      exhibitNumber
      description
      dateCollected
      collectedAppUserGuidRef
    }
  }
`;

export const GET_EXHIBIT = gql`
  query GetExhibit($exhibitGuid: String!) {
    getExhibit(exhibitGuid: $exhibitGuid) {
      exhibitGuid
      taskGuid
      investigationGuid
      exhibitNumber
      description
      dateCollected
      collectedAppUserGuidRef
    }
  }
`;

export const CREATE_EXHIBIT = gql`
  mutation CreateExhibit($input: CreateUpdateExhibitInput!) {
    createExhibit(input: $input) {
      exhibitGuid
      taskGuid
      investigationGuid
      exhibitNumber
      description
      dateCollected
      collectedAppUserGuidRef
    }
  }
`;

export const DELETE_EXHIBIT = gql`
  mutation DeleteExhibit($exhibitGuid: String!) {
    removeExhibit(exhibitGuid: $exhibitGuid) {
      exhibitGuid
    }
  }
`;

export const UPDATE_EXHIBIT = gql`
  mutation UpdateExhibit($input: CreateUpdateExhibitInput!) {
    updateExhibit(input: $input) {
      exhibitGuid
      taskGuid
      investigationGuid
      exhibitNumber
      description
      dateCollected
      collectedAppUserGuidRef
    }
  }
`;

export const TaskExhibits: FC<TaskExhibitsProps> = ({ investigationGuid, task }) => {
  const dispatch = useAppDispatch();
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

  const taskGuid = task?.taskIdentifier ?? "";
  const queryVariables = useMemo(() => ({ taskId: taskGuid }), [taskGuid]);

  const { data, isLoading } = useGraphQLQuery<{ getExhibitsByTask: Exhibit[] }>(GET_EXHIBITS_BY_TASK, {
    queryKey: ["exhibits", task?.taskIdentifier],
    variables: queryVariables,
    enabled: !!task?.taskIdentifier,
  });

  const exhibits = useMemo(() => data?.getExhibitsByTask ?? [], [data]);

  const handleAddExhibit = () => {
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_EDIT_TASK_EXHIBIT,
        data: {
          title: "Add exhibit",
          investigationIdentifier: investigationGuid,
          taskIdentifier: task?.taskIdentifier,
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const handleEditExhibit = (exhibit: Exhibit) => {
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_EDIT_TASK_EXHIBIT,
        data: {
          title: "Edit exhibit",
          investigationIdentifier: investigationGuid,
          taskIdentifier: task?.taskIdentifier,
          exhibit,
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  return (
    <div className="mt-3">
      <div className="d-flex align-items-center my-3">
        <h3 className="me-3 mb-0">Exhibits</h3>
        <div className="d-flex align-items-center gap-3 ms-auto">
          {exhibits.length > 0 && (
            <Button
              id="add-task-exhibit"
              title="Add exhibit"
              variant="primary"
              size="sm"
              onClick={handleAddExhibit}
            >
              <i className="bi bi-plus-circle"></i>
              <span>Add exhibit</span>
            </Button>
          )}
        </div>
      </div>

      {exhibits.length === 0 ? (
        <div>
          <Button
            id="add-task-exhibit"
            title="Add exhibit"
            variant="primary"
            size="sm"
            onClick={handleAddExhibit}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add exhibit</span>
          </Button>
        </div>
      ) : (
        <div className="comp-data-container">
          <TaskExhibitList
            exhibits={exhibits}
            isLoading={isLoading}
            onEdit={handleEditExhibit}
          />
        </div>
      )}
    </div>
  );
};
