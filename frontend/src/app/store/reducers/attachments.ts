import { AppThunk } from "@store/store";
import { deleteMethod, generateApiParameters, get, patch, post, putFile } from "@common/api";
import { from } from "linq-to-typescript";
import { COMSObject } from "@apptypes/coms/object";
import config from "@/config";
import {
  getThumbnailFile,
  injectIdentifierToFilename,
  injectIdentifierToThumbFilename,
  isImage,
} from "@common/methods";
import { DismissToast, ToggleError, ToggleSuccess } from "@common/toast";
import axios from "axios";
import AttachmentEnum from "@constants/attachment-enum";
import { AttachmentTypeConfig, getAttachmentConfig } from "@/app/types/app/attachment-config";
import { AUTH_TOKEN } from "@/app/service/user-service";

interface SaveAttachmentParams {
  dispatch: any;
  attachment: File;
  identifier: string;
  subIdentifier: string | undefined;
  attachmentType: AttachmentEnum;
  isSynchronous: boolean;
  historicalAttachments: Array<COMSObject>;
  isComplaintAttachment: boolean;
  attachmentConfig: AttachmentTypeConfig;
}

interface DeleteAttachmentParams {
  dispatch: any;
  attachment: COMSObject;
  identifier: string | null;
  isComplaintAttachment: boolean;
}

interface BuildHeaderParams {
  attachmentConfig: AttachmentTypeConfig;
  identifier: string;
  subIdentifier: string | undefined;
  attachmentType: AttachmentEnum;
  contentType: string;
  isThumb: boolean;
  attachmentName?: string;
  attachmentId?: string;
}

const buildAttachmentHeader = ({
  attachmentConfig,
  identifier,
  subIdentifier,
  attachmentType,
  contentType,
  isThumb,
  attachmentName,
  attachmentId,
}: BuildHeaderParams): Record<string, any> => {
  // Common fields
  const header: Record<string, any> = {
    [attachmentConfig.headerKey]: identifier,
    "x-amz-meta-is-thumb": isThumb ? "Y" : "N",
    "x-amz-meta-attachment-type": attachmentType,
    "Content-Disposition": `attachment; filename="${attachmentName}"`,
  };

  if (attachmentConfig.subHeaderKey) {
    //if we're creating something like a task where we have a parent but not sub identifier yet we need a dummy value to filter everything out
    header[attachmentConfig.subHeaderKey] = subIdentifier ?? "00000000-0000-0000-0000-000000000000";
  }

  if (contentType) {
    header["Content-Type"] = isThumb ? "image/jpeg" : contentType;
  }

  if (isThumb && attachmentId) {
    header["x-amz-meta-thumb-for"] = attachmentId;
  }

  return header;
};

// Get list of the attachments
export const getAttachments =
  (
    identifier: string,
    subIdentifier: string | undefined,
    attachmentType: AttachmentEnum,
  ): AppThunk<Promise<COMSObject[]>> =>
  async (dispatch) => {
    const attachmentList: COMSObject[] = [];
    try {
      const attachmentConfig = getAttachmentConfig(attachmentType);
      const bucketId =
        attachmentType === AttachmentEnum.TASK_ATTACHMENT ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;
      const parameters = generateApiParameters(`${config.COMS_URL}/object?bucketId=${bucketId}&latest=true`);
      const header = buildAttachmentHeader({
        attachmentConfig,
        identifier,
        subIdentifier,
        attachmentType,
        contentType: "",
        isThumb: false,
      });

      let response = await get<Array<COMSObject>>(dispatch, parameters, header);

      if (response && from(response).any()) {
        for (const attachment of response) {
          if (isImage(attachment.name)) {
            const thumbHeader = buildAttachmentHeader({
              attachmentConfig,
              identifier,
              subIdentifier,
              attachmentType,
              contentType: "",
              isThumb: true,
              attachmentName: attachment?.name,
              attachmentId: attachment?.id,
            });
            const thumbArrayResponse = await get<Array<COMSObject>>(dispatch, parameters, thumbHeader);

            const thumbId = thumbArrayResponse[0]?.id;

            if (thumbId) {
              const thumbParameters = generateApiParameters(`${config.COMS_URL}/object/${thumbId}?download=url`);

              const thumbResponse = await get<string>(dispatch, thumbParameters);
              attachment.imageIconString = thumbResponse;
              attachment.imageIconId = thumbId;
            }
          }
        }

        attachmentList.push(...response);
        return attachmentList;
      }
      return attachmentList;
    } catch (error) {
      console.error(error);
      ToggleError(`Error retrieving attachments`);
      return [];
    }
  };

