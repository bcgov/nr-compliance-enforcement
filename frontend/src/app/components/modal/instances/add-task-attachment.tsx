import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectModalData } from "@/app/store/reducers/app";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { DismissToast, ToggleError, ToggleInformation } from "@/app/common/toast";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import AttachmentUpload from "@/app/components/common/attachment-upload";
import { fileListToCOMSObjects, getDisplayFilename, handlePersistAttachments } from "@/app/common/attachment-utils";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import format from "date-fns/format";
import { selectOfficerByAppUserGuid, selectOfficerListByAgencyCode } from "@/app/store/reducers/officer";
import { getUserAgency } from "@/app/service/user-service";
import { COMSObject } from "@/app/types/coms/object";
import { updateAttachmentMetadata } from "@/app/store/reducers/attachments";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { Attachment } from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { fileTypeOptions } from "@/app/components/common/file-type-options";
import { parseISO } from "date-fns";

type AddEditTaskAttachmentModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditTaskAttachmentModal: FC<AddEditTaskAttachmentModalProps> = ({ close, submit }) => {
  // Hooks
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const userAgency = getUserAgency();
  const officerSelector = useMemo(() => selectOfficerListByAgencyCode(userAgency), [userAgency]);
  const assignableOfficers = useAppSelector(officerSelector);
  const {
    title,
    investigationIdentifier,
    taskIdentifier,
    existingAttachments,
    attachment,
    defaultAssignee,
    onDirtyChange,
  } = modalData;

  const takenByInitialValue = attachment?.takenBy ?? defaultAssignee ?? "";
  const takenByOfficer = useAppSelector(
    useMemo(() => selectOfficerByAppUserGuid(takenByInitialValue), [takenByInitialValue]),
  );

  const assignableOfficersExtended =
    takenByOfficer && !assignableOfficers.some((opt) => opt.value === takenByOfficer.app_user_guid)
      ? [
          ...assignableOfficers,
          {
            value: takenByOfficer.app_user_guid,
            label: `${takenByOfficer.last_name}, ${takenByOfficer.first_name}`,
          },
        ]
      : assignableOfficers;

  // State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [duplicateFileNames, setDuplicateFileNames] = useState<string[]>([]);

  // Form Definition
  const form = useForm({
    defaultValues: {
      file: null as FileList | null,
      originalFileName: attachment?.name ? getDisplayFilename(attachment.name) : "",
      fileType: attachment?.fileType ?? "",
      description: attachment?.description ?? "",
      title: attachment?.title ?? "",
      date: attachment?.date ? parseISO(attachment.date) : null,
      takenBy: attachment?.takenBy ?? defaultAssignee ?? "",
      location: attachment?.location ?? "",
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
    onSubmit: async ({ value }) => {
      persistTaskAttachments(value, taskIdentifier);
    },
  });

  // Data and Types
  const fileType = useStore(form.baseStore, (state) => state.values.fileType);
  type FormValues = typeof form.state.values;

  // Form Dirty Tracking
  const { markDirty } = useFormDirtyState(onDirtyChange);

  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );

  // Use Effects and Callbacks

  // Detects if a form field is touched and marks form dirty
  useEffect(() => {
    if (isFormDirty) {
      markDirty();
    }
  }, [isFormDirty, markDirty]);

  // Orchestrates integration with TanStack Form and contains logic for tracking duplicates
  const onFileSelect = useCallback(
    (files: FileList) => {
      const existingFiles = form.getFieldValue("file");
      const existingFilesArray = existingFiles ? Array.from<File>(existingFiles) : [];
      const newFilesArray = Array.from<File>(files);

      // Merge, ignoring files already in the form selection by name
      const mergedFiles = [
        ...existingFilesArray,
        ...newFilesArray.filter((f) => !existingFilesArray.some((e) => e.name === f.name)),
      ];

      // Convert back to FileList via DataTransfer
      const dataTransfer = new DataTransfer();
      mergedFiles.forEach((f) => dataTransfer.items.add(f));
      const mergedFileList = dataTransfer.files;

      form.setFieldValue("file", mergedFileList);
      form.setFieldValue("originalFileName", mergedFiles.map((f) => f.name).join("\n"));

      const duplicates = newFilesArray
        .filter((f) => existingAttachments.some((a: COMSObject) => getDisplayFilename(a.name) === f.name))
        .map((f) => f.name);
      setDuplicateFileNames(duplicates);
      setShowDuplicateConfirm(duplicates.length > 0);
    },
    [form, existingAttachments],
  );

  // Functions

  // Handle save button click
  const handleSubmit = async () => {
    await form.handleSubmit();
  };

  // Controller function for adding / editing / deleting attachments
  const persistTaskAttachments = async (value: FormValues, taskIdentifier: string) => {
    if (showDeleteConfirm) {
      await handleDelete(taskIdentifier);
    } else if (attachment) {
      await handleEditMetadata(value, taskIdentifier);
    } else {
      await handleAdd(value, taskIdentifier);
    }
  };

  // Function to add attachments to a task.
  const handleAdd = async (value: FormValues, taskIdentifier: string) => {
    const files = value.file ? Array.from<File>(value.file) : null;
    if (!files) return;

    const toastId = ToggleInformation("Upload in progress, do not close the NatSuite application.", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });

    submit();

    // Pre-calculate sequence numbers for each file
    const baseSequence = existingAttachments
      .filter((a: Attachment) => a.fileType === value.fileType)
      .reduce((max: number, a: Attachment) => Math.max(max, Number.parseInt(a.sequenceNumber ?? "0", 10)), 0);

    const fileSequences = files.map((file, i) => {
      const existingSequence = existingAttachments.find(
        (a: Attachment) => getDisplayFilename(a.name) === file.name,
      )?.sequenceNumber;

      return existingSequence ?? String(baseSequence + i + 1).padStart(4, "0");
    });

    await Promise.all(
      files.map((file, i) =>
        handlePersistAttachments({
          dispatch,
          attachmentsToAdd: [file],
          attachmentsToDelete: null,
          identifier: investigationIdentifier,
          subIdentifier: taskIdentifier,
          setAttachmentsToAdd: () => {},
          setAttachmentsToDelete: () => {},
          attachmentType: AttachmentEnum.TASK_ATTACHMENT,
          isSynchronous: false,
          extendedMeta: {
            ...buildExtendedMeta(value),
            "sequence-number": fileSequences[i],
          },
        }),
      ),
    );

    DismissToast(toastId);
    attachmentUploadComplete$.next(taskIdentifier);
  };

  // function to delete a single object from a task
  const handleDelete = async (taskIdentifier: string) => {
    submit();
    handlePersistAttachments({
      dispatch,
      attachmentsToAdd: null,
      attachmentsToDelete: [attachment],
      identifier: investigationIdentifier,
      subIdentifier: taskIdentifier,
      setAttachmentsToAdd: () => {},
      setAttachmentsToDelete: () => {},
      attachmentType: AttachmentEnum.TASK_ATTACHMENT,
      isSynchronous: false,
    }).then(() => {
      attachmentUploadComplete$.next(taskIdentifier);
    });
  };

  // function to edit an object metadata
  const handleEditMetadata = async (value: FormValues, taskIdentifier: string) => {
    submit();

    dispatch(
      updateAttachmentMetadata(attachment.id, {
        ...buildExtendedMeta(value),
        "sequence-number": attachment?.sequenceNumber ?? "",
      }),
    ).then(() => {
      attachmentUploadComplete$.next(taskIdentifier);
    });
  };

  // helper function - shared meta building logic
  const buildExtendedMeta = (value: FormValues) => {
    const isMediaType = ["Audio", "Video", "Photo"].includes(value.fileType);
    return {
      "is-thumb": "N",
      "attachment-type": String(AttachmentEnum.TASK_ATTACHMENT),
      "investigation-id": investigationIdentifier,
      "task-id": taskIdentifier,
      title: value.title,
      description: value.description,
      "file-type": value.fileType,
      date: value.date ? format(value.date, "yyyy-MM-dd") : "",
      ...(isMediaType && value.takenBy && { "taken-by": value.takenBy }),
      ...(isMediaType && value.location && { location: value.location }),
    };
  };

  // Function to remove a file that was selected from the modal (do not upload it)
  const handleRemoveFile = (nameToRemove: string) => {
    const currentFiles = form.getFieldValue("file");
    const updatedFiles = currentFiles ? Array.from<File>(currentFiles).filter((f) => f.name !== nameToRemove) : [];

    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((f) => dataTransfer.items.add(f));
    const updatedFileList = dataTransfer.files;

    form.setFieldValue("file", updatedFileList.length > 0 ? updatedFileList : null);
    form.setFieldValue("originalFileName", updatedFiles.map((f) => f.name).join("\n"));
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-add-edit-attachment">
        <form onSubmit={form.handleSubmit}>
          <fieldset>
            {/* File Upload - don't render on edit  */}
            {!attachment && (
              <FormField
                form={form}
                name="file"
                label="File"
                required
                validators={{
                  onChange: attachment
                    ? z.custom<FileList | null>(() => true) // optional in edit mode
                    : z.custom<FileList | null>((val) => val !== null && val.length > 0, {
                        message: "At least one file is required",
                      }),
                }}
                render={(field) => (
                  <>
                    <AttachmentUpload
                      onFileSelect={onFileSelect}
                      previousValues={fileListToCOMSObjects(field.state.value)}
                    />
                    {field.state.meta.errors?.[0]?.message && (
                      <span className="error-message">{field.state.meta.errors[0].message}</span>
                    )}
                  </>
                )}
              />
            )}

            {/* Original File Name */}
            <FormField
              form={form}
              name="originalFileName"
              label={
                form.getFieldValue("originalFileName")?.includes("\n") ? "Original file names" : "Original file name"
              }
              render={(field) => (
                <div className="comp-details-input">
                  {field.state.value ? (
                    field.state.value.split("\n").map((name: string, i: number) => (
                      <div
                        key={name + "-" + i}
                        className="d-flex align-items-center gap-2"
                      >
                        <span>{name}</span>
                        {!attachment && (
                          <button
                            type="button"
                            className="btn btn-link p-0 border-0 text-body"
                            onClick={() => handleRemoveFile(name)}
                            aria-label={`Remove ${name}`}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">No files selected</span>
                  )}
                </div>
              )}
            />

            {/* Duplicate Warning */}
            {showDuplicateConfirm && (
              <Alert
                variant="warning"
                className="comp-complaint-details-alert mt-3"
              >
                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-exclamation-triangle mt-1" />
                  <span>
                    <strong>Duplicate file detected</strong>
                    <p>
                      {duplicateFileNames.length === 1 ? (
                        <>
                          An attachment with the name <strong>{duplicateFileNames[0]}</strong> already exists. If this
                          is the latest version of that document, please click <strong>"Update document"</strong>. If
                          this is intended to be a new, separate document, please click <strong>"Cancel"</strong> and
                          rename the file before uploading it.
                        </>
                      ) : (
                        <>
                          <span>Attachments with the following names already exist.</span>
                          <ul className="mt-3 list-unstyled">
                            {duplicateFileNames.map((fileName) => (
                              <li
                                key={fileName}
                                className="py-1 px-4"
                              >
                                {fileName}
                              </li>
                            ))}
                          </ul>
                          <span>
                            If this is the latest version of the documents, please click{" "}
                            <strong>"Update document"</strong>. If they are intended to be new, separate documents,
                            please click <strong>"Cancel"</strong> and rename the files before uploading them.
                          </span>
                        </>
                      )}
                    </p>
                  </span>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setShowDuplicateConfirm(false);
                      setDuplicateFileNames([]);
                      form.setFieldValue("file", null);
                      form.setFieldValue("originalFileName", "");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => setShowDuplicateConfirm(false)}
                  >
                    Update document
                  </Button>
                </div>
              </Alert>
            )}

            {/* File Type */}
            <FormField
              form={form}
              name="fileType"
              label="File type"
              required
              validators={{ onChange: z.string().min(1, "File type is required") }}
              render={(field) => (
                <CompSelect
                  id="file-type-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={fileTypeOptions}
                  value={fileTypeOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => {
                    field.handleChange(option?.value || "");
                    const isMediaType = ["Audio", "Video", "Photo"].includes(option?.value || "");
                    if (!isMediaType) {
                      form.setFieldValue("takenBy", "");
                      form.setFieldValue("location", "");
                      form.resetField("takenBy");
                      form.resetField("location");
                    }
                  }}
                  placeholder="Select file type"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  menuPlacement="bottom"
                />
              )}
            />

            {/* Description */}
            <FormField
              form={form}
              name="description"
              label="Description"
              required
              validators={{ onChange: z.string().min(1, "Description is required") }}
              render={(field) => (
                <CompInput
                  id="description"
                  divid="description-value"
                  type="input"
                  inputClass="comp-form-control"
                  error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                  onChange={(evt: any) => field.handleChange(evt.target.value)}
                  value={field.state.value}
                  placeholder="Enter description"
                />
              )}
            />

            {/* Title */}
            <FormField
              form={form}
              name="title"
              label="Title"
              required
              validators={{ onChange: z.string().min(1, "Title is required") }}
              render={(field) => (
                <CompInput
                  id="title"
                  divid="title-value"
                  type="input"
                  inputClass="comp-form-control"
                  error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                  onChange={(evt: any) => field.handleChange(evt.target.value)}
                  value={field.state.value}
                  placeholder="Enter title"
                />
              )}
            />

            {/* Date */}
            <FormField
              form={form}
              name="date"
              label="Date"
              required
              validators={{
                onChange: z
                  .date()
                  .nullable()
                  .refine((val) => val !== null, {
                    message: "Date is required",
                  }),
              }}
              render={(field) => (
                <ValidationDatePicker
                  id="DateOfBirth"
                  classNamePrefix="comp-details-input"
                  className="comp-form-control comp-details-input"
                  selectedDate={field.state.value}
                  maxDate={new Date()}
                  onChange={(date: Date | undefined) => field.handleChange(date ?? undefined)}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />

            {["Audio", "Video", "Photo"].includes(fileType) && (
              <>
                <FormField
                  form={form}
                  name="takenBy"
                  label="Taken by"
                  required
                  validators={{ onChange: z.string().min(1, "Taken by is required") }}
                  render={(field) => (
                    <CompSelect
                      id="taken-by-select"
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={assignableOfficersExtended}
                      value={assignableOfficersExtended.find((opt) => opt.value === field.state.value)}
                      onChange={(option) => field.handleChange(option?.value || "")}
                      placeholder="Select taken by"
                      isClearable={true}
                      showInactive={false}
                      enableValidation={true}
                      errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    />
                  )}
                />

                <FormField
                  form={form}
                  name="location"
                  label="Location"
                  render={(field) => (
                    <CompInput
                      id="location"
                      divid="location-value"
                      type="input"
                      inputClass="comp-form-control"
                      error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                      onChange={(evt: any) => field.handleChange(evt.target.value)}
                      value={field.state.value}
                      placeholder="Enter location"
                      maxLength={1024}
                    />
                  )}
                />
              </>
            )}
          </fieldset>
        </form>

        {showDeleteConfirm && (
          <Alert
            variant="danger"
            className="comp-complaint-details-alert mt-3"
            id={`attachment-delete-confirm-alert`}
          >
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle mt-2" />
              <span>
                <strong> Delete attachment</strong>
                <p className="mb-3">
                  Are you sure you want to delete "{attachment ? getDisplayFilename(attachment.name) : ""}"? This action
                  cannot be undone.
                </p>
              </span>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSubmit}
              >
                <i className="bi bi-trash me-1" />
                <span>Confirm delete</span>
              </Button>
            </div>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons w-100 d-flex justify-content-between">
          {attachment && (
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={showDeleteConfirm}
            >
              <i className="bi bi-trash me-1" />
              <span>Delete</span>
            </Button>
          )}
          <div className="d-flex gap-2 ms-auto">
            <Button
              variant="outline-primary"
              onClick={close}
              disabled={showDuplicateConfirm || showDeleteConfirm}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={showDuplicateConfirm || showDeleteConfirm}
            >
              <span>Save and close</span>
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
};
