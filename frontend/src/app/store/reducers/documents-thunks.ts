import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios, { AxiosRequestConfig } from "axios";
import config from "../../../config";

export const exportComplaint =
  (type: string, id: string): ThunkAction<Promise<void>, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      const config2: AxiosRequestConfig = {
        responseType: "arraybuffer", // Specify response type as arraybuffer
      };
      const url = `${config.API_BASE_URL}/v1/document/export-complaint/${type}?id=${id}`;
      const response = await axios.get(url, config2);

      // found this on stackoverflow, it appears to work, but it's not pretty.
      // Basically, behind the scenes, create a link, click it, and hide the link.  This triggers the download of the file.
      // Can probably use the file-saver library instead.
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `${type}-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting complaint:", error);
    }
  };
