import { FC, useCallback } from "react";
import { Table } from "react-bootstrap";
import { SortableHeader } from "@components/common/sortable-header";
import Paginator from "@/app/components/common/paginator";
import { SORT_TYPES } from "@constants/sort-direction";
import { InspectionListItem } from "./inspection-list-item";
import { useInspectionSearch } from "../hooks/use-inspection-search";

type Props = {
  inspections: any[];
  cases?: Map<string, any[]>;
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const InspectionList: FC<Props> = ({ inspections, totalItems = 0, isLoading = false, error = null, cases = new Map() }) => {
  const { searchValues, setValues, setSort } = useInspectionSearch();

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

  const renderInspectionListHeader = (): JSX.Element => (
    <thead className="sticky-table-header">
      <tr>
        {renderSortableHeader(
          "Inspection ID",
          "name",
          "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
        )}
        <th className="unsortable comp-cell-width-160 comp-cell-min-width-160">
          <div className="header-label">Case ID</div>
        </th>
        {renderSortableHeader("Date Opened", "openedTimestamp", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Status", "inspectionStatus", "comp-cell-width-110")}
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
          <span>Loading inspections...</span>
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
      `Error loading inspections: ${error?.message || "An unexpected error occurred"}`,
      "text-danger",
    );

  const renderInspectionListItems = () => {
    if (isLoading) return renderLoadingSpinner();
    if (!isLoading && error) return renderErrorMessage();
    if (!isLoading && !error && inspections.length === 0)
      return renderMessage("info-circle-fill", "No inspections found.");
    return inspections.map((inspection) => (
      <InspectionListItem
        key={inspection.inspectionGuid}
        data={inspection}
        cases={cases.get(inspection.inspectionGuid) || []}
      />
    ));
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table"
          id="inspection-list"
        >
          {renderInspectionListHeader()}
          <tbody>{renderInspectionListItems()}</tbody>
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
