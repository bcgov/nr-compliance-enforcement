import { FC, useCallback, MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import { useDocumentationSearch } from "./hooks/use-documentation-search";
import { Task } from "@/generated/graphql";
import { useSelector } from "react-redux";
import { selectCurrentDownload } from "@/app/store/reducers/bulk-download";
import SearchInput from "@/app/components/common/search-input";

type Props = {
  investigationId: string;
  tasks?: Task[];
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
  onExport: () => void;
  isExportDisabled: boolean;
};

export const DocumentationFilterBar: FC<Props> = ({
  investigationId,
  tasks = [],
  toggleShowMobileFilters,
  toggleShowDesktopFilters,
  onExport,
  isExportDisabled,
}) => {
  const currentDownload = useSelector(selectCurrentDownload);
  const isDownloadInProgress = currentDownload?.downloadId === investigationId;
  const { searchValues, setValues, clearValues } = useDocumentationSearch();

  const handleSearchChange = (query: string) => {
    if (query) {
      setValues({ search: query });
    } else {
      clearValues("search");
    }
  };

  // Search is handled through the form hook
  const handleSearch = () => {};

  const removeFilter = useCallback(
    (filterName: string) => {
      clearValues(filterName as keyof typeof searchValues);
    },
    [clearValues],
  );

  const hasFilter = (filterName: string): boolean => {
    return searchValues[filterName as keyof typeof searchValues] != null;
  };

  const getTaskFilterLabel = (): string => {
    const task = tasks.find((t) => t.taskIdentifier === searchValues.taskFilter);
    return task ? `Task ${task.taskNumber}` : "Task";
  };

  const getFileTypeLabel = (): string => {
    return searchValues.fileTypeFilter ? `${searchValues.fileTypeFilter}` : "File type";
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
      <div className="search-bar">
        <SearchInput
          viewType="list"
          searchQuery={searchValues.search}
          applySearchQuery={handleSearchChange}
          handleSearch={handleSearch}
          tooltipContext="attachments"
        />
      </div>

      <div className="filter-pills-container">
        {renderFilterButton("desktop", toggleShowDesktopFilters, "documentation-filter-btn")}
        {renderFilterButton("mobile", toggleShowMobileFilters)}

        {hasFilter("taskFilter") && (
          <FilterButton
            id="task-filter-pill"
            label={getTaskFilterLabel()}
            name="taskFilter"
            clear={removeFilter}
          />
        )}
        {hasFilter("fileTypeFilter") && (
          <FilterButton
            id="filetype-filter-pill"
            label={getFileTypeLabel()}
            name="fileTypeFilter"
            clear={removeFilter}
          />
        )}

        <Button
          id="documentation-export-btn"
          variant="outline-primary"
          size="sm"
          className="icon-start ms-auto"
          onClick={onExport}
          disabled={isExportDisabled || isDownloadInProgress}
        >
          <i className="bi bi-download"></i>
          <span className="ms-1">{isDownloadInProgress ? "Downloading..." : "Download and export data"}</span>
        </Button>
      </div>
    </div>
  );
};
