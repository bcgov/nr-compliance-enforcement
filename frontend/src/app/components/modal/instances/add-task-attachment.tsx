import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectModalData } from "@/app/store/reducers/app";
import { FC, useCallback, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { DismissToast, ToggleError, ToggleInformation } from "@/app/common/toast";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import Option from "@apptypes/app/option";
import AttachmentUpload from "@/app/components/common/attachment-upload";
import { getDisplayFilename, handlePersistAttachments } from "@/app/common/attachment-utils";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import format from "date-fns/format";
import { selectOfficerListByAgencyCode } from "@/app/store/reducers/officer";
import { getUserAgency } from "@/app/service/user-service";
import { Id } from "react-toastify";

type AddEditTaskAttachmentModalProps = {
  close: () => void;
  submit: () => void;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
};

// TODO Add to Backend?
const fileTypeOptions: Option[] = [
  { label: "Audio", value: "Audio" },
  { label: "Document", value: "Document" },
  { label: "Photo", value: "Photo" },
  { label: "Video", value: "Video" },
];

export const AddEditTaskAttachmentModal: FC<AddEditTaskAttachmentModalProps> = ({ close, submit, onDirtyChange }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const userAgency = getUserAgency();
  const assignableOfficers = useAppSelector(selectOfficerListByAgencyCode(userAgency));
  const { title, investigationIdentifier, taskIdentifier, attachment } = modalData;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm({
    defaultValues: {
      file: null as FileList | null,
      originalFileName: attachment?.name ? getDisplayFilename(attachment.name) : "",
      fileType: attachment?.fileType ?? "",
      description: attachment?.description ?? "",
      title: attachment?.title ?? "",
      date: attachment?.date ? new Date(attachment.date) : null,
      takenBy: attachment?.takenBy ?? "",
      location: attachment?.location ?? "",
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
    onSubmit: async ({ value }) => {
      persistTaskAttachments(value, taskIdentifier);
    },
  });

  const fileType = useStore(form.baseStore, (state) => state.values.fileType);

  const onFileSelect = useCallback(
    (files: FileList) => {
      form.setFieldValue("file", files);
      const fileNames = Array.from(files)
        .map((f) => f.name)
        .join("\n");
      form.setFieldValue("originalFileName", fileNames);
    },
    [form],
  );

  const handleSubmit = async () => {
    await form.handleSubmit();
  };

  // TODO: can I type the values?
  const persistTaskAttachments = async (value: any, taskIdentifier: string) => {
    const files = value.file ? Array.from<File>(value.file) : null;

    if (!files && !attachment) return;

    let toastId: Id;
    if (!attachment) {
      toastId = ToggleInformation("Upload in progress, do not close the NatSuite application.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });
    }

    close();

    handlePersistAttachments({
      dispatch,
      attachmentsToAdd: showDeleteConfirm ? null : files,
      attachmentsToDelete: showDeleteConfirm ? [attachment] : null,
      identifier: investigationIdentifier,
      subIdentifier: taskIdentifier,
      setAttachmentsToAdd: () => {}, // Don't need these here
      setAttachmentsToDelete: () => {},
      attachmentType: AttachmentEnum.TASK_ATTACHMENT,
      isSynchronous: false,
      extendedMeta: {
        title: value.title,
        description: value.description,
        "file-type": value.fileType,
        date: value.date ? format(value.date, "yyyy-MM-dd") : "",
        ...(value.takenBy && { "taken-by": value.takenBy }),
        ...(value.location && { location: value.location }),
      },
    }).then(() => {
      if (toastId) {
        DismissToast(toastId);
      }
      attachmentUploadComplete$.next(taskIdentifier);
    });
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-create-add-case">
        <form onSubmit={form.handleSubmit}>
          <fieldset>
            {/* File Upload - placeholder */}
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
                  <AttachmentUpload onFileSelect={onFileSelect} />
                  {field.state.meta.errors?.[0]?.message && (
                    <span className="error-message">{field.state.meta.errors[0].message}</span>
                  )}
                </>
              )}
            />

            {/* Original File Name */}
            <FormField
              form={form}
              name="originalFileName"
              label={
                form.getFieldValue("originalFileName")?.includes("\n") ? "Original File Names" : "Original File Name"
              }
              render={(field) => (
                <div className="comp-details-input">
                  {field.state.value ? (
                    field.state.value.split("\n").map((name: string, i: number) => <div key={i}>{name}</div>)
                  ) : (
                    <span className="text-muted">No files selected</span>
                  )}
                </div>
              )}
            />

            {/* File Type */}
            <FormField
              form={form}
              name="fileType"
              label="File Type"
              required
              validators={{ onChange: z.string().min(1, "File type is required") }}
              render={(field) => (
                <CompSelect
                  id="file-type-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={fileTypeOptions}
                  //value={[]} // TODO: find matching option
                  onChange={(option) => {
                    field.handleChange(option?.value || "");
                    const isMediaType = ["Audio", "Video", "Photo"].includes(option?.value || "");
                    if (!isMediaType) {
                      form.setFieldValue("takenBy", "");
                      form.setFieldValue("location", "");
                    }
                  }}
                  placeholder="Select file type"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />

            {["Audio", "Video", "Photo"].includes(fileType) && (
              <>
                <FormField
                  form={form}
                  name="takenBy"
                  label="Taken By"
                  required
                  validators={{ onChange: z.string().min(1, "Taken By is required") }}
                  render={(field) => (
                    <CompSelect
                      id="taken-by-select"
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={assignableOfficers}
                      value={assignableOfficers.find((opt) => opt.value === field.state.value)}
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
                  onChange={(date: Date | undefined) => field.handleChange(date ?? undefined)}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />
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
                <span>Confirm Delete</span>
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
              disabled={showDeleteConfirm}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={showDeleteConfirm}
            >
              <span>Save and Close</span>
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
};
