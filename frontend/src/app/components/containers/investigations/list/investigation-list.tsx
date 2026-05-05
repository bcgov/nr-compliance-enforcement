import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { Investigation } from "@/generated/graphql";
import { applyStatusClass, formatDate } from "@common/methods";
import { selectCommunityCodeDropdown } from "@/app/store/reducers/code-table";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useAppSelector } from "@/app/hooks/hooks";
import { useInvestigationSearch } from "../hooks/use-investigation-search";
import { SORT_TYPES } from "@constants/sort-direction";
import Option from "@apptypes/app/option";

type Props = {
  investigations: Investigation[];
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const InvestigationList: FC<Props> = ({ investigations, totalItems = 0, isLoading = false, error = null }) => {
  const { searchValues, setValues, setSort } = useInvestigationSearch();
  const communityOptions = useAppSelector(selectCommunityCodeDropdown);
  const officers = useAppSelector(selectOfficers) ?? [];

  const officerByGuid = useCallback(
    (guid: string | null | undefined) => officers.find((o: AppUser) => o.app_user_guid === guid),
    [officers],
  );

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

  const columns: CompColumn<Investigation>[] = [
    {
      label: "Investigation ID",
      sortKey: "name",
      headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
      cellClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center",
      isSortable: true,
      getValue: (investigation) => investigation.name ?? investigation.investigationGuid ?? "",
      renderCell: (investigation) => (
        <Link
          to={`/investigation/${investigation.investigationGuid}`}
          className="comp-cell-link"
        >
          {investigation.name || investigation.investigationGuid}
        </Link>
      ),
    },
    {
      label: "Date Opened",
      sortKey: "openedTimestamp",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell",
      isSortable: true,
      getValue: (investigation) => investigation.openedTimestamp ?? "",
      renderCell: (investigation) => formatDate(investigation.openedTimestamp),
    },
    {
      label: "Community",
      sortKey: "community",
      headerClassName: "",
      cellClassName: "",
      isSortable: true,
      getValue: (investigation) => {
        const community = communityOptions.find((o: Option) => o.value === investigation.community);
        return community?.label ?? "";
      },
      renderCell: (investigation) => {
        const community = communityOptions.find((o: Option) => o.value === investigation.community);
        return community?.label ?? "-";
      },
    },
    {
      label: "Location/address",
      sortKey: "locationAddress",
      headerClassName: "",
      cellClassName: "",
      isSortable: true,
      getValue: (investigation) => investigation.locationAddress ?? "",
      renderCell: (investigation) => investigation.locationAddress || "-",
    },
    {
      label: "Status",
      sortKey: "investigationStatus",
      headerClassName: "comp-cell-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (investigation) => investigation.investigationStatus?.investigationStatusCode ?? "",
      renderCell: (investigation) =>
        investigation.investigationStatus?.investigationStatusCode ? (
          <span className={`badge ${applyStatusClass(investigation.investigationStatus.investigationStatusCode)}`}>
            {investigation.investigationStatus.shortDescription}
          </span>
        ) : null,
    },
    {
      label: "Primary investigator",
      headerClassName: "",
      cellClassName: "",
      isSortable: false,
      getValue: () => "",
      renderCell: (investigation) => {
        const officer = officerByGuid(investigation.primaryInvestigatorGuid);
        return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
      },
    },
    {
      label: "File coordinator",
      headerClassName: "",
      cellClassName: "",
      isSortable: false,
      getValue: () => "",
      renderCell: (investigation) => {
        const officer = officerByGuid(investigation.fileCoordinatorGuid);
        return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
      },
    },
    {
      label: "Last updated",
      sortKey: "updatedTimestamp",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell",
      isSortable: true,
      getValue: (investigation) => investigation.updatedTimestamp ?? "",
      renderCell: (investigation) => formatDate(investigation.updatedTimestamp) || "-",
    },
  ];

  return (
    <CompTable
      data={investigations}
      tableIdentifier="investigation-list"
      isFixedHeight={true}
      columns={columns}
      getRowKey={(investigation) => investigation.investigationGuid ?? ""}
      isLoading={isLoading}
      error={error}
      totalItems={totalItems}
      currentPage={searchValues.page}
      pageSize={searchValues.pageSize}
      defaultSort="openedTimestamp"
      defaultSortDirection={SORT_TYPES.DESC}
      onSort={handleSort}
      onPageChange={handlePageChange}
      renderExpandedContent={(investigation) => (
        <dl className="hwc-table-dl">
          <div>
            <dt>Investigation description</dt>
            <dd>{investigation.description || "No description provided"}</dd>
          </div>
        </dl>
      )}
    />
  );
};
