import { FC, useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import Paginator from "@components/common/paginator";
import { SortableHeader } from "@components/common/sortable-header";
import { SORT_TYPES } from "@constants/sort-direction";
import { getDisplayFilename } from "@/app/common/attachment-utils";
import { getFileTypeIcon } from "@components/common/file-type-icon";
import { Attachment } from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { generateApiParameters, get } from "@/app/common/api";
import config from "@/config";

const PAGE_SIZE = 25;

type TaskAttachmentListProps = {
  attachments: Attachment[];
  isLoading?: boolean;
  onEdit: (attachment: Attachment) => void;
};

export const TaskAttachmentList: FC<TaskAttachmentListProps> = ({ attachments, isLoading = false, onEdit }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>(SORT_TYPES.DESC);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const officers = useAppSelector(selectOfficers);

  // Callbacks

  // controller for when sort columns are clicked
  const handleSort = useCallback(
    (sortInput: string) => {
      const newDirection = sortBy === sortInput && sortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;
      setSortBy(sortInput);
      setSortOrder(newDirection);
    },
    [sortBy, sortOrder],
  );

  // contains sorting logic
  const sortedAttachments = useMemo(() => {
    return [...attachments].sort((a, b) => {
      let aVal: string = "";
      let bVal: string = "";

      switch (sortBy) {
        case "name":
          aVal = getDisplayFilename(a.name).toLowerCase();
          bVal = getDisplayFilename(b.name).toLowerCase();
          break;
        case "sequenceNumber":
          aVal = a.sequenceNumber ?? "";
          bVal = b.sequenceNumber ?? "";
          break;
        case "fileType":
          aVal = a.fileType ?? "";
          bVal = b.fileType ?? "";
          break;
        case "description":
          aVal = (a.description ?? "").toLowerCase();
          bVal = (b.description ?? "").toLowerCase();
          break;
        case "title":
          aVal = (a.title ?? "").toLowerCase();
          bVal = (b.title ?? "").toLowerCase();
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

  // Determines pagination
  const paginatedAttachments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedAttachments.slice(start, start + PAGE_SIZE);
  }, [sortedAttachments, currentPage]);

  // Manages pagination navigation
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  // Functions

  // Converts guid to officer name
  const getOfficerName = (officerGuid: string) => {
    const takenByOfficer = officers?.find((o) => o.app_user_guid === officerGuid);
    return takenByOfficer ? `${takenByOfficer.last_name}, ${takenByOfficer.first_name}` : "-";
  };

  // Downloads attachment from COMS
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

  // Renders the table header
  const renderHeader = () => (
    <thead className="sticky-table-header">
      <tr>
        {renderSortableHeader("File name", "name", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("File type", "fileType", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Sequence number", "sequenceNumber", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Description", "description", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Title", "title", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Date", "date", "comp-cell-width-120")}
        <th className="comp-cell-width-160 comp-cell-min-width-160">Taken by</th>
        <th className="comp-cell-width-160 comp-cell-min-width-160">Location</th>
        <th className="comp-cell-width-30 comp-cell-min-width-30"></th>
      </tr>
    </thead>
  );

  // Renders the table Body
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
        <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">
          <div className="d-flex align-items-center">
            <i className={`bi ${getFileTypeIcon(attachment.fileType)} me-2 fs-5`} />
            <button
              className="btn btn-link p-0 border-0 text-body"
              onClick={() => downloadAttachment(attachment.id, getDisplayFilename(attachment.name))}
            >
              {getDisplayFilename(attachment.name)}
            </button>
          </div>
        </td>
        <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">{attachment.fileType ?? "-"}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">{attachment.sequenceNumber ?? "-"}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">{attachment.description ?? "-"}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">{attachment.title ?? "-"}</td>
        <td className="comp-cell-width-120 align-middle">{attachment.date ?? "-"}</td>
        <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">
          {getOfficerName(attachment.takenBy ?? "")}
        </td>
        <td className="comp-cell-width-160 comp-cell-min-width-160 align-middle">{attachment.location ?? "-"}</td>
        <td className="comp-cell-width-30 comp-cell-min-width-30 text-center">
          <button
            type="button"
            className="btn btn-outline-primary rounded p-2"
            onClick={() => onEdit(attachment)}
            title="Edit task action"
            aria-label={`Edit ${getDisplayFilename(attachment.name)}`}
          >
            <i className="bi bi-pencil ms-1 me-1" />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table mb-0"
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
