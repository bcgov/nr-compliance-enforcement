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
import { getAttachments } from "@/app/store/reducers/attachments";

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
  sharedPartyId?: string;
  activityId?: string;
  attachmentType: number;
  allowUpload: boolean;
  allowDelete: boolean;
  triggerSave?: boolean | number;
  triggerCancel?: boolean | number;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onSaved?: () => void;
  attachmentReferences?: InvestigationAttachmentReference[];
  onPendingImagesChange?: (images: { fileName: string; verb: string }[]) => void;
}

export const PartyAttachments: FC<PartyAttachmentsProps> = ({
  partyId,
  sharedPartyId,
  activityId,
  attachmentType,
  allowUpload,
  allowDelete,
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
    const removed = [...(attachmentsToDelete ?? []), ...(referencesToDeactivate ?? [])].map((obj) => ({
      fileName: getDisplayFilename(obj.name),
      verb: "REMOVED",
    }));
    onPendingImagesChange?.([...added, ...edited, ...removed]);
  }, [attachmentsToAdd, attachmentsToDelete, attachmentsToEdit, referencesToDeactivate, onPendingImagesChange]);

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

      // The pinned reference points directly at the shared party's COMS object, so removing it
      // from the investigation removes it from the shared party too.
      if (sharedPartyId) {
        await handlePersistAttachments({
          dispatch,
          attachmentsToAdd: null,
          attachmentsToDelete: referencesToDeactivate,
          identifier: sharedPartyId,
          subIdentifier: undefined,
          setAttachmentsToAdd: () => {},
          setAttachmentsToDelete: () => {},
          attachmentType: AttachmentEnum.PARTY_ATTACHMENT,
          isSynchronous: false,
        });
      }

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

      // The shared party holds its own COMS copies, so the matching objects are removed there too.
      // Names are the only join between the two, since each upload produced independent objects.
      if (sharedPartyId) {
        const deletedNames = new Set(attachmentsToDelete.map((obj) => getDisplayFilename(obj.name)));
        const sharedAttachments = await dispatch(
          getAttachments(sharedPartyId, undefined, AttachmentEnum.PARTY_ATTACHMENT, true),
        );
        const sharedToDelete = sharedAttachments.filter((obj: COMSObject) =>
          deletedNames.has(getDisplayFilename(obj.name)),
        );

        if (sharedToDelete.length) {
          await handlePersistAttachments({
            dispatch,
            attachmentsToAdd: null,
            attachmentsToDelete: sharedToDelete,
            identifier: sharedPartyId,
            subIdentifier: undefined,
            setAttachmentsToAdd: () => {},
            setAttachmentsToDelete: () => {},
            attachmentType: AttachmentEnum.PARTY_ATTACHMENT,
            isSynchronous: false,
          });
        }
      }
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

      // Attachments live only in COMS, so a copy is uploaded against the shared party as well.
      // This sits outside the party save — a failure here leaves the investigation attachment
      // intact and is reported separately.
      if (sharedPartyId) {
        const failedSharedFiles = await uploadAttachmentsWithProgress({
          dispatch,
          files: attachmentsToAdd,
          identifier: sharedPartyId,
          subIdentifier: undefined,
          attachmentType: AttachmentEnum.PARTY_ATTACHMENT,
          toastId,
        });

        if (failedSharedFiles.length > 0) {
          ToggleError(
            `Saved to the investigation, but could not sync to the shared party: ${failedSharedFiles.join(", ")}`,
          );
        }
      }

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
      className="comp-details-section"
      id="party-attachments"
    >
      <Attachments
        attachmentType={attachmentType}
        identifier={identifier}
        subIdentifier={subidentifier}
        allowUpload={allowUpload}
        allowDelete={allowDelete}
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
    </section>
  );
};
