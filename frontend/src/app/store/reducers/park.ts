import { Park } from "@/app/types/app/shared/park";
import { Action, createSelector, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { generateApiParameters, get } from "@/app/common/api";
import config from "@/config";
import { UUID } from "node:crypto";

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

export const selectParkByGuid = (guid: string | undefined) =>
  createSelector([selectParkEntities], (parkCache) => (guid ? parkCache[guid] : undefined));

export const { setPark } = parksReducer.actions;

// get parkData for a single Park
export const getParkData =
  (parkId: string): ThunkAction<Promise<Park | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    // check and see if we've got a cached copy of this park
    const existingPark = getState().parks.parkCache[parkId];
    if (existingPark && !existingPark.isFallback) {
      return existingPark;
    }
    //If not fetch from the shared database
    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/shared-data/park/${parkId}`);
      const response = await get<Park>(dispatch, parameters);

      if (response) {
        dispatch(setPark(response));
        return response;
      } else {
        const fallback = {
          name: "Park name unavailable",
          parkGuid: parkId as UUID,
          isFallback: true,
        };

        if (!existingPark) {
          // Only set fallback if needed to avoid infinite render
          dispatch(setPark(fallback));
        }

        return fallback;
      }
    } catch (error) {
      console.error(`Unable to retrieve park information for ${parkId}: ${error}`);
      return undefined;
    }
  };

export default parksReducer.reducer;
