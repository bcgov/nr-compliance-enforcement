import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import officersInZoneReducer from "./reducers/officer";
import officersInOfficeReducer from "./reducers/officer";
import appReducer from "./reducers/app";
import complaints from "./reducers/complaints";
import dropdowns from "./reducers/code-tables";
import officesInZoneReducer from './reducers/office';

export const store = configureStore({
  reducer: {
    app: appReducer,
    officersInZone: officersInZoneReducer,
    officersInOffice: officersInOfficeReducer,
    officesInZone: officesInZoneReducer,
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
