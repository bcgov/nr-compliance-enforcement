import { Button } from "react-bootstrap";
import { CompColumn } from "@/app/types/app/comp-tables";

// Shared sticky right-hand Edit column so edit buttons align and behave the same across tables
export const editColumn = <T,>({
  title,
  getAriaLabel,
  onEdit,
  isReadOnly,
}: {
  title: string;
  getAriaLabel: (row: T) => string;
  onEdit: (row: T) => void;
  isReadOnly?: boolean;
}): CompColumn<T> => ({
  label: "",
  headerClassName: "comp-cell-width-30 comp-cell-min-width-30 sticky-col sticky-col--right actions-col",
  cellClassName: "comp-cell-width-30 comp-cell-min-width-30 text-end sticky-col sticky-col--right actions-col",
  isSortable: false,
  renderCell: (row) => (
    <Button
      type="button"
      variant="outline-primary"
      size="sm"
      onClick={() => onEdit(row)}
      title={title}
      aria-label={getAriaLabel(row)}
      disabled={isReadOnly}
    >
      <i className="bi bi-pencil ms-1 me-1" />
    </Button>
  ),
});
