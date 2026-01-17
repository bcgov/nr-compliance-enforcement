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
import { AttachmentTypeConfig, getAttachmentConfig } from "@/app/types/app/attachment-config";

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
