import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@store/store";

interface InspectionListUrlState {
  url: string;
}

// Default filters are defined in the URL
const initialState: InspectionListUrlState = {
  url: "/inspections?inspectionStatus=OPEN",
};

const inspectionListUrlSlice = createSlice({
  name: "inspectionListUrl",
  initialState,
  reducers: {
    setInspectionListUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
  },
});

export const { setInspectionListUrl } = inspectionListUrlSlice.actions;

export const selectInspectionListUrl = (state: RootState): string => state.inspectionListUrl.url;

export default inspectionListUrlSlice.reducer;
