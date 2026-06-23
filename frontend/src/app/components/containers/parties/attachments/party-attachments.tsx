import { FC, useCallback, useEffect, useState } from "react";
import { Attachments } from "@components/common/attachments-carousel";
import { COMSObject } from "@apptypes/coms/object";
import {
  getDisplayFilename,
  handleAddAttachments,
  handleDeleteAttachments,
  handlePersistAttachments,
} from "@common/attachment-utils";
import { uploadAttachmentsWithProgress } from "@common/attachment-upload-helper";
import { DismissToast, ToggleError, ToggleInformation } from "@/app/common/toast";
import { Id } from "react-toastify";
import { useAppDispatch } from "@hooks/hooks";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { InvestigationAttachmentReference } from "@/generated/graphql";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";

const DEACTIVATE_INVESTIGATION_ATTACHMENT_REFERENCE_MUTATION = gql`
  mutation DeactivateInvestigationAttachmentReference($input: DeactivateInvestigationAttachmentReferenceInput!) {
    deactivateInvestigationAttachmentReference(input: $input) {
      objectId
      activeInd
    }
  }
`;

interface PartyAttachmentsProps {
  partyId: string;
  activityId?: string;
  attachmentType: number;
  triggerSave: boolean;
  triggerCancel?: boolean;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onSaved?: () => void;
  attachmentReferences?: InvestigationAttachmentReference[];
  onPendingImagesChange?: (images: { fileName: string; verb: string }[]) => void;
}

export const PartyAttachments: FC<PartyAttachmentsProps> = ({
  partyId,
  activityId,
  attachmentType,
  triggerSave,
  triggerCancel,
  onDirtyChange,
  onSaved,
  attachmentReferences,
  onPendingImagesChange,
}) => {
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [referencesToDeactivate, setReferencesToDeactivate] = useState<COMSObject[] | null>(null);
  const [attachmentsToEdit, setAttachmentsToEdit] = useState<File[] | null>(null);
  const [attachmentCount, setAttachmentCount] = useState<number>(0);
  const [isPendingUpload, setIsPendingUpload] = useState<boolean>(false);
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState<number>(0);

  const dispatch = useAppDispatch();
  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const deactivateReferenceMutation = useGraphQLMutation(DEACTIVATE_INVESTIGATION_ATTACHMENT_REFERENCE_MUTATION, {
    onError: (error: any) => {
      console.error("Error deactivating attachment reference:", error);
      ToggleError("Failed to remove attachment");
    },
  });

  const handleSlideCountChange = useCallback((count: number) => {
    setAttachmentCount((prev) => (prev === count ? prev : count));
  }, []);

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    markDirty();
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleReplaceAttachments = (replacedFiles: File[]) => {
    markDirty();
    handleAddAttachments(setAttachmentsToEdit, replacedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    markDirty();

    // Snapshotted globals must never hit COMS — stage them to deactivate the reference row instead
    if (fileToDelete.isSnapshot) {
      setReferencesToDeactivate((prev) => (prev ? [...prev, fileToDelete] : [fileToDelete]));
      return;
    }

    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  // used to communicate back to the parent for party history
  useEffect(() => {
    const editedFileNames = new Set((attachmentsToEdit ?? []).map((file) => file.name));
    const added = (attachmentsToAdd ?? [])
      .filter((file) => !editedFileNames.has(file.name))
      .map((file) => ({ fileName: getDisplayFilename(file.name), verb: "ADDED" }));
    const edited = (attachmentsToEdit ?? []).map((file) => ({
      fileName: getDisplayFilename(file.name),
      verb: "EDITED",
    }));
    const removed = (attachmentsToDelete ?? []).map((obj) => ({
      fileName: getDisplayFilename(obj.name),
      verb: "REMOVED",
    }));
    onPendingImagesChange?.([...added, ...edited, ...removed]);
  }, [attachmentsToAdd, attachmentsToDelete, attachmentsToEdit, onPendingImagesChange]);

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

  // Set the identifiers based on the type
  let identifier: string = "";
  let subidentifier: string | undefined;

  switch (attachmentType) {
    case AttachmentEnum.PARTY_ATTACHMENT: {
      identifier = partyId;
      break;
    }
    case AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT: {
      identifier = activityId ?? "";
      subidentifier = partyId || undefined;
      break;
    }
  }

  const saveButtonClick = async () => {
    markClean();
    let toastId: Id | undefined;

    if (referencesToDeactivate?.length) {
      await Promise.all(
        referencesToDeactivate.map((reference) =>
          deactivateReferenceMutation.mutateAsync({
            input: { investigationPartyGuid: partyId, objectId: reference.id },
          }),
        ),
      );
      setReferencesToDeactivate(null);
    }

    if (attachmentsToDelete?.length) {
      await handlePersistAttachments({
        dispatch,
        attachmentsToAdd: null,
        attachmentsToDelete,
        identifier: partyId,
        subIdentifier: undefined,
        setAttachmentsToAdd,
        setAttachmentsToDelete,
        attachmentType: attachmentType,
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
        identifier: identifier,
        subIdentifier: subidentifier,
        attachmentType: attachmentType,
        toastId,
      });
      setAttachmentsToAdd(null);
      setAttachmentsToEdit(null);
    }
    if (toastId) DismissToast(toastId);
    setAttachmentRefreshKey((k) => k + 1);
    onSaved?.();
  };

  const cancelButtonClick = () => {
    markClean();
    setAttachmentsToAdd([]);
    setAttachmentsToDelete([]);
    setAttachmentsToEdit([]);
    setIsPendingUpload(true);
    setAttachmentRefreshKey((k) => k + 1);
  };

  return (
    <section
      className="comp-details-section mb-3"
      id="party-attachments"
    >
      <div className="comp-details-form-row">
        <label htmlFor="party-attachments">Party Attachments</label>
        <div className="comp-details-edit-input">
          <Attachments
            attachmentType={attachmentType}
            identifier={identifier}
            subIdentifier={subidentifier}
            allowUpload={true}
            allowDelete={true}
            cancelPendingUpload={isPendingUpload}
            setCancelPendingUpload={setIsPendingUpload}
            onFilesSelected={onHandleAddAttachments}
            onFileDeleted={onHandleDeleteAttachment}
            onFilesReplaced={onHandleReplaceAttachments}
            onSlideCountChange={handleSlideCountChange}
            refreshKey={attachmentRefreshKey}
            showPreview={attachmentCount > 0}
            attachmentReferences={attachmentReferences}
          />
        </div>
      </div>
    </section>
  );
};
