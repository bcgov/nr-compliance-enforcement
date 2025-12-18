import DatePicker from "react-datepicker";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { CompSelect } from "@/app/components/common/comp-select";
import { FormField } from "@/app/components/common/form-field";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectTaskCategory, selectTaskStatus, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { RootState } from "@/app/store/store";
import { CreateUpdateTaskInput, Investigation, Task } from "@/generated/graphql";
import { useForm } from "@tanstack/react-form";
import { FC, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { gql } from "graphql-request";
import { TaskItem } from "@/app/components/containers/investigations/details/investigation-task/task-item";

interface InvestigationTasksProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

const ADD_TASK = gql`
  mutation CreateTask($input: CreateUpdateTaskInput!) {
    createTask(input: $input) {
      taskIdentifier
    }
  }
`;

export const InvestigationTasks: FC<InvestigationTasksProps> = ({ investigationGuid, investigationData }) => {
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
  const agency = useAppSelector(selectOfficerAgency);
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatus = useAppSelector(selectTaskStatus);
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, agency));

  const [showAddCard, setshowAddCard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Data
  const tasks = investigationData?.tasks;
  const taskCategoryOptions = taskCategories.map((option: any) => {
    return {
      value: option.value,
      label: option.label,
    };
  });

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

  const addTaskMutation = useGraphQLMutation(ADD_TASK, {
    onSuccess: () => {
      ToggleSuccess("Task added successfully");
      setshowAddCard(false);
      setSelectedCategory("");
      form.reset();
    },
    onError: (error: any) => {
      console.error("Error adding task:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add task");
    },
  });

  const handleSubmit = async () => {
    const input: CreateUpdateTaskInput = {
      investigationIdentifier: investigationGuid,
      taskTypeCode: form.getFieldValue("task-sub-category") || "",
      taskStatusCode: form.getFieldValue("task-status") || "",
      assignedUserIdentifier: form.getFieldValue("task-officer-assigned") || "",
      description: form.getFieldValue("task-description") || "",
    };

    addTaskMutation.mutate({ input: input });
  };

  const handleCancel = async () => {
    setshowAddCard(false);
    setSelectedCategory("");
    form.reset();
  };

  return (
    <>
      <div className="comp-details-view">
        <div className="row">
          <div className="col-12">
            <h3>Tasks</h3>
          </div>
        </div>

        <div className="task-list">
          {tasks?.map((task) => (
            <div key={task?.taskIdentifier}>
              <TaskItem
                task={task as Task}
                investigationData={investigationData}
              />
            </div>
          ))}
        </div>

        {showAddCard && (
          <Card
            className="mb-3"
            border="default"
          >
            <Card.Header className="comp-card-header">
              <div className="comp-card-header-title">
                <h4>Add task</h4>
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
        )}

        <div className="row">
          <div className="col-12">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setshowAddCard(true)}
            >
              <i className="bi bi-plus-circle me-1" /> {/**/}
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestigationTasks;
