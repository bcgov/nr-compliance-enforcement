import { FC, useContext } from "react";
import { ComplaintFilterState } from "../../../types/providers/complaint-filter-provider-type";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { FilterButton } from "../../common/filter-button";

export const ComplaintFilterBar: FC = () => {
  const {
    filters,
    setRegion,
    setZone,
    setCommunity,
    setOfficer,
    setStartDate,
    setEndDate,
    setStatus,
    setSpecies,
    setNatureOfComplaint,
    setViolationType,

    hasFilter,
    hasDate,
  } = useContext(ComplaintFilterContext);

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
  } = filters as ComplaintFilterState;

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

  const clearDateRange = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="comp-filter-pill-container">
      {hasFilter("status") && (
        <FilterButton
          id="comp-status-filter"
          label={status?.label}
          clear={setStatus}
        />
      )}

      {hasDate() && (
        <FilterButton
          id="comp-date-range-filter"
          label={dateRangeLabel()}
          clear={clearDateRange}
        />
      )}

      {hasFilter("species") && (
        <FilterButton
          id="comp-species-filter"
          label={species?.label}
          clear={setSpecies}
        />
      )}

      {hasFilter("officer") && (
        <FilterButton
          id="comp-officer-filter"
          label={officer?.label}
          clear={setOfficer}
        />
      )}

      {hasFilter("violationType") && (
        <FilterButton
          id="comp-violation-filter"
          label={violationType?.label}
          clear={setViolationType}
        />
      )}

      {hasFilter("natureOfComplaint") && (
        <FilterButton
          id="comp-nature-of-complaint-filter"
          label={natureOfComplaint?.label}
          clear={setNatureOfComplaint}
        />
      )}

      {hasFilter("community") && (
        <FilterButton
          id="comp-community-filter"
          label={community?.label}
          clear={setCommunity}
        />
      )}

      {hasFilter("zone") && (
        <FilterButton
          id="comp-zone-filter"
          label={zone?.label}
          clear={setZone}
        />
      )}

      {hasFilter("region") && (
        <FilterButton
          id="comp-region-filter"
          label={region?.label}
          clear={setRegion}
        />
      )}
    </div>
  );
};
