import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from 'react-select';
import Pagination from "react-bootstrap/Pagination";
import Option from "../../types/app/option";

interface ComplaintPaginationProps {
  currentPage: number;
  totalItems: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component for displaying a react-bootstrap pagination component
 * @param currentPage Current page that is selected
 * @param totalItems Total number of items
 * @param resultsPerPage The number of results to appear on each page
 */
const ComplaintPagination: React.FC<ComplaintPaginationProps> = ({
  currentPage,
  totalItems,
  onPageChange,
  resultsPerPage,
}) => {

  const [specificPage, setSpecificPage] = useState<string>("");
  const pageSizeOptions: Option[] = [{label: `${resultsPerPage } / page`, value: `${resultsPerPage}`}];
  const defaultOption: Option = {label: `${resultsPerPage } / page`, value: `${resultsPerPage}`};

  useEffect(() => {
    // Update the local state whenever selectedValue changes so that the pagination starts at 1 again.
    onPageChange(1);
  }, [totalItems]);


  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
    const startPage = Math.max(1, lastPage > 10 ? currentPage - 4 : 1);
    const endPage = Math.min(lastPage, startPage + 9);

    // Render the ellipsis if necessary
    if (startPage > 1) {
      items.push(
        <Pagination.Item key="pagination_first_page" id="pagination_first_page_id" onClick={() => onPageChange(1)}>{1}</Pagination.Item>
      );
    }

    if (startPage > 1 && lastPage > 10) {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-start"
          onClick={() => onPageChange(startPage - 1)}
        />
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
        </Pagination.Item>
      );
    }

    if (endPage < lastPage) {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-end"
          onClick={() => onPageChange(endPage + 1)}
        />
      );
      items.push(
        <Pagination.Item key="pagination_last_page" id="pagination_last_page_id" onClick={() => onPageChange(lastPage)}>
          {lastPage}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div id="complaint_pagination_container_id" className="pagination_container">
      <div className="pagination_total">Total {totalItems} items</div>
      {totalItems > resultsPerPage && (
        <>
          <div>
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
          <div>
          <Select 
                id="resultsPerPageSelect"
                options={pageSizeOptions}
                defaultValue={defaultOption}
               />
          </div>
          <div>
            <Form.Label>Go to</Form.Label>
          </div>
          <div className="pagination_specific_page">
            <Form.Control
              type="number"
              placeholder="Page"
              value={specificPage}
              onKeyPress={handleEnterKeyPress}
              onChange={(e) => setSpecificPage(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ComplaintPagination;
