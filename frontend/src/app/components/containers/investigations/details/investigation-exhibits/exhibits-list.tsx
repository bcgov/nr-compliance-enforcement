import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { formatDateTimeStr, truncateString } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { Exhibit, Task } from "@/generated/graphql";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";
import { SORT_TYPES } from "@constants/sort-direction";
import { getPropertyTypeLabel } from "@/app/types/app/investigation/exhibits";

type Props = {
  exhibits: Exhibit[];
  tasks: Task[];
  totalItems: number;
  isLoading: boolean;
  investigationGuid: string;
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
      headerClassName: "comp-cell-width-80 comp-cell-min-width-80",
      cellClassName: "comp-cell-width-120 comp-cell-min-width-120 align-middle",
      sortKey: "exhibitNumber",
      isSortable: true,
      getValue: (exhibit) => exhibit.exhibitDisplayNumber ?? "",
      renderCell: (exhibit) => exhibit.exhibitDisplayNumber ?? "-",
    },
    {
      label: "Property type",
      headerClassName: "comp-cell-width-120 comp-cell-min-width-120",
      cellClassName: "comp-cell-width-120 comp-cell-min-width-120 align-middle",
      sortKey: "propertyType",
      isSortable: true,
      getValue: (exhibit) => getPropertyTypeLabel(exhibit.propertyType).toLowerCase(),
      renderCell: (exhibit) => getPropertyTypeLabel(exhibit.propertyType),
    },
    {
      label: "Item description",
      headerClassName: "comp-cell-width-250 comp-cell-min-width-250",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      sortKey: "description",
      isSortable: true,
      getValue: (exhibit) => (exhibit.description ?? "").toLowerCase(),
      renderCell: (exhibit) => truncateString(exhibit.description, 100) ?? "-",
    },
    {
      label: "Quantity",
      headerClassName: "comp-cell-width-80 comp-cell-min-width-80",
      cellClassName: "comp-cell-width-80 comp-cell-min-width-80 align-middle",
      sortKey: "quantity",
      isSortable: true,
      getValue: (exhibit) => exhibit.quantity ?? 0,
      renderCell: (exhibit) => (exhibit.quantity == null ? "-" : String(exhibit.quantity)),
    },
    {
      label: "Officer",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      getValue: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? "").toLowerCase(),
      renderCell: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? ""),
    },
    {
      label: "Date/time of intake",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      sortKey: "dateCollected",
      isSortable: true,
      getValue: (exhibit) => exhibit.dateCollected ?? "",
      renderCell: (exhibit) => formatDateTimeStr(exhibit.dateCollected),
    },
    {
      label: "Location of intake",
      headerClassName: "comp-cell-width-200 comp-cell-min-width-200",
      cellClassName: "comp-cell-width-200 comp-cell-min-width-200 align-middle",
      sortKey: "location",
      isSortable: true,
      getValue: (exhibit) => (exhibit.locationOfIntake ?? "").toLowerCase(),
      renderCell: (exhibit) => truncateString(exhibit.locationOfIntake ?? "", 100) ?? "-",
    },
    {
      label: "Property tag number",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      sortKey: "propertyTag",
      isSortable: true,
      getValue: (exhibit) => (exhibit.propertyTagNumber ?? "").toLowerCase(),
      renderCell: (exhibit) => exhibit.propertyTagNumber ?? "-",
    },
    {
      label: "Task",
      sortKey: "taskNumber",
      headerClassName: "comp-cell-min-width-100",
      cellClassName: "comp-cell-width-100 comp-cell-min-width-100",
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
      isFixedHeight={true}
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
