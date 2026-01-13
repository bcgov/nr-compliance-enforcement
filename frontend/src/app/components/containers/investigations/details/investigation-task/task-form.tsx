import { DismissToast, ToggleError, ToggleInformation, ToggleSuccess } from "@/app/common/toast";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { CompSelect } from "@/app/components/common/comp-select";
import { FormField } from "@/app/components/common/form-field";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import DatePicker from "react-datepicker";
import { appUserGuid, openModal, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectTaskCategory, selectTaskStatus, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers, selectOfficersByAgency } from "@/app/store/reducers/officer";
import { RootState } from "@/app/store/store";
import { CreateUpdateTaskInput, Task } from "@/generated/graphql";
import { useForm } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useCallback, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import z from "zod";
import { CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { COMSObject } from "@/app/types/coms/object";
import { handleAddAttachments, handleDeleteAttachments, handlePersistAttachments } from "@/app/common/attachment-utils";
import { AttachmentsCarousel } from "@/app/components/common/attachments-carousel";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { Id } from "react-toastify";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";

interface TaskFormProps {
  investigationGuid: string;
  onClose: (newTask?: Task) => void;
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
      "task-created-by": "",
      "task-status": "",
    },
    onSubmit: async ({ value }) => {
      const input: CreateUpdateTaskInput = {
        taskIdentifier: task?.taskIdentifier,
        investigationIdentifier: investigationGuid,
        taskTypeCode: value["task-sub-category"] || "",
        taskStatusCode: value["task-status"] || "",
        assignedUserIdentifier: value["task-officer-assigned"] || "",
        appUserIdentifier: idir,
        description: value["task-description"] || "",
      };

      if (isEditMode) {
        editTaskMutation.mutate({ input: input });
      } else {
        addTaskMutation.mutate({ input: input });
      }
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
  const allOfficers = useAppSelector(selectOfficers);
  const dispatch = useAppDispatch();
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [attachmentCount, setAttachmentCount] = useState<number>(0);

  // Data
  const taskCategoryOptions = taskCategories.map((option: any) => {
    return {
      value: option.value,
      label: option.label,
    };
  });

  const isEditMode = !!task;

  if (!isEditMode) {
    // Set defaults
    form.setFieldValue("task-officer-assigned", form.getFieldValue("task-officer-assigned") || idir);
    form.setFieldValue("task-status", form.getFieldValue("task-status") || "OPEN");
  }

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
      form.setFieldValue("task-created-by", task.createdByUserIdentifier || "");
      form.setFieldValue("task-status", task.taskStatusCode || "");
    }
  }, [task, taskSubCategories]);

  // Functions

  const persistTaskAttachments = async (taskIdentifier: string) => {
    if (!attachmentsToAdd && !attachmentsToDelete) return;

    let toastId: Id;

    if (attachmentsToAdd) {
      toastId = ToggleInformation("Upload in progress, do not close the NatSuite application.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });
    }

    handlePersistAttachments({
      dispatch,
      attachmentsToAdd,
      attachmentsToDelete,
      identifier: taskIdentifier,
      setAttachmentsToAdd,
      setAttachmentsToDelete,
      attachmentType: AttachmentEnum.TASK_ATTACHMENT,
      isSynchronous: false,
    }).then(() => {
      if (attachmentsToAdd) {
        DismissToast(toastId);
      }
      attachmentUploadComplete$.next(taskIdentifier);
    });
  };

  const addTaskMutation = useGraphQLMutation(ADD_TASK, {
    onSuccess: (data) => {
      (async () => {
        try {
          ToggleSuccess("Task added successfully");
          persistTaskAttachments(data.createTask.taskIdentifier);
          form.reset();
          onClose({
            ...data.createTask,
          } as Task);
        } catch (error) {
          console.error("Error persisting attachments:", error);
          ToggleError("Failed to save attachments for task");
        }
      })();
    },
    onError: (error: any) => {
      console.error("Error adding task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add task");
    },
  });

  const editTaskMutation = useGraphQLMutation(EDIT_TASK, {
    onSuccess: () => {
      ToggleSuccess("Task edited successfully");
      void persistTaskAttachments(task!.taskIdentifier);
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Error editing task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to edit task");
    },
  });

  const handleSubmit = async () => {
    await form.handleSubmit();
  };

  const handleCancel = async () => {
    setSelectedCategory("");
    form.reset();
    onClose();
  };

  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => handleCancel(),
        },
      }),
    );
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

  const allOfficerOptions = allOfficers?.map((option: any) => {
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

  const onHandleAddAttachments = (selectedFiles: File[]) => {
    handleAddAttachments(setAttachmentsToAdd, selectedFiles);
  };

  const onHandleDeleteAttachment = (fileToDelete: COMSObject) => {
    handleDeleteAttachments(attachmentsToAdd, setAttachmentsToAdd, setAttachmentsToDelete, fileToDelete);
  };

  const handleSlideCountChange = useCallback(
    (count: number) => {
      setAttachmentCount(count);
    },
    [setAttachmentCount],
  );

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
            validators={{
              onChange: z.string().min(1, "Task category is required"),
              onSubmit: z.string().min(1, "Task category is required"),
            }}
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
              validators={{
                onChange: z.string().min(1, "Task sub category is required"),
                onSubmit: z.string().min(1, "Task sub category is required"),
              }}
              render={(field) => (
                <CompSelect
                  key={selectedCategory} // Force the component to re-render when the category changes
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
            validators={{
              onChange: z.string().min(1, "Officer assigned is required"),
              onSubmit: z.string().min(1, "Officer assigned is required"),
            }}
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
            validators={{
              onChange: z.string().min(1, "Status is required"),
              onSubmit: z.string().min(1, "Status is required"),
            }}
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
            render={(field) => {
              const resolvedValue = field.state.value || idir;

              return (
                <CompSelect
                  id="task-created-by-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={allOfficerOptions}
                  value={allOfficerOptions?.find((opt) => opt.value === resolvedValue)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Type in or select"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled
                />
              );
            }}
          />
        </form>
        <div className="mt-3">
          <fieldset>
            <h4>Attachments ({attachmentCount})</h4>
            <AttachmentsCarousel
              attachmentType={AttachmentEnum.TASK_ATTACHMENT}
              identifier={task?.taskIdentifier}
              allowUpload={true}
              allowDelete={true}
              onFilesSelected={onHandleAddAttachments}
              onFileDeleted={onHandleDeleteAttachment}
              onSlideCountChange={handleSlideCountChange}
              showPreview={false}
            />
          </fieldset>
        </div>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="add-task-cancel-button"
            title="Cancel"
            onClick={cancelButtonClick}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-task-save-button"
            title="Save Add Task"
            onClick={handleSubmit}
          >
            <span>Save</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
