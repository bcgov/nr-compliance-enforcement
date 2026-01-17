import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {
  createMigrate,
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./reducers";
import migration from "./migrations";

const persistConfig = {
  key: "enforcement",
  storage,
  blacklist: ["app"],
  whitelist: ["codeTables", "officers"],
  version: 41, // This needs to be incremented every time a new migration is added
  debug: true,
  migrate: createMigrate(migration, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, "app/SHOW_MODAL"],
        ignoredPaths: ["app.modalData.deleteConfirmed", "app.callback", "app.hideCallback"], // modals pass functions as parameters, disable serialization checking to supress errors
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const persistor = persistStore(store);
