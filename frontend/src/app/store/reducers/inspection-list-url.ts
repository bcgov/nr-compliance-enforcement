import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@store/store";

interface InspectionListUrlState {
  url: string;
}

// No default filters currently defined. Add getDefaultFilters in useInpsectionSearch when required
const initialState: InspectionListUrlState = {
  url: "/inspections",
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
