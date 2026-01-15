import { ValidationTextArea } from "@/app/common/validation-textarea";
import { FormField } from "@/app/components/common/form-field";
import { Button, Card } from "react-bootstrap";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import z from "zod";
import { ValidationDatePicker } from "@common/validation-date-picker";

interface DiaryDateFormProps {
  index: number;
  onDelete: (index: number) => void;
  onValidationChange: (index: number, isValid: boolean) => void;
  onValuesChange: (index: number, values: { description: string; diaryDate: Date | null }) => void;
  triggerValidation?: boolean;
  initialData?: {
    description: string;
    diaryDate: Date | null;
  };
}

export const DiaryDateForm = ({
  index,
  onDelete,
  onValidationChange,
  onValuesChange,
  triggerValidation,
  initialData,
}: DiaryDateFormProps) => {
  const form = useForm({
    defaultValues: {
      description: initialData?.description || "",
      diaryDate: initialData?.diaryDate || null,
    },
  });

  // Check validation whenever form state changes
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      const state = form.store.state;
      const values = state.values;
      const isValid = !!(values.description && values.diaryDate);
      onValidationChange(index, isValid);
      // Notify parent of value changes
      onValuesChange(index, {
        description: values.description,
        diaryDate: values.diaryDate,
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
      className="comp-drug-form"
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
          name="diaryDate"
          label="Due date"
          required
          validators={{
            onChange: z
              .date()
              .nullable()
              .refine((val) => val !== null, {
                message: "Diary date is required",
              }),
            onSubmit: z
              .date()
              .nullable()
              .refine((val) => val !== null, {
                message: "Diary date is required",
              }),
          }}
          render={(field) => (
            <ValidationDatePicker
              classNamePrefix="comp-details-edit-calendar-input"
              className="comp-details-input full-width"
              id={`diary-date-${index}`}
              maxDate={new Date()}
              onChange={(date: any) => {
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
