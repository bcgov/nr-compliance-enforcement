import { FC, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { applyStatusClass, formatDateTime } from "@common/methods";
import { useCaseSearch } from "../hooks/use-case-search";
import { SORT_TYPES } from "@constants/sort-direction";
import { isFeatureActive } from "@/app/store/reducers/app";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { useAppSelector } from "@/app/hooks/hooks";
import { CaseFile } from "@/generated/graphql";

type Props = {
  cases: any[];
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const CaseList: FC<Props> = ({ cases, totalItems = 0, isLoading = false, error = null }) => {
  const { searchValues, setValues, setSort } = useCaseSearch();
  const showLegacyColumns = useAppSelector(isFeatureActive(FEATURE_TYPES.LEGACY_CASE_VIEW));

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

  const columns: CompColumn<any>[] = [
    {
      label: "Case ID",
      sortKey: "name",
      headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
      cellClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center",
      isSortable: true,
      getValue: (caseFile) => caseFile.name ?? caseFile.caseIdentifier,
      renderCell: (caseFile) => (
        <Link
          to={`/case/${caseFile.caseIdentifier}`}
          className="comp-cell-link"
        >
          {caseFile.name || caseFile.caseIdentifier}
        </Link>
      ),
    },
    {
      label: "Date Opened",
      sortKey: "openedTimestamp",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell",
      isSortable: true,
      getValue: (caseFile) => caseFile.openedTimestamp ?? "",
      renderCell: (caseFile) => formatDateTime(caseFile.openedTimestamp),
    },
    {
      label: "Status",
      sortKey: "caseStatus",
      headerClassName: "comp-cell-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (caseFile) => caseFile.caseStatus?.caseStatusCode ?? "",
      renderCell: (caseFile) =>
        caseFile.caseStatus ? (
          <span className={`badge ${applyStatusClass(caseFile.caseStatus.caseStatusCode)}`}>
            {caseFile.caseStatus.shortDescription}
          </span>
        ) : null,
    },
    ...(showLegacyColumns
      ? [
          {
            label: "Agency",
            sortKey: "leadAgency",
            isSortable: true,
            getValue: (caseFile: CaseFile) => caseFile.leadAgency?.longDescription ?? "",
            renderCell: (caseFile: CaseFile) => caseFile.leadAgency?.longDescription ?? "—",
          },
        ]
      : []),
    ...(showLegacyColumns
      ? [
          {
            label: "Actions",
            headerClassName:
              "sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col case-table-actions-cell",
            cellClassName:
              "comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col case-table-actions-cell",
            isSortable: false,
            renderCell: (caseFile: CaseFile) => (
              <Dropdown
                id={`case-action-button-${caseFile.caseIdentifier}`}
                drop="start"
                className="comp-action-dropdown"
              >
                <Dropdown.Toggle
                  id={`case-action-toggle-${caseFile.caseIdentifier}`}
                  size="sm"
                  variant="outline-primary"
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu
                  popperConfig={{
                    modifiers: [{ name: "offset", options: { offset: [0, 13], placement: "start" } }],
                  }}
                >
                  <Dropdown.Item
                    as={Link}
                    to={`/case/${caseFile.caseIdentifier}`}
                    id={`view-case-${caseFile.caseIdentifier}`}
                  >
                    <i className="bi bi-eye" /> View Case
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to={`/case/${caseFile.caseIdentifier}/edit`}
                    id={`edit-case-${caseFile.caseIdentifier}`}
                  >
                    <i className="bi bi-pencil" /> Edit Case
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ),
          },
        ]
      : []),
  ];

  return (
    <CompTable
      data={cases}
      tableIdentifier="case-list"
      isFixedHeight={true}
      columns={columns}
      getRowKey={(caseFile) => caseFile.caseIdentifier}
      isLoading={isLoading}
      error={error}
      totalItems={totalItems}
      currentPage={searchValues.page}
      pageSize={searchValues.pageSize}
      defaultSort="openedTimestamp"
      defaultSortDirection={SORT_TYPES.DESC}
      onSort={handleSort}
      onPageChange={handlePageChange}
    />
  );
};
