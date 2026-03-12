import { FC, useState } from "react";
import { gql } from "graphql-request";
import { Button, Table } from "react-bootstrap";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { DiaryDate, Investigation } from "@/generated/graphql";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { DiaryDateRow } from "./diary-date-row";
import { DeleteConfirmModal } from "@/app/components/modal/instances/delete-confirm-modal";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_EDIT_DIARY_DATE } from "@/app/types/modal/modal-types";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";

export const GET_DIARY_DATES = gql`
  query GetDiaryDates($investigationGuid: String!) {
    diaryDates(investigationGuid: $investigationGuid) {
      diaryDateGuid
      investigationGuid
      dueDate
      description
      addedTimestamp
      addedUserGuid
      updatedTimestamp
      updatedUserGuid
      taskGuid
    }
  }
`;

export const GET_DIARY_DATES_BY_TASK = gql`
  query GetDiaryDatesByTask($taskGuid: String!) {
    diaryDatesByTask(taskGuid: $taskGuid) {
      diaryDateGuid
      investigationGuid
      dueDate
      description
      addedTimestamp
      addedUserGuid
      updatedTimestamp
      updatedUserGuid
      taskGuid
    }
  }
`;

export const SAVE_DIARY_DATE = gql`
  mutation SaveDiaryDate($input: DiaryDateInput!) {
    saveDiaryDate(input: $input) {
      diaryDateGuid
      investigationGuid
      dueDate
      description
      addedTimestamp
      addedUserGuid
      updatedTimestamp
      updatedUserGuid
      taskGuid
    }
  }
`;

export const DELETE_DIARY_DATE = gql`
  mutation DeleteDiaryDate($diaryDateGuid: String!) {
    deleteDiaryDate(diaryDateGuid: $diaryDateGuid)
  }
`;

export const DELETE_DIARY_DATES_BY_TASK = gql`
  mutation DeleteDiaryDatesByTask($taskGuid: String!) {
    deleteDiaryDatesByTask(taskGuid: $taskGuid)
  }
`;

interface DiaryDatesProps {
  investigationGuid: string;
  investigationData?: Investigation;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  // When set, only diary dates for this task are shown
  taskGuid?: string;
}

export const DiaryDates: FC<DiaryDatesProps> = ({ investigationGuid, investigationData, onDirtyChange, taskGuid }) => {
  const dispatch = useAppDispatch();
  const tasks = investigationData?.tasks || [];
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning(onDirtyChange);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDiaryDateGuid, setDeletingDiaryDateGuid] = useState<string | null>(null);

  const { data, refetch } = useGraphQLQuery<{ diaryDates: DiaryDate[] }>(GET_DIARY_DATES, {
    queryKey: ["diaryDates", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
  });

  const deleteMutation = useGraphQLMutation(DELETE_DIARY_DATE, {
    onSuccess: () => {
      ToggleSuccess("Diary date deleted successfully");
      setShowDeleteModal(false);
      setDeletingDiaryDateGuid(null);
      refetch();
    },
    onError: () => {
      ToggleError("Failed to delete diary date");
    },
  });

  const allDiaryDates = data?.diaryDates ?? [];
  const diaryDates = taskGuid ? allDiaryDates.filter((dd) => dd.taskGuid === taskGuid) : allDiaryDates;
  const hasDiaryDates = diaryDates.length > 0;

  const handleAddClick = () => {
    dispatch(
      openModal({
        modalType: ADD_EDIT_DIARY_DATE,
        data: {
          investigationGuid,
          diaryDate: null,
          taskGuid,
          onDirtyChange: handleChildDirtyChange,
        },
        callback: refetch,
        hideCallback,
      }),
    );
  };

  const handleEditClick = (diaryDate: DiaryDate) => {
    dispatch(
      openModal({
        modalType: ADD_EDIT_DIARY_DATE,
        data: {
          investigationGuid,
          diaryDate,
          taskGuid,
          onDirtyChange: handleChildDirtyChange,
        },
        callback: refetch,
        hideCallback,
      }),
    );
  };

  const handleDeleteClick = (diaryDateGuid: string) => {
    setDeletingDiaryDateGuid(diaryDateGuid);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingDiaryDateGuid) {
      deleteMutation.mutate({ diaryDateGuid: deletingDiaryDateGuid });
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingDiaryDateGuid(null);
  };

  return (
    <div className="comp-details-section mt-4 mb-3">
      <div className="d-flex align-items-center justify-content-between gap-4 mb-0">
        <h3 className="mb-0">Diary dates</h3>
        {hasDiaryDates && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddClick}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add diary date</span>
          </Button>
        )}
      </div>

      {!hasDiaryDates ? (
        <div className="mt-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddClick}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add diary date</span>
          </Button>
        </div>
      ) : (
        <div className="border rounded p-3 pt-0 pb-0 mt-3">
          <Table className="mb-0 table-borderless diary-dates-table">
            <tbody>
              {diaryDates.map((diaryDate) => {
                const taskNumber = tasks
                  ? tasks.find((task) => task?.taskIdentifier === diaryDate.taskGuid)?.taskNumber
                  : null;
                return (
                  <DiaryDateRow
                    key={diaryDate.diaryDateGuid}
                    diaryDate={diaryDate}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    taskNumber={taskNumber ?? null}
                    showTaskBadge={!taskGuid}
                  />
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <DeleteConfirmModal
        show={showDeleteModal}
        title="Delete diary date"
        content="Are you sure you want to delete this diary date? This action cannot be undone."
        onDelete={handleConfirmDelete}
        onHide={handleCloseDeleteModal}
        confirmText="Yes, delete"
      />
    </div>
  );
};

export default DiaryDates;
