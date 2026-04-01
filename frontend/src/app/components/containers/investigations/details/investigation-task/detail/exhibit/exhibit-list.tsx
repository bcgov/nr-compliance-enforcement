import { FC, useCallback } from "react";
import { Button } from "react-bootstrap";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { SORT_TYPES } from "@constants/sort-direction";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { Exhibit } from "@/generated/graphql";
import { formatDate, parseUTCDateTimeToLocal } from "@/app/common/methods";

type TaskExhibitListProps = {
  exhibits: Exhibit[];
  isLoading?: boolean;
  onEdit: (exhibit: Exhibit) => void;
};

const formatDateStr = (inputDate: any): string => {
  const d = parseUTCDateTimeToLocal(inputDate, null);
  if (!d) return "-";
  const s = d.toISOString?.() ?? d.toString();
  return formatDate(s);
};

export const TaskExhibitList: FC<TaskExhibitListProps> = ({ exhibits, isLoading = false, onEdit }) => {
  const officers = useAppSelector(selectOfficers);

  const getOfficerName = useCallback(
    (officerGuid: string): string => {
      const officer = officers?.find((o) => o.app_user_guid === officerGuid);
      return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
    },
    [officers],
  );

  const columns: CompColumn<Exhibit>[] = [
    {
      label: "Exhibit #",
      headerClassName: "comp-cell-width-80 comp-cell-min-width-80",
      cellClassName: "comp-cell-width-120 comp-cell-min-width-120 align-middle",
      isSortable: true,
      getValue: (exhibit) => exhibit.exhibitNumber ?? 0,
      renderCell: (exhibit) => exhibit.exhibitNumber ?? "-",
    },
    {
      label: "Description",
      headerClassName: "comp-cell-width-250 comp-cell-min-width-250",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: true,
      getValue: (exhibit) => (exhibit.description ?? "").toLowerCase(),
      renderCell: (exhibit) => exhibit.description ?? "-",
    },
    {
      label: "Date collected",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: true,
      getValue: (exhibit) => exhibit.dateCollected ?? "",
      renderCell: (exhibit) => formatDateStr(exhibit.dateCollected),
    },
    {
      label: "Officer collected",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: true,
      getValue: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? "").toLowerCase(),
      renderCell: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? ""),
    },
    {
      label: "",
      headerClassName: "comp-cell-width-30 comp-cell-min-width-30",
      cellClassName: "comp-cell-width-30 comp-cell-min-width-30 text-end",
      isSortable: false,
      renderCell: (exhibit) => (
        <div className="d-flex justify-content-end">
          <Button
            className="comp-cell-width-30 comp-cell-height-30 d-flex align-items-center justify-content-center"
            type="button"
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(exhibit)}
            title="Edit exhibit"
            aria-label={`Edit exhibit ${exhibit.exhibitNumber}`}
          >
            <i className="bi bi-pencil ms-1 me-1" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <CompTable
      data={exhibits}
      columns={columns}
      getRowKey={(exhibit) => exhibit.exhibitGuid}
      isLoading={isLoading}
      defaultSortLabel="Exhibit #"
      defaultSortDirection={SORT_TYPES.ASC}
      emptyMessage="No exhibits found."
    />
  );
};
