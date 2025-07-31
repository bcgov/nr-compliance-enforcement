import { FC, useCallback } from "react";
import { Table } from "react-bootstrap";
import { useCaseSearchForm } from "./hooks/use-case-search-form";
import { SortableHeader } from "@components/common/sortable-header";
import Paginator from "@/app/components/common/paginator";
import { SORT_TYPES } from "@constants/sort-direction";
import { CaseListItem } from "./case-list-item";

type Props = {
  cases: any[];
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const CaseList: FC<Props> = ({ cases, totalItems = 0, isLoading = false, error = null }) => {
  const { formValues, setFieldValue, setMultipleFieldValues } = useCaseSearchForm();

  const handleSort = (sortInput: string) => {
    const currentSortBy = formValues.sortBy;
    const currentSortOrder = formValues.sortOrder;
    const newDirection =
      currentSortBy === sortInput && currentSortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;

    // Update both sortBy and sortOrder atomically to avoid timing issues
    setMultipleFieldValues({
      sortBy: sortInput,
      sortOrder: newDirection,
    });
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFieldValue("page", newPage);
    },
    [setFieldValue],
  );

  const renderSortableHeader = (title: string, sortKey: string, className?: string) => (
    <SortableHeader
      title={title}
      sortFnc={handleSort}
      sortKey={sortKey}
      currentSort={formValues.sortBy}
      sortDirection={formValues.sortOrder}
      className={className}
    />
  );

  const renderCaseListHeader = (): JSX.Element => (
    <thead className="sticky-table-header">
      <tr>
        {renderSortableHeader(
          "Case #",
          "caseIdentifier",
          "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
        )}
        {renderSortableHeader("Date Opened", "caseOpenedTimestamp", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Status", "caseStatus", "comp-cell-width-110")}
        {renderSortableHeader("Agency", "leadAgency")}
        <th className="unsortable sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col case-table-actions-cell">
          <div className="header-label">Actions</div>
        </th>
      </tr>
    </thead>
  );

  const renderLoadingSpinner = () => (
    <tr>
      <td
        colSpan={5}
        className="text-center p-4"
      >
        <div className="d-flex align-items-center justify-content-center">
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Loading cases...</span>
        </div>
      </td>
    </tr>
  );

  const renderMessage = (icon: string, message: string, variant?: string) => (
    <tr>
      <td
        colSpan={5}
        className="text-center p-4"
      >
        <div className={`d-flex align-items-center justify-content-center${variant ? ` ${variant}` : ""}`}>
          <i className={`bi bi-${icon} me-2`}></i>
          <span>{message}</span>
        </div>
      </td>
    </tr>
  );

  const renderErrorMessage = () =>
    renderMessage(
      "exclamation-triangle-fill",
      `Error loading cases: ${error?.message || "An unexpected error occurred"}`,
      "text-danger",
    );

  const renderNoCasesFoundMessage = () => {
    const hasActiveFilters =
      formValues.searchQuery ||
      formValues.status ||
      formValues.leadAgency ||
      formValues.startDate ||
      formValues.endDate;

    const message = hasActiveFilters
      ? "No cases found using your current filters. Remove or change your filters to see cases."
      : "No cases found.";

    return renderMessage("info-circle-fill", message);
  };

  const renderCaseListItems = () => {
    if (isLoading) return renderLoadingSpinner();
    if (!isLoading && error) return renderErrorMessage();
    if (!isLoading && !error && cases.length === 0) return renderNoCasesFoundMessage();
    return cases.map((caseFile) => (
      <CaseListItem
        key={caseFile.caseIdentifier}
        caseFile={caseFile}
      />
    ));
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table"
          id="case-list"
        >
          {renderCaseListHeader()}
          <tbody>{renderCaseListItems()}</tbody>
        </Table>
      </div>

      {totalItems > 0 && (
        <Paginator
          currentPage={formValues.page}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          resultsPerPage={formValues.pageSize}
        />
      )}
    </div>
  );
};
