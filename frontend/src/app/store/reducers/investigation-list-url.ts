import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@store/store";

interface InvestigationListUrlState {
  url: string;
}

// Default filters are defined in the URL
const initialState: InvestigationListUrlState = {
  url: "/investigations?investigationStatus=OPEN",
};

const investigationListUrlSlice = createSlice({
  name: "investigationListUrl",
  initialState,
  reducers: {
    setInvestigationListUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
  },
});

export const { setInvestigationListUrl } = investigationListUrlSlice.actions;

export const selectInvestigationListUrl = (state: RootState): string => state.investigationListUrl.url;

export default investigationListUrlSlice.reducer;
