import React, { FC, createContext, useReducer } from "react";
import complaintFilterReducer from "../store/reducers/complaint-filters";
import { ComplaintFilters } from "../types/complaints/complaint-filters/complaint-filters";

interface ComplaintFilterContextType {
  state: ComplaintFilters;
  dispatch: React.Dispatch<any>;
}

type ProviderProps = {
  children: React.ReactNode;
};

const initialState: ComplaintFilters = {
  region: null,
  zone: null,
  community: null,
  officer: null,
  startDate: undefined,
  endDate: undefined,
  status: { value: "OPEN", label: "Open" },
  species: null,
  natureOfComplaint: null,
  violationType: null,
};

const ComplaintFilterContext = createContext<ComplaintFilterContextType>({
  state: initialState,
  dispatch: () => {},
});

const ComplaintFilterProvider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(complaintFilterReducer, initialState);

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <ComplaintFilterContext.Provider value={value}>
      {children}
    </ComplaintFilterContext.Provider>
  );
};

export { ComplaintFilterContext, ComplaintFilterProvider };