const deleteSingleAttachment = async ({
  dispatch,
  attachment,
  identifier,
  isComplaintAttachment,
}: DeleteAttachmentParams) => {
  const parameters = generateApiParameters(`${config.COMS_URL}/object/${attachment.id}`);

  const response = await deleteMethod<string>(dispatch, parameters);

  if (isImage(attachment.name)) {
    const thumbParameters = generateApiParameters(`${config.COMS_URL}/object/${attachment.imageIconId}`);
    await deleteMethod<string>(dispatch, thumbParameters);
  }

  if (response) {
    if (isComplaintAttachment) {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/update-date-by-id/${identifier}`);
      await patch<boolean>(dispatch, parameters);
    }
    ToggleSuccess(`Attachment ${decodeURIComponent(attachment.name)} has been removed`);
  }
};

export const deleteAttachments =
  (attachments: COMSObject[], identifier: string | null, attachmentType: AttachmentEnum): AppThunk =>
  async (dispatch) => {
    const isComplaintAttachment =
      attachmentType === AttachmentEnum.COMPLAINT_ATTACHMENT || attachmentType === AttachmentEnum.OUTCOME_ATTACHMENT;

    if (attachments) {
      for (const attachment of attachments) {
        try {
          await deleteSingleAttachment({
            dispatch,
            attachment,
            identifier,
            isComplaintAttachment,
          });
        } catch (error) {
          console.error(error);
          ToggleError(`Attachment ${decodeURIComponent(attachment.name)} could not be deleted`);
        }
      }
    }
  };

const saveSingleAttachment = async ({
  dispatch,
  attachment,
  identifier,
  subIdentifier,
  attachmentType,
  isSynchronous,
  historicalAttachments,
  isComplaintAttachment,
  attachmentConfig,
}: SaveAttachmentParams) => {
  const attachmentIdentifier = subIdentifier ?? identifier;
  const attachmentName = encodeURIComponent(
    injectIdentifierToFilename(attachment.name, attachmentIdentifier, attachmentType),
  );

  const existingAttachment = historicalAttachments.find((item) => item.name === attachmentName);

  const header = buildAttachmentHeader({
    attachmentConfig,
    identifier,
    subIdentifier,
    attachmentType,
    contentType: attachment.type,
    isThumb: false,
    attachmentName,
  });

  const bucketId = attachmentType === AttachmentEnum.TASK_ATTACHMENT ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;

  const parameters = existingAttachment
    ? generateApiParameters(`${config.COMS_URL}/object/${existingAttachment.id}`)
    : generateApiParameters(`${config.COMS_URL}/object?bucketId=${bucketId}`);

  const response = await putFile<COMSObject>(dispatch, parameters, header, attachment, isSynchronous);

  if (isImage(attachment.name)) {
    const historicalThumbHeader = buildAttachmentHeader({
      attachmentConfig,
      identifier,
      subIdentifier,
      attachmentType,
      contentType: attachment.type,
      isThumb: true,
      attachmentName: attachment.name,
    });

    const bucketId = attachmentType === AttachmentEnum.TASK_ATTACHMENT ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;
    const params = generateApiParameters(`${config.COMS_URL}/object?bucketId=${bucketId}`);
    let historicalThumbs = await get<Array<COMSObject>>(dispatch, params, historicalThumbHeader, isSynchronous);

    const thumbName = encodeURIComponent(
      injectIdentifierToThumbFilename(attachment.name, attachmentIdentifier, attachmentType),
    );

    const existingThumb = historicalThumbs.find((item) => item.name === thumbName);

    const thumbHeader = buildAttachmentHeader({
      attachmentConfig,
      identifier,
      subIdentifier,
      attachmentType,
      contentType: attachment.type,
      isThumb: true,
      attachmentName: thumbName,
      attachmentId: response.id,
    });

    const thumbnailFile = await getThumbnailFile(attachment).catch((error) => {
      console.error("Error occurred while getting thumbnail file:", error);
    });

    if (thumbnailFile) {
      const thumbParameters = existingThumb
        ? generateApiParameters(`${config.COMS_URL}/object/${existingThumb.id}`)
        : generateApiParameters(`${config.COMS_URL}/object?bucketId=${bucketId}`);

      await putFile<COMSObject>(dispatch, thumbParameters, thumbHeader, thumbnailFile, isSynchronous);
    }
  }

  if (response) {
    if (isComplaintAttachment) {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/update-date-by-id/${identifier}`);
      await patch<boolean>(dispatch, parameters, false);
    }
    ToggleSuccess(`Attachment "${attachment.name}" saved`);
  }
};

