import { ValidationTextArea } from "@/app/common/validation-textarea";
import { FormField } from "@/app/components/common/form-field";
import { Button, Card } from "react-bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import z from "zod";
import { ValidationDatePicker } from "@common/validation-date-picker";
import { DiaryDate } from "@/generated/graphql";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface DiaryDateFormProps {
  index: number;
  onDelete: (index: number) => void;
  onValidationChange: (index: number, isValid: boolean) => void;
  onValuesChange: (index: number, values: { description: string; dueDate: Date | null }) => void;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  triggerValidation?: boolean;
  initialData?: DiaryDate | null;
}

export const DiaryDateForm = ({
  index,
  onDelete,
  onValidationChange,
  onValuesChange,
  onDirtyChange,
  triggerValidation,
  initialData,
}: DiaryDateFormProps) => {
  const form = useForm({
    defaultValues: {
      description: initialData?.description || "",
      dueDate: initialData?.dueDate || null,
    },
  });

  const { markDirty } = useFormDirtyState(onDirtyChange);

  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );

  useEffect(() => {
    if (isFormDirty) {
      markDirty();
    }
  }, [isFormDirty, markDirty]);

  // Check validation whenever form state changes
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      const state = form.store.state;
      const values = state.values;
      const isValid = !!(values.description && values.dueDate);
      onValidationChange(index, isValid);
      // Notify parent of value changes
      onValuesChange(index, {
        description: values.description,
        dueDate: values.dueDate,
      });
    });

    return () => subscription();
  }, [form.store, index, onValidationChange, onValuesChange]);

  useEffect(() => {
    if (triggerValidation) {
      form.validateAllFields("submit");
    }
  }, [triggerValidation, form]);

  return (
    <Card
      className="comp-task-form-section"
      style={{ borderTop: "none" }}
    >
      <Card.Header className="comp-card-header px-0">
        <div className="comp-card-header-title">
          <h5>Add diary date {index + 1}</h5>
        </div>
        <div className="comp-card-header-actions">
          <Button
            variant="outline-primary"
            size="sm"
            aria-label="Delete diary date"
            onClick={() => onDelete(index)}
          >
            <i className="bi bi-trash3"></i>
            <span>Delete</span>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <FormField
          form={form}
          name="description"
          label="Description"
          required
          validators={{
            onChange: z.string().min(1, "Description is required"),
            onSubmit: z.string().min(1, "Description is required"),
          }}
          render={(field) => (
            <ValidationTextArea
              id={`diary-description-${index}`}
              className="comp-form-control comp-details-input"
              rows={3}
              defaultValue={field.state.value}
              onChange={(value: string) => {
                field.handleChange(value);
              }}
              placeholderText="Enter diary date description..."
              maxLength={4000}
              errMsg={field.state.meta.errors?.[0]?.message || ""}
            />
          )}
        />
        <FormField
          form={form}
          name="dueDate"
          label="Due date"
          required
          validators={{
            onChange: z
              .date()
              .nullable()
              .refine((val) => val !== null, {
                message: "Date is required",
              }),
            onSubmit: z
              .date()
              .nullable()
              .refine((val) => val !== null, {
                message: "Date is required",
              }),
          }}
          render={(field) => (
            <ValidationDatePicker
              classNamePrefix="comp-details-edit-calendar-input"
              className="comp-details-input full-width"
              id={`diary-date-${index}`}
              onChange={(date: Date, _time: string | null) => {
                field.handleChange(date);
              }}
              selectedDate={field.state.value}
              errMsg={field.state.meta.errors?.[0]?.message || ""}
              vertical={true}
            />
          )}
        />
      </Card.Body>
    </Card>
  );
};
