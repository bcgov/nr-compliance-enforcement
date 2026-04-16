import { FC, useCallback, ChangeEvent, KeyboardEvent, useState, useEffect, MouseEventHandler } from "react";
import { Button, CloseButton, InputGroup } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import { useDocumentationSearch } from "./hooks/use-documentation-search";
import { Task } from "@/generated/graphql";
import { useSelector } from "react-redux";
import { selectCurrentDownload } from "@/app/store/reducers/bulk-download";

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
  const [searchInput, setSearchInput] = useState<string>(searchValues.search || "");

  // Sync search input with URL state
  useEffect(() => {
    if (!searchValues.search) {
      setSearchInput("");
    }
  }, [searchValues.search]);

  const handleSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    if (!value) {
      handleClearSearch();
    }
    setSearchInput(value);
  };

  const handleSearchKeyPress = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key.toUpperCase() === "ENTER") {
      applySearch();
    }
  };

  const applySearch = () => {
    if (searchInput.length >= 3) {
      setValues({ search: searchInput });
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    clearValues("search");
  };

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
        <InputGroup className="search-input-group">
          <input
            id="documentation-search"
            placeholder="Search..."
            aria-label="Search by filename"
            className="comp-form-control comp-search-input form-control"
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyPress}
            value={searchInput}
          />
          {searchInput && (
            <CloseButton
              id="clear-search"
              className="clear-search-button"
              onClick={handleClearSearch}
              tabIndex={0}
            />
          )}
          <button
            id="search-button"
            className="btn text-white"
            onClick={applySearch}
            type="button"
            aria-label="Search"
          >
            <i className="bi bi-search"></i>
          </button>
        </InputGroup>
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
