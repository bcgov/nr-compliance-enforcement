import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import officers from "./reducers/officer";
import app from "./reducers/app";
import complaints from "./reducers/complaints";
import offices from "./reducers/office";
import codeTables from "./reducers/code-table";
import attachments from "./reducers/attachments";
import cases from "./reducers/cases";

const appPersistConfig = {
  key: "app",
  storage: storage,
  whitelist: [
    "profile",
    "alerts",
    "notifications",
    "configurations",
    "codeTableVersion",
    "activeTab",
    "activeComplaintsViewType",
  ],
};

const complaintsPersistConfig = {
  key: "complaints",
  storage: storage,
  whitelist: ["complaintSearchParameters"],
};

export const rootReducer = combineReducers({
  app: persistReducer(appPersistConfig, app),
  officers,
  offices,
  complaints: persistReducer(complaintsPersistConfig, complaints),
  codeTables,
  attachments,
  cases,
});
