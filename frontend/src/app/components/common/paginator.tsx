import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import Pagination from "react-bootstrap/Pagination";
import Option from "@apptypes/app/option";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { FEATURE_TYPES } from "@constants/feature-flag-types";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  resetPageOnChange?: boolean;
}

/**
 * Pagination component for displaying a react-bootstrap pagination component
 * @param currentPage Current page that is selected
 * @param totalItems Total number of items
 * @param resultsPerPage The number of results to appear on each page
 * @param resetPageOnChange Whether to reset to page 1 when totalItems changes (default: true)
 */
const Paginator: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  onPageChange,
  resultsPerPage,
  resetPageOnChange = false,
}) => {
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));

  const [specificPage, setSpecificPage] = useState<string>("");
  const pageSizeOptions: Option[] = [{ label: `${resultsPerPage} / page`, value: `${resultsPerPage}` }];
  const defaultOption: Option = {
    label: `${resultsPerPage} / page`,
    value: `${resultsPerPage}`,
  };

  useEffect(() => {
    // Update the local state whenever selectedValue changes so that the pagination starts at 1 again.
    if (resetPageOnChange) {
      onPageChange(1);
    }
  }, [onPageChange, totalItems, resetPageOnChange]);

  const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSpecificPageChange();
    }
  };

  const lastPage = Math.ceil(totalItems / resultsPerPage);

  const handleSpecificPageChange = () => {
    const page = parseInt(specificPage, 10);
    if (!isNaN(page) && page >= 1 && page <= lastPage) {
      onPageChange(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    // Calculate the range of pages to display based on the current page
    const startPage = Math.max(1, lastPage > 5 ? currentPage - 4 : 1);
    const endPage = Math.min(lastPage, startPage + 5);

    // Render the ellipsis if necessary
    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key="pagination_first_page"
          id="pagination_first_page_id"
          onClick={() => onPageChange(1)}
        >
          {1}
        </Pagination.Item>,
      );
    }

    if (startPage > 1 && lastPage > 5) {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-start"
          onClick={() => onPageChange(startPage - 1)}
        />,
      );
    }

    // Render page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          id={`pagination_page_${page}_id`}
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>,
      );
    }

    if (endPage < lastPage) {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-end"
          onClick={() => onPageChange(endPage + 1)}
        />,
      );
      items.push(
        <Pagination.Item
          key="pagination_last_page"
          id="pagination_last_page_id"
          onClick={() => onPageChange(lastPage)}
        >
          {lastPage}
        </Pagination.Item>,
      );
    }

    return items;
  };

  return (
    <div
      id="complaint_pagination_container_id"
      className="pagination_container"
    >
      {/* Total count */}
      <div className="pagination_total">Total {totalItems} items</div>

      {totalItems > resultsPerPage && (
        <div className="pagination_controls">
          {/* Paging buttons */}
          <div className="pagination_paging-btns">
            <Pagination>
              <Pagination.Prev
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              />
              {renderPaginationItems()}
              <Pagination.Next
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
              />
            </Pagination>
          </div>

          <div className="pagination_controls_end">
            {/* Select total viewable records */}
            {showExperimentalFeature && (
              <Select
                menuPlacement="top"
                id="resultsPerPageSelect"
                options={pageSizeOptions}
                classNamePrefix="comp-select"
                defaultValue={defaultOption}
              />
            )}

            {/* Go to specific page */}
            <div className="pagination_specific_page">
              <label htmlFor="pagination_page_input">Go to</label>
              <Form.Control
                id="pagination_page-input"
                type="number"
                placeholder="Page"
                value={specificPage}
                onKeyDown={handleEnterKeyPress}
                onChange={(e) => setSpecificPage(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Paginator;
