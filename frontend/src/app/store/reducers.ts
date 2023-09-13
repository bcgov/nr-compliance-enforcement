import { combineReducers } from "@reduxjs/toolkit";

import officers from "./reducers/officer";
import app from "./reducers/app";
import complaints from "./reducers/complaints";
import offices from "./reducers/office";
import codeTables from "./reducers/code-table";
import configurations from "./reducers/configurations";

export const rootReducer = combineReducers({
  app,
  officers,
  offices,
  complaints,
  codeTables,
  configurations,
});