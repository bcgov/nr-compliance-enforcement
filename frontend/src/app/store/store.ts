import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import hwcrComplaintsReducer from "./reducers/hwcr-complaints";
import officersInZoneReducer from "./reducers/officer";
import appReducer from "./reducers/app";
import allegationComplaintsReducer from "./reducers/allegation-complaint";
import complaints from "./reducers/complaints";
import dropdowns from "./reducers/code-tables";

export const store = configureStore({
  reducer: {
    app: appReducer,
    allegationComplaint: allegationComplaintsReducer,
    hwcrComplaint: hwcrComplaintsReducer,
    officersInZone: officersInZoneReducer,
    complaints,
    dropdowns,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
