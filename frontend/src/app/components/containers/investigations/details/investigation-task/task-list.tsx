import { FC } from "react";
import { Link } from "react-router-dom";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { Task } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { applyStatusClass } from "@/app/common/methods";
import { SORT_TYPES } from "@constants/sort-direction";
import { TaskListExpandedContent } from "./task-list-item";
import { formatDateObjectAsString, parseUTCTimestampToLocal, parseUTCDateToLocal } from "@/app/common/date-utils";

type Props = {
  tasks: Task[];
  investigationGuid: string;
  isLoading?: boolean;
};

export const TaskList: FC<Props> = ({ tasks, investigationGuid, isLoading = false }) => {
  const taskCategories = useAppSelector(selectTaskCategory);
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
      label: "Subject",
      headerClassName: "comp-cell-width-160",
      cellClassName: "comp-cell-width-160",
      isSortable: true,
      getValue: (task) => task.subject ?? "",
      renderCell: (task) => task.subject ?? "-",
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
      renderCell: (task) => formatDateObjectAsString(parseUTCDateToLocal(task.dueDate), { format: "date" }) ?? "-",
    },
    {
      label: "Last updated",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: true,
      getValue: (task) => task.updatedDate ?? task.createdDate ?? "",
      renderCell: (task) =>
        formatDateObjectAsString(parseUTCTimestampToLocal(task.updatedDate ?? task.createdDate), {
          format: "dateTime",
        }),
    },
  ];

  return (
    <CompTable
      data={tasks}
      tableIdentifier="task-list"
      isFixedHeight={true}
      columns={columns}
      getRowKey={(task) => task.taskIdentifier}
      renderExpandedContent={(task) => (
        <TaskListExpandedContent
          data={task}
          investigationGuid={investigationGuid}
        />
      )}
      isLoading={isLoading}
      pageSize={50}
      defaultSort="Task #"
      defaultSortDirection={SORT_TYPES.ASC}
    />
  );
};
