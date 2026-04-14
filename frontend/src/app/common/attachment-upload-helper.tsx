import { ProgressBar } from "react-bootstrap";
import { Id } from "react-toastify";
import AttachmentEnum from "@constants/attachment-enum";
import { handlePersistAttachments, RETRY_CONFIG, withRetry } from "@common/attachment-utils";
import { ToggleError, UpdateToast } from "@common/toast";

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
