import { FC } from "react";
import { DiaryDate } from "@/generated/graphql";
import { formatDate, formatDateTime } from "@common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";
import { useNavigate, useParams } from "react-router-dom";
import { InvestigationParams } from "@/app/components/containers/investigations/details/investigation-details";
import { EditButton } from "@components/common/comp-table-edit-column";
import { useInvestigationReadOnly } from "../../hooks/use-investigation-read-only";

interface DiaryDateRowProps {
  diaryDate: DiaryDate;
  onEdit: (diaryDate: DiaryDate) => void;
  onDelete: (diaryDateGuid: string) => void;
  taskNumber: number | null;
  showTaskBadge?: boolean;
  isReadOnly?: boolean;
}

export const DiaryDateRow: FC<DiaryDateRowProps> = ({
  diaryDate,
  onEdit,
  onDelete,
  taskNumber,
  showTaskBadge = true,
  isReadOnly: isReadOnlyProp,
}) => {
  const navigate = useNavigate();
  const { investigationGuid } = useParams<InvestigationParams>();
  const investigationReadOnly = useInvestigationReadOnly(investigationGuid ?? "");
  const isReadOnly = isReadOnlyProp ?? investigationReadOnly;

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

  return (
    <tr>
      <td>
        <div className="d-flex gap-4 ">
          <span className="d-flex text-nowrap">
            <i className="bi bi-calendar me-2"></i>
            <strong>{diaryDate.dueDate ? formatDate(diaryDate.dueDate) : "N/A"}</strong>
          </span>
          <span>{diaryDate.description}</span>
          {showTaskBadge && taskNumber && diaryDate.taskGuid && (
            <button
              className="badge comp-status-badge-conflict-history"
              style={{ maxHeight: "20px", border: "none" }}
              onClick={() => {
                navigate(`/investigation/${investigationGuid}/task/${diaryDate.taskGuid}`);
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
        <EditButton
          title="Edit diary date"
          ariaLabel="edit-diary-date"
          onClick={handleEditClick}
          disabled={isReadOnly}
        />
      </td>
    </tr>
  );
};

export default DiaryDateRow;
