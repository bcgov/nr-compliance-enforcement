import { FC, MouseEventHandler, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import MapListToggle from "@components/common/map-list-toggle";
import SearchInput from "@components/common/search-input";
import { useAppSelector } from "@hooks/hooks";
import { useCaseSearch } from "../hooks/use-case-search";
import { selectAgencyDropdown, selectComplaintStatusWithPendingCodeDropdown } from "@store/reducers/code-table";

type Props = {
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
};

export const CaseFilterBar: FC<Props> = ({ toggleShowMobileFilters, toggleShowDesktopFilters }) => {
  const { searchValues, setValues, clearValues } = useCaseSearch();
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const statusOptions = useAppSelector(selectComplaintStatusWithPendingCodeDropdown);

  const removeFilter = useCallback(
    (filterName: string) => {
      if (filterName === "dateRange") {
        clearValues(["startDate", "endDate"]);
      } else {
        clearValues(filterName as keyof typeof searchValues);
      }
    },
    [clearValues],
  );

  const handleViewTypeToggle = (view: "map" | "list") => {
    setValues({ viewType: view });
  };

  const handleSearchChange = (query: string) => {
    setValues({ search: query });
  };

  // Search is handled through the form hook
  const handleSearch = () => {};

  const hasFilter = (filterName: string): boolean => {
    return searchValues[filterName as keyof typeof searchValues] != null;
  };

  const hasDateRange = (): boolean => {
    return searchValues.startDate != null || searchValues.endDate != null;
  };

  const getDateRangeLabel = (): string => {
    const { startDate, endDate } = searchValues;

    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    if (startDate) {
      return `From ${startDate.toLocaleDateString()}`;
    }
    if (endDate) {
      return `Until ${endDate.toLocaleDateString()}`;
    }
    return "Date Range";
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
        <MapListToggle
          onToggle={handleViewTypeToggle}
          activeView={searchValues.viewType}
          className="map-list-toggle"
        />
      </div>

      <div className="filter-pills-container">
        {renderFilterButton("desktop", toggleShowDesktopFilters, "case-filter-btn")}
        {renderFilterButton("mobile", toggleShowMobileFilters)}

        {hasFilter("caseStatus") && (
          <FilterButton
            id="case-status-filter-pill"
            label={statusOptions.find((option) => option.value === searchValues.caseStatus)?.label || "Status"}
            name="caseStatus"
            clear={removeFilter}
          />
        )}

        {hasFilter("leadAgency") && (
          <FilterButton
            id="case-agency-filter-pill"
            label={leadAgencyOptions.find((option) => option.value === searchValues.leadAgency)?.label || "Agency"}
            name="leadAgency"
            clear={removeFilter}
          />
        )}

        {hasDateRange() && (
          <FilterButton
            id="case-date-range-filter-pill"
            label={getDateRangeLabel()}
            name="dateRange"
            clear={removeFilter}
          />
        )}
      </div>
    </div>
  );
};
