import { FC, useContext, useCallback } from "react";
import { FilterButton } from "../../common/filter-button";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { clearFilter } from "../../../store/reducers/complaint-filters";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters/complaint-filters";
import MapListToggle from "../../common/map-list-toggle";
import SearchInput from "../../common/search-input";

type Props = {
  toggleViewType: (view: "map" | "list") => void;
  viewType: "map" | "list";
};

export const ComplaintFilterBar: FC<Props> = ({ viewType, toggleViewType }) => {
  const { state, dispatch } = useContext(ComplaintFilterContext);

  const {
    region,
    zone,
    community,
    officer,
    startDate,
    endDate,
    status,
    species,
    natureOfComplaint,
    violationType,
  } = state;

  const dateRangeLabel = (): string | undefined => {
    if (startDate !== null && endDate !== null) {
      return `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`;
    } else if (startDate !== null) {
      return `${startDate?.toLocaleDateString()} - `;
    } else if (endDate !== null) {
      return ` - ${endDate?.toLocaleDateString()}`;
    } else {
      return undefined;
    }
  };

  const hasDate = () => {
    if (
      (startDate === undefined || startDate === null) &&
      (endDate === undefined || endDate === null)
    ) {
      return false;
    }

    return true;
  };

  const hasFilter = (filter: string) => {
    const selected = state[filter as keyof ComplaintFilters];
    return !!selected;
  };

  const removeFilter = useCallback(
    (name: string) => {
      switch (name) {
        case "dateRange":
          dispatch(clearFilter("startDate"));
          dispatch(clearFilter("endDate"));
          break;
        default:
          dispatch(clearFilter(name));
          break;
      }
    },
    [state],
  );

  return (
    <div className="fixed-filter-header comp-filter-pill-container">
      <MapListToggle
        onToggle={toggleViewType}
        activeView={viewType}
        className="map-list-toggle"
      />
      <div className="comp-filter-pills">
        {hasFilter("status") && (
          <FilterButton
            id="comp-status-filter"
            label={status?.label}
            name="status"
            clear={removeFilter}
          />
        )}

        {hasDate() && (
          <FilterButton
            id="comp-date-range-filter"
            label={dateRangeLabel()}
            name="dateRange"
            clear={removeFilter}
          />
        )}

        {hasFilter("species") && (
          <FilterButton
            id="comp-species-filter"
            label={species?.label}
            name="species"
            clear={removeFilter}
          />
        )}

        {hasFilter("officer") && (
          <FilterButton
            id="comp-officer-filter"
            label={officer?.label}
            name="officer"
            clear={removeFilter}
          />
        )}

        {hasFilter("violationType") && (
          <FilterButton
            id="comp-violation-filter"
            label={violationType?.label}
            name="violationType"
            clear={removeFilter}
          />
        )}

        {hasFilter("natureOfComplaint") && (
          <FilterButton
            id="comp-nature-of-complaint-filter"
            label={natureOfComplaint?.label}
            name="natureOfComplaint"
            clear={removeFilter}
          />
        )}

        {hasFilter("community") && (
          <FilterButton
            id="comp-community-filter"
            label={community?.label}
            name="community"
            clear={removeFilter}
          />
        )}

        {hasFilter("zone") && (
          <FilterButton
            id="comp-zone-filter"
            label={zone?.label}
            name="zone"
            clear={removeFilter}
          />
        )}

        {hasFilter("region") && (
          <FilterButton
            id="comp-region-filter"
            label={region?.label}
            name="region"
            clear={removeFilter}
          />
        )}

        <div className="comp-filter-search">
          <SearchInput />
        </div>
      </div>
    </div>
  );
};
