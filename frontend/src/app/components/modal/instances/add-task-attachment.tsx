import { useAppSelector } from "@/app/hooks/hooks";
import { selectModalData } from "@/app/store/reducers/app";
import { FC } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { ToggleError } from "@/app/common/toast";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import Option from "@apptypes/app/option";
import AttachmentUpload from "@/app/components/common/attachment-upload";

type AddEditTaskAttachmentModalProps = {
  close: () => void;
  submit: () => void;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
};

// TODO Add to Backend
const fileTypeOptions: Option[] = [
  { label: "Audio", value: "Audio" },
  { label: "Document", value: "Document" },
  { label: "Photo", value: "Photo" },
  { label: "Video", value: "Video" },
];

export const AddEditTaskAttachmentModal: FC<AddEditTaskAttachmentModalProps> = ({ close, submit, onDirtyChange }) => {
  const modalData = useAppSelector(selectModalData);
  const { title } = modalData;

  const form = useForm({
    defaultValues: {
      file: null,
      originalFileName: "",
      fileType: "",
      description: "",
      title: "",
      date: null,
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const onFileSelect = async (newFiles: FileList) => {
    console.log("test");
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
              render={(field) => <AttachmentUpload onFileSelect={onFileSelect} />}
            />

            {/* Original File Name */}
            <FormField
              form={form}
              name="originalFileName"
              label="Original File Name"
              render={(field) => (
                <CompInput
                  id="original-file-name"
                  divid="original-file-name-value"
                  type="input"
                  inputClass="comp-form-control"
                  value={field.state.value}
                  onChange={() => {}}
                  disabled={true}
                />
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
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select file type"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
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
              validators={{ onChange: z.date({ required_error: "Date is required" }) }}
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
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="add-attachment-cancel-button"
            title="Cancel"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-attachment-save-button"
            title="Save Attachment"
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
