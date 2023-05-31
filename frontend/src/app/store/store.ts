import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import hwcrComplaintsReducer from "./reducers/hwcr-complaints";
import appReducer from "./reducers/app";

export const store = configureStore({
  reducer: {
    app: appReducer,
    hwcrComplaint: hwcrComplaintsReducer,
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
