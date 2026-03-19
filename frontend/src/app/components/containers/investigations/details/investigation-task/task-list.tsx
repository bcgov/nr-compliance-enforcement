import { FC, useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import Paginator from "@components/common/paginator";
import { SortableHeader } from "@components/common/sortable-header";
import { SortArrow } from "@components/common/sort-arrow";
import { SORT_TYPES } from "@constants/sort-direction";
import { TaskListItem } from "./task-list-item";
import { Task } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";

const PAGE_SIZE = 25;

type Props = {
  tasks: Task[];
  investigationGuid: string;
  isLoading?: boolean;
};

export const TaskList: FC<Props> = ({ tasks, investigationGuid, isLoading = false }) => {
  const [sortBy, setSortBy] = useState<string>("taskNumber");
  const [sortOrder, setSortOrder] = useState<string>(SORT_TYPES.ASC);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const officers = useAppSelector(selectOfficers);

  const handleSort = useCallback(
    (sortInput: string) => {
      const newDirection = sortBy === sortInput && sortOrder === SORT_TYPES.ASC ? SORT_TYPES.DESC : SORT_TYPES.ASC;
      setSortBy(sortInput);
      setSortOrder(newDirection);
    },
    [sortBy, sortOrder],
  );

  const resolveCategory = useCallback(
    (task: Task) => {
      return taskCategories.find((c) => c.value === task.taskCategoryTypeCode)?.label ?? "";
    },
    [taskCategories],
  );

  const resolveSubCategory = useCallback(
    (task: Task) => taskSubCategories.find((sc) => sc.value === task.taskTypeCode)?.label ?? "",
    [taskSubCategories],
  );

  const resolveOfficer = useCallback(
    (task: Task) => {
      const officer = officers?.find((o) => o.app_user_guid === task.assignedUserIdentifier);
      return officer ? `${officer.first_name} ${officer.last_name}` : "-";
    },
    [officers],
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
        case "category":
          aVal = resolveCategory(a);
          bVal = resolveCategory(b);
          break;
        case "subCategory":
          aVal = resolveSubCategory(a);
          bVal = resolveSubCategory(b);
          break;
        case "taskStatusCode":
          aVal = a.taskStatusCode ?? "";
          bVal = b.taskStatusCode ?? "";
          break;
        case "assignedOfficer":
          aVal = resolveOfficer(a);
          bVal = resolveOfficer(b);
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
  }, [tasks, sortBy, sortOrder, resolveCategory, resolveSubCategory, resolveOfficer]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedTasks.slice(start, start + PAGE_SIZE);
  }, [sortedTasks, currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

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

  const renderTaskListHeader = () => (
    <thead className="sticky-table-header">
      <tr>
        <th className="comp-cell-width-30 comp-cell-min-width-30 text-center"></th>
        <th
          className="sortable-header comp-cell-width-120 comp-cell-min-width-120"
          onClick={() => handleSort("taskNumber")}
        >
          <div className="sortable-header-inner">
            <div className="header-label">Task #</div>
            <div className="header-caret">
              <SortArrow
                sortKey="taskNumber"
                current={sortBy}
                direction={sortOrder}
              />
            </div>
          </div>
        </th>
        {renderSortableHeader("Category", "category", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Sub-category", "subCategory", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Status", "taskStatusCode", "comp-cell-width-110")}
        {renderSortableHeader("Officer assigned", "assignedOfficer", "comp-cell-width-160 comp-cell-min-width-160")}
        {renderSortableHeader("Last updated", "updatedDate", "comp-cell-width-160 comp-cell-min-width-160")}
      </tr>
    </thead>
  );

  const renderLoadingSpinner = () => (
    <tr>
      <td
        colSpan={7}
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
            colSpan={7}
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
    return paginatedTasks.map((task) => (
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
          className="comp-table mb-0"
          id="task-list"
        >
          {renderTaskListHeader()}
          <tbody>{renderTaskListItems()}</tbody>
        </Table>
      </div>

      {sortedTasks.length > 0 && (
        <Paginator
          currentPage={currentPage}
          totalItems={sortedTasks.length}
          onPageChange={handlePageChange}
          resultsPerPage={PAGE_SIZE}
        />
      )}
    </div>
  );
};
