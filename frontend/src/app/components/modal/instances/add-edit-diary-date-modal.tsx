import { FC, useEffect, useState } from "react";
import { Alert, Modal, Button } from "react-bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { parse } from "date-fns";
import { DiaryDate, DiaryDateInput } from "@/generated/graphql";
import { FormField } from "@/app/components/common/form-field";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid } from "@/app/store/reducers/app";
import { selectModalData } from "@/app/store/reducers/app";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { SAVE_DIARY_DATE, DELETE_DIARY_DATE } from "@/app/components/containers/investigations/details/investigation-diary-dates";

type AddEditDiaryDateModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditDiaryDateModal: FC<AddEditDiaryDateModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { investigationGuid, diaryDate, taskGuid, onDirtyChange } = modalData ?? {};
  const currentUserGuid = useAppSelector(selectAppUserGuid);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveMutation = useGraphQLMutation(SAVE_DIARY_DATE, {
    onSuccess: () => {
      ToggleSuccess("Diary date saved successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to save diary date");
    },
  });

  const deleteMutation = useGraphQLMutation(DELETE_DIARY_DATE, {
    onSuccess: () => {
      ToggleSuccess("Diary date deleted successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to delete diary date");
    },
  });

  const isEditing = !!diaryDate?.diaryDateGuid;
  const isSaving = saveMutation.isPending || deleteMutation.isPending;

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
        taskGuid: diaryDate?.taskGuid || taskGuid || undefined,
        userGuid: currentUserGuid,
      };
      await saveMutation.mutateAsync({ input });
    },
  });

  const isDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );
  const { markDirty } = useFormDirtyState(onDirtyChange);

  useEffect(() => {
    if (isDirty) {
      markDirty();
    }
  }, [isDirty, markDirty]);

  const parseDate = (dateStr: string) => parse(dateStr, "yyyy-MM-dd", new Date());

  useEffect(() => {
    if (diaryDate) {
      form.setFieldValue("dueDate", parseDate(diaryDate.dueDate));
      form.setFieldValue("description", diaryDate.description || "");
    } else {
      form.setFieldValue("dueDate", null);
      form.setFieldValue("description", "");
    }
    form.setFieldMeta("dueDate", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
    form.setFieldMeta("description", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
  }, [diaryDate?.diaryDateGuid]);

  const handleClose = () => {
    if (showDeleteConfirm) {
      setShowDeleteConfirm(false);
      return;
    }
    if (isDirty) {
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) return;
    }
    form.reset();
    close();
  };

  const handleSave = () => {
    form.handleSubmit();
  };

  const handleConfirmDelete = async () => {
    if (!diaryDate?.diaryDateGuid) return;
    await deleteMutation.mutateAsync({ diaryDateGuid: diaryDate.diaryDateGuid });
    setShowDeleteConfirm(false);
    form.reset();
  };

  return (
    <>
      <Modal.Header closeButton className="pb-0">
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
              onSubmit: z
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
                  value={field.state.value}
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
              onSubmit: ({ value }: { value: Date | null }) => (value ? undefined : "Date is required"),
            }}
            render={(field) => (
              <div className="comp-details-input">
                <ValidationDatePicker
                  id="diary-date-due-date"
                  selectedDate={field.state.value}
                  onChange={(date: Date, _time: string | null) => field.handleChange(date)}
                  className="comp-details-edit-calendar-input"
                  classNamePrefix="comp-select"
                  errMsg={field.state.meta.errors?.[0]?.message || field.state.meta.errors?.[0] || ""}
                  showPreviousMonths={false}
                  vertical
                />
              </div>
            )}
          />
        </form>
        {isEditing && showDeleteConfirm && (
          <Alert variant="danger" className="comp-complaint-details-alert mt-3">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle mt-2" />
              <span>
                <strong>Delete diary date</strong>
                <p className="mb-3">
                  Are you sure you want to delete this diary date? This action cannot be undone.
                </p>
              </span>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-primary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={isSaving}
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
          {isEditing && (
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving || showDeleteConfirm}
            >
              <i className="bi bi-trash me-1" />
              <span>Delete</span>
            </Button>
          )}
          <div className="d-flex gap-2 ms-auto">
            <Button variant="outline-primary" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || showDeleteConfirm}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
};
