import { FC, useCallback } from "react";
import { Table } from "react-bootstrap";
import { SortableHeader } from "@components/common/sortable-header";
import Paginator from "@/app/components/common/paginator";
import { SORT_TYPES } from "@constants/sort-direction";
import { InvestigationListItem } from "./investigation-list-item";
import { useInvestigationSearch } from "../hooks/use-investigation-search";

type Props = {
  investigations: any[];
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const InvestigationList: FC<Props> = ({ investigations, totalItems = 0, isLoading = false, error = null }) => {
  const { searchValues, setValues, setSort } = useInvestigationSearch();

  const handleSort = (sortInput: string) => {
    const currentSortBy = searchValues.sortBy;
    const currentSortOrder = searchValues.sortOrder;
    const newDirection =
      currentSortBy === sortInput && currentSortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;

    // Update both sortBy and sortOrder atomically to avoid timing issues
    setSort(sortInput, newDirection);
  };

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

  const renderInvestigationListHeader = (): JSX.Element => (
    <thead className="sticky-table-header">
      <tr>
        {renderSortableHeader(
          "Investigation #",
          "investigationGuid",
          "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
        )}
        {renderSortableHeader("Case #", "caseIdentifier", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Date Opened", "openedTimestamp", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Status", "investigationStatus", "comp-cell-width-110")}
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
          <div className="spinner-border spinner-border-sm me-2">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Loading investigations...</span>
        </div>
      </td>
    </tr>
  );

  const renderMessage = (icon: string, message: string, variant?: string) => {
    return (
      <tr>
        <td
          colSpan={6}
          className="text-center p-4"
        >
          <div className={`d-flex align-items-center justify-content-center${variant || ""}`}>
            <i className={`bi bi-${icon} me-2`}></i>
            <span>{message}</span>
          </div>
        </td>
      </tr>
    );
  };

  const renderErrorMessage = () =>
    renderMessage(
      "exclamation-triangle-fill",
      `Error loading investigations: ${error?.message || "An unexpected error occurred"}`,
      "text-danger",
    );

  const renderInvestigationListItems = () => {
    if (isLoading) return renderLoadingSpinner();
    if (!isLoading && error) return renderErrorMessage();
    if (!isLoading && !error && investigations.length === 0)
      return renderMessage("info-circle-fill", "No investigations found.");
    return investigations.map((investigation) => (
      <InvestigationListItem
        key={investigation.investigationGuid}
        data={investigation}
      />
    ));
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table"
          id="investigation-list"
        >
          {renderInvestigationListHeader()}
          <tbody>{renderInvestigationListItems()}</tbody>
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
