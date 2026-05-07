import { Button } from "react-bootstrap";
import { DismissToast, ToggleError, ToggleInformation } from "@/app/common/toast";
import { getAttachments } from "@store/reducers/attachments";
import { useAppDispatch } from "@/app/hooks/hooks";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { bulkDownload, selectCurrentDownload } from "@/app/store/reducers/bulk-download";
import { Id } from "react-toastify";
import { useSelector } from "react-redux";
import { COMSObject } from "@/app/types/coms/object";

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

      const attachments = await dispatch(getAttachments(investigationGuid, taskId, AttachmentEnum.TASK_ATTACHMENT));
      if (!attachments || attachments.length === 0) {
        ToggleError("No attachments found for this task");
        return;
      }

      console.log(attachments);
      // Prepare attachment info for backend
      const attachmentInfo = attachments.map((a: COMSObject) => ({
        id: a.id,
        name: a.name,
        size: a.size || 0,
        folder: a.fileType ? `${a.fileType}s` : undefined,
      }));
      await dispatch(bulkDownload(taskId, attachmentInfo, `Task_${taskNumber}_Attachments.zip`));
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
