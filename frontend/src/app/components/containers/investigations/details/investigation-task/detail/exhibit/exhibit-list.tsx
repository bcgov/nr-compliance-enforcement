import { FC, useCallback, useMemo, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Paginator from "@components/common/paginator";
import { SortableHeader } from "@components/common/sortable-header";
import { SORT_TYPES } from "@constants/sort-direction";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { Exhibit } from "@/generated/graphql";
import { formatDate, parseUTCDateTimeToLocal } from "@/app/common/methods";

const PAGE_SIZE = 25;

type TaskExhibitListProps = {
  exhibits: Exhibit[];
  isLoading?: boolean;
  onEdit: (exhibit: Exhibit) => void;
};

export const TaskExhibitList: FC<TaskExhibitListProps> = ({ exhibits, isLoading = false, onEdit }) => {
  const [sortBy, setSortBy] = useState<string>("exhibitNumber");
  const [sortOrder, setSortOrder] = useState<string>(SORT_TYPES.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const officers = useAppSelector(selectOfficers);

  const handleSort = useCallback(
    (sortInput: string) => {
      const newDirection = sortBy === sortInput && sortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;
      setSortBy(sortInput);
      setSortOrder(newDirection);
    },
    [sortBy, sortOrder],
  );

  const getOfficerName = (officerGuid: string) => {
    const officer = officers?.find((o) => o.app_user_guid === officerGuid);
    return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
  };

  const formatDateStr = (inputDate: any) => {
    const d = parseUTCDateTimeToLocal(inputDate, null);
    if (!d) return "";
    const s = d.toISOString?.() ?? d.toString();
    return formatDate(s);
  };

  const sortedExhibits = useMemo(() => {
    return [...exhibits].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortBy) {
        case "exhibitNumber":
          aVal = a.exhibitNumber ?? 0;
          bVal = b.exhibitNumber ?? 0;
          break;
        case "description":
          aVal = (a.description ?? "").toLowerCase();
          bVal = (b.description ?? "").toLowerCase();
          break;
        case "dateCollected":
          aVal = a.dateCollected ?? "";
          bVal = b.dateCollected ?? "";
          break;
        case "collectedAppUserGuidRef":
          aVal = getOfficerName(a.collectedAppUserGuidRef ?? "").toLowerCase();
          bVal = getOfficerName(b.collectedAppUserGuidRef ?? "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === SORT_TYPES.ASC ? -1 : 1;
      if (aVal > bVal) return sortOrder === SORT_TYPES.ASC ? 1 : -1;
      return 0;
    });
  }, [exhibits, sortBy, sortOrder, officers]);

  const paginatedExhibits = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedExhibits.slice(start, start + PAGE_SIZE);
  }, [sortedExhibits, currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const renderSortableHeader = (title: string, sortKey: string, className?: string) => (
    <SortableHeader
      title={title}
      sortFnc={handleSort}
      sortKey={sortKey}
      currentSort={sortBy}
      sortDirection={sortOrder}
      className={className}
    />
  );

  const renderHeader = () => (
    <thead className="sticky-table-header">
      <tr>
        {renderSortableHeader("Exhibit #", "exhibitNumber", "comp-cell-width-120 comp-cell-min-width-120")}
        {renderSortableHeader("Description", "description", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Date collected", "dateCollected", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader(
          "Officer collected",
          "collectedAppUserGuidRef",
          "comp-cell-width-160 comp-cell-min-width-160",
        )}
        <th className="comp-cell-width-30 comp-cell-min-width-30"></th>
      </tr>
    </thead>
  );

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={5}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border spinner-border-sm me-2">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading exhibits...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (exhibits.length === 0) {
      return (
        <tr>
          <td
            colSpan={5}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <i className="bi bi-info-circle-fill me-2"></i>
              <span>No exhibits found.</span>
            </div>
          </td>
        </tr>
      );
    }

    return paginatedExhibits.map((exhibit) => {
      return (
        <tr key={exhibit.exhibitGuid}>
          <td className="comp-cell-width-120 comp-cell-min-width-120 align-middle">{exhibit.exhibitNumber}</td>
          <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">{exhibit.description ?? "-"}</td>
          <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">
            {formatDateStr(exhibit.dateCollected) ?? "-"}
          </td>
          <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">
            {getOfficerName(exhibit.collectedAppUserGuidRef ?? "")}
          </td>
          <td className="comp-cell-width-30 comp-cell-min-width-30 text-center">
            <Button
              type="button"
              variant="outline-primary"
              size="sm"
              onClick={() => onEdit(exhibit)}
              title="Edit exhibit"
              aria-label={`Edit exhibit ${exhibit.exhibitNumber}`}
            >
              <i className="bi bi-pencil ms-1 me-1" />
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table mb-0 exhibits-table"
          id="task-exhibit-list"
        >
          {renderHeader()}
          <tbody>{renderBody()}</tbody>
        </Table>
      </div>
      {sortedExhibits.length > 0 && (
        <Paginator
          currentPage={currentPage}
          totalItems={sortedExhibits.length}
          onPageChange={handlePageChange}
          resultsPerPage={PAGE_SIZE}
        />
      )}
    </div>
  );
};
