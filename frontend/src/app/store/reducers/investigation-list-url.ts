import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@store/store";

interface InvestigationListUrlState {
  url: string;
  defaultsActive: boolean;
}

// Default filters are defined in the URL
const initialState: InvestigationListUrlState = {
  url: "/investigations?investigationStatus=OPEN",
  defaultsActive: false,
};

const investigationListUrlSlice = createSlice({
  name: "investigationListUrl",
  initialState,
  reducers: {
    setInvestigationListUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setInvestigationListUrlDefaultsActive: (state) => {
      state.defaultsActive = true;
    },
  },
});

export const { setInvestigationListUrl, setInvestigationListUrlDefaultsActive } = investigationListUrlSlice.actions;

export const selectInvestigationListUrl = (state: RootState): string => state.investigationListUrl.url;
export const selectInvestigationDefaultsActive = (state: RootState): boolean =>
  state.investigationListUrl.defaultsActive;

export default investigationListUrlSlice.reducer;
