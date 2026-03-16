import { FC, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { Task } from "@/generated/graphql";
import type { CreateUpdateTaskInput } from "@/generated/graphql";
import { FormField } from "@/app/components/common/form-field";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { CompSelect } from "@/app/components/common/comp-select";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid as selectAppUserGuid, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectTaskCategory, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface TaskDetailEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (input: CreateUpdateTaskInput) => Promise<void>;
  investigationGuid: string;
  task: Task | undefined;
  isSaving: boolean;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const TaskDetailEditModal: FC<TaskDetailEditModalProps> = ({
  show,
  onHide,
  onSave,
  investigationGuid,
  task,
  isSaving,
  onDirtyChange,
}) => {
  const currentUserGuid = useAppSelector(selectAppUserGuid);
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const agency = useAppSelector(selectOfficerAgency);
  const officersInAgencyList = useAppSelector((state) => selectOfficersByAgency(state, agency));

  const [selectedCategory, setSelectedCategory] = useState("");

  const taskCategoryOptions = taskCategories.map((c) => ({
    value: String(c.value ?? ""),
    label: String(c.label ?? ""),
  }));
  const taskSubCategoryOptions = taskSubCategories
    .filter((s) => s.taskCategory === selectedCategory)
    .map((s) => ({ value: String(s.value ?? ""), label: String(s.label ?? "") }));
  const officerOptions = (officersInAgencyList ?? []).map((o) => ({
    value: o.app_user_guid,
    label: `${o.last_name}, ${o.first_name}`,
  }));

  const form = useForm({
    defaultValues: {
      taskCategory: "",
      taskSubCategory: "",
      officerAssigned: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const input: CreateUpdateTaskInput = {
        taskIdentifier: task?.taskIdentifier,
        investigationIdentifier: investigationGuid,
        taskTypeCode: value.taskSubCategory || undefined,
        taskStatusCode: task ? undefined :  "OPEN", // default to open for new tasks
        assignedUserIdentifier: value.officerAssigned || undefined,
        appUserIdentifier: currentUserGuid,
        description: value.description?.trim() || undefined,
      };
      await onSave(input);
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

  const clearFieldMeta = () => {
    (["taskCategory", "taskSubCategory", "officerAssigned", "description"] as const).forEach(
      (name) => {
        form.setFieldMeta(name, (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      },
    );
  };

  useEffect(() => {
    if (show && task) {
      const categoryValue = String(
        taskSubCategories.find((s) => s.value === task.taskTypeCode)?.taskCategory ?? "",
      );
      setSelectedCategory(categoryValue);
      form.setFieldValue("taskCategory", categoryValue);
      form.setFieldValue("taskSubCategory", task.taskTypeCode ?? "");
      form.setFieldValue("officerAssigned", task.assignedUserIdentifier ?? "");
      form.setFieldValue("description", task.description ?? "");
      clearFieldMeta();
      const timeout = globalThis.setTimeout(clearFieldMeta, 0);
      return () => globalThis.clearTimeout(timeout);
    }
    if (show && !task) {
      setSelectedCategory("");
      form.reset();
    }
  }, [show, task?.taskIdentifier]);

  const handleClose = () => {
    form.reset();
    onHide();
  };

  const savingText = task ? "Saving..." : "Creating...";
  const saveText = task ? "Save" : "Create";


  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="pb-0">
        <Modal.Title>{task ? "Edit task details" : "Add task"}</Modal.Title>
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
            name="taskCategory"
            label="Task category"
            required
            validators={{
              onChange: z.string().min(1, "Task category is required"),
              onSubmit: z.string().min(1, "Task category is required"),
            }}
            render={(field) => (
              <CompSelect
                id="task-detail-edit-category"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={taskCategoryOptions}
                value={taskCategoryOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => {
                  const value = option?.value ?? "";
                  field.handleChange(value);
                  setSelectedCategory(value);
                }}
                placeholder="Select category"
                isClearable
                showInactive={false}
                enableValidation
                errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
              />
            )}
          />
          {selectedCategory && (
            <FormField
              form={form}
              name="taskSubCategory"
              label="Task sub-category"
              required
              validators={{
                onChange: z.string().min(1, "Task sub-category is required"),
                onSubmit: z.string().min(1, "Task sub-category is required"),
              }}
              render={(field) => (
                <CompSelect
                  key={selectedCategory}
                  id="task-detail-edit-subcategory"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={taskSubCategoryOptions}
                  value={taskSubCategoryOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value ?? "")}
                  placeholder="Select sub-category"
                  isClearable
                  showInactive={false}
                  enableValidation
                  errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
                />
              )}
            />
          )}
          <FormField
            form={form}
            name="officerAssigned"
            label="Officer assigned"
            required
            validators={{
              onChange: z.string().min(1, "Officer assigned is required"),
              onSubmit: z.string().min(1, "Officer assigned is required"),
            }}
            render={(field) => (
              <CompSelect
                id="task-detail-edit-officer"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={officerOptions}
                value={officerOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => field.handleChange(option?.value ?? "")}
                placeholder="Select officer"
                isClearable
                showInactive={false}
                enableValidation
                errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
              />
            )}
          />
          <FormField
            form={form}
            name="description"
            label="Task details"
            render={(field) => (
              <ValidationTextArea
                id="task-detail-edit-description"
                className="comp-form-control comp-details-input"
                rows={4}
                value={field.state.value}
                onChange={(value: string) => field.handleChange(value)}
                placeholderText="Enter task description..."
                maxLength={4000}
                errMsg={field.state.meta.errors?.[0]?.message ?? ""}
              />
            )}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => form.handleSubmit()} disabled={isSaving}>
          {isSaving ? savingText : saveText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
