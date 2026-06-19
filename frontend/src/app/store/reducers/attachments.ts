import { AppThunk } from "@store/store";
import { deleteMethod, generateApiParameters, get, patch, put, putFile } from "@common/api";
import { from } from "linq-to-typescript";
import axios, { AxiosProgressEvent } from "axios";
import { COMSObject } from "@apptypes/coms/object";
import config from "@/config";
import {
  getThumbnailFile,
  injectIdentifierToFilename,
  injectIdentifierToThumbFilename,
  isImage,
} from "@common/methods";
import { ToggleError, ToggleSuccess } from "@common/toast";
import AttachmentEnum from "@constants/attachment-enum";
import { AttachmentTypeConfig, getAttachmentConfig, isSecureAttachmentType } from "@/app/types/app/attachment-config";
import { InvestigationAttachmentReference } from "@/generated/graphql";

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
  extendedMeta?: Record<string, string>;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

interface DeleteAttachmentParams {
  dispatch: any;
  attachment: COMSObject;
  identifier: string | null;
  isComplaintAttachment: boolean;
  attachmentType: AttachmentEnum;
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
  extendedMeta?: Record<string, string>;
  /** When provided, the file's byte size is written as x-amz-meta-content-length so it
   *  can be retrieved later via the metadata API */
  size?: number;
}

export interface ObjectVersion {
  id: string;
  s3VersionId: string;
  objectId: string;
  isLatest: boolean;
  deleteMarker: boolean;
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
  extendedMeta,
  size,
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

  if (typeof size === "number" && size > 0) {
    header["x-amz-meta-content-length"] = String(size);
  }

  if (extendedMeta) {
    Object.entries(extendedMeta).forEach(([key, value]) => {
      header[`x-amz-meta-${key}`] = value;
    });
  }

  return header;
};

