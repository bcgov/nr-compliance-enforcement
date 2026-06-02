import { FC, useCallback } from "react";
import { Button } from "react-bootstrap";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { SORT_TYPES } from "@constants/sort-direction";
import { getDisplayFilename } from "@/app/common/attachment-utils";
import { Attachment } from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { generateApiParameters, get } from "@/app/common/api";
import config from "@/config";
import { truncateFilenameString } from "@/app/common/methods";

type TaskAttachmentListProps = {
  attachments: Attachment[];
  isLoading?: boolean;
  isReadOnly?: boolean;
  onEdit: (attachment: Attachment) => void;
};

const downloadAttachment = async (
  e: React.MouseEvent<HTMLAnchorElement>,
  dispatch: any,
  objectId: string | undefined,
  filename: string,
) => {
  e.preventDefault();
  if (!objectId) return;
  const parameters = generateApiParameters(`${config.COMS_URL}/object/${objectId}?download=url`);
  const response = await get<string>(dispatch, parameters);
  const a = document.createElement("a");
  a.href = response;
  a.download = filename;
  a.target = "_blank";
  a.click();
};

export const TaskAttachmentList: FC<TaskAttachmentListProps> = ({
  attachments,
  isLoading = false,
  isReadOnly = false,
  onEdit,
}) => {
  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficers);

  const getOfficerName = useCallback(
    (officerGuid: string): string => {
      const officer = officers?.find((o) => o.app_user_guid === officerGuid);
      return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
    },
    [officers],
  );

  const columns: CompColumn<Attachment>[] = [
    {
      label: "File type",
      headerClassName: "comp-cell-width-50 comp-cell-min-width-50",
      cellClassName: "comp-cell-width-50 comp-cell-min-width-50 align-middle",
      isSortable: true,
      getValue: (attachment) => attachment.fileType ?? "",
      renderCell: (attachment) => attachment.fileType ?? "-",
    },
    {
      label: "ID",
      headerClassName: "comp-cell-width-50 comp-cell-min-width-50",
      cellClassName: "comp-cell-width-50 comp-cell-min-width-50 align-middle",
      isSortable: true,
      getValue: (attachment) => attachment.sequenceNumber ?? "",
      renderCell: (attachment) => attachment.sequenceNumber ?? "-",
    },
    {
      label: "Description",
      headerClassName: "comp-cell-width-250 comp-cell-min-width-250",
      cellClassName: "comp-cell-width-250 comp-cell-min-width-250 align-middle",
      isSortable: true,
      getValue: (attachment) => attachment.description ?? "",
      renderCell: (attachment) => attachment.description ?? "-",
    },
    {
      label: "Title",
      headerClassName: "comp-cell-width-175 comp-cell-min-width-175",
      cellClassName: "comp-cell-width-175 comp-cell-min-width-175 align-middle",
      isSortable: true,
      getValue: (attachment) => attachment.title ?? "",
      renderCell: (attachment) => attachment.title ?? "-",
    },
    {
      label: "Date",
      headerClassName: "comp-cell-width-50 comp-cell-min-width-50",
      cellClassName: "comp-cell-width-50 comp-cell-min-width-50 align-middle",
      isSortable: true,
      getValue: (attachment) => attachment.date ?? "",
      renderCell: (attachment) => attachment.date ?? "-",
    },
    {
      label: "Taken by",
      headerClassName: "comp-cell-width-150 comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150 align-middle",
      isSortable: false,
      renderCell: (attachment) => getOfficerName(attachment.takenBy ?? ""),
    },
    {
      label: "Location",
      headerClassName: "comp-cell-width-175 comp-cell-min-width-175",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: false,
      renderCell: (attachment) => attachment.location ?? "-",
    },
    {
      label: "File name",
      headerClassName: "comp-cell-width-175 comp-cell-min-width-175",
      cellClassName: "comp-cell-width-175 comp-cell-min-width-175 align-middle",
      isSortable: true,
      getValue: (attachment) => getDisplayFilename(attachment.name).toLowerCase(),
      renderCell: (attachment) => {
        const displayName = getDisplayFilename(attachment.name);
        return (
          <a
            href={`${config.COMS_URL}/object/${attachment.id}`}
            className="btn btn-link p-0 border-0 text-body"
            onClick={(e) => downloadAttachment(e, dispatch, attachment.id, displayName)}
            title={`Download ${displayName}`}
          >
            {truncateFilenameString(displayName, 15)}
          </a>
        );
      },
    },
    {
      label: "",
      headerClassName: "comp-cell-width-30 comp-cell-min-width-30 sticky-col sticky-col--right actions-col",
      cellClassName: "comp-cell-width-30 comp-cell-min-width-30 text-end sticky-col sticky-col--right actions-col",
      isSortable: false,
      renderCell: (attachment) => (
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          onClick={() => onEdit(attachment)}
          title="Edit attachment data"
          aria-label={`Edit ${getDisplayFilename(attachment.name)}`}
          disabled={isReadOnly}
        >
          <i className="bi bi-pencil ms-1 me-1" />
        </Button>
      ),
    },
  ];

  return (
    <CompTable
      data={attachments}
      tableIdentifier="attachment-list"
      isFixedHeight={false}
      columns={columns}
      getRowKey={(attachment) => attachment.id ?? ""}
      isLoading={isLoading}
      defaultSort="Date"
      defaultSortDirection={SORT_TYPES.DESC}
    />
  );
};
