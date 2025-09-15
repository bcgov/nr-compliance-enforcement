import { FC, MouseEventHandler, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import SearchInput from "@components/common/search-input";
import { useAppSelector } from "@hooks/hooks";
import { usePartySearch } from "../hooks/use-party-search";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";

type Props = {
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
};

export const PartyFilterBar: FC<Props> = ({ toggleShowMobileFilters, toggleShowDesktopFilters }) => {
  const { searchValues, setValues, clearValues } = usePartySearch();
  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  const removeFilter = useCallback(
    (filterName: string) => {
      clearValues(filterName as keyof typeof searchValues);
    },
    [clearValues],
  );

  const handleSearchChange = (query: string) => {
    setValues({ search: query });
  };

  // Search is handled through the form hook
  const handleSearch = () => {};

  const hasFilter = (filterName: string): boolean => {
    return searchValues[filterName as keyof typeof searchValues] != null;
  };

  const renderFilterButton = (variant: "desktop" | "mobile", onClick: MouseEventHandler, id?: string) => (
    <Button
      variant="outline-primary"
      size="sm"
      className={`icon-start filter-btn filter-btn-${variant}`}
      id={id}
      onClick={onClick}
    >
      <i className="bi bi-filter"></i>
      <span>Filters</span>
    </Button>
  );

  return (
    <div className="comp-filter-bar">
      <div className="search-bar">
        <SearchInput
          viewType={searchValues.viewType}
          searchQuery={searchValues.search}
          applySearchQuery={handleSearchChange}
          handleSearch={handleSearch}
        />
      </div>

      <div className="filter-pills-container">
        {renderFilterButton("desktop", toggleShowDesktopFilters, "case-filter-btn")}
        {renderFilterButton("mobile", toggleShowMobileFilters)}

        {hasFilter("partyTypeCode") && (
          <FilterButton
            id="party-type-filter-pill"
            label={partyTypes.find((item) => item.value === searchValues.partyTypeCode)?.label ?? ""}
            name="partyTypeCode"
            clear={removeFilter}
          />
        )}
      </div>
    </div>
  );
};
