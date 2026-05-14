import { ProgressBar } from "react-bootstrap";
import { Id } from "react-toastify";
import { UpdateToast } from "@common/toast";
import { RETRY_CONFIG } from "@common/attachment-utils";
import { BulkDownloadProgressCallback, BulkDownloadProgressEvent } from "@store/reducers/bulk-download";

// Builds a progress callback that renders a progress bar inside the given toast.
// Mirrors the UX of uploadAttachmentsWithProgress for symmetry with upload progress.
export const createDownloadProgressHandler = (toastId: Id): BulkDownloadProgressCallback => {
  let lastRenderedOverall = -1;
  let lastRenderedStatus: string | undefined;

  return (event: BulkDownloadProgressEvent) => {
    const { fileIndex, fileCount, bytesDownloaded, totalBytes, retryAttempt, phase } = event;

    const overall =
      totalBytes > 0 ? Math.min(100, Math.round((bytesDownloaded / totalBytes) * 100)) : phase === "finalizing" ? 100 : 0;

    let status: string | undefined;
    if (phase === "finalizing") {
      status = "Finalizing zip file…";
    } else {
      const fileLabel = fileCount > 1 ? `File ${fileIndex + 1} of ${fileCount}` : "";
      const retryLabel = retryAttempt ? `Retry attempt ${retryAttempt} of ${RETRY_CONFIG.MAX_RETRIES}` : "";
      status = [fileLabel, retryLabel].filter(Boolean).join(" - ") || undefined;
    }

    if (overall === lastRenderedOverall && status === lastRenderedStatus) return;
    lastRenderedOverall = overall;
    lastRenderedStatus = status;

    UpdateToast(
      toastId,
      <>
        <div>Download in progress, do not close the NatSuite application.</div>
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
