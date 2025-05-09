import { Park } from "@/app/types/app/shared/park";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ParkState {
  parkCache: Record<string, Park>;
}

const selectParkEntities = (state: RootState) => state.parks.parkCache;

const initialState: ParkState = {
  parkCache: {},
};

const parksReducer = createSlice({
  name: "parks",
  initialState,
  reducers: {
    setPark: (state, action: PayloadAction<Park>) => {
      state.parkCache[action.payload.parkGuid] = action.payload;
    },
  },
});

export const selectAllParks = createSelector([selectParkEntities], (parks): Record<string, Park> => parks);

export const { setPark } = parksReducer.actions;
export default parksReducer.reducer;
