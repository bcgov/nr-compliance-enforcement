import { FC, useCallback, MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import { useTaskSearch } from "./hooks/use-task-search";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory, selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";

type Props = {
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
  onExport: () => void;
  isExportDisabled: boolean;
  isDownloadInProgress: boolean;
  onAddTask: () => void;
  isAddTaskDisabled: boolean;
};

export const TaskFilterBar: FC<Props> = ({
  toggleShowMobileFilters,
  toggleShowDesktopFilters,
  onExport,
  isExportDisabled,
  isDownloadInProgress,
  onAddTask,
  isAddTaskDisabled,
}) => {
  const { searchValues, clearValues } = useTaskSearch();

  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officers = useAppSelector(selectOfficers);

  const removeFilter = useCallback(
    (filterName: string) => {
      if (filterName === "categoryFilter") {
        clearValues(["categoryFilter", "subCategoryFilter"]);
      } else {
        clearValues(filterName as keyof typeof searchValues);
      }
    },
    [clearValues],
  );

  const hasFilter = (filterName: string): boolean => {
    return searchValues[filterName as keyof typeof searchValues] != null;
  };

  const getCategoryFilterLabel = (): string => {
    return taskCategories.find((c) => c.value === searchValues.categoryFilter)?.label ?? "Category";
  };

  const getSubCategoryFilterLabel = (): string => {
    return taskSubCategories.find((sc) => sc.value === searchValues.subCategoryFilter)?.label ?? "Sub-category";
  };

  const getStatusFilterLabel = (): string => {
    return taskStatuses.find((s) => s.value === searchValues.statusFilter)?.label ?? "Status";
  };

  const getOfficerFilterLabel = (): string => {
    const officer = officers?.find((o) => o.app_user_guid === searchValues.officerFilter);
    return officer ? `${officer.last_name}, ${officer.first_name}` : "Officer assigned";
  };

  const renderFilterButton = (variant: "desktop" | "mobile", onClick: MouseEventHandler, id?: string) => (
    <Button
      variant="outline-primary"
      size="sm"
      className={`icon-start filter-btn filter-btn-${variant}`}
      id={id}
      onClick={onClick}
    >
      <i className="bi bi-filter"></i>
      <span>Filters</span>
    </Button>
  );

  return (
    <div className="comp-filter-bar">
      <div className="filter-pills-container">
        {renderFilterButton("desktop", toggleShowDesktopFilters, "task-filter-btn")}
        {renderFilterButton("mobile", toggleShowMobileFilters)}

        {hasFilter("categoryFilter") && (
          <FilterButton
            id="category-filter-pill"
            label={getCategoryFilterLabel()}
            name="categoryFilter"
            clear={removeFilter}
          />
        )}
        {hasFilter("subCategoryFilter") && (
          <FilterButton
            id="subcategory-filter-pill"
            label={getSubCategoryFilterLabel()}
            name="subCategoryFilter"
            clear={removeFilter}
          />
        )}
        {hasFilter("statusFilter") && (
          <FilterButton
            id="status-filter-pill"
            label={getStatusFilterLabel()}
            name="statusFilter"
            clear={removeFilter}
          />
        )}
        {hasFilter("officerFilter") && (
          <FilterButton
            id="officer-filter-pill"
            label={getOfficerFilterLabel()}
            name="officerFilter"
            clear={removeFilter}
          />
        )}

        <Button
          id="export-tasks-button"
          variant="outline-primary"
          size="sm"
          className="icon-start ms-auto"
          onClick={onExport}
          disabled={isExportDisabled || isDownloadInProgress}
        >
          <i className="bi bi-download"></i>
          <span className="ms-1">{isDownloadInProgress ? "Downloading..." : "Download and export data"}</span>
        </Button>
        <Button
          id="add-task-button"
          variant="primary"
          size="sm"
          onClick={onAddTask}
          disabled={isAddTaskDisabled}
        >
          <i className="bi bi-plus-circle me-1" /> Add task
        </Button>
      </div>
    </div>
  );
};
