import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { gql } from "graphql-request";
import { CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { TaskList } from "@/app/components/containers/investigations/details/investigation-task/task-list";
import { TaskDetailEditModal } from "@/app/components/containers/investigations/details/investigation-task/detail/task-detail-edit-modal";
import { TaskFilter } from "./task-filter";
import { TaskFilterBar } from "./task-filter-bar";
import { useTaskSearch } from "./hooks/use-task-search";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { Investigation, Task } from "@/generated/graphql";
import type { CreateUpdateTaskInput } from "@/generated/graphql";
import { DismissToast, TOAST_POSITION, ToggleError, ToggleInformation, ToggleSuccess } from "@/app/common/toast";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory, selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { selectCurrentDownload } from "@/app/store/reducers/bulk-download";
import { exportTasksList } from "@/app/store/reducers/documents-thunks";
import { createDownloadProgressHandler } from "@/app/common/attachment-download-helper";
import { escapeCsvCell, formatDate, formatTimestampAsLocalDateTime } from "@/app/common/methods";
import { useInvestigationReadOnly } from "../../hooks/use-investigation-read-only";

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
  const isReadOnly = useInvestigationReadOnly(investigationGuid);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const tasks = (investigationData?.tasks as Task[]) ?? [];
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

  const { searchValues } = useTaskSearch();

  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officers = useAppSelector(selectOfficers);
  const currentDownload = useSelector(selectCurrentDownload);
  const isDownloadInProgress = currentDownload?.downloadId === investigationGuid;

  const toggleShowMobileFilters = useCallback(() => setShowMobileFilters((prev) => !prev), []);
  const toggleShowDesktopFilters = useCallback(() => setShowDesktopFilters((prev) => !prev), []);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (searchValues.categoryFilter && task.taskCategoryTypeCode !== searchValues.categoryFilter) return false;
        if (searchValues.subCategoryFilter && task.taskTypeCode !== searchValues.subCategoryFilter) return false;
        if (searchValues.statusFilter && task.taskStatusCode !== searchValues.statusFilter) return false;
        if (searchValues.officerFilter && task.assignedUserIdentifier !== searchValues.officerFilter) return false;
        return true;
      }),
    [
      tasks,
      searchValues.categoryFilter,
      searchValues.subCategoryFilter,
      searchValues.statusFilter,
      searchValues.officerFilter,
    ],
  );

  const assignedOfficerIds = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignedUserIdentifier).filter((id): id is string => !!id))),
    [tasks],
  );

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
        position: TOAST_POSITION,
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });

      const sortedTasks = [...filteredTasks].sort((a, b) => (a.taskNumber ?? 0) - (b.taskNumber ?? 0));

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
          formatTimestampAsLocalDateTime(t.updatedDate ?? t.createdDate ?? undefined),
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
    filteredTasks,
    taskCategories,
    taskSubCategories,
    taskStatuses,
    officers,
    investigationGuid,
    investigationData?.name,
    dispatch,
  ]);

  const renderDesktopFilterSection = () => (
    <Collapse
      in={showDesktopFilters}
      dimension="width"
    >
      <div className="comp-data-filters">
        <div className="comp-data-filters-inner">
          <div className="comp-data-filters-header">
            Filter by{" "}
            <CloseButton
              onClick={() => setShowDesktopFilters(false)}
              aria-expanded={showDesktopFilters}
              aria-label="Close filters"
            />
          </div>
          <div className="comp-data-filters-body">
            <TaskFilter assignedOfficerIds={assignedOfficerIds} />
          </div>
        </div>
      </div>
    </Collapse>
  );

  const renderMobileFilters = () => (
    <Offcanvas
      show={showMobileFilters}
      onHide={() => setShowMobileFilters(false)}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <TaskFilter assignedOfficerIds={assignedOfficerIds} />
      </Offcanvas.Body>
    </Offcanvas>
  );

  return (
    <div className="comp-details-section--list-view">
      <h2>Tasks</h2>
      <TaskFilterBar
        toggleShowMobileFilters={toggleShowMobileFilters}
        toggleShowDesktopFilters={toggleShowDesktopFilters}
        onExport={handleExportTasks}
        isExportDisabled={filteredTasks.length === 0}
        isDownloadInProgress={isDownloadInProgress}
        onAddTask={() => setShowAddTaskModal(true)}
        isAddTaskDisabled={isReadOnly}
      />

      <div className="comp-data-container">
        {renderDesktopFilterSection()}
        <div className="comp-data-list-map">
          <TaskList
            tasks={filteredTasks}
            investigationGuid={investigationGuid}
          />
        </div>
      </div>

      {renderMobileFilters()}

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
