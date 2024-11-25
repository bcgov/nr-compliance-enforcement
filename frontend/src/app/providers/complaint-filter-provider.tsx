import React, { FC, createContext, useReducer } from "react";
import complaintFilterReducer from "@store/reducers/complaint-filters";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";

interface ComplaintFilterContextType {
  state: ComplaintFilters;
  dispatch: React.Dispatch<any>;
}

type ProviderProps = {
  children: React.ReactNode;
  freshSearch: boolean;
  complaintFilters: Partial<ComplaintFilters>;
};

let initialState: ComplaintFilters = {
  region: null,
  zone: null,
  community: null,
  officer: null,
  startDate: undefined,
  endDate: undefined,
  status: null,
  species: null,
  natureOfComplaint: null,
  violationType: null,
  filters: [],
  complaintMethod: null,
  actionTaken: null,
  outcomeAnimal: null,
};

const mapFilters = (complaintFilters: Partial<ComplaintFilters>) => {
  /**
   * This funtion takes a partial set of filters in the shape of the ComplaintSearchParameters from
   * the store, and maps them into the initial state for this provider. This enables the search page
   * to preserve the filters when navigating away from then back to the complaints search page.
   */
  const {
    regionCodeFilter,
    zoneCodeFilter,
    areaCodeFilter,
    officerFilter,
    startDateFilter,
    endDateFilter,
    complaintStatusFilter,
    girTypeFilter,
    violationFilter,
    complaintMethodFilter,
    actionTakenFilter,
    speciesCodeFilter,
    natureOfComplaintFilter,
  } = complaintFilters;
  const allFilters: Partial<ComplaintFilters> = {
    region: regionCodeFilter,
    zone: zoneCodeFilter,
    community: areaCodeFilter,
    officer: officerFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    status: complaintStatusFilter,
    species: speciesCodeFilter,
    complaintMethod: complaintMethodFilter,
    natureOfComplaint: natureOfComplaintFilter,
    violationType: violationFilter,
    girType: girTypeFilter,
    actionTaken: actionTakenFilter,
  };

  // Only return filters that have a value set
  let activeFilters: Partial<ComplaintFilters> = {};
  Object.keys(allFilters).forEach((key) => {
    const value = allFilters[key as keyof ComplaintFilters];
    if (value !== undefined && value !== null) {
      activeFilters = {
        ...activeFilters,
        [key]: value,
      };
    }
  });
  return activeFilters;
};

const ComplaintFilterContext = createContext<ComplaintFilterContextType>({
  state: initialState,
  dispatch: () => {},
});

const ComplaintFilterProvider: FC<ProviderProps> = ({ children, freshSearch, complaintFilters }) => {
  let startingState = { ...initialState };
  if (freshSearch) {
    startingState = complaintFilters.zone
      ? { ...startingState, status: { value: "OPEN", label: "Open" }, zone: complaintFilters.zone }
      : { ...startingState, status: { value: "OPEN", label: "Open" } };
  } else {
    const activeFilters = mapFilters(complaintFilters);
    startingState = { ...startingState, ...activeFilters };
  }

  const [state, dispatch] = useReducer(complaintFilterReducer, startingState);

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return <ComplaintFilterContext.Provider value={value}>{children}</ComplaintFilterContext.Provider>;
};

export { ComplaintFilterContext, ComplaintFilterProvider };
