import Option from "@apptypes/app/option";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";

export type ComplaintFilterPayload = {
  filter: string;
  value?: Option | Date | null;
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

export const resetFilters = (payload?: Array<ComplaintFilterPayload>) => ({
  type: ComplaintFilterActionTypes.RESET_FILTERS,
  payload,
});

//-- reducer
const complaintFilterReducer = (state: ComplaintFilters, action: any): ComplaintFilters => {
  switch (action.type) {
    case ComplaintFilterActionTypes.UPDATE_FILTER: {
      const {
        payload: { filter, value },
      } = action;

      return { ...state, [filter]: value };
    }
    case ComplaintFilterActionTypes.CLEAR_FILTER: {
      const { filter } = action;
      const update = { ...state, [filter]: null };

      return { ...update };
    }
    case ComplaintFilterActionTypes.RESET_FILTERS: {
      const { payload } = action;

      let update = { ...state };
      Object.keys(update).forEach((item) => {
        switch (item) {
          case "startDate":
          case "endDate":
            update[item] = undefined;
            return update[item];
          default:
            const x: ComplaintFilterPayload = payload.find((filter: ComplaintFilterPayload) => {
              return filter.filter === item;
            });
            if (x) {
              update[item] = x.value;
            } else {
              update[item] = null;
            }

            return update[item];
        }
      });

      return { ...update };
    }
    default:
      return state;
  }
};

export default complaintFilterReducer;
