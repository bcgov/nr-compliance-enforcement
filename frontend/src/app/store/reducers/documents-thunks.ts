import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { generateApiParameters, get } from "../../common/api";
import config from "../../../config";

//--
//-- exports a complaint as a pdf document
//--
export const exportComplaint =
  (type: string, id: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/document/export-complaint/${type}?id=${id}`);
    const response = await get<any>(dispatch, parameters);

    console.log(response);
    return response;
  };
