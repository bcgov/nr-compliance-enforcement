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
  park: null,
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
  outcomeAnimalStartDate: undefined,
  outcomeAnimalEndDate: undefined,
  equipmentStatus: null,
  equipmentTypes: [],
};

const convertFilterNames = (complaintFilters: Partial<ComplaintFilters>) => {
  /**
   * This funtion takes a partial set of filters in the shape of the ComplaintSearchParameters from
   * the store, and maps them into the initial state for this provider. This enables the search page
   * to preserve the filters when navigating away from then back to the complaints search page.
   */
  const {
    regionCodeFilter,
    zoneCodeFilter,
    areaCodeFilter,
    parkFilter,
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
    outcomeAnimalFilter,
    outcomeAnimalStartDateFilter,
    outcomeAnimalEndDateFilter,
    equipmentStatusFilter,
    equipmentTypesFilter,
  } = complaintFilters;

  // Parse the start and end date filters into Date objects if they exist.
  const parsedStartDate = startDateFilter ? new Date(startDateFilter) : undefined;
  // If start date is set and end date is not, default to current date for end date.
  let parsedEndDate = undefined;
  if (endDateFilter) {
    parsedEndDate = new Date(endDateFilter);
  } else if (parsedStartDate) {
    parsedEndDate = new Date();
  }

  //Parse outcomeAnimalDates
  const parsedOutcomeAnimalStartDate = outcomeAnimalStartDateFilter
    ? new Date(outcomeAnimalStartDateFilter)
    : undefined;
  let parsedOutcomeAnimalEndDate = undefined;
  if (outcomeAnimalEndDateFilter) {
    parsedOutcomeAnimalEndDate = new Date(outcomeAnimalEndDateFilter);
  } else if (parsedOutcomeAnimalStartDate) {
    parsedOutcomeAnimalEndDate = new Date();
  }

  const allFilters: Partial<ComplaintFilters> = {
    region: regionCodeFilter,
    zone: zoneCodeFilter,
    community: areaCodeFilter,
    park: parkFilter,
    officer: officerFilter,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    status: complaintStatusFilter,
    species: speciesCodeFilter,
    complaintMethod: complaintMethodFilter,
    natureOfComplaint: natureOfComplaintFilter,
    violationType: violationFilter,
    girType: girTypeFilter,
    actionTaken: actionTakenFilter,
    outcomeAnimal: outcomeAnimalFilter,
    outcomeAnimalStartDate: parsedOutcomeAnimalStartDate,
    outcomeAnimalEndDate: parsedOutcomeAnimalEndDate,
    equipmentStatus: equipmentStatusFilter,
    equipmentTypes: equipmentTypesFilter,
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
    startingState = { ...startingState, ...complaintFilters, status: { value: "OPEN", label: "Open" } };
  } else {
    const activeFilters = convertFilterNames(complaintFilters);
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
