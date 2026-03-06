import { DismissToast, ToggleError, ToggleInformation, ToggleSuccess, ToggleWarning } from "@/app/common/toast";
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
import {
  ActivityNote,
  ActivityNoteInput,
  CreateUpdateTaskInput,
  DiaryDate,
  DiaryDateInput,
  Task,
} from "@/generated/graphql";
import { useForm, useStore } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useCallback, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import z from "zod";
import { ADD_EDIT_TASK_ATTACHMENT, CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { DiaryDateForm } from "@/app/components/containers/investigations/details/investigation-diary-dates/diary-date-form";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import {
  DELETE_DIARY_DATE,
  GET_DIARY_DATES_BY_TASK,
  SAVE_DIARY_DATE,
} from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { COMSObject } from "@/app/types/coms/object";
import { handleAddAttachments, handleDeleteAttachments, handlePersistAttachments } from "@/app/common/attachment-utils";
import { Attachments } from "@/app/components/common/attachments-carousel";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { Id } from "react-toastify";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import { parse } from "date-fns";
import {
  ActivityNoteEditor,
  DELETE_ACTIVITY_NOTE,
  GET_ACTIVITY_NOTES_BY_TASK,
  SAVE_ACTIVITY_NOTE,
} from "@/app/components/common/activity-note";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface TaskFormProps {
  investigationGuid: string;
  onClose: (newTask?: Task) => void;
  task?: Task;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
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

export const TaskForm = ({ task, investigationGuid, onClose, onDirtyChange }: TaskFormProps) => {
  const { data: diaryDatesData } = useGraphQLQuery<{ diaryDatesByTask: DiaryDate[] }>(GET_DIARY_DATES_BY_TASK, {
    queryKey: ["diaryDatesByTask", task?.taskIdentifier],
    variables: { taskGuid: task?.taskIdentifier },
    enabled: !!task?.taskIdentifier,
  });

  const { data: taskActionsData } = useGraphQLQuery<{ getActivityNotesByTask: ActivityNote[] }>(
    GET_ACTIVITY_NOTES_BY_TASK,
    {
      queryKey: ["getActivityNotesByTask", task?.taskIdentifier],
      variables: { taskGuid: task?.taskIdentifier },
      enabled: !!task?.taskIdentifier,
    },
  );

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

      // Check task action validation
      if (taskActions.length > 0 && !areAllTaskActionsValid()) {
        setShowTaskActionErrors(true);
        ToggleError("Please complete all task action fields");
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
  const [taskActions, setTaskActions] = useState<Partial<ActivityNoteInput[]>>([]);
  const [showTaskActionErrors, setShowTaskActionErrors] = useState(false);
  const [taskActionValidation, setTaskActionValidation] = useState<Record<number, boolean>>({});
  const [deletedTaskActionGuids, setDeletedTaskActionGuids] = useState<string[]>([]);
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<File[] | null>(null);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<COMSObject[] | null>(null);
  const [attachmentCount, setAttachmentCount] = useState<number>(0);

  // Data
  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field.isTouched),
  );

  useEffect(() => {
    if (isFormDirty) {
      markDirty();
    }
  }, [isFormDirty, markDirty]);

  const taskCategoryOptions = taskCategories.map((option: any) => {
    return {
      value: option.value,
      label: option.label,
    };
  });

  const isEditMode = !!task;

  // Use Effects

  // Set defaults on first mount
  useEffect(() => {
    if (!isEditMode) {
      form.setFieldValue("task-officer-assigned", form.getFieldValue("task-officer-assigned") || idir);
      form.setFieldValue("task-status", form.getFieldValue("task-status") || "OPEN");
      form.setFieldMeta("task-officer-assigned", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("task-status", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
    }
  }, []);

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

      form.setFieldMeta("task-category", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("task-sub-category", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("task-description", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("task-officer-assigned", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("task-created-by", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("task-status", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
    }
  }, [task, taskSubCategories]);

  const parseDate = (dateStr: string) => parse(dateStr, "yyyy-MM-dd", new Date());

  // Populate diary dates when editing
  useEffect(() => {
    if (task && diaryDatesData?.diaryDatesByTask) {
      const existingDiaryDates = diaryDatesData.diaryDatesByTask.map((dd) => ({
        diaryDateGuid: dd.diaryDateGuid,
        description: dd.description || "",
        dueDate: dd.dueDate ? parseDate(dd.dueDate) : null,
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

  // Populate task actions when editing
  useEffect(() => {
    if (task && taskActionsData?.getActivityNotesByTask) {
      const existingTaskActions = taskActionsData.getActivityNotesByTask.map((ta) => ({
        activityNoteGuid: ta.activityNoteGuid,
        contentJson: ta.contentJson,
        contentText: ta.contentText,
        actionedDate: ta.actionedDate || new Date(),
        actionedTime: ta.actionedTime || null,
        actionedAppUserGuidRef: ta?.actionedAppUserGuidRef,
      }));

      setTaskActions(existingTaskActions);

      // Initialize validation state for existing diary dates
      const initialValidation: Record<number, boolean> = {};
      existingTaskActions.forEach((_, index) => {
        initialValidation[index] = true; // Existing task Actions are already valid
      });
      setTaskActionValidation(initialValidation);
    }
  }, [task, taskActionsData]);

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
      identifier: investigationGuid,
      subIdentifier: taskIdentifier,
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
      const handleSuccess = async () => {
        let diaryDatesFailed = false;
        let taskActionsFailed = false;

        // Diary Dates
        if (diaryDates.length > 0) {
          try {
            await saveDiaryDates(data.createTask.taskIdentifier);
          } catch (error) {
            console.error("Error saving diary dates:", error);
            diaryDatesFailed = true;
          }
        }

        // Attachments (asynchronous)
        persistTaskAttachments(data.createTask.taskIdentifier);

        // Actions
        if (taskActions.length > 0) {
          try {
            await saveTaskActions(data.createTask.taskIdentifier);
          } catch (error) {
            console.error("Error saving task actions:", error);
            taskActionsFailed = true;
          }
        }

        // Cleanup
        form.reset();
        setDiaryDates([]);
        setDiaryDateValidation({});
        onClose({
          ...data.createTask,
        } as Task);

        // Show appropriate toast based on what failed
        if (!diaryDatesFailed && !taskActionsFailed) {
          ToggleSuccess("Task added successfully");
        } else if (diaryDatesFailed && taskActionsFailed) {
          ToggleWarning("Task added but diary dates and task actions failed to save");
        } else if (diaryDatesFailed) {
          ToggleWarning("Task added but diary dates failed to save");
        } else if (taskActionsFailed) {
          ToggleWarning("Task added but task actions failed to save");
        }
      };

      handleSuccess();
    },
    onError: (error: any) => {
      console.error("Error adding task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add task");
    },
  });

  const editTaskMutation = useGraphQLMutation(EDIT_TASK, {
    onSuccess: () => {
      const handleSuccess = async () => {
        let diaryDatesFailed = false;
        let taskActionsFailed = false;

        try {
          // First delete any marked diary dates
          if (deletedDiaryDateGuids.length > 0) {
            await deleteTrackedDiaryDates();
          }
          if (diaryDates.length > 0) {
            await saveDiaryDates(task?.taskIdentifier);
          }
        } catch (error) {
          console.error("Error editing task:", error);
          diaryDatesFailed = true;
        }

        void persistTaskAttachments(task!.taskIdentifier);

        try {
          // First delete any marked task Actions
          if (deletedTaskActionGuids.length > 0) {
            await deleteTrackedTaskActions();
          }
          if (taskActions.length > 0) {
            await saveTaskActions(task!.taskIdentifier);
          }
        } catch (error) {
          console.error("Error editing task:", error);
          taskActionsFailed = true;
        }

        form.reset();
        setDiaryDates([]);
        setDiaryDateValidation({});
        setDeletedDiaryDateGuids([]);
        onClose();

        if (!diaryDatesFailed && !taskActionsFailed) {
          ToggleSuccess("Task edited successfully");
        } else if (diaryDatesFailed && taskActionsFailed) {
          ToggleWarning("Task edited but diary dates and task actions failed to save");
        } else if (diaryDatesFailed) {
          ToggleWarning("Task edited but diary dates failed to save");
        } else if (taskActionsFailed) {
          ToggleWarning("Task edited but task actions failed to save");
        }
      };

      handleSuccess();
    },
    onError: (error: any) => {
      console.error("Error editing task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to edit task");
    },
  });

  const saveDiaryDateMutation = useGraphQLMutation(SAVE_DIARY_DATE, {
    onError: (error: any) => {
      console.error("Error saving diary date:", error);
    },
  });

  const deleteDiaryDateMutation = useGraphQLMutation(DELETE_DIARY_DATE, {
    onError: (error: any) => {
      console.error("Error deleting diary date:", error);
    },
  });

  const saveDiaryDates = async (taskGuid: string | undefined) => {
    const savePromises = diaryDates.map(async (diaryDate) => {
      const input: DiaryDateInput = {
        diaryDateGuid: diaryDate?.diaryDateGuid || undefined,
        investigationGuid: investigationGuid,
        dueDate: (diaryDate.dueDate as Date) || "",
        description: diaryDate?.description || "",
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
    markClean();
  };

  const handleCancel = async () => {
    setSelectedCategory("");
    setDiaryDates([]);
    setDiaryDateValidation({});
    form.reset();
    onClose();
    markClean();
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
    setDiaryDates([...diaryDates, { description: "", dueDate: null }]);
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
      const numKey = Number.parseInt(key);
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

  const handleDiaryDateValuesChange = (index: number, values: { description: string; dueDate: Date | null }) => {
    setDiaryDates((prev) => {
      const newDiaryDates = [...prev];
      newDiaryDates[index] = {
        ...newDiaryDates[index],
        description: values.description,
        dueDate: values.dueDate,
      };
      return newDiaryDates;
    });
  };

  const areAllDiaryDatesValid = () => {
    if (diaryDates.length === 0) return true;
    return diaryDates.every((_, index) => diaryDateValidation[index] === true);
  };

  const areAllTaskActionsValid = () => {
    if (taskActions.length === 0) return true;

    const result = taskActions.every((_, index) => taskActionValidation[index] === true);
    return result;
  };

  // Task Action Functions
  const addTaskAction = () => {
    setTaskActions([...taskActions, { contentJson: "" }]);
  };

  const handleTaskActionValidationChange = (isValid: boolean, index?: number) => {
    setTaskActionValidation((prev) => ({
      ...prev,
      [index || 0]: isValid,
    }));
  };

  const handleTaskActionValuesChange = (values: Partial<ActivityNoteInput>, index?: number) => {
    setTaskActions((prev) => {
      const newValues = [...prev];
      newValues[index || 0] = values;
      return newValues;
    });
  };

  const saveActivityNoteMutation = useGraphQLMutation(SAVE_ACTIVITY_NOTE, {
    onError: (error: any) => {
      console.error("Error saving activity note:", error);
    },
  });

  const deleteActivityNoteMutation = useGraphQLMutation(DELETE_ACTIVITY_NOTE, {
    onError: (error: any) => {
      console.error("Error deleting diary date:", error);
    },
  });

  const saveTaskActions = async (taskGuid: string) => {
    const savePromises = taskActions.map(async (values) => {
      const input: ActivityNoteInput = {
        investigationGuid: investigationGuid,
        taskGuid: taskGuid,
        activityNoteGuid: values?.activityNoteGuid,
        activityNoteCode: "TASKACT",
        contentJson: values?.contentJson,
        contentText: values?.contentText,
        actionedDate: values?.actionedDate || new Date(),
        actionedTime: values?.actionedTime || null,
        reportedTimestamp: new Date(),
        actionedAppUserGuidRef: values?.actionedAppUserGuidRef,
        reportedAppUserGuidRef: idir,
      };
      return saveActivityNoteMutation.mutateAsync({ input });
    });

    await Promise.all(savePromises);
  };

  const deleteTrackedTaskActions = async () => {
    try {
      const deletePromises = deletedTaskActionGuids.map(async (guid) => {
        return deleteActivityNoteMutation.mutateAsync({ activityNoteGuid: guid });
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting task actions:", error);
      throw error;
    }
  };

  const deleteTaskAction = async (index: number) => {
    const taskActionToDelete = taskActions[index];

    // If it's an existing task action (has activityNoteGuid), track it for deletion
    if (taskActionToDelete?.activityNoteGuid) {
      setDeletedTaskActionGuids([...deletedTaskActionGuids, taskActionToDelete.activityNoteGuid]);
    }

    //Remove from local state
    const newTaskActions = taskActions.filter((_, i) => i !== index);
    setTaskActions(newTaskActions);

    // Update validation state
    const newValidation = { ...taskActionValidation };
    delete newValidation[index];
    // Reindex the validation state
    const reindexedValidation: Record<number, boolean> = {};
    Object.keys(newValidation).forEach((key) => {
      const numKey = Number.parseInt(key);
      if (numKey > index) {
        reindexedValidation[numKey - 1] = newValidation[numKey];
      } else {
        reindexedValidation[numKey] = newValidation[numKey];
      }
    });
    setTaskActionValidation(reindexedValidation);
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

  const toggleAddAttachment = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: ADD_EDIT_TASK_ATTACHMENT,
        data: {
          title: "Upload attachment",
        },
      }),
    );
  };

  return (
    <Card
      className="mb-3"
      border="default"
    >
      <Card.Header className="comp-card-header">
        <div className="comp-card-header-title">
          <h4>{isEditMode ? `Edit Task ${task?.taskNumber}` : "Add task"}</h4>
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
          <div className="d-flex my-3 gap-2 align-items-center">
            <i className="bi bi-calendar3-week"></i>
            <h5 className="fw-bold m-0">Diary dates</h5>
          </div>
          {/* Render Diary Date Forms */}
          {diaryDates.map((diaryDate, index: number) => (
            <DiaryDateForm
              key={diaryDate.diaryDateGuid}
              index={index}
              onDelete={deleteDiaryDate}
              onValidationChange={handleDiaryDateValidationChange}
              onDirtyChange={onDirtyChange}
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

        {/* Task Action Section */}
        <div className="mt-4">
          <hr className="m-0"></hr>
          <div className="d-flex my-3 gap-2 align-items-center">
            <i className="bi bi-file-text"></i>
            <h5 className="fw-bold m-0">Task actions</h5>
          </div>
          {/* Render Task Action Forms */}
          {taskActions.map((taskAction, index: number) => (
            <Card
              key={taskAction?.activityNoteGuid || index}
              className="comp-task-form-section"
              style={{ borderTop: "none" }}
            >
              <Card.Header className="comp-card-header px-0">
                <div className="comp-card-header-title">
                  <h5>Add task action {index + 1}</h5>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  aria-label="Delete diary date"
                  onClick={() => deleteTaskAction(index)}
                >
                  <i className="bi bi-trash3"></i>
                  <span>Delete</span>
                </Button>
              </Card.Header>
              <Card.Body>
                <ActivityNoteEditor
                  index={index}
                  onValidationChange={handleTaskActionValidationChange}
                  onValuesChange={handleTaskActionValuesChange}
                  initialData={taskAction}
                  showErrors={showTaskActionErrors}
                  onDirtyChange={onDirtyChange}
                />
              </Card.Body>
            </Card>
          ))}
          <Button
            className="comp-add-task-action"
            variant="outline-primary"
            size="sm"
            title="Add task Action"
            onClick={addTaskAction}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add task action</span>
          </Button>
        </div>

        <div className="mt-3">
          <hr className="mb-3"></hr>
          <fieldset>
            <div className="attachment-header">
              <h4>Attachments ({attachmentCount})</h4>
              <Button
                id="add-task-attachment"
                title="Add attachment"
                variant="primary"
                size="sm"
                onClick={toggleAddAttachment}
              >
                <i className="bi bi-upload"></i>
                <span>Add attachment</span>
              </Button>
            </div>

            <Attachments
              attachmentType={AttachmentEnum.TASK_ATTACHMENT}
              identifier={investigationGuid}
              subIdentifier={task?.taskIdentifier}
              allowUpload={true}
              allowDelete={true}
              onFilesSelected={onHandleAddAttachments}
              onFileDeleted={onHandleDeleteAttachment}
              onSlideCountChange={handleSlideCountChange}
              onDirtyChange={onDirtyChange}
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
