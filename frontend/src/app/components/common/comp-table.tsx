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
  columns,
  getRowKey,
  renderExpandedContent,
  isLoading = false,
  pageSize = DEFAULT_PAGE_SIZE,
  defaultSortLabel,
  defaultSortDirection = SORT_TYPES.ASC,
}: CompTableProps<T>) => {
  const [sortBy, setSortBy] = useState<string>(defaultSortLabel);
  const [sortOrder, setSortOrder] = useState<string>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const isExpandable = !!renderExpandedContent;

  const handleSort = useCallback(
    (sortInput: string) => {
      const newDirection = sortBy === sortInput && sortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;
      setSortBy(sortInput);
      setSortOrder(newDirection);
    },
    [sortBy, sortOrder],
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

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const sortedData = useMemo(() => {
    const activeColumn = columns.find((col) => col.label === sortBy);
    if (!activeColumn?.getValue) return [...data];

    return [...data].sort((a, b) => {
      const aVal = activeColumn.getValue!(a);
      const bVal = activeColumn.getValue!(b);
      if (aVal < bVal) return sortOrder === SORT_TYPES.ASC ? -1 : 1;
      if (aVal > bVal) return sortOrder === SORT_TYPES.ASC ? 1 : -1;
      return 0;
    });
  }, [data, columns, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const renderHeader = () => (
    <thead className="sticky-table-header">
      <tr>
        {/* Chevron column header - only rendered when table is expandable */}
        {isExpandable && <th className="comp-cell-width-30 comp-cell-min-width-30" />}
        {columns.map((col) =>
          col.isSortable ? (
            <SortableHeader
              key={col.label}
              title={col.label}
              sortFnc={handleSort}
              sortKey={col.label}
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
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={columns.length + (isExpandable ? 1 : 0)}
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

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={columns.length + (isExpandable ? 1 : 0)}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <i className="bi bi-info-circle-fill me-2" />
              <span>No records found.</span>
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
      <div className="comp-table-scroll-container">
        <Table className="comp-table mb-0 border-0">
          {renderHeader()}
          <tbody>{renderBody()}</tbody>
        </Table>
      </div>

      {sortedData.length > 0 && (
        <Paginator
          currentPage={currentPage}
          totalItems={sortedData.length}
          onPageChange={handlePageChange}
          resultsPerPage={pageSize}
        />
      )}
    </div>
  );
};
