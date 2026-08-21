import { ProgressBar } from "react-bootstrap";
import { Id } from "react-toastify";
import AttachmentEnum from "@constants/attachment-enum";
import { getDisplayFilename, handlePersistAttachments, RETRY_CONFIG, withRetry } from "@common/attachment-utils";
import { DismissToast, ToggleError, ToggleInformation, UpdateToast } from "@common/toast";
import { generateApiParameters, get } from "@common/api";
import { getAttachments, getLatestObjectVersion } from "@store/reducers/attachments";
import { COMSObject } from "@apptypes/coms/object";
import { CreateAttachmentReferenceInput } from "@/generated/graphql";
import config from "@/config";

interface UploadAttachmentsWithProgressParams {
  dispatch: any;
  files: File[];
  identifier: string;
  subIdentifier?: string;
  attachmentType: AttachmentEnum;
  toastId: Id;
  buildExtendedMeta?: (file: File, index: number) => Record<string, string>;
}

// Uploads attachments with retry logic and progress bar.
export const uploadAttachmentsWithProgress = async ({
  dispatch,
  files,
  identifier,
  subIdentifier,
  attachmentType,
  toastId,
  buildExtendedMeta,
}: UploadAttachmentsWithProgressParams): Promise<string[]> => {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  let completedBytes = 0;
  let currentFilePercentage = 0;
  let lastRenderedOverall = -1;
  let lastRenderedStatus: string | undefined;
  const failedFiles: string[] = [];

  const updateToast = (fileSize: number, status?: string) => {
    const overall =
      totalSize > 0 ? Math.round(((completedBytes + (currentFilePercentage / 100) * fileSize) / totalSize) * 100) : 0;

    if (overall === lastRenderedOverall && status === lastRenderedStatus) return;
    lastRenderedOverall = overall;
    lastRenderedStatus = status;

    UpdateToast(
      toastId,
      <>
        <div>Upload in progress, do not close the NatSuite application.</div>
        <ProgressBar
          now={overall}
          label={`${overall}%`}
          animated
          striped
          className="mt-3"
        />
        {status && <div className="text-muted mt-1 small">{status}</div>}
      </>,
    );
  };

  for (let i = 0; i < files.length; i++) {
    currentFilePercentage = 0;
    const fileLabel = files.length > 1 ? `File ${i + 1} of ${files.length}` : "";

    const buildStatus = (attempt: number) => {
      const retryLabel = attempt > 1 ? `Retry attempt ${attempt - 1} of ${RETRY_CONFIG.MAX_RETRIES}` : "";
      return [fileLabel, retryLabel].filter(Boolean).join(" - ") || undefined;
    };

    const result = await withRetry(
      async (attempt) => {
        currentFilePercentage = 0;
        updateToast(files[i].size, buildStatus(attempt));

        await handlePersistAttachments({
          dispatch,
          attachmentsToAdd: [files[i]],
          attachmentsToDelete: null,
          identifier,
          subIdentifier,
          setAttachmentsToAdd: () => {},
          setAttachmentsToDelete: () => {},
          attachmentType,
          isSynchronous: false,
          extendedMeta: buildExtendedMeta?.(files[i], i),
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              currentFilePercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              updateToast(files[i].size, buildStatus(attempt));
            }
          },
          throwOnError: true,
        });
      },
      {
        onRetry: (attempt, error) => {
          ToggleError(`Upload failed for "${files[i].name}". Retrying upload. Error: ${error.message}`);
          currentFilePercentage = 0;
          updateToast(files[i].size, buildStatus(attempt + 1));
        },
      },
    );

    completedBytes += result.success ? files[i].size : (currentFilePercentage / 100) * files[i].size;
    if (!result.success) {
      failedFiles.push(files[i].name);
    }
  }

  if (failedFiles.length > 0) {
    ToggleError(`Failed to upload: ${failedFiles.join(", ")}`);
  }

  return failedFiles;
};

