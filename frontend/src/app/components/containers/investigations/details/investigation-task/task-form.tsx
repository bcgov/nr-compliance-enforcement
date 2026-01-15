import { ToggleError, ToggleSuccess } from "@/app/common/toast";
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
import { CreateUpdateTaskInput, DiaryDateInput, Task } from "@/generated/graphql";
import { useForm } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import z from "zod";
import { CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { DiaryDateForm } from "@/app/components/containers/investigations/details/investigation-diary-dates/diary-date-form";
import { useQueryClient } from "@tanstack/react-query";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import {
  DELETE_DIARY_DATE,
  GET_DIARY_DATES_BY_TASK,
  SAVE_DIARY_DATE,
} from "@/app/components/containers/investigations/details/investigation-diary-dates";

interface TaskFormProps {
  investigationGuid: string;
  onClose: () => void;
  task?: Task;
}

interface DiaryDate {
  diaryDateGuid?: string;
  description: string;
  diaryDate: Date | null;
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
  const queryClient = useQueryClient();
  const { data: diaryDatesData, refetch } = useGraphQLQuery<{ diaryDatesByTask: DiaryDate[] }>(
    GET_DIARY_DATES_BY_TASK,
    {
      queryKey: ["diaryDatesByTask", task?.taskIdentifier],
      variables: { taskGuid: task?.taskIdentifier },
      enabled: !!task?.taskIdentifier,
    },
  );
  const initialDiaryDatesData = diaryDatesData?.diaryDatesByTask || [];

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
      if (diaryDates.length > 0 && !areAllDiaryDatesValid()) {
        setTriggerDiaryValidation(true);
        setTimeout(() => setTriggerDiaryValidation(false), 100); // reset trigger
        return;
      }

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
  const [diaryDates, setDiaryDates] = useState<DiaryDate[]>([]);
  const [diaryDateValidation, setDiaryDateValidation] = useState<Record<number, boolean>>({});
  const [triggerDiaryValidation, setTriggerDiaryValidation] = useState(false);
  const [deletedDiaryDateGuids, setDeletedDiaryDateGuids] = useState<string[]>([]);

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

  // Populate diary dates when editing
  useEffect(() => {
    if (task && diaryDatesData?.diaryDatesByTask) {
      const existingDiaryDates = diaryDatesData.diaryDatesByTask.map((dd) => ({
        diaryDateGuid: dd.diaryDateGuid,
        description: dd.description || "",
        //@ts-ignore
        diaryDate: dd.dueDate ? new Date(dd.dueDate) : null,
      }));

      setDiaryDates(existingDiaryDates);

      // Initialize validation state for existing diary dates
      const initialValidation: Record<number, boolean> = {};
      existingDiaryDates.forEach((_, index) => {
        initialValidation[index] = true; // Existing diary dates are already valid
      });
      setDiaryDateValidation(initialValidation);
    }
  }, [task, diaryDatesData]);

  // Functions

  const addTaskMutation = useGraphQLMutation(ADD_TASK, {
    onSuccess: async (data) => {
      // First delete any marked diary dates
      if (deletedDiaryDateGuids.length > 0) {
        await deleteTrackedDiaryDates();
      }

      // Save diary dates after task is created
      if (diaryDates.length > 0) {
        try {
          await saveDiaryDates(data.createTask.taskIdentifier);
        } catch (error) {
          console.error("Error saving diary dates:", error);
          ToggleError("Task added but some diary dates failed to save");
          return;
        }
      }
      ToggleSuccess("Task added successfully");

      form.reset();
      setDiaryDates([]);
      setDiaryDateValidation({});
      onClose();
    },
    onError: (error: any) => {
      console.error("Error adding task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add task");
    },
  });

  const editTaskMutation = useGraphQLMutation(EDIT_TASK, {
    onSuccess: async () => {
      //Delete any marked diary dates
      if (deletedDiaryDateGuids.length > 0) {
        await deleteTrackedDiaryDates();
      }

      // Save diary dates after task is updated
      if (diaryDates.length > 0) {
        try {
          await saveDiaryDates(task?.taskIdentifier);
        } catch (error) {
          console.error("Error saving diary dates:", error);
          ToggleError("Task updated but some diary dates failed to save");
          return;
        }
      }

      ToggleSuccess("Task edited successfully");
      form.reset();
      setDiaryDates([]);
      setDiaryDateValidation({});
      onClose();
    },
    onError: (error: any) => {
      console.error("Error editing task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to edit task");
    },
  });

  const saveDiaryDateMutation = useGraphQLMutation(SAVE_DIARY_DATE, {
    onError: (error: any) => {
      console.error("Error saving diary date:", error);
      ToggleError("Failed to save diary date");
    },
  });

  const deleteDiaryDateMutation = useGraphQLMutation(DELETE_DIARY_DATE, {
    onError: (error: any) => {
      console.error("Error deleting diary date:", error);
      ToggleError("Failed to delete diary date");
    },
  });

  const saveDiaryDates = async (taskGuid: string | undefined) => {
    const savePromises = diaryDates.map(async (diaryDate) => {
      const input: DiaryDateInput = {
        diaryDateGuid: diaryDate?.diaryDateGuid || undefined,
        investigationGuid: investigationGuid,
        dueDate: diaryDate.diaryDate?.toISOString() || "",
        description: diaryDate.description,
        userGuid: idir,
        taskGuid: taskGuid || undefined,
      };
      return saveDiaryDateMutation.mutateAsync({ input });
    });

    await Promise.all(savePromises);
  };

  const deleteTrackedDiaryDates = async () => {
    try {
      const deletePromises = deletedDiaryDateGuids.map(async (guid) => {
        return deleteDiaryDateMutation.mutateAsync({ diaryDateGuid: guid });
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting diary dates:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    await form.handleSubmit();
  };

  const handleCancel = async () => {
    setSelectedCategory("");
    setDiaryDates([]);
    setDiaryDateValidation({});
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

  // Diary Date Functions
  const addDiaryDate = () => {
    setDiaryDates([...diaryDates, { description: "", diaryDate: null }]);
  };

  const deleteDiaryDate = async (index: number) => {
    const diaryDateToDelete = diaryDates[index];

    // If it's an existing diary date (has diaryDateGuid), track it for deletion
    if (diaryDateToDelete.diaryDateGuid) {
      setDeletedDiaryDateGuids([...deletedDiaryDateGuids, diaryDateToDelete.diaryDateGuid]);
    }

    //Remove from local state
    const newDiaryDates = diaryDates.filter((_, i) => i !== index);
    setDiaryDates(newDiaryDates);

    // Update validation state
    const newValidation = { ...diaryDateValidation };
    delete newValidation[index];
    // Reindex the validation state
    const reindexedValidation: Record<number, boolean> = {};
    Object.keys(newValidation).forEach((key) => {
      const numKey = parseInt(key);
      if (numKey > index) {
        reindexedValidation[numKey - 1] = newValidation[numKey];
      } else {
        reindexedValidation[numKey] = newValidation[numKey];
      }
    });
    setDiaryDateValidation(reindexedValidation);
  };

  const handleDiaryDateValidationChange = (index: number, isValid: boolean) => {
    setDiaryDateValidation((prev) => ({
      ...prev,
      [index]: isValid,
    }));
  };

  const handleDiaryDateValuesChange = (index: number, values: { description: string; diaryDate: Date | null }) => {
    setDiaryDates((prev) => {
      const newDiaryDates = [...prev];
      newDiaryDates[index] = {
        ...newDiaryDates[index],
        description: values.description,
        diaryDate: values.diaryDate,
      };
      return newDiaryDates;
    });
  };

  const areAllDiaryDatesValid = () => {
    if (diaryDates.length === 0) return true;
    return diaryDates.every((_, index) => diaryDateValidation[index] === true);
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

        {/* Diary Dates Section */}
        <div className="mt-4">
          <hr className="m-0"></hr>
          <div
            className="my-3"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <i className="bi bi-calendar3-week"></i>
            <h5 className="fw-bold m-0">Diary Dates</h5>
          </div>
          {/* Render Diary Date Forms */}
          {diaryDates.map((diaryDate, index: number) => (
            <DiaryDateForm
              key={index}
              index={index}
              onDelete={deleteDiaryDate}
              onValidationChange={handleDiaryDateValidationChange}
              onValuesChange={handleDiaryDateValuesChange}
              initialData={diaryDate}
              triggerValidation={triggerDiaryValidation}
            />
          ))}
          <Button
            className="comp-add-drug-btn"
            variant="outline-primary"
            size="sm"
            title="Add diary date"
            onClick={addDiaryDate}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add diary date</span>
          </Button>
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
