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
import { ExportTaskInput } from "@/app/types/api-params/export-task-input";

export const generateExportComplaintInputParams = (
  id: string,
  type: string,
  dateLogged: Date,
  agency: string,
  complaintAttachments: COMSObject[],
  outcomeAttachments?: COMSObject[],
) => {
  let fileName = "";

  if (agency) {
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

export const generateExportTaskInputParams = (taskId: string, taskNumber: number) => {
  const fileName = `T${taskNumber}_Task_Report_${format(new Date(), "yyMMdd")}.pdf`;
  const tz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { taskId, fileName, tz } as ExportTaskInput;
};

//-- this is a janky solution, but as of 2024 it is still the widly
//-- accepted solution to download a file from a service
const downloadPdf = (data: ArrayBuffer, fileName: string, elementId: string) => {
  const file = new Blob([data], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(file);
  let link = document.createElement("a");
  link.id = elementId;
  link.href = fileURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
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
  async (dispatch) => {
    const complaintAttachments = await dispatch(getAttachments(id, undefined, AttachmentEnum.COMPLAINT_ATTACHMENT));
    const outcomeAttachments = await dispatch(getAttachments(id, undefined, AttachmentEnum.OUTCOME_ATTACHMENT));
    try {
      const agency = forAgency ?? getUserAgency();

      const axiosConfig: AxiosRequestConfig = {
        responseType: "arraybuffer", // Specify response type as arraybuffer
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

      const exportComplaintInput = generateExportComplaintInputParams(
        id,
        type,
        dateLogged,
        agency,
        complaintAttachments,
        outcomeAttachments,
      );

      const url = `${config.API_BASE_URL}/v1/document/export-complaint`;

      const response = await axios.post(url, exportComplaintInput, axiosConfig);

      downloadPdf(response.data, exportComplaintInput.fileName, "hidden-details-screen-export-complaint");

      return "success";
    } catch (error) {
      console.error("Error exporting complaint:", error);
      return "error";
    }
  };

//--
//-- exports a task as a pdf document
//--
export const exportTask =
  (taskId: string, taskNumber: number): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async () => {
    try {
      const axiosConfig: AxiosRequestConfig = {
        responseType: "arraybuffer",
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

      const exportTaskInput = generateExportTaskInputParams(taskId, taskNumber);

      const url = `${config.API_BASE_URL}/v1/document/export-task`;

      const response = await axios.post(url, exportTaskInput, axiosConfig);

      downloadPdf(response.data, exportTaskInput.fileName, "hidden-details-screen-export-task");

      return "success";
    } catch (error) {
      console.error("Error exporting task:", error);
      return "error";
    }
  };
