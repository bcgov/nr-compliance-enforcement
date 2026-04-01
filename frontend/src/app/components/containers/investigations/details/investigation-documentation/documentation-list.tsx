import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { formatDate } from "@common/methods";
import { generateApiParameters, get } from "@common/api";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { Task } from "@/generated/graphql";
import { getDisplayFilename } from "@common/attachment-utils";
import { getFileTypeIcon } from "@components/common/file-type-icon";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useDocumentationSearch } from "./hooks/use-documentation-search";
import { Attachment } from "./hooks/use-investigation-attachments";
import { SORT_TYPES } from "@constants/sort-direction";
import config from "@/config";

type AttachmentWithTask = Attachment & {
  task?: Task;
};

type Props = {
  attachments: Attachment[];
  tasks: Task[];
  totalItems: number;
  isLoading: boolean;
  error: Error | null;
  investigationGuid: string;
};

export const DocumentationList: FC<Props> = ({
  attachments,
  tasks,
  totalItems,
  isLoading,
  error,
  investigationGuid,
}) => {
  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficers);
  const { searchValues, setValues, setSort } = useDocumentationSearch();

  const handleSort = useCallback(
    (sortKey: string, sortDirection: string) => {
      setSort(sortKey, sortDirection);
    },
    [setSort],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setValues({ page: newPage });
    },
    [setValues],
  );

  const getUserName = (officerGuid: string): string => {
    const officer = officers?.find((o) => o.app_user_guid === officerGuid);
    return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
  };

  const handleFileClick = async (e: React.MouseEvent<HTMLAnchorElement>, attachmentId: string) => {
    e.preventDefault();
    if (!attachmentId) return;
    const parameters = generateApiParameters(`${config.COMS_URL}/object/${attachmentId}?download=url`);
    const downloadUrl = await get<string>(dispatch, parameters);
    window.open(downloadUrl, "_blank");
  };

  const attachmentsWithTasks: AttachmentWithTask[] = attachments.map((attachment) => ({
    ...attachment,
    task: attachment.taskId ? tasks.find((t) => t.taskIdentifier === attachment.taskId) : undefined,
  }));

  const emptyMessage =
    searchValues.search || searchValues.taskFilter
      ? "No documents match your search criteria."
      : "No documents have been uploaded for this investigation.";

  const columns: CompColumn<AttachmentWithTask>[] = [
    {
      label: "File type",
      sortKey: "fileType",
      headerClassName: "comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => attachment.fileType ?? "",
      renderCell: (attachment) => attachment.fileType ?? "",
    },
    {
      label: "ID",
      sortKey: "sequenceNumber",
      headerClassName: "comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => attachment.sequenceNumber ?? "",
      renderCell: (attachment) => attachment.sequenceNumber ?? "",
    },
    {
      label: "Description",
      sortKey: "description",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => attachment.description ?? "",
      renderCell: (attachment) => attachment.description ?? "-",
    },
    {
      label: "Title",
      sortKey: "title",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => attachment.title ?? "",
      renderCell: (attachment) => attachment.title ?? "-",
    },
    {
      label: "Date",
      sortKey: "date",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => attachment.date ?? "",
      renderCell: (attachment) => (attachment.date ? formatDate(attachment.date) : "-"),
    },
    {
      label: "Taken by",
      sortKey: "takenBy",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => getUserName(attachment.takenBy ?? ""),
      renderCell: (attachment) => getUserName(attachment.takenBy ?? ""),
    },
    {
      label: "Location",
      sortKey: "location",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => attachment.location ?? "",
      renderCell: (attachment) => attachment.location ?? "-",
    },
    {
      label: "Task",
      sortKey: "taskNumber",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (attachment) => (attachment.task ? `Task ${attachment.task.taskNumber}` : ""),
      renderCell: (attachment) => {
        const taskLabel = attachment.task ? `Task ${attachment.task.taskNumber}` : "-";
        return attachment.task ? (
          <Link
            to={`/investigation/${investigationGuid}/tasks?section=task-item-${attachment.task.taskNumber}`}
            className="comp-cell-link"
          >
            {taskLabel}
          </Link>
        ) : (
          <span>{taskLabel}</span>
        );
      },
    },
    {
      label: "File name",
      sortKey: "name",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-min-width-200",
      isSortable: true,
      getValue: (attachment) => attachment.name ?? "",
      renderCell: (attachment) => {
        const displayName = getDisplayFilename(attachment.name);
        return (
          <>
            <i className={`bi ${getFileTypeIcon(attachment.fileType)} me-1 fs-5`} />
            <a
              href={`${config.COMS_URL}/object/${attachment.id}`}
              className="comp-cell-link"
              onClick={(e) => handleFileClick(e, attachment.id ?? "")}
              title={`Download ${displayName}`}
            >
              {displayName}
            </a>
          </>
        );
      },
    },
  ];

  return (
    <CompTable
      data={attachmentsWithTasks}
      tableIdentifier="documentation-list"
      columns={columns}
      getRowKey={(attachment) => attachment.id ?? ""}
      isLoading={isLoading}
      error={error}
      totalItems={totalItems}
      currentPage={searchValues.page}
      pageSize={searchValues.pageSize}
      defaultSortLabel="File type"
      defaultSortDirection={SORT_TYPES.ASC}
      onSort={handleSort}
      onPageChange={handlePageChange}
      emptyMessage={emptyMessage}
    />
  );
};
