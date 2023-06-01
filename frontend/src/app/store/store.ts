import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from "./reducers/app";
import allegationComplaintsReducer from "./reducers/allegation-complaint";

export const store = configureStore({
  reducer: {
    app: appReducer,
    allegationComplaint: allegationComplaintsReducer,
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
