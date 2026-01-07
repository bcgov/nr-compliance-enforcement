import { AppThunk } from "@store/store";
import { deleteMethod, generateApiParameters, get, patch, putFile } from "@common/api";
import { from } from "linq-to-typescript";
import { COMSObject } from "@apptypes/coms/object";
import config from "@/config";
import {
  getThumbnailFile,
  injectIdentifierToFilename,
  injectIdentifierToThumbFilename,
  isImage,
} from "@common/methods";
import { ToggleError, ToggleSuccess } from "@common/toast";
import axios from "axios";
import AttachmentEnum from "@constants/attachment-enum";
import { getComplaintById } from "./complaints";

// Get list of the attachments
export const getAttachments =
  (identifier: string, attachmentType: AttachmentEnum): AppThunk<Promise<COMSObject[]>> =>
  async (dispatch) => {
    const attachmentList: COMSObject[] = [];
    try {
      const parameters = generateApiParameters(`${config.COMS_URL}/object?bucketId=${config.COMS_BUCKET}&latest=true`);

      const isComplaintAttachment =
        attachmentType === AttachmentEnum.COMPLAINT_ATTACHMENT || attachmentType === AttachmentEnum.OUTCOME_ATTACHMENT;

      const headerKey = isComplaintAttachment ? "x-amz-meta-complaint-id" : "x-amz-meta-task-id";

      let response = await get<Array<COMSObject>>(dispatch, parameters, {
        [headerKey]: identifier,
        "x-amz-meta-is-thumb": "N",
        "x-amz-meta-attachment-type": attachmentType,
      });

      if (response && from(response).any()) {
        for (const attachment of response) {
          if (isImage(attachment.name)) {
            const thumbArrayResponse = await get<Array<COMSObject>>(dispatch, parameters, {
              [headerKey]: identifier,
              "x-amz-meta-is-thumb": "Y",
              "x-amz-meta-thumb-for": attachment?.id,
            });

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

// delete attachments from objectstore
export const deleteAttachments =
  (
    attachments: COMSObject[],
    identifier: string | null,
    attachmentType: AttachmentEnum,
    complaintType?: string,
  ): AppThunk =>
  async (dispatch) => {
    const isComplaintAttachment =
      attachmentType === AttachmentEnum.COMPLAINT_ATTACHMENT || attachmentType === AttachmentEnum.OUTCOME_ATTACHMENT;

    if (attachments) {
      for (const attachment of attachments) {
        try {
          const parameters = generateApiParameters(`${config.COMS_URL}/object/${attachment.id}`);

          const response = await deleteMethod<string>(dispatch, parameters);
          if (isImage(attachment.name)) {
            const thumbParameters = generateApiParameters(`${config.COMS_URL}/object/${attachment.imageIconId}`);

            await deleteMethod<string>(dispatch, thumbParameters);
          }

          if (response) {
            if (isComplaintAttachment) {
              const parameters = generateApiParameters(
                `${config.API_BASE_URL}/v1/complaint/update-date-by-id/${identifier}`,
              );
              await patch<boolean>(dispatch, parameters);
            }
            ToggleSuccess(`Attachment ${decodeURIComponent(attachment.name)} has been removed`);
          }
        } catch (error) {
          console.error(error);
          ToggleError(`Attachment ${decodeURIComponent(attachment.name)} could not be deleted`);
        }
      }
      // refresh store
      if (identifier && complaintType) {
        dispatch(getComplaintById(identifier, complaintType));
        dispatch(getAttachments(identifier, attachmentType));
      }
    }
  };

// save new attachment(s) to object store
export const saveAttachments =
  (attachments: File[], identifier: string, attachmentType: AttachmentEnum): AppThunk<Promise<void>> =>
  async (dispatch) => {
    if (!attachments) {
      return;
    }

    const isComplaintAttachment =
      attachmentType === AttachmentEnum.COMPLAINT_ATTACHMENT || attachmentType === AttachmentEnum.OUTCOME_ATTACHMENT;

    const params = generateApiParameters(`${config.COMS_URL}/object?bucketId=${config.COMS_BUCKET}`);

    const headerKey = isComplaintAttachment ? "x-amz-meta-complaint-id" : "x-amz-meta-task-id";

    const historicalHeader = {
      [headerKey]: identifier,
      "x-amz-meta-is-thumb": "N",
      "x-amz-meta-attachment-type": attachmentType,
    };

    let historicalAttachments = await get<Array<COMSObject>>(dispatch, params, historicalHeader);

    for (const attachment of attachments) {
      const attachmentName = encodeURIComponent(
        injectIdentifierToFilename(attachment.name, identifier, attachmentType),
      );
      const existingAttachment = historicalAttachments.find((item) => item.name === attachmentName);
      const header = {
        [headerKey]: identifier,
        "x-amz-meta-is-thumb": "N",
        "x-amz-meta-attachment-type": attachmentType,
        "Content-Disposition": `attachment; filename="${attachmentName}"`,
        "Content-Type": attachment?.type,
      };

      try {
        const parameters = existingAttachment
          ? generateApiParameters(`${config.COMS_URL}/object/${existingAttachment.id}`)
          : generateApiParameters(`${config.COMS_URL}/object?bucketId=${config.COMS_BUCKET}`);
        const response = await putFile<COMSObject>(dispatch, parameters, header, attachment);

        if (isImage(attachment.name)) {
          const thumbHeader = {
            [headerKey]: identifier,
            "x-amz-meta-is-thumb": "Y",
            "x-amz-meta-thumb-for": response.id,
            "Content-Disposition": `attachment; filename="${encodeURIComponent(
              injectIdentifierToThumbFilename(attachment.name, identifier, attachmentType),
            )}"`,
            "Content-Type": "image/jpeg",
          };

          const thumbnailFile = await getThumbnailFile(attachment).catch((error) => {
            //we are just going to ignore this and move on
            console.error("Error occurred while getting thumbnail file:", error);
          });

          if (thumbnailFile) {
            await putFile<COMSObject>(dispatch, parameters, thumbHeader, thumbnailFile);
          }
        }

        if (response) {
          if (isComplaintAttachment) {
            const parameters = generateApiParameters(
              `${config.API_BASE_URL}/v1/complaint/update-date-by-id/${identifier}`,
            );
            await patch<boolean>(dispatch, parameters);
          }
          ToggleSuccess(`Attachment "${attachment.name}" saved`);
        }
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
