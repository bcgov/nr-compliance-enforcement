import { FC, useCallback, useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { usePartySearch } from "../hooks/use-party-search";
import { SORT_TYPES } from "@constants/sort-direction";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { format, parseISO } from "date-fns";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";

type Props = {
  parties: any[];
  partyTypeCode: string;
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

const getPrimaryPhone = (contactMethods: any[] | undefined): string => {
  if (!contactMethods?.length) {
    return "-";
  }
  const primary = contactMethods.find((cm) => cm.typeCode === ContactMethods.PHONE && cm.isPrimary);
  return primary?.value ?? "-";
};

const formatDateOfBirth = (dateOfBirth: string | null | undefined): string => {
  if (!dateOfBirth) {
    return "-";
  }
  return format(parseISO(dateOfBirth), "yyyy-MM-dd");
};

const getBusinessNumber = (identifiers: any[] | undefined): string => {
  if (!identifiers?.length) {
    return "-";
  }
  const businessNumber = identifiers.find((id) => id.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER);
  return businessNumber?.identifierValue ?? "-";
};

const partyIdentifierColumn: CompColumn<any> = {
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
};

const actionsColumn: CompColumn<any> = {
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
};

const businessColumns: CompColumn<any>[] = [
  partyIdentifierColumn,
  {
    label: "Business name",
    sortKey: "name",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: true,
    getValue: (party) => party.business?.name ?? "",
    renderCell: (party) => party.business?.name ?? "-",
  },
  {
    label: "Business number",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: false,
    getValue: (party) => getBusinessNumber(party.business?.identifiers),
    renderCell: (party) => getBusinessNumber(party.business?.identifiers),
  },
  {
    label: "Phone number",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: false,
    getValue: (party) => getPrimaryPhone(party.business?.contactMethods),
    renderCell: (party) => getPrimaryPhone(party.business?.contactMethods),
  },
  actionsColumn,
];

const personColumns: CompColumn<any>[] = [
  partyIdentifierColumn,
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
    label: "Date of birth",
    sortKey: "dateOfBirth",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: true,
    getValue: (party) => party.person?.dateOfBirth ?? "",
    renderCell: (party) => formatDateOfBirth(party.person?.dateOfBirth),
  },
  {
    label: "Phone number",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: false,
    getValue: (party) => getPrimaryPhone(party.person?.contactMethods),
    renderCell: (party) => getPrimaryPhone(party.person?.contactMethods),
  },
  actionsColumn,
];

export const PartyList: FC<Props> = ({ parties, partyTypeCode, totalItems = 0, isLoading = false, error = null }) => {
  const { searchValues, setValues, setSort } = usePartySearch();

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

  const columns = useMemo(
    () => (partyTypeCode === PartyTypeCodes.BUSINESS ? businessColumns : personColumns),
    [partyTypeCode],
  );

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
