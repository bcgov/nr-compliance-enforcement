import { FC } from "react";
import { Button } from "react-bootstrap";
import { DiaryDate } from "@/generated/graphql";
import { formatDate, formatDateTime } from "@common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficerByAppUserGuid } from "@/app/store/reducers/officer";

interface DiaryDateRowProps {
  diaryDate: DiaryDate;
  onEdit: (diaryDate: DiaryDate) => void;
  onDelete: (diaryDateGuid: string) => void;
}

export const DiaryDateRow: FC<DiaryDateRowProps> = ({ diaryDate, onEdit, onDelete }) => {
  const addedByUser = useAppSelector(selectOfficerByAppUserGuid(diaryDate.addedUserGuid));
  const addedByName = addedByUser
    ? `${addedByUser.last_name}, ${addedByUser.first_name} (${addedByUser.agency_code_ref})`
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
        </div>
        <div className="text-muted small mt-2 mb-0">
          Added on {addedTimestamp} by {addedByName}
        </div>
      </td>
      <td>
        <div className="d-flex gap-2 justify-content-end text-nowrap">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleEditClick}
            title="Edit diary date"
          >
            <i className="bi bi-pencil" /> Edit
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleDeleteClick}
            title="Delete diary date"
          >
            <i className="bi bi-trash" /> Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default DiaryDateRow;
