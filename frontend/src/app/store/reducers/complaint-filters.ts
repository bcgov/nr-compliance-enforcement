import { DropdownOption } from "../../types/code-tables/option";

//-- types
export type ComplaintFilters = {
  [key: string]: any;

  region: DropdownOption | null;
  zone: DropdownOption | null;
  community: DropdownOption | null;
  officer: DropdownOption | null;

  startDate?: Date;
  endDate?: Date;
  status: DropdownOption | null;

  species: DropdownOption | null;
  natureOfComplaint: DropdownOption | null;

  violationType: DropdownOption | null;
};

export type ComplaintFilterPayload = {
  filter: string;
  value?: DropdownOption | Date | null;
};
//--

export enum ComplaintFilterActionTypes {
  UPDATE_FILTER = "filter/UPDATE_FILTER",
  CLEAR_FILTER = "filter/CLEAR_FILTER",
  RESET_FILTERS = "filter/RESET_FILTERS",
}
//-- action creators
export const updateFilter = (payload: ComplaintFilterPayload) => ({
  type: ComplaintFilterActionTypes.UPDATE_FILTER,
  payload: payload,
});

export const clearFilter = (filter: string) => ({
  type: ComplaintFilterActionTypes.CLEAR_FILTER,
  filter,
});

export const resetFilters = () => ({
  type: ComplaintFilterActionTypes.RESET_FILTERS,
});

//-- reducer

const complaintFilterReducer = (
  state: ComplaintFilters,
  action: any
): ComplaintFilters => {
  switch (action.type) {
    case ComplaintFilterActionTypes.UPDATE_FILTER: {
      const {
        payload: { filter, value },
      } = action;

      return { ...state, [filter]: value };
    }
    case ComplaintFilterActionTypes.CLEAR_FILTER: {
      const { payload } = action;
      const update = { ...state, [payload]: null };

      return { ...update };
    }
    case ComplaintFilterActionTypes.RESET_FILTERS: {
      const { payload } = action;

      return { ...state };
    }
    default:
      return state;
  }
};

export default complaintFilterReducer;
