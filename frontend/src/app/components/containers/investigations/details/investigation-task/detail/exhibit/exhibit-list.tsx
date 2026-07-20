import { FC, useCallback } from "react";
import { CompTable } from "@components/common/comp-table";
import { editColumn } from "@components/common/comp-table-edit-column";
import { CompColumn } from "@/app/types/app/comp-tables";
import { SORT_TYPES } from "@constants/sort-direction";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { Exhibit } from "@/generated/graphql";
import { formatDateTimeStr, truncateString } from "@/app/common/methods";
import { getPropertyTypeLabel } from "@/app/types/app/investigation/exhibits";

type TaskExhibitListProps = {
  exhibits: Exhibit[];
  isLoading?: boolean;
  isReadOnly?: boolean;
  onEdit: (exhibit: Exhibit) => void;
};

export const TaskExhibitList: FC<TaskExhibitListProps> = ({
  exhibits,
  isLoading = false,
  isReadOnly = false,
  onEdit,
}) => {
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
      label: "Exhibit number",
      headerClassName: "comp-cell-width-80 comp-cell-min-width-80",
      cellClassName: "comp-cell-width-80 comp-cell-min-width-80 align-middle",
      isSortable: true,
      getValue: (exhibit) => exhibit.exhibitDisplayNumber ?? "",
      renderCell: (exhibit) => exhibit.exhibitDisplayNumber ?? "-",
    },
    {
      label: "Property type",
      headerClassName: "comp-cell-width-120 comp-cell-min-width-120",
      cellClassName: "comp-cell-width-120 comp-cell-min-width-120 align-middle",
      isSortable: true,
      getValue: (exhibit) => getPropertyTypeLabel(exhibit.propertyType).toLowerCase(),
      renderCell: (exhibit) => getPropertyTypeLabel(exhibit.propertyType),
    },
    {
      label: "Item description",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: true,
      getValue: (exhibit) => (exhibit.description ?? "").toLowerCase(),
      renderCell: (exhibit) => truncateString(exhibit.description, 100) ?? "-",
    },
    {
      label: "Quantity",
      headerClassName: "comp-cell-width-80 comp-cell-min-width-80",
      cellClassName: "comp-cell-width-80 comp-cell-min-width-80 align-middle",
      isSortable: true,
      getValue: (exhibit) => exhibit.quantity ?? 0,
      renderCell: (exhibit) => (exhibit.quantity == null ? "-" : String(exhibit.quantity)),
    },
    {
      label: "Officer",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: true,
      getValue: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? "").toLowerCase(),
      renderCell: (exhibit) => getOfficerName(exhibit.collectedAppUserGuidRef ?? ""),
    },
    {
      label: "Date/time of intake",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: true,
      getValue: (exhibit) => exhibit.dateCollected ?? "",
      renderCell: (exhibit) => formatDateTimeStr(exhibit.dateCollected),
    },
    {
      label: "Location of intake",
      headerClassName: "comp-cell-width-200 comp-cell-min-width-200",
      cellClassName: "comp-cell-width-200 comp-cell-min-width-200 align-middle",
      isSortable: true,
      getValue: (exhibit) => (exhibit.locationOfIntake ?? "").toLowerCase(),
      renderCell: (exhibit) => truncateString(exhibit.locationOfIntake ?? "", 100) ?? "-",
    },
    {
      label: "Property tag number",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 align-middle",
      isSortable: true,
      getValue: (exhibit) => (exhibit.propertyTagNumber ?? "").toLowerCase(),
      renderCell: (exhibit) => exhibit.propertyTagNumber ?? "-",
    },
    editColumn({
      title: "Edit exhibit",
      getAriaLabel: (exhibit) => `Edit exhibit ${exhibit.exhibitDisplayNumber}`,
      onEdit,
      isReadOnly,
    }),
  ];

  return (
    <CompTable
      data={exhibits}
      tableIdentifier="exhibit-list"
      isFixedHeight={false}
      columns={columns}
      getRowKey={(exhibit) => exhibit.exhibitGuid}
      isLoading={isLoading}
      defaultSort="Exhibit number"
      defaultSortDirection={SORT_TYPES.ASC}
      emptyMessage="No exhibits found."
      itemLabel="exhibits"
    />
  );
};
