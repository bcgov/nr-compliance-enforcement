import { ProgressBar } from "react-bootstrap";
import { Id } from "react-toastify";
import { UpdateToast } from "@common/toast";
import { RETRY_CONFIG } from "@common/attachment-utils";
import { BulkDownloadProgressCallback, BulkDownloadProgressEvent } from "@store/reducers/bulk-download";

// Builds a progress callback that renders a progress bar inside the given toast.
// Mirrors the UX of uploadAttachmentsWithProgress for symmetry with upload progress.
export const createDownloadProgressHandler = (toastId: Id): BulkDownloadProgressCallback => {
  let lastRenderedOverall = -1;
  let lastRenderedMessage: string | undefined;
  let lastRenderedStatus: string | undefined;

  return (event: BulkDownloadProgressEvent) => {
    const { fileIndex, fileCount, overallPercent, retryAttempt, phase, fileName } = event;

    const overall = Math.min(100, Math.max(0, overallPercent));

    let message: string;
    let status: string | undefined;
    const fileLabel = fileCount > 1 ? `File ${fileIndex + 1} of ${fileCount}` : "";
    if (phase === "compressing") {
      message = "Download in progress, do not close the NatSuite application.";
      status = `${fileLabel}: Adding to zip…`;
    } else if (phase === "finalizing") {
      message = "Download in progress, do not close the NatSuite application.";
      status = "Finalizing zip file…";
    } else {
      message = "Download in progress, do not close the NatSuite application.";
      const retryLabel = retryAttempt ? `Retry attempt ${retryAttempt} of ${RETRY_CONFIG.MAX_RETRIES}` : "";
      status = [fileLabel, retryLabel].filter(Boolean).join(" - ") || undefined;
    }

    if (overall === lastRenderedOverall && message === lastRenderedMessage && status === lastRenderedStatus) return;
    lastRenderedOverall = overall;
    lastRenderedMessage = message;
    lastRenderedStatus = status;

    UpdateToast(
      toastId,
      <>
        <div>{message}</div>
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
};
