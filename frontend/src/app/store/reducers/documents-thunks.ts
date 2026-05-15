import { Action, ThunkAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "@store/store";
import config from "@/config";
import { format } from "date-fns";
import axios, { AxiosRequestConfig } from "axios";
import { AUTH_TOKEN, getUserAgency } from "@service/user-service";
import { AgencyType } from "@apptypes/app/agency-types";
import { COMSObject } from "@/app/types/coms/object";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { getAttachments } from "@/app/store/reducers/attachments";
import { ExportTaskInput } from "@/app/types/api-params/export-task-input";
import { fetchAttachmentsWithMetadata } from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { bulkDownload, BulkDownloadProgressCallback, FileWithPresignedUrl } from "@/app/store/reducers/bulk-download";

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
      case AgencyType.CEEB:
      case AgencyType.NROS: {
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
  const exportComplaintInput = { id, type, fileName, tz, attachments };
  return exportComplaintInput;
};

export const generateExportTaskInputParams = (taskId: string, taskNumber: number, attachments?: COMSObject[]) => {
  const fileName = `T${taskNumber}_Task_Report_${format(new Date(), "yyMMdd")}.pdf`;
  const tz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { taskId, fileName, tz, attachments } as ExportTaskInput;
};

export const generateExportContinuationReportParams = (investigationGuid: string) => {
  const fileName = `Continuation_Report_${format(new Date(), "yyMMdd")}.pdf`;
  const tz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { investigationGuid, fileName, tz };
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

interface ComplaintPdfResult {
  data: ArrayBuffer;
  fileName: string;
}

const generateComplaintPdf = async (
  type: string,
  id: string,
  dateLogged: Date,
  agency: string,
  complainantAttachments: COMSObject[],
  outcomeAttachments: COMSObject[],
): Promise<ComplaintPdfResult> => {
  const axiosConfig: AxiosRequestConfig = {
    responseType: "arraybuffer",
  };

  axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

  const exportComplaintInput = generateExportComplaintInputParams(
    id,
    type,
    dateLogged,
    agency,
    complainantAttachments,
    outcomeAttachments,
  );

  const url = `${config.API_BASE_URL}/v1/document/export-complaint`;
  const response = await axios.post(url, exportComplaintInput, axiosConfig);

  return {
    data: response.data,
    fileName: exportComplaintInput.fileName,
  };
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
    const complainantAttachments = await dispatch(
      getAttachments(id, undefined, AttachmentEnum.COMPLAINT_ATTACHMENT, false),
    );
    const outcomeAttachments = await dispatch(getAttachments(id, undefined, AttachmentEnum.OUTCOME_ATTACHMENT, false));
    try {
      const agency = forAgency ?? getUserAgency();

      const { data, fileName } = await generateComplaintPdf(
        type,
        id,
        dateLogged,
        agency,
        complainantAttachments,
        outcomeAttachments,
      );

      downloadPdf(data, fileName, "hidden-details-screen-export-complaint");

      return "success";
    } catch (error) {
      console.error("Error exporting complaint:", error);
      return "error";
    }
  };

export const exportComplaintWithAttachments =
  (
    type: string,
    id: string,
    dateLogged: Date,
    complainantAttachments: COMSObject[],
    outcomeAttachments: COMSObject[],
    forAgency?: string,
    onProgress?: BulkDownloadProgressCallback,
  ): AppThunk<Promise<void>> =>
  async (dispatch) => {
    let pdfObjectUrl: string | undefined;

    try {
      const agency = forAgency ?? getUserAgency();

      const { data, fileName } = await generateComplaintPdf(
        type,
        id,
        dateLogged,
        agency,
        complainantAttachments,
        outcomeAttachments,
      );

      const pdfBlob = new Blob([data], { type: "application/pdf" });
      pdfObjectUrl = URL.createObjectURL(pdfBlob);

      const taggedComplainantAttachments: COMSObject[] = complainantAttachments.map((attachment) => ({
        ...attachment,
        folder: "Complainant attachments",
      }));

      const taggedOutcomeAttachments: COMSObject[] = outcomeAttachments.map((attachment) => ({
        ...attachment,
        folder: "Outcome attachments",
      }));

      const pdfFile: FileWithPresignedUrl = {
        id: undefined,
        name: fileName,
        size: pdfBlob.size,
        url: pdfObjectUrl,
      };

      const downloadId = id;
      const zipFilename = `Complaint_${id}.zip`;

      await dispatch(
        bulkDownload(
          downloadId,
          [...taggedComplainantAttachments, ...taggedOutcomeAttachments],
          zipFilename,
          [pdfFile],
          onProgress,
          AttachmentEnum.COMPLAINT_ATTACHMENT,
        ),
      );
    } catch (error) {
      console.error("Error exporting complaint with attachments:", error);
    } finally {
      if (pdfObjectUrl) {
        URL.revokeObjectURL(pdfObjectUrl);
      }
    }
  };

//--
//-- exports a task as a pdf document
//--
export const exportTask =
  (
    investigationId: string,
    taskId: string,
    taskNumber: number,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async () => {
    try {
      const allAttachments = await fetchAttachmentsWithMetadata(investigationId);
      const attachments = allAttachments
        .filter((a) => a.taskId === taskId)
        .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

      const axiosConfig: AxiosRequestConfig = {
        responseType: "arraybuffer",
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

      const exportTaskInput = generateExportTaskInputParams(taskId, taskNumber, attachments);

      const url = `${config.API_BASE_URL}/v1/document/export-task`;

      const response = await axios.post(url, exportTaskInput, axiosConfig);

      downloadPdf(response.data, exportTaskInput.fileName, "hidden-details-screen-export-task");

      return "success";
    } catch (error) {
      console.error("Error exporting task:", error);
      return "error";
    }
  };

//--
//-- exports the list of tasks for an investigation as a zip containing a CSV
//-- of the task details and a folder with pdf exports of each task
//--
export const exportTasksList =
  (
    investigationGuid: string,
    investigationName: string | null | undefined,
    tasks: Array<{ taskIdentifier: string; taskNumber: number }>,
    csvContent: string,
    onProgress?: BulkDownloadProgressCallback,
  ): AppThunk<Promise<void>> =>
  async (dispatch) => {
    const objectUrlsToRevoke: string[] = [];

    try {
      const allAttachments = await fetchAttachmentsWithMetadata(investigationGuid);

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

      const exportTaskUrl = `${config.API_BASE_URL}/v1/document/export-task`;

      const pdfFiles: FileWithPresignedUrl[] = await Promise.all(
        tasks.map(async ({ taskIdentifier, taskNumber }) => {
          const attachments = allAttachments
            .filter((a) => a.taskId === taskIdentifier)
            .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

          const exportTaskInput = generateExportTaskInputParams(taskIdentifier, taskNumber, attachments);
          const response = await axios.post(exportTaskUrl, exportTaskInput, { responseType: "arraybuffer" });

          const pdfBlob = new Blob([response.data], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          objectUrlsToRevoke.push(pdfUrl);

          return {
            id: undefined,
            name: exportTaskInput.fileName,
            size: pdfBlob.size,
            url: pdfUrl,
            folder: "Tasks",
          };
        }),
      );

      const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const csvUrl = URL.createObjectURL(csvBlob);
      objectUrlsToRevoke.push(csvUrl);
      const today = format(new Date(), "yyyy-MM-dd");
      const safeName = investigationName || investigationGuid;
      const csvFile: FileWithPresignedUrl = {
        id: undefined,
        name: `Investigation ${safeName} Tasks ${today}.csv`,
        size: csvBlob.size,
        url: csvUrl,
      };

      const zipFilename = `Investigation_${safeName}_Tasks.zip`;

      await dispatch(bulkDownload(investigationGuid, [], zipFilename, [csvFile, ...pdfFiles], onProgress));
    } finally {
      objectUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    }
  };

//--
//-- exports a continuation report as a pdf document
//--
export const exportContinuationReport =
  (investigationGuid: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async () => {
    try {
      const axiosConfig: AxiosRequestConfig = {
        responseType: "arraybuffer",
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;

      const params = generateExportContinuationReportParams(investigationGuid);

      const url = `${config.API_BASE_URL}/v1/document/export-continuation-report`;

      const response = await axios.post(url, params, axiosConfig);

      downloadPdf(response.data, params.fileName, "hidden-export-continuation-report");

      return "success";
    } catch (error) {
      console.error("Error exporting continuation report:", error);
      return "error";
    }
  };
