import { FC, useState } from "react";
import { gql } from "graphql-request";
import { Button, Table } from "react-bootstrap";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { DiaryDate, DiaryDateInput } from "@/generated/graphql";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { DiaryDateRow } from "./diary-date-row";
import { DiaryDateModal } from "./diary-date-modal";
import { DeleteConfirmModal } from "@/app/components/modal/instances/delete-confirm-modal";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid } from "@/app/store/reducers/app";

const GET_DIARY_DATES = gql`
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
    }
  }
`;

const SAVE_DIARY_DATE = gql`
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
    }
  }
`;

const DELETE_DIARY_DATE = gql`
  mutation DeleteDiaryDate($diaryDateGuid: String!) {
    deleteDiaryDate(diaryDateGuid: $diaryDateGuid)
  }
`;

interface DiaryDatesProps {
  investigationGuid: string;
}

export const DiaryDates: FC<DiaryDatesProps> = ({ investigationGuid }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDiaryDate, setEditingDiaryDate] = useState<DiaryDate | null>(null);
  const [deletingDiaryDateGuid, setDeletingDiaryDateGuid] = useState<string | null>(null);
  const currentUserGuid = useAppSelector(selectAppUserGuid);

  const { data, refetch } = useGraphQLQuery<{ getDiaryDates: DiaryDate[] }>(GET_DIARY_DATES, {
    queryKey: ["diaryDates", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
  });

  const saveMutation = useGraphQLMutation(SAVE_DIARY_DATE, {
    onSuccess: () => {
      ToggleSuccess("Diary date saved successfully");
      setShowModal(false);
      setEditingDiaryDate(null);
      refetch();
    },
    onError: () => {
      ToggleError("Failed to save diary date");
    },
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

  const diaryDates = data?.diaryDates ?? [];

  const handleAddClick = () => {
    setEditingDiaryDate(null);
    setShowModal(true);
  };

  const handleEditClick = (diaryDate: DiaryDate) => {
    setEditingDiaryDate(diaryDate);
    setShowModal(true);
  };

  const handleDeleteClick = (diaryDateGuid: string) => {
    setDeletingDiaryDateGuid(diaryDateGuid);
    setShowDeleteModal(true);
  };

  const handleSave = async (input: DiaryDateInput) => {
    const inputWithUser = {
      ...input,
      userGuid: currentUserGuid,
    };
    await saveMutation.mutateAsync({ input: inputWithUser });
  };

  const handleConfirmDelete = () => {
    if (deletingDiaryDateGuid) {
      deleteMutation.mutate({ diaryDateGuid: deletingDiaryDateGuid });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDiaryDate(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingDiaryDateGuid(null);
  };

  return (
    <div className="comp-details-section mt-4">
      <div className="d-flex align-items-center gap-4 mb-3">
        <h3 className="mb-0">Diary dates</h3>
      </div>

      {diaryDates.length === 0 ? (
        <></>
      ) : (
        <div className="border rounded p-3">
          <Table className="mb-0 table-borderless diary-dates-table">
            <tbody>
              {diaryDates.map((diaryDate) => (
                <DiaryDateRow
                  key={diaryDate.diaryDateGuid}
                  diaryDate={diaryDate}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Button
        variant="primary"
        size="sm"
        onClick={handleAddClick}
        className="mt-3"
      >
        <i className="bi bi-plus-circle"></i>
        <span>Add diary date</span>
      </Button>

      <DiaryDateModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave}
        investigationGuid={investigationGuid}
        diaryDate={editingDiaryDate}
        isSaving={saveMutation.isPending}
      />

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
