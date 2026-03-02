import { FC, useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import { SortableHeader } from "@components/common/sortable-header";
import { SORT_TYPES } from "@constants/sort-direction";
import { TaskListItem } from "./task-list-item";
import { Task } from "@/generated/graphql";

type Props = {
  tasks: Task[];
  investigationGuid: string;
  isLoading?: boolean;
};

export const TaskList: FC<Props> = ({ tasks, investigationGuid, isLoading = false }) => {
  const [sortBy, setSortBy] = useState<string>("taskNumber");
  const [sortOrder, setSortOrder] = useState<string>(SORT_TYPES.ASC);

  const handleSort = useCallback(
    (sortInput: string) => {
      const newDirection = sortBy === sortInput && sortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;
      setSortBy(sortInput);
      setSortOrder(newDirection);
    },
    [sortBy, sortOrder],
  );

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortBy) {
        case "taskNumber":
          aVal = a.taskNumber ?? 0;
          bVal = b.taskNumber ?? 0;
          break;
        case "taskStatusCode":
          aVal = a.taskStatusCode ?? "";
          bVal = b.taskStatusCode ?? "";
          break;
        case "updatedDate":
          aVal = a.updatedDate ?? a.createdDate ?? "";
          bVal = b.updatedDate ?? b.createdDate ?? "";
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === SORT_TYPES.ASC ? -1 : 1;
      if (aVal > bVal) return sortOrder === SORT_TYPES.ASC ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [tasks, sortBy, sortOrder]);

  const renderSortableHeader = (title: string, sortKey: string, className?: string) => (
    <SortableHeader
      title={title}
      sortFnc={handleSort}
      sortKey={sortKey}
      currentSort={sortBy}
      sortDirection={sortOrder}
      className={className}
    />
  );

  const renderTaskListHeader = (): JSX.Element => (
    <thead className="sticky-table-header">
      <tr>
        {renderSortableHeader("Task #", "taskNumber", "comp-cell-width-90 comp-cell-min-width-90")}
        <th className="unsortable comp-cell-width-160 comp-cell-min-width-160">
          <div className="header-label">Category</div>
        </th>
        <th className="unsortable comp-cell-width-160 comp-cell-min-width-160">
          <div className="header-label">Sub-category</div>
        </th>
        {renderSortableHeader("Status", "taskStatusCode", "comp-cell-width-110")}
        <th className="unsortable comp-cell-width-160 comp-cell-min-width-160">
          <div className="header-label">Assigned Officer</div>
        </th>
        {renderSortableHeader("Last Updated", "updatedDate", "comp-cell-width-160 comp-cell-min-width-160")}
      </tr>
    </thead>
  );

  const renderLoadingSpinner = () => (
    <tr>
      <td
        colSpan={6}
        className="text-center p-4"
      >
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-border spinner-border-sm me-2">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>Loading tasks...</span>
        </div>
      </td>
    </tr>
  );

  const renderTaskListItems = () => {
    if (isLoading) return renderLoadingSpinner();
    if (sortedTasks.length === 0) {
      return (
        <tr>
          <td
            colSpan={6}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <i className="bi bi-info-circle-fill me-2"></i>
              <span>No tasks found.</span>
            </div>
          </td>
        </tr>
      );
    }
    return sortedTasks.map((task) => (
      <TaskListItem
        key={task.taskIdentifier}
        data={task}
        investigationGuid={investigationGuid}
      />
    ));
  };

  return (
    <div className="comp-table-container">
      <div className="comp-table-scroll-container">
        <Table
          className="comp-table"
          id="task-list"
        >
          {renderTaskListHeader()}
          <tbody>{renderTaskListItems()}</tbody>
        </Table>
      </div>
    </div>
  );
};
