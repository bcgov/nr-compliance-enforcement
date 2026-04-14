import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { formatDate, parseUTCDateTimeToLocal } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { Exhibit, Task } from "@/generated/graphql";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";
import { SORT_TYPES } from "@constants/sort-direction";

type Props = {
  exhibits: Exhibit[];
  tasks: Task[];
  totalItems: number;
  isLoading: boolean;
  investigationGuid: string;
};

const formatDateStr = (inputDate: any): string => {
  const d = parseUTCDateTimeToLocal(inputDate, null);
  if (!d) return "-";
  const s = d.toISOString?.() ?? d.toString();
  return formatDate(s);
};

export const ExhibitsList: FC<Props> = ({ exhibits, tasks, totalItems, isLoading, investigationGuid }) => {
  const officers = useAppSelector(selectOfficers);
  const { searchValues, setValues, setSort } = useExhibitsSearch();

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

  const getOfficerName = useCallback(
    (officerGuid: string): string => {
      const officer = officers?.find((o) => o.app_user_guid === officerGuid);
      return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
    },
    [officers],
  );

  const getTaskNumber = useCallback(
    (taskGuid: string): number | undefined => {
      return tasks.find((t) => t.taskIdentifier === taskGuid)?.taskNumber;
    },
    [tasks],
  );

  const emptyMessage =
    searchValues.search || searchValues.taskFilter
      ? "No exhibits match your search criteria."
      : "No exhibits have been captured for this investigation.";

  const columns: CompColumn<Exhibit>[] = [
    {
      label: "Exhibit number",
      sortKey: "exhibitNumber",
      headerClassName: "comp-cell-min-width-100",
      cellClassName: "comp-cell-width-100 comp-cell-min-width-100",
      isSortable: true,
      getValue: (exhibit) => exhibit.exhibitNumber ?? 0,
      renderCell: (exhibit) =>
        exhibit.exhibitNumber == null ? "-" : String(exhibit.exhibitNumber).padStart(4, "0"),
    },
    {
      label: "Description",
      sortKey: "description",
      headerClassName: "comp-cell-min-width-200",
      cellClassName: "comp-cell-min-width-200",
      isSortable: true,
      getValue: (exhibit) => (exhibit.description ?? "").toLowerCase(),
      renderCell: (exhibit) => exhibit.description ?? "-",
    },
    {
      label: "Date collected",
      sortKey: "dateCollected",
      headerClassName: "comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (exhibit) => exhibit.dateCollected ?? "",
      renderCell: (exhibit) => formatDateStr(exhibit.dateCollected),
    },
    {
      label: "Officer collected",
      sortKey: "officerCollected",
      headerClassName: "comp-cell-min-width-150",
      cellClassName: "comp-cell-width-150 comp-cell-min-width-150",
      isSortable: true,
      getValue: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? "").toLowerCase(),
      renderCell: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? ""),
    },
    {
      label: "Task",
      sortKey: "taskNumber",
      headerClassName: "comp-cell-min-width-100",
      cellClassName: "comp-cell-width-100 comp-cell-min-width-100",
      isSortable: true,
      getValue: (exhibit) => getTaskNumber(exhibit.taskGuid ?? "") ?? 0,
      renderCell: (exhibit) => {
        const taskNumber = getTaskNumber(exhibit.taskGuid ?? "");
        const taskLabel = taskNumber ? `Task ${taskNumber}` : "-";
        return taskNumber && exhibit.taskGuid ? (
          <Link
            to={`/investigation/${investigationGuid}/task/${exhibit.taskGuid}`}
            className="comp-cell-link"
          >
            {taskLabel}
          </Link>
        ) : (
          <span>{taskLabel}</span>
        );
      },
    },
  ];

  return (
    <CompTable
      data={exhibits}
      tableIdentifier="exhibits-list"
      isFixedHeight={false}
      columns={columns}
      getRowKey={(exhibit) => exhibit.exhibitGuid}
      isLoading={isLoading}
      totalItems={totalItems}
      currentPage={searchValues.page}
      pageSize={searchValues.pageSize}
      defaultSort="exhibitNumber"
      defaultSortDirection={SORT_TYPES.ASC}
      onSort={handleSort}
      onPageChange={handlePageChange}
      emptyMessage={emptyMessage}
    />
  );
};
