import { FC, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { CaseFile, Inspection } from "@/generated/graphql";
import { applyStatusClass, formatDateTime } from "@common/methods";
import { selectAgencyDropdown } from "@/app/store/reducers/code-table";
import { useAppSelector } from "@/app/hooks/hooks";
import { useInspectionSearch } from "../hooks/use-inspection-search";
import { SORT_TYPES } from "@constants/sort-direction";
import Option from "@apptypes/app/option";

type Props = {
  inspections: Inspection[];
  cases?: Map<string, CaseFile[]>;
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const InspectionList: FC<Props> = ({
  inspections,
  totalItems = 0,
  isLoading = false,
  error = null,
  cases = new Map(),
}) => {
  const { searchValues, setValues, setSort } = useInspectionSearch();
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

  const columns: CompColumn<Inspection>[] = [
    {
      label: "Inspection ID",
      sortKey: "name",
      headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
      cellClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center",
      isSortable: true,
      getValue: (inspection) => inspection.name ?? inspection.inspectionGuid ?? "",
      renderCell: (inspection) => (
        <Link
          to={`/inspection/${inspection.inspectionGuid}`}
          className="comp-cell-link"
        >
          {inspection.name || inspection.inspectionGuid}
        </Link>
      ),
    },
    {
      label: "Case ID",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-110 comp-cell-min-width-110 text-center",
      isSortable: false,
      renderCell: (inspection) =>
        (cases.get(inspection.inspectionGuid) ?? []).map((caseFile: CaseFile) => (
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
      getValue: (inspection) => inspection.openedTimestamp ?? "",
      renderCell: (inspection) => formatDateTime(inspection.openedTimestamp),
    },
    {
      label: "Status",
      sortKey: "inspectionStatus",
      headerClassName: "comp-cell-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (inspection) => inspection.inspectionStatus?.inspectionStatusCode ?? "",
      renderCell: (inspection) =>
        inspection.inspectionStatus?.inspectionStatusCode ? (
          <span className={`badge ${applyStatusClass(inspection.inspectionStatus.inspectionStatusCode)}`}>
            {inspection.inspectionStatus.shortDescription}
          </span>
        ) : null,
    },
    {
      label: "Agency",
      sortKey: "leadAgency",
      headerClassName: "",
      cellClassName: "",
      isSortable: true,
      getValue: (inspection) => {
        const agency = leadAgencyOptions.find((o: Option) => o.value === inspection.leadAgency);
        return agency?.label ?? "";
      },
      renderCell: (inspection) => {
        const agency = leadAgencyOptions.find((o: Option) => o.value === inspection.leadAgency);
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
      renderCell: (inspection) => (
        <Dropdown
          id={`inspection-action-button-${inspection.inspectionGuid}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`inspection-action-toggle-${inspection.inspectionGuid}`}
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
              to={`/inspection/${inspection.inspectionGuid}`}
              id={`view-inspection-${inspection.inspectionGuid}`}
            >
              <i className="bi bi-eye" /> View inspection
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to={`/inspection/${inspection.inspectionGuid}/edit`}
              id={`edit-inspection-${inspection.inspectionGuid}`}
            >
              <i className="bi bi-pencil" /> Edit inspection
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <CompTable
      data={inspections}
      tableIdentifier="inspection-list"
      isFixedHeight={true}
      columns={columns}
      getRowKey={(inspection) => inspection.inspectionGuid ?? ""}
      isLoading={isLoading}
      error={error}
      totalItems={totalItems}
      currentPage={searchValues.page}
      pageSize={searchValues.pageSize}
      defaultSortLabel="Inspection ID"
      defaultSortDirection={SORT_TYPES.ASC}
      onSort={handleSort}
      onPageChange={handlePageChange}
    />
  );
};