interface CopyInvestigationPartyAttachmentsParams {
  dispatch: any;
  investigationGuid: string;
  investigationPartyGuid: string;
  sharedPartyGuid: string;
}

// Pulls a COMS object down as a File so it can be re-uploaded under a different set of tags.
const downloadComsObjectAsFile = async (dispatch: any, objectId: string, fileName: string): Promise<File> => {
  const parameters = generateApiParameters(`${config.COMS_URL}/object/${objectId}?download=url`);
  const presignedUrl = await get<string>(dispatch, parameters);

  const response = await fetch(presignedUrl);
  if (!response.ok) {
    throw new Error(`COMS download responded with ${response.status}`);
  }

  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

// Copies an investigation party's attachments onto a shared party.
export const copyInvestigationPartyAttachmentsToSharedParty = async ({
  dispatch,
  investigationGuid,
  investigationPartyGuid,
  sharedPartyGuid,
}: CopyInvestigationPartyAttachmentsParams): Promise<string[]> => {
  const objects = await dispatch(
    getAttachments(investigationGuid, investigationPartyGuid, AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT, false),
  );

  const copyable = objects.filter((object: COMSObject) => !!object.id);
  if (!copyable.length) {
    return [];
  }

  // Only raised once there is something to copy, so a party without attachments stays quiet
  const toastId = ToggleInformation("Uploading party attachments, do not close the application.", {
    position: "top-right",
    autoClose: false,
    closeOnClick: false,
    closeButton: false,
    draggable: false,
  });

  try {
    const files: File[] = [];
    const failedFiles: string[] = [];

    for (const object of copyable) {
      const fileName = getDisplayFilename(object.name);
      try {
        files.push(await downloadComsObjectAsFile(dispatch, object.id as string, fileName));
      } catch (error) {
        console.error(`Could not download "${fileName}" to copy onto the shared party`, error);
        failedFiles.push(fileName);
      }
    }

    if (!files.length) {
      return failedFiles;
    }

    const failedUploads = await uploadAttachmentsWithProgress({
      dispatch,
      files,
      identifier: sharedPartyGuid,
      subIdentifier: undefined,
      attachmentType: AttachmentEnum.PARTY_ATTACHMENT,
      toastId,
    });

    return [...failedFiles, ...failedUploads];
  } finally {
    DismissToast(toastId);
  }
};

interface BuildSharedPartyAttachmentReferencesParams {
  dispatch: any;
  sharedPartyGuid: string;
}

// Attachments live only in COMS, so the shared party's objects are listed and pinned to specific
// versions here, then stored as reference rows against the investigation party.
export const buildSharedPartyAttachmentReferences = async ({
  dispatch,
  sharedPartyGuid,
}: BuildSharedPartyAttachmentReferencesParams): Promise<CreateAttachmentReferenceInput[]> => {
  const attachments: COMSObject[] = await dispatch(
    getAttachments(sharedPartyGuid, undefined, AttachmentEnum.PARTY_ATTACHMENT, true),
  );

  const attachmentReferences: CreateAttachmentReferenceInput[] = [];

  for (const attachment of attachments) {
    if (attachment.id === undefined) {
      continue;
    }

    const version = await dispatch(getLatestObjectVersion(attachment.id));
    if (version === undefined) {
      continue;
    }

    // Pin the thumbnail alongside it, when the image has one
    const thumb =
      attachment.imageIconId === undefined ? undefined : await dispatch(getLatestObjectVersion(attachment.imageIconId));

    attachmentReferences.push({
      objectId: attachment.id,
      version: version.s3VersionId,
      fileName: attachment.name,
      createdAt: attachment.createdAt,
      thumbObjectId: thumb === undefined ? undefined : attachment.imageIconId,
      thumbVersion: thumb?.s3VersionId,
    });
  }

  return attachmentReferences;
};
