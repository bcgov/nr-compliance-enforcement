import { useState } from "react";
import { Button } from "react-bootstrap";
import { ToggleError } from "@/app/common/toast";
import { bulkDownload, getAttachments } from "@store/reducers/attachments";
import { useAppDispatch } from "@/app/hooks/hooks";
import AttachmentEnum from "@/app/constants/attachment-enum";

export const BulkDownloadButton = ({
  taskId,
  taskNumber,
  investigationGuid,
}: {
  taskId: string;
  taskNumber: number;
  investigationGuid: string;
}) => {
  const [downloading, setDownloading] = useState(false);
  const dispatch = useAppDispatch();

  const handleBulkDownload = async () => {
    try {
      setDownloading(true);
      const attachments = await dispatch(getAttachments(investigationGuid, taskId, AttachmentEnum.TASK_ATTACHMENT));
      if (!attachments || attachments.length === 0) {
        ToggleError("No attachments found for this task");
        return;
      }
      // Prepare attachment info for backend
      const attachmentInfo = attachments.map((a: any) => ({
        id: a.id,
        name: a.name,
        size: a.size || 0,
      }));

      await dispatch(bulkDownload(taskId, taskNumber, attachmentInfo));
    } catch (error) {
      console.error("Bulk download error:", error);
      ToggleError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="outline-primary"
      size="sm"
      onClick={handleBulkDownload}
      disabled={downloading}
      title="Download all attachments as a zip file"
    >
      <i className="bi bi-download"></i>
      <span className="ms-1">{downloading ? "Downloading..." : "Download all"}</span>
    </Button>
  );
};
