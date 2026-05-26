import { Button } from "react-bootstrap";
import { DismissToast, ToggleError, ToggleInformation } from "@/app/common/toast";
import { useAppDispatch } from "@/app/hooks/hooks";
import { bulkDownload, selectCurrentDownload } from "@/app/store/reducers/bulk-download";
import { Id } from "react-toastify";
import { useSelector } from "react-redux";
import {
  Attachment,
  fetchAttachmentsWithMetadata,
} from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { createDownloadProgressHandler } from "@/app/common/attachment-download-helper";
import AttachmentEnum from "@constants/attachment-enum";

export const BulkDownloadButton = ({
  taskId,
  taskNumber,
  investigationGuid,
}: {
  taskId: string;
  taskNumber: number;
  investigationGuid: string;
}) => {
  const dispatch = useAppDispatch();
  const currentDownload = useSelector(selectCurrentDownload);

  const isCurrentTaskDownload = currentDownload?.downloadId === taskId;
  let toastDownloadInfo: Id;

  const handleBulkDownload = async () => {
    try {
      toastDownloadInfo = ToggleInformation("Download in progress, do not close the NatSuite application.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });

      const attachments = await fetchAttachmentsWithMetadata(investigationGuid, taskId);
      if (!attachments || attachments.length === 0) {
        ToggleError("No attachments found for this task");
        return;
      }

      // Prepare attachment info for backend
      const attachmentInfo = attachments.map((a: Attachment) => ({
        id: a.id,
        name: a.name,
        size: a.size || 0,
        folder: a.fileType ? `${a.fileType}s` : undefined,
      }));
      const onProgress = createDownloadProgressHandler(toastDownloadInfo);
      await dispatch(
        bulkDownload(
          taskId,
          attachmentInfo,
          `Task_${taskNumber}_Attachments.zip`,
          undefined,
          onProgress,
          AttachmentEnum.TASK_ATTACHMENT,
        ),
      );
    } catch (error) {
      console.error("Bulk download error:", error);
      ToggleError("Download failed. Please try again.");
    } finally {
      DismissToast(toastDownloadInfo);
    }
  };

  return (
    <Button
      variant="outline-primary"
      size="sm"
      onClick={handleBulkDownload}
      disabled={isCurrentTaskDownload}
      title="Download all attachments as a zip file"
    >
      <i className="bi bi-download"></i>
      <span className="ms-1">{isCurrentTaskDownload ? "Downloading..." : "Download all"}</span>
    </Button>
  );
};
