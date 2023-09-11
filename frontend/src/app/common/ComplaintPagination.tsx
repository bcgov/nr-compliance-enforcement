import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface ComplaintPaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const ComplaintPagination: React.FC<ComplaintPaginationProps> = ({
  currentPage,
  totalItems,
  onPageChange,
}) => {
  const lastPage = Math.ceil(totalItems/10);
  const PAGE_SIZE = 10;
  const renderPaginationItems = () => {
    const items = [];

    // Calculate the range of pages to display based on the current page
    const startPage = Math.max(1, currentPage - 4);
    const endPage = Math.min(lastPage, startPage + 9);

    // Render the ellipsis if necessary
    if (startPage > 1) {
        items.push(
            <Pagination.Item onClick={() => onPageChange(1)}>{1}</Pagination.Item>        
        )
      items.push(
        <Pagination.Ellipsis key="ellipsis-start" onClick={() => onPageChange(startPage - 1)} />
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
        <Pagination.Ellipsis key="ellipsis-end" onClick={() => onPageChange(endPage + 1)} />
      );
      items.push(
        <Pagination.Item onClick={() => onPageChange(lastPage)}>{lastPage}</Pagination.Item>
      )
    }

    return items;
  };

  return (
    <div className="pagination_container">
    <div className="pagination_total">Total {totalItems} items</div>
    {totalItems > PAGE_SIZE && (
    <Pagination>
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}/>
      {renderPaginationItems()}
      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= lastPage}/>
    </Pagination>
  )}</div>);
};

export default ComplaintPagination;
