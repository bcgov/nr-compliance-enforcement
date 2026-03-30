import { CompTableRowProps } from "@/app/types/app/comp-tables";

export const CompTableRow = <T,>({
  row,
  columns,
  rowKey,
  isExpanded,
  onToggleExpand,
  renderExpandedContent,
}: CompTableRowProps<T>) => {
  const isExpandable = !!renderExpandedContent;
  const expandedClass = isExpanded ? "comp-cell-parent-expanded align-middle" : "align-middle";

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;
    onToggleExpand(rowKey);
  };

  return (
    <>
      <tr
        className={expandedClass}
        onClick={isExpandable ? handleRowClick : undefined}
      >
        {/* Chevron toggle cell - only rendered when table is expandable */}
        {isExpandable && (
          <td className={`comp-cell-width-30 comp-cell-min-width-30 text-center ${expandedClass}`}>
            <button
              onClick={() => onToggleExpand(rowKey)}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} row details`}
              className="btn p-0 border-0 text-muted"
            >
              <i className={`m-0 ps-1 bi bi-chevron-${isExpanded ? "down" : "right"}`} />
            </button>
          </td>
        )}

        {/* Data cells */}
        {columns.map((col) => (
          <td
            key={col.label}
            className={`${col.cellClassName ?? ""} ${expandedClass}`}
          >
            {col.renderCell(row)}
          </td>
        ))}
      </tr>

      {/* Expanded content row - only rendered when row is expanded */}
      {isExpandable && isExpanded && renderExpandedContent && (
        <tr onClick={handleRowClick}>
          {/* Spacer cell for chevron column */}
          <td className="comp-cell-width-30 comp-cell-child-expanded" />
          {/* Spacer cell for identifier column */}
          <td className="comp-cell-child-expanded" />
          {/* Expanded content spanning remaining columns */}
          <td
            colSpan={columns.length}
            className="comp-cell-child-expanded"
          >
            {renderExpandedContent(row)}
          </td>
        </tr>
      )}
    </>
  );
};
