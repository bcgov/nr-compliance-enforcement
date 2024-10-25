import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import config from "../../../config";
import { format } from "date-fns";
import axios, { AxiosRequestConfig } from "axios";
import { AUTH_TOKEN, getUserAgency } from "../../service/user-service";

//--
//-- exports a complaint as a pdf document
//--
export const exportComplaint =
  (type: string, id: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      const agency = getUserAgency();
      let tailored_filename = "";
      if (agency != null) {
        switch (agency) {
          case "CEEB": {
            tailored_filename = `${format(new Date(), "yyyy-MM-dd")} Complaint ${id}.pdf`;
            break;
          }
          case "COS":
          default: {
            let typeName = type;
            if (type === "ERS") {
              typeName = "EC";
            } else if (type === "HWCR") {
              typeName = "HWC";
            }
            tailored_filename = `${typeName}_${id}_${format(new Date(), "yyMMdd")}.pdf`;
            break;
          }
        }
      } else {
        // Can't find any agency information - use previous standard
        tailored_filename = `Complaint-${id}-${type}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      }

      const tz: string = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);

      const axiosConfig: AxiosRequestConfig = {
        responseType: "arraybuffer", // Specify response type as arraybuffer
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

      const url = `${config.API_BASE_URL}/v1/document/export-complaint/${type}?id=${id}&tz=${tz}`;

      //-- this should not work as there's no authentication token passed to the server,
      const response = await axios.get(url, axiosConfig);

      //-- this is a janky solution, but as of 2024 it is still the widly
      //-- accepted solution to download a file from a service
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      let link = document.createElement("a");
      link.id = "hidden-details-screen-export-complaint";
      link.href = fileURL;
      link.download = tailored_filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return "success";
    } catch (error) {
      console.error("Error exporting complaint:", error);
      return "error";
    }
  };
