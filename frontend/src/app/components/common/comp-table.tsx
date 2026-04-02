import { useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import Paginator from "@components/common/paginator";
import { SortableHeader } from "@components/common/sortable-header";
import { SORT_TYPES } from "@constants/sort-direction";
import { CompTableRow } from "./comp-table-row";
import { CompTableProps } from "@/app/types/app/comp-tables";

const DEFAULT_PAGE_SIZE = 25;

export const CompTable = <T,>({
  data,
  tableIdentifier,
  isFixedHeight,
  columns,
  getRowKey,
  renderExpandedContent,
  isLoading = false,
  error = null,
  pageSize = DEFAULT_PAGE_SIZE,
  defaultSort,
  defaultSortDirection = SORT_TYPES.ASC,
  onSort,
  onPageChange,
  totalItems,
  currentPage: externalCurrentPage,
  emptyMessage,
}: CompTableProps<T>) => {
  const [sortBy, setSortBy] = useState<string>(defaultSort);
  const [sortOrder, setSortOrder] = useState<string>(defaultSortDirection);
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Infer whether sorting and pagination are server-side
  const isServerSort = !!onSort && !!onPageChange;
  const isServerPagination = !!onPageChange;

  // Determine height of table
  const isPartial = data.length < pageSize;

  const currentPage = isServerPagination ? (externalCurrentPage ?? 1) : internalCurrentPage;

  const isExpandable = !!renderExpandedContent;

  const handleSort = useCallback(
    (sortInput: string) => {
      const newDirection = sortBy === sortInput && sortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;
      setSortBy(sortInput);
      setSortOrder(newDirection);
      // Notify parent of sort change regardless of server/client mode
      onSort?.(sortInput, newDirection);
    },
    [sortBy, sortOrder, onSort],
  );

  const handleToggleExpand = useCallback((rowKey: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }
      return next;
    });
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (isServerPagination) {
        onPageChange(newPage);
      } else {
        setInternalCurrentPage(newPage);
      }
    },
    [isServerPagination, onPageChange],
  );

  const sortedData = useMemo(() => {
    if (isServerSort) return data;
    const activeColumn = columns.find((col) => (col.sortKey ?? col.label) === sortBy);
    if (!activeColumn?.getValue) return [...data];

    return [...data].sort((a, b) => {
      const aVal = activeColumn.getValue!(a);
      const bVal = activeColumn.getValue!(b);
      if (aVal < bVal) return sortOrder === SORT_TYPES.ASC ? -1 : 1;
      if (aVal > bVal) return sortOrder === SORT_TYPES.ASC ? 1 : -1;
      return 0;
    });
  }, [data, columns, sortBy, sortOrder, isServerSort]);

  const paginatedData = useMemo(() => {
    if (isServerPagination) return data;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, isServerPagination, data]);

  const totalCount = isServerPagination ? (totalItems ?? 0) : sortedData.length;

  const renderHeader = () => (
    <thead className="sticky-table-header">
      <tr>
        {/* Chevron column header - only rendered when table is expandable */}
        {isExpandable && <th className="comp-cell-width-30 comp-cell-min-width-30" />}
        {columns
          .filter((col) => !col.isHidden)
          .map((col) =>
            col.isSortable ? (
              <SortableHeader
                key={col.label}
                title={col.label}
                sortFnc={handleSort}
                sortKey={col.sortKey ?? col.label}
                currentSort={sortBy}
                sortDirection={sortOrder}
                className={col.headerClassName}
              />
            ) : (
              <th
                key={col.label}
                className={col.headerClassName}
              >
                {col.label}
              </th>
            ),
          )}
      </tr>
    </thead>
  );

  const renderBody = () => {
    const visibleColumnCount = columns.filter((col) => !col.isHidden).length;

    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={visibleColumnCount + (isExpandable ? 1 : 0)}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border spinner-border-sm me-2">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td
            colSpan={visibleColumnCount + (isExpandable ? 1 : 0)}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              <span>{`Error loading data: ${error.message || "An unexpected error occurred"}`}</span>
            </div>
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={visibleColumnCount + (isExpandable ? 1 : 0)}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <i className="bi bi-info-circle-fill me-2" />
              <span>{emptyMessage ?? "No records found."}</span>
            </div>
          </td>
        </tr>
      );
    }

    return paginatedData.map((row) => {
      const rowKey = getRowKey(row);
      return (
        <CompTableRow
          key={rowKey}
          row={row}
          rowKey={rowKey}
          columns={columns}
          isExpanded={expandedRows.has(rowKey)}
          onToggleExpand={handleToggleExpand}
          renderExpandedContent={renderExpandedContent}
        />
      );
    });
  };

  return (
    <div className="comp-table-container">
      <div className={`comp-table-scroll-container ${isFixedHeight ? "comp-table-scroll-container--fixed" : ""}`}>
        <Table
          id={tableIdentifier}
          className={`comp-table mb-0 border-0 ${isPartial ? "comp-table--partial" : ""}`}
        >
          {renderHeader()}
          <tbody>{renderBody()}</tbody>
        </Table>
      </div>

      {totalCount > 0 && (
        <Paginator
          currentPage={currentPage}
          totalItems={totalCount}
          onPageChange={handlePageChange}
          resultsPerPage={pageSize}
        />
      )}
    </div>
  );
};
