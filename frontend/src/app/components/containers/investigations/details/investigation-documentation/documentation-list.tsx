import { FC, useCallback } from "react";
import { Table } from "react-bootstrap";
import Paginator from "@components/common/paginator";
import { SortableHeader } from "@components/common/sortable-header";
import { SORT_TYPES } from "@constants/sort-direction";
import { DocumentationListItem } from "./documentation-list-item";
import { useDocumentationSearch } from "./hooks/use-documentation-search";
import { Attachment } from "./hooks/use-investigation-attachments";
import { Task } from "@/generated/graphql";

type Props = {
  attachments: Attachment[];
  tasks: Task[];
  totalItems: number;
  isLoading: boolean;
  error: Error | null;
  investigationGuid: string;
};

export const DocumentationList: FC<Props> = ({
  attachments,
  tasks,
  totalItems,
  isLoading,
  error,
  investigationGuid,
}) => {
  const { searchValues, setValues, setSort } = useDocumentationSearch();

  const handleSort = useCallback(
    (sortKey: string) => {
      const currentSortBy = searchValues.sortBy;
      const currentSortOrder = searchValues.sortOrder;
      const newDirection =
        currentSortBy === sortKey && currentSortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;

      setSort(sortKey, newDirection);
    },
    [searchValues.sortBy, searchValues.sortOrder, setSort],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setValues({ page: newPage });
    },
    [setValues],
  );

  const renderSortableHeader = (title: string, sortKey: string, className?: string) => (
    <SortableHeader
      title={title}
      sortFnc={handleSort}
      sortKey={sortKey}
      currentSort={searchValues.sortBy}
      sortDirection={searchValues.sortOrder}
      className={className}
    />
  );

  const renderTableHeader = (): JSX.Element => (
    <thead className="sticky-table-header">
      <tr>
        {renderSortableHeader("File type", "fileType", "comp-cell-min-width-150")}
        {renderSortableHeader("ID", "sequenceNumber", "comp-cell-min-width-150")}
        {renderSortableHeader("Description", "description", "comp-cell-width-150 comp-cell-min-width-150")}
        {renderSortableHeader("Title", "title", "comp-cell-width-150 comp-cell-min-width-150")}
        {renderSortableHeader("Date", "date", "comp-cell-width-150 comp-cell-min-width-150")}
        {renderSortableHeader("Taken by", "takenBy", "comp-cell-width-150 comp-cell-min-width-150")}
        {renderSortableHeader("Location", "location", "comp-cell-width-150 comp-cell-min-width-150")}
        {renderSortableHeader("Task", "taskNumber", "comp-cell-width-150 comp-cell-min-width-150")}
        {renderSortableHeader("File name", "name", "comp-cell-width-150 comp-cell-min-width-150")}
      </tr>
    </thead>
  );

  const renderLoadingSpinner = () => (
    <tr>
      <td
        colSpan={3}
        className="text-center p-4"
      >
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-border spinner-border-sm me-2">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Loading documents...</span>
        </div>
      </td>
    </tr>
  );

  const renderMessage = (icon: string, message: string, variant?: string) => (
    <tr>
      <td
        colSpan={9}
        className="text-center p-4"
      >
        <div className={`d-flex align-items-center justify-content-center ${variant || ""}`}>
          <i className={`bi bi-${icon} me-2`}></i>
          <span>{message}</span>
        </div>
      </td>
    </tr>
  );

  const renderErrorMessage = () =>
    renderMessage(
      "exclamation-triangle-fill",
      `Error loading documents: ${error?.message || "An unexpected error occurred"}`,
      "text-danger",
    );

  const renderEmptyMessage = () => {
    if (searchValues.search || searchValues.taskFilter) {
      return renderMessage("info-circle-fill", "No documents match your search criteria.");
    }
    return renderMessage("info-circle-fill", "No documents have been uploaded for this investigation.");
  };

  const renderListItems = () => {
    if (isLoading) return renderLoadingSpinner();
    if (error) return renderErrorMessage();
    if (attachments.length === 0) return renderEmptyMessage();

    return attachments.map((attachment) => (
      <DocumentationListItem
        key={attachment.id}
        attachment={attachment}
        investigationGuid={investigationGuid}
        task={attachment.taskId ? tasks.find((t) => t.taskIdentifier === attachment.taskId) : undefined}
      />
    ));
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table"
          id="documentation-list"
        >
          {renderTableHeader()}
          <tbody>{renderListItems()}</tbody>
        </Table>
      </div>

      {totalItems > 0 && (
        <Paginator
          currentPage={searchValues.page}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          resultsPerPage={searchValues.pageSize}
        />
      )}
    </div>
  );
};
