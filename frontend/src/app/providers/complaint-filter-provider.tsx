import React, { FC, createContext, useReducer } from "react";
import complaintFilterReducer, { ComplaintFilters } from '../store/reducers/complaint-filters';

const initialState: ComplaintFilters = {
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
};

export interface ComplaintFilterContextType {
  state: ComplaintFilters
  dispatch: React.Dispatch<any>
}

const ComplaintFilterContext = createContext<ComplaintFilterContextType>({
  state: initialState,
  dispatch: () => {}
})

type ProviderProps = {
  children: React.ReactNode;
};

const ComplaintFilterProvider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(complaintFilterReducer, initialState as ComplaintFilters);

  return (
    <ComplaintFilterContext.Provider value={{state, dispatch}}>
      {children}
    </ComplaintFilterContext.Provider>
  )
}

export { ComplaintFilterContext, ComplaintFilterProvider };
