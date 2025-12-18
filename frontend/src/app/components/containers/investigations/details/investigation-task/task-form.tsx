import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { CompSelect } from "@/app/components/common/comp-select";
import { FormField } from "@/app/components/common/form-field";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useAppSelector } from "@/app/hooks/hooks";
import DatePicker from "react-datepicker";
import { appUserGuid, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectTaskCategory, selectTaskStatus, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { RootState } from "@/app/store/store";
import { CreateUpdateTaskInput, Task } from "@/generated/graphql";
import { useForm } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

interface TaskFormProps {
  investigationGuid: string;
  onClose: () => void;
  task?: Task;
}

const ADD_TASK = gql`
  mutation CreateTask($input: CreateUpdateTaskInput!) {
    createTask(input: $input) {
      taskIdentifier
    }
  }
`;

const EDIT_TASK = gql`
  mutation UpdateTask($input: CreateUpdateTaskInput!) {
    updateTask(input: $input) {
      taskIdentifier
      investigationIdentifier
      taskTypeCode
      taskStatusCode
      assignedUserIdentifier
      description
    }
  }
`;

export const TaskForm = ({ task, investigationGuid, onClose }: TaskFormProps) => {
  // Form Definition
  const form = useForm({
    defaultValues: {
      "task-category": "",
      "task-sub-category": "",
      "task-description": "",
      "task-officer-assigned": "",
      "task-status": "",
    },
  });

  // State
  const idir = useAppSelector(appUserGuid);
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatus = useAppSelector(selectTaskStatus);
  const [selectedCategory, setSelectedCategory] = useState("");
  const agency = useAppSelector(selectOfficerAgency);
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, agency));

  // Data
  const taskCategoryOptions = taskCategories.map((option: any) => {
    return {
      value: option.value,
      label: option.label,
    };
  });

  const isEditMode = !!task;

  // Use Effects

  // Populate form when editing
  useEffect(() => {
    if (task) {
      // Find the subcategory to get its parent category
      const categoryValue = (taskSubCategories.find((sub: any) => sub.value === task.taskTypeCode)?.taskCategory ||
        "") as string;

      // Set the category state first
      setSelectedCategory(categoryValue);

      // Set all form values
      form.setFieldValue("task-category", categoryValue);
      form.setFieldValue("task-sub-category", task.taskTypeCode || "");
      form.setFieldValue("task-description", task.description || "");
      form.setFieldValue("task-officer-assigned", task.assignedUserIdentifier || "");
      form.setFieldValue("task-status", task.taskStatusCode || "");
    }
  }, [task, taskSubCategories]);

  // Functions

  const addTaskMutation = useGraphQLMutation(ADD_TASK, {
    onSuccess: () => {
      ToggleSuccess("Task added successfully");
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Error adding task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add task");
    },
  });

  const editTaskMutation = useGraphQLMutation(EDIT_TASK, {
    onSuccess: () => {
      ToggleSuccess("Task edited successfully");
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Error editing task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to edit task");
    },
  });

  const handleSubmit = async () => {
    const input: CreateUpdateTaskInput = {
      taskIdentifier: task?.taskIdentifier,
      investigationIdentifier: investigationGuid,
      taskTypeCode: form.getFieldValue("task-sub-category") || "",
      taskStatusCode: form.getFieldValue("task-status") || "",
      assignedUserIdentifier: form.getFieldValue("task-officer-assigned") || "",
      description: form.getFieldValue("task-description") || "",
    };

    if (isEditMode) {
      editTaskMutation.mutate({ input: input });
    } else {
      addTaskMutation.mutate({ input: input });
    }
  };

  const handleCancel = async () => {
    setSelectedCategory("");
    form.reset();
    onClose();
  };

  const taskSubCategoryOptions = taskSubCategories
    .filter((task: any) => task.taskCategory === selectedCategory)
    .map((option: any) => {
      return {
        value: option.value,
        label: option.label,
      };
    });

  const assignableOfficers = officersInAgencyList.map((option: any) => {
    return {
      value: option.app_user_guid,
      label: `${option.last_name}, ${option.first_name}`,
    };
  });

  const taskStatusOptions = taskStatus.map((option: any) => {
    return {
      value: option.value,
      label: option.label,
    };
  });

  return (
    <Card
      className="mb-3"
      border="default"
    >
      <Card.Header className="comp-card-header">
        <div className="comp-card-header-title">
          <h4>{isEditMode ? `Edit task ${task?.taskNumber}` : "Add task"}</h4>
        </div>
      </Card.Header>

      <Card.Body className="comp-task-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FormField
            form={form}
            name="task-category"
            label="Task category"
            required
            render={(field) => (
              <CompSelect
                id="task-category-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={taskCategoryOptions}
                value={taskCategoryOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => {
                  const value = option?.value || "";
                  field.handleChange(value);
                  setSelectedCategory(value);
                }}
                placeholder="Select category"
                isClearable={true}
                showInactive={false}
                enableValidation={true}
                errorMessage={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />

          {selectedCategory && (
            <FormField
              form={form}
              name="task-sub-category"
              label="Task sub-category"
              required
              render={(field) => (
                <CompSelect
                  id="task-sub-category-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={taskSubCategoryOptions}
                  value={taskSubCategoryOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => {
                    const value = option?.value || "";
                    field.handleChange(value);
                  }}
                  placeholder="Select sub-category"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />
          )}
          <FormField
            form={form}
            name="task-description"
            label="Task description"
            render={(field) => (
              <ValidationTextArea
                id="description"
                className="comp-form-control comp-details-input"
                rows={4}
                defaultValue={field.state.value}
                onChange={(value: string) => {
                  field.handleChange(value);
                }}
                placeholderText="Enter task description..."
                maxLength={4000}
                errMsg={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />
          <FormField
            form={form}
            name="task-officer-assigned"
            label="Officer assigned"
            required
            render={(field) => (
              <CompSelect
                id="task-officer-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={assignableOfficers}
                value={assignableOfficers.find((opt) => opt.value === field.state.value)}
                onChange={(option) => {
                  field.handleChange(option?.value || "");
                }}
                placeholder="Type in or select"
                isClearable={true}
                showInactive={false}
                enableValidation={true}
                errorMessage={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />
          <FormField
            form={form}
            name="task-status"
            label="Status"
            required
            render={(field) => (
              <CompSelect
                id="task-status-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={taskStatusOptions}
                value={taskStatusOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => {
                  field.handleChange(option?.value || "");
                }}
                placeholder="Select status"
                isClearable={true}
                showInactive={false}
                enableValidation={true}
                errorMessage={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />
          <FormField
            form={form}
            name="task-created-date"
            label="Date created"
            render={(field) => (
              <DatePicker
                id="task-created-date-calendar"
                selected={new Date()}
                onChange={(e) => e}
                dateFormat="yyyy-MM-dd"
                wrapperClassName="comp-details-edit-calendar-input datepicker-disabled"
                readOnly
                disabled
                showIcon
              />
            )}
          />
          <FormField
            form={form}
            name="task-created-by"
            label="Created by"
            render={(field) => (
              <CompSelect
                id="task-created-by-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={assignableOfficers}
                value={assignableOfficers.find((opt) => opt.value === idir)}
                onChange={(option) => field.handleChange(option?.value || "")}
                placeholder="Type in or select"
                isClearable={true}
                showInactive={false}
                enableValidation={true}
                errorMessage={field.state.meta.errors?.[0]?.message || ""}
                isDisabled
              />
            )}
          />
        </form>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="add-contravention-cancel-button"
            title="Cancel"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-contravention-save-button"
            title="Save Add Contravention"
            onClick={handleSubmit}
          >
            <span>Save</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
