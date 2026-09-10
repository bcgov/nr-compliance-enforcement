import { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from "react";
import { Alert, Button } from "react-bootstrap";
import {
  Attachment,
  fetchAttachmentsWithMetadata,
  getDisplayFilename,
  handlePersistAttachments,
  MAX_ATTACHMENT_PREVIEWS,
} from "@/app/common/attachment-utils";
import { uploadAttachmentsWithProgress } from "@/app/common/attachment-upload-helper";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import { DismissToast, ToggleInformation } from "@/app/common/toast";
import {
  buildEnforcementActionMeta,
  computeSequenceNumbers,
  EnforcementActionAttachmentFieldValues,
} from "@/app/common/enforcement-action-attachment-utils";
import { useAppDispatch } from "@/app/hooks/hooks";
import { updateAttachmentMetadata } from "@/app/store/reducers/attachments";
import { COMSObject } from "@/app/types/coms/object";
import { useAttachmentStaging } from "@/app/hooks/use-attachment-staging";
import AttachmentCarousel from "@/app/components/common/attachment-carousel";
import AttachmentDuplicateWarning from "@/app/components/common/attachment-duplicate-warning";

export interface EnforcementActionAttachmentSectionHandle {
  // True if files are staged to add or existing attachments are staged to remove.
  isDirty: () => boolean;
  // Persist staged adds/removes against the given enforcement action id.
  persist: (enforcementActionId: string, fieldValues: EnforcementActionAttachmentFieldValues) => Promise<void>;
}

interface EnforcementActionAttachmentSectionProps {
  investigationGuid: string;
  // Existing attachments already in COMS for this EA (empty for a brand-new EA).
  existingAttachments: Attachment[];
  onDirtyChange?: (isDirty: boolean) => void;
  // Reports when a pending duplicate-file decision should block saving.
  onBlockedChange?: (isBlocked: boolean) => void;
}

export const EnforcementActionAttachmentSection = forwardRef<
  EnforcementActionAttachmentSectionHandle,
  EnforcementActionAttachmentSectionProps
>(({ investigationGuid, existingAttachments, onDirtyChange, onBlockedChange }, ref) => {
  const dispatch = useAppDispatch();

  const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  // existing (already-saved) attachment awaiting delete confirmation
  const [pendingRemove, setPendingRemove] = useState<(Attachment & { id: string }) | null>(null);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [duplicateFileNames, setDuplicateFileNames] = useState<string[]>([]);

  const handleFilesSelected = useCallback((files: File[]) => {
    setFilesToAdd((prev) => mergeNewFiles(prev, files));
  }, []);

  // a staged slide was removed from the carousel, so drop the matching file from the upload list
  const handleFileDeleted = useCallback((attachment: COMSObject) => {
    const removedName = decodeURIComponent(attachment.name);
    setFilesToAdd((prev) => prev.filter((f) => f.name !== removedName));
  }, []);

  const {
    slides,
    setSlides,
    onFileSelect: stageFiles,
    onFileRemove,
  } = useAttachmentStaging({
    attachmentType: AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT,
    identifier: investigationGuid,
    onFilesSelected: handleFilesSelected,
    onFilesReplaced: handleFilesSelected,
    onFileDeleted: handleFileDeleted,
    confirmDuplicates: false,
  });

  const isSectionDirty = filesToAdd.length > 0 || removedIds.size > 0;
  useEffect(() => {
    onDirtyChange?.(isSectionDirty);
  }, [isSectionDirty, onDirtyChange]);

  useEffect(() => {
    onBlockedChange?.(showDuplicateConfirm);
  }, [showDuplicateConfirm, onBlockedChange]);

  const handleRemoveExisting = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
  };

  const visibleExisting = existingAttachments.filter(
    (a): a is Attachment & { id: string } => !!a.id && !removedIds.has(a.id),
  );

  // staged files first, matching the carousel's own ordering when new files are staged
  const mergedSlides: COMSObject[] = [...slides, ...visibleExisting];

  const handleSlideRemove = (attachment: COMSObject) => {
    if (attachment.pendingUpload) {
      onFileRemove(attachment);
      return;
    }

    const existing = visibleExisting.find((a) => a.id === attachment.id);
    if (existing) {
      setPendingRemove(existing);
    }
  };

  useImperativeHandle(ref, () => ({
    isDirty: () => filesToAdd.length > 0 || removedIds.size > 0,
    persist: async (enforcementActionId, fieldValues) => {
      const meta = buildEnforcementActionMeta(fieldValues, { investigationGuid, enforcementActionId });

      const current = await fetchAttachmentsWithMetadata(investigationGuid, undefined, enforcementActionId);

      // Deletes
      const toDelete = current.filter((a) => a.id && removedIds.has(a.id));
      if (toDelete.length > 0) {
        await handlePersistAttachments({
          dispatch,
          attachmentsToAdd: null,
          attachmentsToDelete: toDelete,
          identifier: investigationGuid,
          subIdentifier: enforcementActionId,
          setAttachmentsToAdd: () => {},
          setAttachmentsToDelete: () => {},
          attachmentType: AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT,
          isSynchronous: false,
        });
      }

      // Sync metadata onto retained attachments
      const toSync = current.filter((a): a is Attachment & { id: string } => !!a.id && !removedIds.has(a.id));
      if (toSync.length > 0) {
        await Promise.all(
          toSync.map((a) =>
            dispatch(updateAttachmentMetadata(a.id, { ...meta, "sequence-number": a.sequenceNumber ?? "" }, true)),
          ),
        );
      }

      // Adds
      if (filesToAdd.length > 0) {
        const toastId = ToggleInformation("Upload in progress, do not close the NatSuite application.", {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          draggable: false,
        });

        let sequences: string[];

        try {
          sequences = await computeSequenceNumbers(investigationGuid, current, fieldValues.fileType, filesToAdd);
        } catch (error) {
          DismissToast(toastId);
          throw error;
        }

        await uploadAttachmentsWithProgress({
          dispatch,
          files: filesToAdd,
          identifier: investigationGuid,
          subIdentifier: enforcementActionId,
          attachmentType: AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT,
          toastId,
          buildExtendedMeta: (_file, i) => ({ ...meta, "sequence-number": sequences[i] }),
        });
        DismissToast(toastId);
      }

      if (toDelete.length > 0 || toSync.length > 0 || filesToAdd.length > 0) {
        attachmentUploadComplete$.next(enforcementActionId);
      }
    },
  }));

  const handleFileSelect = useCallback(
    (files: FileList) => {
      const incoming = Array.from<File>(files);
      const existingNames = new Set([
        ...visibleExisting.map((a) => getDisplayFilename(a.name)),
        ...filesToAdd.map((f) => f.name),
      ]);

      const duplicates = incoming.filter((f) => existingNames.has(f.name)).map((f) => f.name);
      setDuplicateFileNames(duplicates);
      setShowDuplicateConfirm(duplicates.length > 0);

      stageFiles(files);
    },
    [visibleExisting, filesToAdd, stageFiles],
  );

  return (
    <fieldset className="mt-3">
      <h5>Attachments</h5>

      {/* Delete confirmation for an already-saved attachment */}
      {pendingRemove && (
        <Alert
          variant="danger"
          className="comp-complaint-details-alert mt-3"
        >
          <div className="d-flex align-items-start gap-2">
            <i className="bi bi-info-circle mt-2" />
            <span>
              <strong> Delete attachment</strong>
              <p className="mb-3">
                Are you sure you want to delete "{getDisplayFilename(pendingRemove.name)}"? This action cannot be
                undone.
              </p>
            </span>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-primary"
              onClick={() => setPendingRemove(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleRemoveExisting(pendingRemove.id);
                setPendingRemove(null);
              }}
            >
              <i className="bi bi-trash me-1" />
              <span>Confirm delete</span>
            </Button>
          </div>
        </Alert>
      )}

      {showDuplicateConfirm && (
        <AttachmentDuplicateWarning
          fileNames={duplicateFileNames}
          onCancel={() => {
            setShowDuplicateConfirm(false);
            setDuplicateFileNames([]);
            setFilesToAdd([]);
            setSlides([]);
          }}
          onConfirm={() => setShowDuplicateConfirm(false)}
        />
      )}

      <div className="comp-details-input-label">Add attachments</div>
      <AttachmentCarousel
        slides={mergedSlides}
        showPreview={true}
        onFileSelect={handleFileSelect}
        onFileRemove={handleSlideRemove}
        allowUpload={true}
        allowDelete={true}
        variant="comp-carousel-modal"
        maxPreviews={MAX_ATTACHMENT_PREVIEWS}
      />
    </fieldset>
  );
});

EnforcementActionAttachmentSection.displayName = "EnforcementActionAttachmentSection";

// convert to FileList for fileListToCOMSObjects
function toFileList(files: File[]): FileList {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  return dt.files;
}

// merge new files into the list, replacing any already present by name
function mergeNewFiles(existing: File[], incoming: File[]): File[] {
  const incomingNames = new Set(incoming.map((f) => f.name));
  return [...existing.filter((f) => !incomingNames.has(f.name)), ...incoming];
}
