import { FC, useContext, useState } from "react";
import { FilterButton } from "../../common/filter-button";

export const ComplaintFilterBar: FC = () => {
  const [region, setRegion] = useState<any>();
  const [zone, setZone] = useState<any>();
  const [community, setCommunity] = useState<any>();
  const [officer, setOfficer] = useState<any>();
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [species, setSpecies] = useState<any>();
  const [natureOfComplaint, setNatureOfComplaint] = useState<any>();
  const [violationType, setViolationType] = useState<any>();

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

  const hasDate = () => {
    if (
      (startDate === undefined || startDate === null) &&
      (endDate === undefined || endDate === null)
    ) {
      return false;
    }

    return true;
  };

  const hasFilter = (filter: string): boolean => {
    return false;
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
