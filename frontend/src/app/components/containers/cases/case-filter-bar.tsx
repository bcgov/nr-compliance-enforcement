import { FC, MouseEventHandler, useState, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import MapListToggle from "@components/common/map-list-toggle";
import SearchInput from "@components/common/search-input";
import { CaseFilters } from "./case-filter";
import { CaseSearchFormData } from "./hooks/use-case-search-form";

type Props = {
  formValues: CaseSearchFormData;
  form: any; // Tanstack form instance
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
  onClearFilter?: (filterName: string) => void;
};

export const CaseFilterBar: FC<Props> = ({
  formValues,
  form,
  toggleShowMobileFilters,
  toggleShowDesktopFilters,
  onClearFilter,
}) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const removeFilter = useCallback(
    (filterName: string) => {
      onClearFilter?.(filterName);
      setActiveFilters((prev) => prev.filter((f) => f !== filterName));
    },
    [onClearFilter],
  );

  const handleViewTypeToggle = (view: "map" | "list") => {
    form.setFieldValue("viewType", view);
  };

  const handleSearchChange = (query: string) => {
    form.setFieldValue("searchQuery", query);
  };

  const hasFilter = (filterName: keyof CaseFilters): boolean => {
    return formValues[filterName] != null;
  };

  const hasDateRange = (): boolean => {
    return formValues.startDate != null || formValues.endDate != null;
  };

  const getDateRangeLabel = (): string => {
    if (formValues.startDate && formValues.endDate) {
      return `${formValues.startDate.toLocaleDateString()} - ${formValues.endDate.toLocaleDateString()}`;
    } else if (formValues.startDate) {
      return `From ${formValues.startDate.toLocaleDateString()}`;
    } else if (formValues.endDate) {
      return `Until ${formValues.endDate.toLocaleDateString()}`;
    }
    return "Date Range";
  };

  return (
    <div className="comp-filter-bar">
      <div className="search-bar">
        <SearchInput
          viewType={formValues.viewType}
          complaintType="CASE" // Using a generic type for cases
          searchQuery={formValues.searchQuery}
          applySearchQuery={handleSearchChange}
        />
        <MapListToggle
          onToggle={handleViewTypeToggle}
          activeView={formValues.viewType}
          className="map-list-toggle"
        />
      </div>

      <div className="filter-pills-container">
        <Button
          variant="outline-primary"
          size="sm"
          className="icon-start filter-btn filter-btn-desktop"
          id="case-filter-btn"
          onClick={toggleShowDesktopFilters}
        >
          <i className="bi bi-filter"></i>
          <span>Filters</span>
        </Button>

        <Button
          variant="outline-primary"
          size="sm"
          className="icon-start filter-btn filter-btn-mobile"
          onClick={toggleShowMobileFilters}
        >
          <i className="bi bi-filter"></i>
          <span>Filters</span>
        </Button>

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
