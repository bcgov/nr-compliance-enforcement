import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import config from "@/config";
import { format } from "date-fns";
import axios, { AxiosRequestConfig } from "axios";
import { AUTH_TOKEN, getUserAgency } from "@service/user-service";
import { AgencyType } from "@apptypes/app/agency-types";
import { ExportComplaintInput } from "@/app/types/complaints/export-complaint-input";
import { COMSObject } from "@/app/types/coms/object";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { getAttachments } from "@/app/store/reducers/attachments";

export const generateExportComplaintInputParams = (
  id: string,
  complaintAttachments: COMSObject[],
  outcomeAttachments: COMSObject[],
  type: string,
  dateLogged: Date,
  agency: string,
) => {
  let fileName = "";

  if (agency != null) {
    switch (agency) {
      case AgencyType.CEEB: {
        fileName = `${format(dateLogged, "yyyy-MM-dd")} Complaint ${id}.pdf`;
        break;
      }
      case AgencyType.COS:
      default: {
        let typeName = type;
        if (type === "ERS") {
          typeName = "EC";
        } else if (type === "HWCR") {
          typeName = "HWC";
        }
        fileName = `${typeName}_${id}_${format(dateLogged, "yyMMdd")}.pdf`;
        break;
      }
    }
  } else {
    // Can't find any agency information - use previous standard
    fileName = `Complaint-${id}-${type}-${format(dateLogged, "yyyy-MM-dd")}.pdf`;
  }

  const attachments = { complaintsAttachments: complaintAttachments, outcomeAttachments: outcomeAttachments };
  const tz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const exportComplaintInput = { id, type, fileName, tz, attachments } as ExportComplaintInput;
  return exportComplaintInput;
};

//--
//-- exports a complaint as a pdf document
//--
export const exportComplaint =
  (
    type: string,
    id: string,
    dateLogged: Date,
    forAgency?: string,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const complaintAttachments = await dispatch(getAttachments(id, AttachmentEnum.COMPLAINT_ATTACHMENT));
    const outcomeAttachments = await dispatch(getAttachments(id, AttachmentEnum.OUTCOME_ATTACHMENT));
    try {
      const agency = forAgency ?? getUserAgency();

      const axiosConfig: AxiosRequestConfig = {
        responseType: "arraybuffer", // Specify response type as arraybuffer
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

      const exportComplaintInput = generateExportComplaintInputParams(
        id,
        complaintAttachments,
        outcomeAttachments,
        type,
        dateLogged,
        agency,
      );

      const url = `${config.API_BASE_URL}/v1/document/export-complaint`;

      const response = await axios.post(url, exportComplaintInput, axiosConfig);

      //-- this is a janky solution, but as of 2024 it is still the widly
      //-- accepted solution to download a file from a service
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      let link = document.createElement("a");
      link.id = "hidden-details-screen-export-complaint";
      link.href = fileURL;
      link.download = exportComplaintInput.fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return "success";
    } catch (error) {
      console.error("Error exporting complaint:", error);
      return "error";
    }
  };