export const saveAttachments =
  (
    attachments: File[],
    identifier: string,
    subIdentifier: string | undefined,
    attachmentType: AttachmentEnum,
    isSynchronous: boolean,
  ): AppThunk<Promise<void>> =>
  async (dispatch) => {
    if (!attachments) {
      return;
    }

    const attachmentConfig = getAttachmentConfig(attachmentType);
    const isComplaintAttachment = attachmentConfig.shouldUpdateComplaintDate ?? false;

    const bucketId = attachmentType === AttachmentEnum.TASK_ATTACHMENT ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;
    const params = generateApiParameters(`${config.COMS_URL}/object?bucketId=${bucketId}`);

    // Build header with both primary and sub header keys if applicable
    const historicalHeader = buildAttachmentHeader({
      attachmentConfig,
      identifier,
      subIdentifier,
      attachmentType,
      contentType: "",
      isThumb: false,
    });

    let historicalAttachments = await get<Array<COMSObject>>(dispatch, params, historicalHeader, isSynchronous);

    for (const attachment of attachments) {
      try {
        await saveSingleAttachment({
          dispatch,
          attachment,
          identifier,
          subIdentifier,
          attachmentType,
          isSynchronous,
          historicalAttachments,
          isComplaintAttachment,
          attachmentConfig,
        });
      } catch (error) {
        handleError(attachment, error);
      }
    }
  };
const handleError = (attachment: File, error: any) => {
  if (axios.isAxiosError(error) && error.response?.status === 409) {
    ToggleError(`Attachment "${attachment.name}" could not be saved.  Duplicate file.`);
  } else {
    ToggleError(`Attachment "${attachment.name}" could not be saved.`);
  }
};

export const bulkDownload =
  (taskId: string, taskNumber: number, attachments: COMSObject[]): AppThunk =>
  async (dispatch) => {
    // Track if download is in progress
    if ((window as any).__bulkDownloadInProgress) {
      ToggleError("A download is already in progress. Please wait.");
      return;
    }

    try {
      (window as any).__bulkDownloadInProgress = true;

      const authToken = localStorage.getItem(AUTH_TOKEN);
      if (!authToken) {
        ToggleError("Authentication required");
        return;
      }

      const timestamp = Date.now();
      const url = `${config.API_BASE_URL}/v1/document/tasks/bulk-download?t=${timestamp}`;

      console.log("Starting bulk download request...");

      // Use XMLHttpRequest for better blob handling and timeout control
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        let progressToast: any;

        xhr.onload = () => {
          if (progressToast) {
            DismissToast(progressToast);
          }
          console.log("Download complete, status:", xhr.status);

          if (xhr.status >= 200 && xhr.status < 300) {
            const blob = xhr.response as Blob;

            console.log("Blob size:", (blob.size / (1024 * 1024)).toFixed(2), "MB");

            if (blob.size === 0) {
              ToggleError("Download failed: Received empty file");
              reject(new Error("Empty file"));
              return;
            }

            // Trigger download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `Task_${taskNumber}_Attachments.zip`;
            link.style.display = "none";

            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(downloadUrl);
            }, 1000);

            ToggleSuccess(`Downloaded ${attachments.length} files as Task_${taskNumber}_Attachments.zip`);
            resolve();
          } else {
            // Handle HTTP errors
            console.error("HTTP error:", xhr.status, xhr.statusText);

            if (xhr.status === 413) {
              ToggleError("Files too large to download");
            } else if (xhr.status === 401) {
              ToggleError("Authentication failed. Please log in again.");
            } else {
              ToggleError(`Download failed: ${xhr.status} ${xhr.statusText}`);
            }
            reject(new Error(`HTTP ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.error("Network error");
          ToggleError("Network error occurred. Please check your connection and try again.");
          reject(new Error("Network error"));
        };

        xhr.onabort = () => {
          console.error("Download aborted");
          ToggleError("Download was aborted");
          reject(new Error("Aborted"));
        };

        xhr.ontimeout = () => {
          console.error("Download timeout");
          ToggleError("Download timed out. The file may be too large. Please try again or contact support.");
          reject(new Error("Timeout"));
        };

        // Open request
        xhr.open("POST", url, true);

        // Set headers
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Pragma", "no-cache");

        // Set 60 mins timeout
        xhr.timeout = 3600000; // 60 minutes

        // Send request
        xhr.send(
          JSON.stringify({
            taskId,
            taskNumber,
            attachments: attachments.map((a) => ({
              id: a.id,
              name: a.name,
            })),
          }),
        );
      });
    } catch (error) {
      console.error("Bulk download error:", error);
      if (error instanceof Error) {
        ToggleError(`Failed to download: ${error.message}`);
      } else {
        ToggleError("Failed to download attachments. Please try again.");
      }
    } finally {
      (window as any).__bulkDownloadInProgress = false;
    }
  };
