import { FC } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { Task } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory, selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { applyStatusClass, formatDate, formatDateTime } from "@/app/common/methods";
import { SORT_TYPES } from "@constants/sort-direction";
import { TaskListExpandedContent } from "./task-list-item";

type Props = {
  tasks: Task[];
  investigationGuid: string;
  isLoading?: boolean;
};

export const TaskList: FC<Props> = ({ tasks, investigationGuid, isLoading = false }) => {
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officers = useAppSelector(selectOfficers);

  const columns: CompColumn<Task>[] = [
    {
      label: "Task #",
      headerClassName: "comp-cell-width-120 comp-cell-min-width-120",
      cellClassName: "comp-cell-width-120 comp-cell-min-width-120",
      isSortable: true,
      getValue: (task) => task.taskNumber ?? 0,
      renderCell: (task) => (
        <Link
          to={`/investigation/${investigationGuid}/task/${task.taskIdentifier}`}
          className="comp-cell-link"
        >
          {`Task ${task.taskNumber}`}
        </Link>
      ),
    },
    {
      label: "Category",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: true,
      getValue: (task) => taskCategories.find((c) => c.value === task.taskCategoryTypeCode)?.label ?? "",
      renderCell: (task) => taskCategories.find((c) => c.value === task.taskCategoryTypeCode)?.label ?? "-",
    },
    {
      label: "Sub-category",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: true,
      getValue: (task) => taskSubCategories.find((sc) => sc.value === task.taskTypeCode)?.label ?? "",
      renderCell: (task) => {
        const subCategory = taskSubCategories.find((sc) => sc.value === task.taskTypeCode);
        return subCategory?.label && subCategory.label !== "None" ? subCategory.label : "-";
      },
    },
    {
      label: "Remarks",
      headerClassName: "comp-cell-width-160",
      cellClassName: "comp-cell-width-160",
      isSortable: true,
      getValue: (task) => task.remarks ?? "",
      renderCell: (task) => task.remarks ?? "-",
    },
    {
      label: "Status",
      headerClassName: "comp-cell-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: true,
      getValue: (task) => task.taskStatusCode ?? "",
      renderCell: (task) => {
        const statusLabel = taskStatuses.find((s) => s.value === task.taskStatusCode)?.label ?? "";
        return statusLabel && task.taskStatusCode ? (
          <span className={`badge ${applyStatusClass(task.taskStatusCode)}`}>{statusLabel}</span>
        ) : null;
      },
    },
    {
      label: "Officer assigned",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: true,
      getValue: (task) => {
        const officer = officers?.find((o) => o.app_user_guid === task.assignedUserIdentifier);
        return officer ? `${officer.last_name}, ${officer.first_name}` : "";
      },
      renderCell: (task) => {
        const officer = officers?.find((o) => o.app_user_guid === task.assignedUserIdentifier);
        return officer ? `${officer.last_name}, ${officer.first_name}` : "-";
      },
    },
    {
      label: "Due date",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: true,
      getValue: (task) => task.dueDate ?? "",
      renderCell: (task) => formatDate(task.dueDate) ?? "-",
    },
    {
      label: "Last updated",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: true,
      getValue: (task) => task.updatedDate ?? task.createdDate ?? "",
      renderCell: (task) => formatDateTime(task.updatedDate ?? task.createdDate),
    },
  ];

  return (
    <CompTable
      data={tasks}
      tableIdentifier="task-list"
      columns={columns}
      getRowKey={(task) => task.taskIdentifier}
      renderExpandedContent={(task) => (
        <TaskListExpandedContent
          data={task}
          investigationGuid={investigationGuid}
        />
      )}
      isLoading={isLoading}
      defaultSortLabel="Task #"
      defaultSortDirection={SORT_TYPES.ASC}
    />
  );
};
