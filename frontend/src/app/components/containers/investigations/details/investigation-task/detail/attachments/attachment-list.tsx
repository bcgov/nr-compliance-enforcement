import { FC, useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import Paginator from "@components/common/paginator";
import { SortableHeader } from "@components/common/sortable-header";
import { SORT_TYPES } from "@constants/sort-direction";
import { getDisplayFilename } from "@/app/common/attachment-utils";
import { Attachment } from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { generateApiParameters, get } from "@/app/common/api";
import config from "@/config";

const PAGE_SIZE = 25;

type Props = {
  attachments: Attachment[];
  isLoading?: boolean;
  onEdit: (attachment: Attachment) => void;
};

export const TaskAttachmentList: FC<Props> = ({ attachments, isLoading = false, onEdit }) => {
  const dispatch = useAppDispatch();
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>(SORT_TYPES.DESC);
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

  const sortedAttachments = useMemo(() => {
    return [...attachments].sort((a, b) => {
      let aVal: string = "";
      let bVal: string = "";

      switch (sortBy) {
        case "name":
          aVal = getDisplayFilename(a.name).toLowerCase();
          bVal = getDisplayFilename(b.name).toLowerCase();
          break;
        case "fileType":
          aVal = a.fileType ?? "";
          bVal = b.fileType ?? "";
          break;
        case "description":
          aVal = a.description ?? "";
          bVal = b.description ?? "";
          break;
        case "title":
          aVal = a.title ?? "";
          bVal = b.title ?? "";
          break;
        case "date":
          aVal = a.date ?? "";
          bVal = b.date ?? "";
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === SORT_TYPES.ASC ? -1 : 1;
      if (aVal > bVal) return sortOrder === SORT_TYPES.ASC ? 1 : -1;
      return 0;
    });
  }, [attachments, sortBy, sortOrder]);

  const paginatedAttachments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedAttachments.slice(start, start + PAGE_SIZE);
  }, [sortedAttachments, currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const getOfficerName = (officerGuid: string) => {
    const takenByOfficer = officers?.find((o) => o.auth_user_guid === officerGuid);
    return takenByOfficer ? `${takenByOfficer.last_name}, ${takenByOfficer.first_name}` : "-";
  };

  const downloadAttachment = async (objectid: string | undefined, filename: string) => {
    if (!objectid) {
      return;
    }

    const parameters = generateApiParameters(`${config.COMS_URL}/object/${objectid}?download=url`);
    const response = await get<string>(dispatch, parameters);

    const a = document.createElement("a");
    a.href = response;
    a.download = filename;
    a.target = "_blank";
    a.click();
  };

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
        {renderSortableHeader("File Name", "name", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("File Type", "fileType", "comp-cell-width-120")}
        {renderSortableHeader("Description", "description", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Title", "title", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Date", "date", "comp-cell-width-120")}
        <th className="comp-cell-width-160 comp-cell-min-width-160">Taken By</th>
        <th className="comp-cell-width-160 comp-cell-min-width-160">Location</th>
        <th className="comp-cell-width-30 comp-cell-min-width-30"></th>
      </tr>
    </thead>
  );

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={8}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border spinner-border-sm me-2">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading attachments...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (attachments.length === 0) {
      return (
        <tr>
          <td
            colSpan={8}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <i className="bi bi-info-circle-fill me-2"></i>
              <span>No attachments found.</span>
            </div>
          </td>
        </tr>
      );
    }

    return paginatedAttachments.map((attachment) => (
      <tr key={attachment.id}>
        <td className="comp-cell-width-160 comp-cell-min-width-160">
          <button
            className="btn btn-link p-0 border-0 text-body"
            onClick={() => downloadAttachment(attachment.id, getDisplayFilename(attachment.name))}
          >
            {getDisplayFilename(attachment.name)}
          </button>
        </td>
        <td className="comp-cell-width-120">{attachment.fileType ?? "-"}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160">{attachment.description ?? "-"}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160">{attachment.title ?? "-"}</td>
        <td className="comp-cell-width-120">{attachment.date ?? "-"}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160">{getOfficerName(attachment.takenBy ?? "")}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160">{attachment.location ?? "-"}</td>
        <td className="comp-cell-width-30 comp-cell-min-width-30 text-center">
          <button
            className="btn btn-link p-0 border-0 text-body"
            onClick={() => onEdit(attachment)}
            aria-label={`Edit ${getDisplayFilename(attachment.name)}`}
          >
            <i className="bi bi-pencil-square" />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table"
          id="task-attachment-list"
        >
          {renderHeader()}
          <tbody>{renderBody()}</tbody>
        </Table>
      </div>
      {sortedAttachments.length > 0 && (
        <Paginator
          currentPage={currentPage}
          totalItems={sortedAttachments.length}
          onPageChange={handlePageChange}
          resultsPerPage={PAGE_SIZE}
        />
      )}
    </div>
  );
};
