import { FC, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { CaseFile, Investigation } from "@/generated/graphql";
import { applyStatusClass, formatDateTime } from "@common/methods";
import { selectAgencyDropdown } from "@/app/store/reducers/code-table";
import { useAppSelector } from "@/app/hooks/hooks";
import { useInvestigationSearch } from "../hooks/use-investigation-search";
import { SORT_TYPES } from "@constants/sort-direction";
import Option from "@apptypes/app/option";

type Props = {
  investigations: Investigation[];
  cases?: Map<string, CaseFile[]>;
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const InvestigationList: FC<Props> = ({
  investigations,
  totalItems = 0,
  isLoading = false,
  error = null,
  cases = new Map(),
}) => {
  const { searchValues, setValues, setSort } = useInvestigationSearch();
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);

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
      label: "Case ID",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-110 comp-cell-min-width-110 text-center",
      isSortable: false,
      getValue: () => "",
      renderCell: (investigation) =>
        (cases.get(investigation.investigationGuid) ?? []).map((caseFile: CaseFile) => (
          <Link
            to={`/case/${caseFile.caseIdentifier}`}
            className="comp-cell-link"
            key={caseFile.caseIdentifier}
          >
            {caseFile.name || caseFile.caseIdentifier}
          </Link>
        )),
    },
    {
      label: "Date Opened",
      sortKey: "openedTimestamp",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell",
      isSortable: true,
      getValue: (investigation) => investigation.openedTimestamp ?? "",
      renderCell: (investigation) => formatDateTime(investigation.openedTimestamp),
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
      label: "Agency",
      sortKey: "leadAgency",
      headerClassName: "",
      cellClassName: "",
      isSortable: true,
      getValue: (investigation) => {
        const agency = leadAgencyOptions.find((o: Option) => o.value === investigation.leadAgency);
        return agency?.label ?? "";
      },
      renderCell: (investigation) => {
        const agency = leadAgencyOptions.find((o: Option) => o.value === investigation.leadAgency);
        return agency?.label ?? "-";
      },
    },
    {
      label: "Actions",
      headerClassName:
        "sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col case-table-actions-cell",
      cellClassName:
        "comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col case-table-actions-cell",
      isSortable: false,
      getValue: () => "",
      renderCell: (investigation) => (
        <Dropdown
          id={`investigation-action-button-${investigation.investigationGuid}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`investigation-action-toggle-${investigation.investigationGuid}`}
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
              to={`/investigation/${investigation.investigationGuid}`}
              id={`view-investigation-${investigation.investigationGuid}`}
            >
              <i className="bi bi-eye" /> View investigation
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to={`/investigation/${investigation.investigationGuid}/edit`}
              id={`edit-investigation-${investigation.investigationGuid}`}
            >
              <i className="bi bi-pencil" /> Edit investigation
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
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
    />
  );
};
