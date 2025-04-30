import { FC, MouseEventHandler, useContext, useCallback } from "react";
import { FilterButton } from "@components/common/filter-button";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";
import { clearFilter } from "@store/reducers/complaint-filters";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";
import MapListToggle from "@components/common/map-list-toggle";
import SearchInput from "@components/common/search-input";
import { Button } from "react-bootstrap";

type Props = {
  toggleViewType: (view: "map" | "list") => void;
  viewType: "map" | "list";
  complaintType: string;
  searchQuery: string | undefined;
  applySearchQuery: Function;
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
};

export const ComplaintFilterBar: FC<Props> = ({
  viewType,
  toggleViewType,
  complaintType,
  searchQuery,
  applySearchQuery,
  toggleShowMobileFilters,
  toggleShowDesktopFilters,
}) => {
  const { state, dispatch } = useContext(ComplaintFilterContext);

  const {
    region,
    zone,
    community,
    park,
    officer,
    startDate,
    endDate,
    status,
    species,
    natureOfComplaint,
    violationType,
    girType,
    complaintMethod,
    actionTaken,
    outcomeAnimal,
    outcomeAnimalStartDate,
    outcomeAnimalEndDate,
    outcomeActionedBy,
    equipmentStatus,
    equipmentTypes,
  } = state;

  const dateRangeLabel = (startDate: Date | undefined | null, endDate: Date | undefined | null): string | undefined => {
    const currentDate = new Date().toLocaleDateString();
    if (startDate !== null && endDate !== null) {
      return `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`;
    } else if (startDate !== null) {
      return `${startDate?.toLocaleDateString()} - ${currentDate}`;
    } else if (endDate !== null) {
      return `${currentDate} - ${endDate?.toLocaleDateString()}`;
    } else {
      return undefined;
    }
  };

  const hasDate = (startDate: Date | undefined | null, endDate: Date | undefined | null) => {
    if ((startDate === undefined || startDate === null) && (endDate === undefined || endDate === null)) {
      return false;
    }

    return true;
  };

  const hasFilter = (filter: string) => {
    const selected = state[filter as keyof ComplaintFilters];
    //Check if the filter is Equipment types
    if (Array.isArray(selected)) {
      return selected.length > 0 && !!selected;
    }
    return !!selected;
  };

  const removeFilter = useCallback(
    (name: string) => {
      switch (name) {
        case "dateRange":
          dispatch(clearFilter("startDate"));
          dispatch(clearFilter("endDate"));
          break;
        case "outcomeAnimalDateRange":
          dispatch(clearFilter("outcomeAnimalStartDate"));
          dispatch(clearFilter("outcomeAnimalEndDate"));
          break;
        case "equipmentStatus":
          dispatch(clearFilter("equipmentStatus"));
          dispatch(clearFilter("equipmentTypes"));
          break;
        default:
          dispatch(clearFilter(name));
          break;
      }
    },
    [dispatch], //-- original: [state]
  );

  return (
    <div className="comp-filter-bar">
      <div className="search-bar">
        <SearchInput
          viewType={viewType}
          complaintType={complaintType}
          searchQuery={searchQuery}
          applySearchQuery={applySearchQuery}
        />
        <MapListToggle
          onToggle={toggleViewType}
          activeView={viewType}
          className="map-list-toggle"
        />
      </div>

      <div className="filter-pills-container">
        <Button
          variant="outline-primary"
          size="sm"
          className="icon-start filter-btn filter-btn-desktop"
          id="comp-filter-btn"
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
            id="comp-status-filter"
            label={status?.label}
            name="status"
            clear={removeFilter}
          />
        )}

        {hasDate(startDate, endDate) && (
          <FilterButton
            id="comp-date-range-filter"
            label={dateRangeLabel(startDate, endDate)}
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

        {hasFilter("park") && (
          <FilterButton
            id="comp-park-filter"
            label={park?.label}
            name="park"
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

        {hasFilter("girType") && (
          <FilterButton
            id="comp-gir-filter"
            label={girType?.label}
            name="girType"
            clear={removeFilter}
          />
        )}

        {hasFilter("complaintMethod") && (
          <FilterButton
            id="comp-complaint-method-filter"
            label={complaintMethod?.label}
            name="complaintMethod"
            clear={removeFilter}
          />
        )}

        {hasFilter("actionTaken") && (
          <FilterButton
            id="comp-complaint-method-filter"
            label={actionTaken?.label}
            name="actionTaken"
            clear={removeFilter}
          />
        )}

        {hasFilter("outcomeAnimal") && (
          <FilterButton
            id="comp-complaint-method-filter"
            label={outcomeAnimal?.label}
            name="outcomeAnimal"
            clear={removeFilter}
          />
        )}

        {hasDate(outcomeAnimalStartDate, outcomeAnimalEndDate) && (
          <FilterButton
            id="comp-complaint-method-filter"
            label={dateRangeLabel(outcomeAnimalStartDate, outcomeAnimalEndDate)}
            name="outcomeAnimalDateRange"
            clear={removeFilter}
          />
        )}

        {hasFilter("outcomeActionedBy") && (
          <FilterButton
            id="comp-complaint-method-filter"
            label={outcomeActionedBy?.label}
            name="outcomeActionedBy"
            clear={removeFilter}
          />
        )}

        {hasFilter("equipmentStatus") && (
          <FilterButton
            id="comp-complaint-method-filter"
            label={equipmentStatus?.label}
            name="equipmentStatus"
            clear={removeFilter}
          />
        )}

        {hasFilter("equipmentTypes") && (
          <FilterButton
            id="comp-complaint-method-filter"
            label={equipmentTypes?.map((type) => type.label).join(", ")}
            name="equipmentTypes"
            clear={removeFilter}
          />
        )}
      </div>
    </div>
  );
};
