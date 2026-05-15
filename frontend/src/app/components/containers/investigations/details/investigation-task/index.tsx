import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { gql } from "graphql-request";
import { Button } from "react-bootstrap";
import { TaskList } from "@/app/components/containers/investigations/details/investigation-task/task-list";
import { TaskDetailEditModal } from "@/app/components/containers/investigations/details/investigation-task/detail/task-detail-edit-modal";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { Investigation, Task } from "@/generated/graphql";
import type { CreateUpdateTaskInput } from "@/generated/graphql";
import { DismissToast, ToggleError, ToggleInformation, ToggleSuccess } from "@/app/common/toast";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  selectTaskCategory,
  selectTaskSubCategory,
  selectTaskStatus,
} from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { selectCurrentDownload } from "@/app/store/reducers/bulk-download";
import { exportTasksList } from "@/app/store/reducers/documents-thunks";
import { createDownloadProgressHandler } from "@/app/common/attachment-download-helper";
import { escapeCsvCell, formatDate, formatDateTime } from "@/app/common/methods";

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateUpdateTaskInput!) {
    createTask(input: $input) {
      taskIdentifier
    }
  }
`;

interface InvestigationTasksNewProps {
  investigationGuid: string;
  investigationData?: Investigation;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const InvestigationTasksNew: FC<InvestigationTasksNewProps> = ({ investigationGuid, investigationData }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const tasks = (investigationData?.tasks as Task[]) ?? [];
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officers = useAppSelector(selectOfficers);
  const currentDownload = useSelector(selectCurrentDownload);
  const isDownloadInProgress = currentDownload?.downloadId === investigationGuid;

  const createTaskMutation = useGraphQLMutation<{ createTask: { taskIdentifier: string } }>(CREATE_TASK, {
    onSuccess: (data) => {
      ToggleSuccess("Task created successfully");
      setShowAddTaskModal(false);
      const taskId = data?.createTask?.taskIdentifier;
      if (taskId) {
        navigate(`/investigation/${investigationGuid}/task/${taskId}`);
      }
    },
    onError: () => {
      ToggleError("Failed to create task");
    },
  });

  const handleSaveNewTask = async (input: CreateUpdateTaskInput) => {
    await createTaskMutation.mutateAsync({ input });
  };

  const handleHideAddTaskModal = () => {
    const result = hideCallback();
    if (result === false) return;
    setShowAddTaskModal(false);
  };

  const handleExportTasks = useCallback(async () => {
    let toastId: ReturnType<typeof ToggleInformation> | undefined;
    try {
      toastId = ToggleInformation("Download in progress, do not close the NatSuite application.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });

      const sortedTasks = [...tasks].sort((a, b) => (a.taskNumber ?? 0) - (b.taskNumber ?? 0));

      const headers = [
        "Task #",
        "Category",
        "Sub-category",
        "Remarks",
        "Status",
        "Officer assigned",
        "Due date",
        "Last updated",
      ];

      const rows = sortedTasks.map((t) => {
        const category = taskCategories.find((c) => c.value === t.taskCategoryTypeCode)?.label ?? "";
        const subCategory = taskSubCategories.find((sc) => sc.value === t.taskTypeCode);
        const subCategoryLabel = subCategory?.label && subCategory.label !== "None" ? subCategory.label : "";
        const status = taskStatuses.find((s) => s.value === t.taskStatusCode)?.label ?? "";
        const officer = officers?.find((o) => o.app_user_guid === t.assignedUserIdentifier);
        const officerName = officer ? `${officer.last_name}, ${officer.first_name}` : "";

        return [
          `Task ${t.taskNumber ?? ""}`,
          category,
          subCategoryLabel,
          t.remarks ?? "",
          status,
          officerName,
          formatDate(t.dueDate ?? undefined),
          formatDateTime(t.updatedDate ?? t.createdDate ?? undefined),
        ]
          .map((v) => escapeCsvCell(v ?? ""))
          .join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");

      const onProgress = createDownloadProgressHandler(toastId);

      await dispatch(
        exportTasksList(
          investigationGuid,
          investigationData?.name,
          sortedTasks.map((t) => ({ taskIdentifier: t.taskIdentifier, taskNumber: t.taskNumber ?? 0 })),
          csv,
          onProgress,
        ),
      );
    } catch (error) {
      console.error("Task export error:", error);
      ToggleError("Download failed. Please try again.");
    } finally {
      if (toastId !== undefined) DismissToast(toastId);
    }
  }, [
    tasks,
    taskCategories,
    taskSubCategories,
    taskStatuses,
    officers,
    investigationGuid,
    investigationData?.name,
    dispatch,
  ]);

  return (
    <div className="comp-details-section--list-view">
      <div className="d-flex align-items-center justify-content-between my-2">
        <h2>Tasks</h2>
        <div className="d-flex gap-2">
          <Button
            id="export-tasks-button"
            variant="outline-primary"
            size="sm"
            className="icon-start"
            onClick={handleExportTasks}
            disabled={tasks.length === 0 || isDownloadInProgress}
          >
            <i className="bi bi-download" />
            <span className="ms-1">{isDownloadInProgress ? "Downloading..." : "Download and export data"}</span>
          </Button>
          <Button
            id="add-task-button"
            variant="primary"
            size="sm"
            onClick={() => setShowAddTaskModal(true)}
          >
            <i className="bi bi-plus-circle me-1" /> Add task
          </Button>
        </div>
      </div>

      <div className="comp-data-container">
        <div className="comp-data-list-map">
          <TaskList
            tasks={tasks}
            investigationGuid={investigationGuid}
          />
        </div>
      </div>

      <TaskDetailEditModal
        show={showAddTaskModal}
        onHide={handleHideAddTaskModal}
        onSave={handleSaveNewTask}
        investigationGuid={investigationGuid}
        task={undefined}
        isSaving={createTaskMutation.isPending}
        primaryInvestigatorGuid={investigationData?.primaryInvestigatorGuid}
        onDirtyChange={handleChildDirtyChange}
      />
    </div>
  );
};
