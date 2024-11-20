import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createMigrate, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./reducers";
import migration from "./migrations";

const persistConfig = {
  key: "enforcement",
  storage,
  blacklist: ["app"],
  whitelist: ["codeTables", "officers"],
  version: 22, // This needs to be incremented every time a new migration is added
  debug: true,
  migrate: createMigrate(migration, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const persistor = persistStore(store);
