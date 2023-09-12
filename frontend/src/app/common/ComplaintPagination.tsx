import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";

interface ComplaintPaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onResultsPerPageChange: (perPage: number) => void;
}

const ComplaintPagination: React.FC<ComplaintPaginationProps> = ({
  currentPage,
  totalItems,
  onPageChange,
  onResultsPerPageChange,
}) => {
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [specificPage, setSpecificPage] = useState<string>("");

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSpecificPageChange();
    }
  };

  const handleResultsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newResultsPerPage = parseInt(event.target.value, 10);
    setResultsPerPage(newResultsPerPage);
    onResultsPerPageChange(newResultsPerPage);
  };

  const handleSpecificPageChange = () => {
    const page = parseInt(specificPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalItems) {
      onPageChange(page);
    }
  };

  const lastPage = Math.ceil(totalItems / resultsPerPage);
  const renderPaginationItems = () => {
    const items = [];

    // Calculate the range of pages to display based on the current page
    const startPage = Math.max(1, lastPage > 10 ? currentPage - 4 : 1);
    const endPage = Math.min(lastPage, startPage + 9);

    // Render the ellipsis if necessary
    if (startPage > 1) {
      items.push(
        <Pagination.Item onClick={() => onPageChange(1)}>{1}</Pagination.Item>
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
        <Pagination.Item onClick={() => onPageChange(lastPage)}>
          {lastPage}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="pagination_container">
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
            <Form.Group controlId="resultsPerPageSelect">
              <Form.Control
                as="select"
                value={resultsPerPage}
                onChange={handleResultsPerPageChange}
              >
                <option value={50}>50 / page</option>
              </Form.Control>
            </Form.Group>
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
