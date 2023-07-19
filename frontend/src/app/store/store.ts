import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import officersInZoneReducer from "./reducers/officer";
import officersInOfficeReducer from "./reducers/officer";
import appReducer from "./reducers/app";
import complaints from "./reducers/complaints";
import officesInZoneReducer from './reducers/office';
import codeTables from "./reducers/code-table";

export const store = configureStore({
  reducer: {
    app: appReducer,
    officersInZone: officersInZoneReducer,
    officersInOffice: officersInOfficeReducer,
    officesInZone: officesInZoneReducer,
    complaints,
    codeTables
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
