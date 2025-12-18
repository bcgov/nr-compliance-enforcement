import { FC, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { DiaryDate, DiaryDateInput } from "@/generated/graphql";
import { FormField } from "@/app/components/common/form-field";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";

interface DiaryDateModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (input: DiaryDateInput) => Promise<void>;
  investigationGuid: string;
  diaryDate: DiaryDate | null;
  isSaving: boolean;
}

export const DiaryDateModal: FC<DiaryDateModalProps> = ({
  show,
  onHide,
  onSave,
  investigationGuid,
  diaryDate,
  isSaving,
}) => {
  const isEditing = !!diaryDate?.diaryDateGuid;

  const form = useForm({
    defaultValues: {
      dueDate: null as Date | null,
      description: "",
    },
    onSubmit: async ({ value }) => {
      const input: DiaryDateInput = {
        diaryDateGuid: diaryDate?.diaryDateGuid || undefined,
        investigationGuid,
        dueDate: value.dueDate as Date,
        description: value.description.trim(),
      };

      await onSave(input);
    },
  });

  useEffect(() => {
    if (show) {
      if (diaryDate) {
        form.setFieldValue("dueDate", new Date(diaryDate.dueDate));
        form.setFieldValue("description", diaryDate.description || "");
      } else {
        form.setFieldValue("dueDate", null);
        form.setFieldValue("description", "");
      }
    }
  }, [show, diaryDate]);

  const handleClose = () => {
    form.reset();
    onHide();
  };

  const handleSave = () => {
    form.handleSubmit();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header
        closeButton
        className="pb-0"
      >
        <Modal.Title>{isEditing ? "Edit diary date" : "Add diary date"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FormField
            form={form}
            name="description"
            label="Description"
            required
            validators={{
              onChange: z
                .string()
                .min(1, "Description is required")
                .max(4000, "Description must be 4000 characters or less"),
            }}
            render={(field) => (
              <div>
                <ValidationTextArea
                  id="diary-date-description"
                  className="comp-form-control comp-details-input"
                  rows={3}
                  defaultValue={field.state.value}
                  onChange={(value: string) => field.handleChange(value)}
                  placeholderText="Enter description..."
                  maxLength={4000}
                  errMsg={field.state.meta.errors?.[0]?.message || field.state.meta.errors?.[0] || ""}
                />
              </div>
            )}
          />
          <FormField
            form={form}
            name="dueDate"
            label="Due date"
            required
            validators={{
              onChange: ({ value }: { value: Date | null }) => (!value ? "Date is required" : undefined),
            }}
            render={(field) => (
              <div className="comp-details-input">
                <ValidationDatePicker
                  id="diary-date-due-date"
                  selectedDate={field.state.value}
                  onChange={(date: Date) => field.handleChange(date)}
                  placeholder="Select date"
                  className="comp-details-edit-calendar-input"
                  classNamePrefix="comp-select"
                  errMsg={field.state.meta.errors?.[0]?.message || field.state.meta.errors?.[0] || ""}
                  maxDate={new Date(2099, 11, 31)}
                />
              </div>
            )}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handleClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DiaryDateModal;
