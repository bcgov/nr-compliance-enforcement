import { FC, MouseEventHandler, useState, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import MapListToggle from "@components/common/map-list-toggle";
import SearchInput from "@components/common/search-input";
import { CaseFilters } from "./case-filter";
import { useCaseSearchForm } from "./hooks/use-case-search-form";

type Props = {
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
  onClearFilter?: (filterName: string) => void;
};

export const CaseFilterBar: FC<Props> = ({ toggleShowMobileFilters, toggleShowDesktopFilters, onClearFilter }) => {
  const { formValues, setFieldValue } = useCaseSearchForm();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const removeFilter = useCallback(
    (filterName: string) => {
      onClearFilter?.(filterName);
      setActiveFilters((prev) => prev.filter((f) => f !== filterName));
    },
    [onClearFilter],
  );

  const handleViewTypeToggle = (view: "map" | "list") => {
    setFieldValue("viewType", view);
  };

  const handleSearchChange = (query: string) => {
    setFieldValue("searchQuery", query);
  };

  // Search is handled through the form hook
  const handleSearch = () => {}};

  const hasFilter = (filterName: keyof CaseFilters): boolean => {
    return formValues[filterName] != null;
  };

  const hasDateRange = (): boolean => {
    return formValues.startDate != null || formValues.endDate != null;
  };

  const getDateRangeLabel = (): string => {
    const { startDate, endDate } = formValues;

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
          viewType={formValues.viewType}
          complaintType="CASE" // Using a generic type for cases
          searchQuery={formValues.searchQuery}
          applySearchQuery={handleSearchChange}
          handleSearch={handleSearch}
        />
        <MapListToggle
          onToggle={handleViewTypeToggle}
          activeView={formValues.viewType}
          className="map-list-toggle"
        />
      </div>

      <div className="filter-pills-container">
        {renderFilterButton("desktop", toggleShowDesktopFilters, "case-filter-btn")}
        {renderFilterButton("mobile", toggleShowMobileFilters)}

        {hasFilter("status") && (
          <FilterButton
            id="case-status-filter-pill"
            label={formValues.status?.label || "Status"}
            name="status"
            clear={removeFilter}
          />
        )}

        {hasFilter("leadAgency") && (
          <FilterButton
            id="case-agency-filter-pill"
            label={formValues.leadAgency?.label || "Agency"}
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
