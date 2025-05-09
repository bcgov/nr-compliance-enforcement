import { Park } from "@/app/types/app/shared/park";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ParkState {
  park: Record<string, Park>;
}

const selectParkEntities = (state: RootState) => state.parks.park;

const initialState: ParkState = {
  park: {},
};

const parksReducer = createSlice({
  name: "parks",
  initialState,
  reducers: {
    setPark: (state, action: PayloadAction<Park>) => {
      state.park[action.payload.parkGuid] = action.payload;
    },
  },
});

export const selectAllParks = createSelector([selectParkEntities], (parks): Record<string, Park> => parks);

export const { setPark } = parksReducer.actions;
export default parksReducer.reducer;
