import { FC, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { usePartySearch } from "../hooks/use-party-search";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { SORT_TYPES } from "@constants/sort-direction";

type Props = {
  parties: any[];
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

export const PartyList: FC<Props> = ({ parties, totalItems = 0, isLoading = false, error = null }) => {
  const { searchValues, setValues, setSort } = usePartySearch();
  const partyTypes = useAppSelector(selectPartyTypeDropdown);

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
      label: "Party #",
      sortKey: "partyIdentifier",
      headerClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left",
      cellClassName: "comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center",
      isSortable: true,
      getValue: (party) => party.partyIdentifier ?? "",
      renderCell: (party) => (
        <Link
          to={`/party/${party.partyIdentifier}`}
          className="comp-cell-link"
        >
          {party.partyIdentifier}
        </Link>
      ),
    },
    {
      label: "Party Type",
      sortKey: "partyType",
      headerClassName: "comp-cell-min-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (party) => partyTypes.find((item) => item.value === party.partyTypeCode)?.label ?? "",
      renderCell: (party) => partyTypes.find((item) => item.value === party.partyTypeCode)?.label ?? "-",
    },
    {
      label: "First name",
      sortKey: "firstName",
      headerClassName: "comp-cell-min-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (party) => party.person?.firstName ?? "",
      renderCell: (party) => party.person?.firstName ?? "-",
    },
    {
      label: "Last name",
      sortKey: "lastName",
      headerClassName: "comp-cell-min-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (party) => party.person?.lastName ?? "",
      renderCell: (party) => party.person?.lastName ?? "-",
    },
    {
      label: "Business name",
      sortKey: "name",
      headerClassName: "comp-cell-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (party) => party.business?.name ?? "",
      renderCell: (party) => party.business?.name ?? "-",
    },
    {
      label: "Actions",
      headerClassName: "sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col",
      cellClassName: "comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col",
      isSortable: false,
      renderCell: (party) => (
        <Dropdown
          id={`party-action-button-${party.partyIdentifier}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`party-action-toggle-${party.partyIdentifier}`}
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
              to={`/party/${party.partyIdentifier}`}
              id={`view-party-${party.partyIdentifier}`}
            >
              <i className="bi bi-eye" /> View Party
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to={`/party/${party.partyIdentifier}/edit`}
              id={`edit-party-${party.partyIdentifier}`}
            >
              <i className="bi bi-pencil" /> Edit Party
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <CompTable
      data={parties}
      isFixedHeight={true}
      tableIdentifier="party-list"
      columns={columns}
      getRowKey={(party) => party.partyIdentifier}
      isLoading={isLoading}
      error={error}
      totalItems={totalItems}
      currentPage={searchValues.page}
      pageSize={searchValues.pageSize}
      defaultSort="partyIdentifier"
      defaultSortDirection={SORT_TYPES.DESC}
      onSort={handleSort}
      onPageChange={handlePageChange}
    />
  );
};
