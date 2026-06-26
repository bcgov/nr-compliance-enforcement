import { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from "react";
import { Alert, Button } from "react-bootstrap";
import AttachmentUpload from "@/app/components/common/attachment-upload";
import { fileListToCOMSObjects, getDisplayFilename, handlePersistAttachments } from "@/app/common/attachment-utils";
import { uploadAttachmentsWithProgress } from "@/app/common/attachment-upload-helper";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import { DismissToast, ToggleInformation } from "@/app/common/toast";
import {
  buildEnforcementActionMeta,
  computeSequenceNumbers,
  fetchEnforcementActionAttachments,
  EnforcementActionAttachment,
  EnforcementActionAttachmentFieldValues,
} from "@/app/common/enforcement-action-attachment-utils";
import { useAppDispatch } from "@/app/hooks/hooks";
import { updateAttachmentMetadata } from "@/app/store/reducers/attachments";

export interface EnforcementActionAttachmentSectionHandle {
  /** True if files are staged to add or existing attachments are staged to remove. */
  isDirty: () => boolean;
  /** Persist staged adds/removes against the given enforcement action id. */
  persist: (enforcementActionId: string, fieldValues: EnforcementActionAttachmentFieldValues) => Promise<void>;
}

interface EnforcementActionAttachmentSectionProps {
  investigationGuid: string;
  /** Existing attachments already in COMS for this EA (empty for a brand-new EA). */
  existingAttachments: EnforcementActionAttachment[];
  onDirtyChange?: (isDirty: boolean) => void;
}

export const EnforcementActionAttachmentSection = forwardRef<
  EnforcementActionAttachmentSectionHandle,
  EnforcementActionAttachmentSectionProps
>(({ investigationGuid, existingAttachments, onDirtyChange }, ref) => {
  const dispatch = useAppDispatch();

  const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  // existing (already-saved) attachment awaiting delete confirmation
  const [pendingRemove, setPendingRemove] = useState<(EnforcementActionAttachment & { id: string }) | null>(null);

  const isSectionDirty = filesToAdd.length > 0 || removedIds.size > 0;
  useEffect(() => {
    onDirtyChange?.(isSectionDirty);
  }, [isSectionDirty, onDirtyChange]);

  const onFileSelect = useCallback((files: FileList) => {
    const incoming = Array.from<File>(files);
    setFilesToAdd((prev) => mergeNewFiles(prev, incoming));
  }, []);

  const handleRemoveStagedFile = (name: string) => {
    setFilesToAdd((prev) => prev.filter((f) => f.name !== name));
  };

  const handleRemoveExisting = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
  };

  const visibleExisting = existingAttachments.filter(
    (a): a is EnforcementActionAttachment & { id: string } => !!a.id && !removedIds.has(a.id),
  );

  useImperativeHandle(ref, () => ({
    isDirty: () => filesToAdd.length > 0 || removedIds.size > 0,
    persist: async (enforcementActionId, fieldValues) => {
      const meta = buildEnforcementActionMeta(fieldValues, { investigationGuid, enforcementActionId });

      const current = await fetchEnforcementActionAttachments(investigationGuid, enforcementActionId);

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
      const toSync = current.filter(
        (a): a is EnforcementActionAttachment & { id: string } => !!a.id && !removedIds.has(a.id),
      );
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
        const sequences = computeSequenceNumbers(current, fieldValues.fileType, filesToAdd);
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

  return (
    <fieldset className="mt-3">
      <h5>Attachments</h5>

      {/* Existing attachments with remove */}
      {visibleExisting.length > 0 && (
        <div className="mb-3">
          {visibleExisting.map((a) => (
            <div
              key={a.id}
              className="d-flex align-items-center gap-2 py-1"
            >
              <span>{getDisplayFilename(a.name)}</span>
              <button
                type="button"
                className="btn btn-link p-0 border-0 text-body"
                onClick={() => setPendingRemove(a)}
                aria-label={`Remove ${getDisplayFilename(a.name)}`}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          ))}
        </div>
      )}

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
                Are you sure you want to delete "{getDisplayFilename(pendingRemove.name)}"? This action cannot be undone.
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

      {/* New file dropzone */}
      <div className="comp-details-input-label">Add attachments</div>
      <AttachmentUpload
        onFileSelect={onFileSelect}
        previousValues={fileListToCOMSObjects(toFileList(filesToAdd))}
      />

      {/* Staged file names with remove */}
      <div className="comp-details-input mt-2">
        {filesToAdd.length > 0 ? (
          filesToAdd.map((f) => (
            <div
              key={f.name}
              className="d-flex align-items-center gap-2"
            >
              <span>{f.name}</span>
              <button
                type="button"
                className="btn btn-link p-0 border-0 text-body"
                onClick={() => handleRemoveStagedFile(f.name)}
                aria-label={`Remove ${f.name}`}
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          ))
        ) : (
          <span className="text-muted">No file selected</span>
        )}
      </div>
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

// merge new files into the list, ignore any already present by name
function mergeNewFiles(existing: File[], incoming: File[]): File[] {
  const existingNames = new Set(existing.map((f) => f.name));
  return [...existing, ...incoming.filter((f) => !existingNames.has(f.name))];
}
