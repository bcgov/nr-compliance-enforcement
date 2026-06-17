import { FC, useCallback, useEffect, useState } from "react";
import { Attachments } from "@components/common/attachments-carousel";
import { COMSObject } from "@apptypes/coms/object";
import { handleAddAttachments, handleDeleteAttachments, handlePersistAttachments } from "@common/attachment-utils";
import { uploadAttachmentsWithProgress } from "@common/attachment-upload-helper";
import AttachmentEnum from "@constants/attachment-enum";
import { DismissToast, ToggleInformation } from "@/app/common/toast";
import { Id } from "react-toastify";
import { useAppDispatch } from "@hooks/hooks";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface PartyAttachmentsProps {
  partyId: string;
  triggerSave: boolean;
  triggerCancel: boolean;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onSaved?: () => void;
}

export const PartyAttachments: FC<PartyAttachmentsProps> = ({
  partyId,
  triggerSave,
  triggerCancel,
  onDirtyChange,
  onSaved,
}) => {
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [attachmentCount, setAttachmentCount] = useState<number>(0);
  const [isPendingUpload, setIsPendingUpload] = useState<boolean>(false);
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState<number>(0);

  const dispatch = useAppDispatch();
  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const handleSlideCountChange = useCallback((count: number) => {
    setAttachmentCount((prev) => (prev === count ? prev : count));
  }, []);

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    markDirty();
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    markDirty();
    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  useEffect(() => {
    const noPendingAdditions = !attachmentsToAdd || attachmentsToAdd.length === 0;
    const noPendingDeletes = !attachmentsToDelete || attachmentsToDelete.length === 0;

    if (noPendingAdditions && noPendingDeletes) {
      markClean();
    }
  }, [attachmentsToAdd, attachmentsToDelete, markClean]);

  useEffect(() => {
    if (triggerSave) {
      saveButtonClick();
    }
  }, [triggerSave]);

  useEffect(() => {
    if (triggerCancel) {
      cancelButtonClick();
    }
  }, [triggerCancel]);

  const saveButtonClick = async () => {
    markClean();
    let toastId: Id | undefined;
    if (attachmentsToDelete?.length) {
      await handlePersistAttachments({
        dispatch,
        attachmentsToAdd: null,
        attachmentsToDelete,
        identifier: partyId,
        subIdentifier: undefined,
        setAttachmentsToAdd,
        setAttachmentsToDelete,
        attachmentType: AttachmentEnum.PARTY_ATTACHMENT,
        isSynchronous: false,
      });
    }
    if (attachmentsToAdd?.length) {
      toastId = ToggleInformation("Upload in progress, do not close the application.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });
      await uploadAttachmentsWithProgress({
        dispatch,
        files: attachmentsToAdd,
        identifier: partyId,
        attachmentType: AttachmentEnum.PARTY_ATTACHMENT,
        toastId,
      });
      setAttachmentsToAdd(null);
    }
    if (toastId) DismissToast(toastId);
    setAttachmentRefreshKey((k) => k + 1);
    onSaved?.();
  };

  const cancelButtonClick = () => {
    markClean();
    setAttachmentsToAdd([]);
    setAttachmentsToDelete([]);
    setIsPendingUpload(true);
    setAttachmentRefreshKey((k) => k + 1);
  };

  return (
    <section
      className="comp-details-section mb-3"
      id="party-attachments"
    >
      <div className="comp-details-form-row">
        <label
          className="align-self-lg-center"
          htmlFor="party-attachments"
        >
          Party Attachments
        </label>
        <div className="comp-details-edit-input">
          <Attachments
            attachmentType={AttachmentEnum.PARTY_ATTACHMENT}
            identifier={partyId}
            allowUpload={true}
            allowDelete={true}
            cancelPendingUpload={isPendingUpload}
            setCancelPendingUpload={setIsPendingUpload}
            onFilesSelected={onHandleAddAttachments}
            onFileDeleted={onHandleDeleteAttachment}
            onSlideCountChange={handleSlideCountChange}
            refreshKey={attachmentRefreshKey}
            showPreview={attachmentCount > 0}
          />
        </div>
      </div>
    </section>
  );
};
