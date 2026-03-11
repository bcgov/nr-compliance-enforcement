import { FC } from "react";
import { DiaryDate } from "@/generated/graphql";
import { formatDate, formatDateTime } from "@common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";
import { useNavigate, useParams } from "react-router-dom";
import { InvestigationParams } from "@/app/components/containers/investigations/details/investigation-details";

interface DiaryDateRowProps {
  diaryDate: DiaryDate;
  onEdit: (diaryDate: DiaryDate) => void;
  onDelete: (diaryDateGuid: string) => void;
  taskNumber: number | null;
  showTaskBadge?: boolean;
}

export const DiaryDateRow: FC<DiaryDateRowProps> = ({
  diaryDate,
  onEdit,
  onDelete,
  taskNumber,
  showTaskBadge = true,
}) => {
  const navigate = useNavigate();
  const { investigationGuid } = useParams<InvestigationParams>();

  const addedByUser = useAppSelector(selectOfficerByAppUserGuid(diaryDate.addedUserGuid));
  const addedByName = addedByUser
    ? `${addedByUser.last_name}, ${addedByUser.first_name} (${addedByUser.agency_code?.shortDescription ?? addedByUser.agency_code_ref})`
    : "Unknown";
  const addedTimestamp = diaryDate.addedTimestamp
    ? formatDateTime(new Date(diaryDate.addedTimestamp).toISOString())
    : "";
  const handleEditClick = () => {
    onEdit(diaryDate);
  };

  const handleDeleteClick = () => {
    if (diaryDate.diaryDateGuid) {
      onDelete(diaryDate.diaryDateGuid);
    }
  };

  return (
    <tr>
      <td>
        <div className="d-flex gap-4 ">
          <span className="d-flex text-nowrap">
            <i className="bi bi-calendar me-2"></i>
            <strong>{diaryDate.dueDate ? formatDate(diaryDate.dueDate) : "N/A"}</strong>
          </span>
          <span>{diaryDate.description}</span>
          {showTaskBadge && taskNumber && (
            <button
              className="badge comp-status-badge-conflict-history"
              style={{ maxHeight: "20px", border: "none" }}
              onClick={() => {
                navigate(`/investigation/${investigationGuid}/tasks?section=task-item-${taskNumber}`);
              }}
            >
              Task {taskNumber}
            </button>
          )}
        </div>
        <div className="text-muted small mt-2 mb-0">
          Added on {addedTimestamp} by {addedByName}
        </div>
      </td>
      <td className="align-top text-end">
        <div className="d-flex gap-1 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-primary rounded p-2"
            onClick={handleEditClick}
            title="Edit diary date"
            aria-label="Edit diary date"
          >
            <i className="bi bi-pencil ms-1 me-1" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DiaryDateRow;
