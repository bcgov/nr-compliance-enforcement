import { FC, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { usePartySearch } from "../hooks/use-party-search";
import { SORT_TYPES } from "@constants/sort-direction";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { calculateAgeYears } from "@common/methods";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { Address, BusinessIdentifier, ContactMethod } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { CountrySubdivisionType } from "@/app/types/app/code-tables/country-subdivision";
import { GenderType } from "@/app/types/app/code-tables/gender";

type Props = {
  parties: any[];
  partyTypeCode: string;
  totalItems?: number;
  isLoading?: boolean;
  error?: Error | null;
};

const getPrimaryPhone = (contactMethods: ContactMethod[]): string => {
  if (!contactMethods?.length) {
    return "-";
  }
  const primary = contactMethods.find((cm) => cm.typeCode === ContactMethods.PHONE && cm.isPrimary);
  if (!primary?.value) {
    return "-";
  }
  return formatPhoneNumber(primary.value) ?? primary.value;
};

const getPrimaryAddress = (addresses: Address[], countrySubdivisions: CountrySubdivisionType[]): string => {
  if (!addresses?.length) {
    return "-";
  }
  const primary = addresses.find((a) => a.isPrimary);
  if (!primary?.address && !primary?.city && !primary?.province) {
    return "-";
  }

  const province =
    countrySubdivisions.find((s) => s.countrySubdivisionCode === primary?.province)?.shortDescription ??
    primary?.province;

  return [primary?.address, primary?.city, province].filter(Boolean).join(", ");
};

const getBusinessNumber = (identifiers: BusinessIdentifier[]): string => {
  if (!identifiers?.length) {
    return "-";
  }
  const businessNumber = identifiers.find((id) => id.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER);
  return businessNumber?.identifierValue ?? "-";
};

const getPartyDisplayName = (party: any): string => {
  if (party.partyTypeCode === PartyTypeCodes.BUSINESS) {
    return party.business?.name ?? "";
  }

  const lastName = party.person?.lastName ?? "";
  const firstName = party.person?.firstName ?? "";

  return [lastName, firstName].filter(Boolean).join(", ");
};

const getAgeDisplay = (party: any): number | string => {
  const dateOfBirth = party.person?.dateOfBirth;
  if (!dateOfBirth) {
    return "-";
  }
  return calculateAgeYears(new Date(dateOfBirth)) ?? "-";
};

const partyNameColumn: CompColumn<any> = {
  label: "Party name",
  sortKey: "partyName",
  headerClassName: "comp-cell-width-140 comp-cell-min-width-140 sticky-col sticky-col--left",
  cellClassName: "comp-cell-width-140 comp-cell-min-width-140 sticky-col sticky-col--left text-center",
  isSortable: true,
  getValue: (party) => getPartyDisplayName(party),
  renderCell: (party) => (
    <Link
      to={`/party/${party.partyIdentifier}`}
      className="comp-cell-link"
    >
      {getPartyDisplayName(party)}
    </Link>
  ),
};

const getBusinessColumns = (countrySubdivisions: CountrySubdivisionType[]): CompColumn<any>[] => [
  partyNameColumn,
  {
    label: "Business number",
    sortKey: "businessNumber",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: true,
    getValue: (party) => getBusinessNumber(party.business?.identifiers),
    renderCell: (party) => getBusinessNumber(party.business?.identifiers),
  },
  {
    label: "Primary phone",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: false,
    getValue: (party) => getPrimaryPhone(party.contactMethods),
    renderCell: (party) => getPrimaryPhone(party.contactMethods),
  },
  {
    label: "Primary address",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: false,
    getValue: (party) => getPrimaryAddress(party.addresses, countrySubdivisions),
    renderCell: (party) => getPrimaryAddress(party.addresses, countrySubdivisions),
  },
];

const getPersonColumns = (countrySubdivisions: CountrySubdivisionType[], genders: GenderType[]): CompColumn<any>[] => [
  partyNameColumn,
  {
    label: "Age",
    sortKey: "age",
    headerClassName: "comp-cell-min-width-60",
    cellClassName: "comp-cell-width-60",
    isSortable: false,
    getValue: (party) => getAgeDisplay(party),
    renderCell: (party) => getAgeDisplay(party),
  },
  {
    label: "Gender",
    sortKey: "gender",
    headerClassName: "comp-cell-min-width-110",
    cellClassName: "comp-cell-width-110",
    isSortable: false,
    getValue: (party) => genders.find((g) => g.genderCode === party.person?.genderCode)?.shortDescription ?? "",
    renderCell: (party) => genders.find((g) => g.genderCode === party.person?.genderCode)?.shortDescription ?? "",
  },
  {
    label: "Primary phone",
    headerClassName: "comp-cell-min-width-80",
    cellClassName: "comp-cell-width-80",
    isSortable: false,
    getValue: (party) => getPrimaryPhone(party.contactMethods),
    renderCell: (party) => getPrimaryPhone(party.contactMethods),
  },
  {
    label: "Primary address",
    headerClassName: "comp-cell-min-width-170",
    cellClassName: "comp-cell-width-170",
    isSortable: false,
    getValue: (party) => getPrimaryAddress(party.addresses, countrySubdivisions),
    renderCell: (party) => getPrimaryAddress(party.addresses, countrySubdivisions),
  },
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

  const countrySubdivisions = useAppSelector((state) => state.codeTables["country-subdivision-type"]);
  const genders = useAppSelector((state) => state.codeTables["gender-type"]);

  const columns = useMemo(
    () =>
      partyTypeCode === PartyTypeCodes.BUSINESS
        ? getBusinessColumns(countrySubdivisions)
        : getPersonColumns(countrySubdivisions, genders),
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
