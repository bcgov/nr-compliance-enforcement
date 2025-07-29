import { FC, useRef, useState, useCallback } from "react";
import { Table, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SORT_TYPES } from "@constants/sort-direction";
import { SortableHeader } from "@components/common/sortable-header";
import { CaseFilters } from "./case-filter";
import ComplaintPagination from "@components/common/complaint-pagination";
import { applyStatusClass } from "@common/methods";

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

  const renderCaseListHeader = (): JSX.Element => {
    return (
      <thead className="sticky-table-header">
        <tr>
          <SortableHeader
            title="Case #"
            sortFnc={handleSort}
            sortKey="caseIdentifier"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left"
          />
          <SortableHeader
            title="Date Opened"
            sortFnc={handleSort}
            sortKey="caseOpenedTimestamp"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-cell-width-160 comp-cell-min-width-160"
          />
          <SortableHeader
            title="Status"
            sortFnc={handleSort}
            sortKey="caseStatus"
            currentSort={sortKey}
            sortDirection={sortDirection}
            className="comp-cell-width-110"
          />
          <SortableHeader
            title="Agency"
            sortFnc={handleSort}
            sortKey="leadAgency"
            currentSort={sortKey}
            sortDirection={sortDirection}
          />
          <th className="unsortable sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col case-table-actions-cell">
            <div className="header-label">Actions</div>
          </th>
        </tr>
      </thead>
    );
  };

  const renderCaseListItem = (caseFile: any): JSX.Element => {
    return (
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
              <Dropdown.Item
                as={Link}
                to={`/case/${caseFile.caseIdentifier}`}
                id={`view-case-${caseFile.caseIdentifier}`}
              >
                <i className="bi bi-eye" /> View Case
              </Dropdown.Item>
              <Dropdown.Item
                id={`edit-case-${caseFile.caseIdentifier}`}
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log("Edit case", caseFile.caseIdentifier);
                }}
              >
                <i className="bi bi-pencil" /> Edit Case
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  const renderLoadingState = () => {
    return (
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
  };

  const renderErrorState = () => {
    return (
      <tr>
        <td
          colSpan={5}
          className="text-center p-4"
        >
          <div className="d-flex align-items-center justify-content-center text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <span>Error loading cases: {error?.message || "An unexpected error occurred"}</span>
          </div>
        </td>
      </tr>
    );
  };

  const renderNoCasesFound = () => {
    return (
      <tr>
        <td
          colSpan={5}
          className="text-center p-4"
        >
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            <span>
              {searchQuery || (filters && Object.values(filters).some((f) => f != null))
                ? "No cases found using your current filters. Remove or change your filters to see cases."
                : "No cases found."}
            </span>
          </div>
        </td>
      </tr>
    );
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
          <tbody>
            {isLoading && renderLoadingState()}
            {!isLoading && error && renderErrorState()}
            {!isLoading && !error && cases.length === 0 && renderNoCasesFound()}
            {!isLoading && !error && cases.map((caseFile) => renderCaseListItem(caseFile))}
          </tbody>
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