// Get list of the attachments
export const getAttachments =
  (
    identifier: string,
    subIdentifier: string | undefined,
    attachmentType: AttachmentEnum,
    includeThumbnails: boolean = true,
  ): AppThunk<Promise<COMSObject[]>> =>
  async (dispatch) => {
    const attachmentList: COMSObject[] = [];
    try {
      const attachmentConfig = getAttachmentConfig(attachmentType);
      const bucketId = isSecureAttachmentType(attachmentType) ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;
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
          if (includeThumbnails && isImage(attachment.name)) {
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

// Creates an array of COMS objects based on pinned object identifiers and versions
export const getSnapshotAttachments =
  (references: InvestigationAttachmentReference[]): AppThunk<Promise<COMSObject[]>> =>
  async (dispatch) => {
    const attachments: COMSObject[] = [];

    try {
      for (const reference of references) {
        // Hidden (soft-deleted) references aren't shown in the investigation
        if (!reference.activeInd) {
          continue;
        }

        const attachment: COMSObject = {
          id: reference.objectId,
          name: reference.fileName,
          createdAt: reference.createdAt,
          s3VersionId: reference.version,
          path: "",
          public: false,
          active: true,
          bucketId: "",
          createdBy: "",
          updatedBy: "",
        };

        // Pinned thumbnail preview, when the snapshot captured one
        if (reference.thumbObjectId && reference.thumbVersion) {
          const thumbParameters = generateApiParameters(
            `${config.COMS_URL}/object/${reference.thumbObjectId}?download=url&s3VersionId=${reference.thumbVersion}`,
          );
          attachment.imageIconId = reference.thumbObjectId ?? "";
          attachment.imageIconString = await get<string>(dispatch, thumbParameters);
        }

        attachments.push(attachment);
      }
    } catch (error) {
      console.error(error);
      ToggleError(`Error retrieving attachments`);
      return [];
    }

    return attachments;
  };

// decodeURIComponent throws an error on malformed names, fall back to the raw name
const safeDecodeFilename = (name: string): string => {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

const deleteSingleAttachment = async ({
  dispatch,
  attachment,
  identifier,
  isComplaintAttachment,
  attachmentType,
}: DeleteAttachmentParams) => {
  const parameters = generateApiParameters(`${config.COMS_URL}/object/${attachment.id}`);

  const response = await deleteMethod<string>(dispatch, parameters);

  if (response) {
    if (isComplaintAttachment || attachmentType === AttachmentEnum.PARTY_ATTACHMENT) {
      if (isImage(attachment.name)) {
        const thumbParameters = generateApiParameters(`${config.COMS_URL}/object/${attachment.imageIconId}`);
        await deleteMethod<string>(dispatch, thumbParameters);
      }
      if (isComplaintAttachment) {
        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/update-date-by-id/${identifier}`);
        await patch<string>(dispatch, parameters);
      }
    }
    ToggleSuccess(`Attachment ${safeDecodeFilename(attachment.name)} has been removed`);
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
            attachmentType,
          });
        } catch (error) {
          console.error(error);
          ToggleError(`Attachment ${safeDecodeFilename(attachment.name)} could not be deleted`);
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
  extendedMeta,
  onUploadProgress,
}: SaveAttachmentParams) => {
  const attachmentIdentifier = subIdentifier ?? identifier;
  const attachmentName = injectIdentifierToFilename(attachment.name, attachmentIdentifier, attachmentType);
  const existingAttachment = historicalAttachments.find((item) => item.name === attachmentName);

  const header = buildAttachmentHeader({
    attachmentConfig,
    identifier,
    subIdentifier,
    attachmentType,
    contentType: attachment.type,
    isThumb: false,
    attachmentName,
    extendedMeta,
    size: attachment.size,
  });

  const bucketId = isSecureAttachmentType(attachmentType) ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;

  const parameters = existingAttachment
    ? generateApiParameters(`${config.COMS_URL}/object/${existingAttachment.id}`)
    : generateApiParameters(`${config.COMS_URL}/object?bucketId=${bucketId}`);

  const response = await putFile<COMSObject>(dispatch, parameters, header, attachment, isSynchronous, onUploadProgress);

  if (
    isImage(attachment.name) &&
    (!isSecureAttachmentType(attachmentType) ||
      attachmentType === AttachmentEnum.PARTY_ATTACHMENT ||
      attachmentType === AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT)
  ) {
    const historicalThumbHeader = buildAttachmentHeader({
      attachmentConfig,
      identifier,
      subIdentifier,
      attachmentType,
      contentType: attachment.type,
      isThumb: true,
      attachmentName: attachment.name,
    });

    const bucketId = isSecureAttachmentType(attachmentType) ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;
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

interface SaveAttachmentsParams {
  attachments: File[];
  identifier: string;
  subIdentifier: string | undefined;
  attachmentType: AttachmentEnum;
  isSynchronous: boolean;
  extendedMeta?: Record<string, string>;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  throwOnError?: boolean;
}

export const saveAttachments =
  ({
    attachments,
    identifier,
    subIdentifier,
    attachmentType,
    isSynchronous,
    extendedMeta,
    onUploadProgress,
    throwOnError,
  }: SaveAttachmentsParams): AppThunk<Promise<void>> =>
  async (dispatch) => {
    if (!attachments) {
      return;
    }

    const attachmentConfig = getAttachmentConfig(attachmentType);
    const isComplaintAttachment = attachmentConfig.shouldUpdateComplaintDate ?? false;

    const bucketId = isSecureAttachmentType(attachmentType) ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;
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
          extendedMeta,
          onUploadProgress,
        });
      } catch (error) {
        if (throwOnError) {
          throw error;
        }
        handleError(attachment, error);
      }
    }
  };

export const getLatestObjectVersion =
  (objectId: string): AppThunk<Promise<ObjectVersion | undefined>> =>
  async (dispatch) => {
    // Fetch versions to get the latest versionId as this is required to update metadata
    const versionParameters = generateApiParameters(`${config.COMS_URL}/object/${objectId}/version`);
    const versions = await get<ObjectVersion[]>(dispatch, versionParameters);
    return versions.find((v) => v.isLatest && !v.deleteMarker);
  };

// Deletes and replaces the attachment metadata on a file.  Note that all custom meta-data is affected
export const updateAttachmentMetadata =
  (objectId: string, extendedMeta: Record<string, string>, silent: boolean = false): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      // Fetch versions to get the latest versionId as this is required to update metadata
      const latestVersion = await dispatch(getLatestObjectVersion(objectId));

      if (!latestVersion) {
        ToggleError("Could not find latest version of attachment");
        return;
      }

      const parameters = generateApiParameters(
        `${config.COMS_URL}/object/${objectId}/metadata?versionId=${latestVersion.id}`,
      );

      const headers: Record<string, string> = {};
      Object.entries(extendedMeta).forEach(([key, value]) => {
        headers[`x-amz-meta-${key}`] = value;
      });

      await put<void>(dispatch, parameters, true, headers);

      if (!silent) {
        ToggleSuccess("Attachment updated successfully");
      }
    } catch (error) {
      console.error(error);
      if (!silent) {
        ToggleError("Failed to update attachment");
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
