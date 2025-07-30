import { FC, useRef, useState } from "react";
import { Table, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CaseFilters } from "./case-filter";
import { SortableHeader } from "@components/common/sortable-header";
import ComplaintPagination from "@components/common/complaint-pagination";
import { applyStatusClass } from "@common/methods";
import { SORT_TYPES } from "@constants/sort-direction";

type Props = {
  cases: any[];
  searchQuery?: string;
  filters?: CaseFilters;
  onSort?: (column: string, direction: string) => void;
  currentPage?: number;
  totalItems?: number;
  resultsPerPage?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  error?: Error | null;
};

export const CaseList: FC<Props> = ({
  cases,
  searchQuery,
  filters,
  onSort,
  currentPage = 1,
  totalItems = 0,
  resultsPerPage = 25,
  onPageChange,
  isLoading = false,
  error = null,
}) => {
  const [sortKey, setSortKey] = useState("caseOpenedTimestamp");
  const [sortDirection, setSortDirection] = useState(SORT_TYPES.DESC);
  const divRef = useRef<HTMLDivElement>(null);

  const handleSort = (sortInput: string) => {
    const newDirection = sortKey === sortInput && sortDirection === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;

    setSortKey(sortInput);
    setSortDirection(newDirection);
    onSort?.(sortInput, newDirection);
  };

  const scrollToTop = () => {
    divRef.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderSortableHeader = (title: string, sortKey: string, className?: string) => (
    <SortableHeader
      title={title}
      sortFnc={handleSort}
      sortKey={sortKey}
      currentSort={sortKey}
      sortDirection={sortDirection}
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

  const renderDropdownAction = (caseFile: any, icon: string, label: string, to?: string, onClick?: () => void) => {
    const itemProps = {
      id: `${label.toLowerCase().replace(" ", "-")}-case-${caseFile.caseIdentifier}`,
      onClick,
    };

    return to ? (
      <Dropdown.Item
        as={Link}
        to={to}
        {...itemProps}
      >
        <i className={`bi bi-${icon}`} /> {label}
      </Dropdown.Item>
    ) : (
      <Dropdown.Item {...itemProps}>
        <i className={`bi bi-${icon}`} /> {label}
      </Dropdown.Item>
    );
  };

  const renderCaseListItem = (caseFile: any): JSX.Element => (
    <tr key={caseFile.caseIdentifier}>
      <td className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center">
        <Link
          to={`/case/${caseFile.caseIdentifier}`}
          className="comp-cell-link"
        >
          {caseFile.caseIdentifier}
        </Link>
      </td>
      <td className="comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell">
        {caseFile.caseOpenedTimestamp ? new Date(caseFile.caseOpenedTimestamp).toLocaleDateString() : "—"}
      </td>
      <td className="comp-cell-width-110">
        {caseFile.caseStatus && (
          <span className={`badge ${applyStatusClass(caseFile.caseStatus.caseStatusCode)}`}>
            {caseFile.caseStatus.shortDescription}
          </span>
        )}
      </td>
      <td>{caseFile.leadAgency?.longDescription || "—"}</td>
      <td className="comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col case-table-actions-cell">
        <Dropdown
          id={`case-action-button-${caseFile.caseIdentifier}`}
          key={`case-action-${caseFile.caseIdentifier}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`case-action-toggle-${caseFile.caseIdentifier}`}
            size="sm"
            variant="outline-primary"
          >
            Actions
          </Dropdown.Toggle>
          <Dropdown.Menu
            popperConfig={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 13],
                    placement: "start",
                  },
                },
              ],
            }}
          >
            {renderDropdownAction(caseFile, "eye", "View Case", `/case/${caseFile.caseIdentifier}`)}
            {renderDropdownAction(caseFile, "pencil", "Edit Case", undefined, () =>
              console.log("Edit case", caseFile.caseIdentifier),
            )}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );

  const renderMessageState = (icon: string, message: string, variant?: string) => (
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

  const renderLoadingState = () => (
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

  const renderErrorState = () =>
    renderMessageState(
      "exclamation-triangle-fill",
      `Error loading cases: ${error?.message || "An unexpected error occurred"}`,
      "text-danger",
    );

  const renderNoCasesFound = () => {
    const hasActiveFilters = searchQuery || (filters && Object.values(filters).some((f) => f != null));
    const message = hasActiveFilters
      ? "No cases found using your current filters. Remove or change your filters to see cases."
      : "No cases found.";

    return renderMessageState("info-circle-fill", message);
  };

  const renderTableBody = () => {
    if (isLoading) return renderLoadingState();
    if (!isLoading && error) return renderErrorState();
    if (!isLoading && !error && cases.length === 0) return renderNoCasesFound();
    return cases.map((caseFile) => renderCaseListItem(caseFile));
  };

  return (
    <div className="comp-table-container">
      <div
        className="comp-table-scroll-container"
        ref={divRef}
      >
        <Table
          className="comp-table"
          id="case-list"
        >
          {renderCaseListHeader()}
          <tbody>{renderTableBody()}</tbody>
        </Table>
      </div>

      {onPageChange && (
        <ComplaintPagination
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
          resultsPerPage={resultsPerPage}
        />
      )}
    </div>
  );
};
