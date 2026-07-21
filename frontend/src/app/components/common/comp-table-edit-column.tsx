import { FC } from "react";
import { Button } from "react-bootstrap";
import { CompColumn } from "@/app/types/app/comp-tables";

// Shared edit button so edit buttons align and behave consistantly
export const EditButton: FC<{
  title: string;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ title, ariaLabel, onClick, disabled }) => (
  <Button
    className="comp-cell-width-30 comp-cell-height-30 d-inline-flex align-items-center justify-content-center"
    type="button"
    variant="outline-primary"
    size="sm"
    onClick={onClick}
    title={title}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {/* ms-1/me-1 keep the icon margins symmetric; a global .btn rule otherwise adds margin-right only */}
    <i className="bi bi-pencil ms-1 me-1" />
  </Button>
);

// Shared sticky Edit button column for tables
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
  // pe-3 lines the button up with the card sections' edit buttons (cards inset their content by p-3)
  headerClassName: "comp-cell-width-30 comp-cell-min-width-30 pe-3 sticky-col sticky-col--right actions-col",
  cellClassName: "comp-cell-width-30 comp-cell-min-width-30 pe-3 text-end sticky-col sticky-col--right actions-col",
  isSortable: false,
  renderCell: (row) => (
    <EditButton
      title={title}
      ariaLabel={getAriaLabel(row)}
      onClick={() => onEdit(row)}
      disabled={isReadOnly}
    />
  ),
});
