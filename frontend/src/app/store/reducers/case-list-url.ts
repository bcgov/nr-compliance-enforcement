import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@store/store";

interface CaseListUrlState {
  url: string;
}

// Default filters are defined in the URL
// not useful today but this is in place for case filter buildout
const initialState: CaseListUrlState = {
  url: "/cases",
};

const caseListUrlSlice = createSlice({
  name: "caseListUrl",
  initialState,
  reducers: {
    setCaseListUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
  },
});

export const { setCaseListUrl } = caseListUrlSlice.actions;

export const selectCaseListUrl = (state: RootState): string => state.caseListUrl.url;

export default caseListUrlSlice.reducer;
