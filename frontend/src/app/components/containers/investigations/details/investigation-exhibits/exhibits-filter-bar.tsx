import { FC, useCallback, ChangeEvent, KeyboardEvent, useState, useEffect, MouseEventHandler } from "react";
import { Button, CloseButton, InputGroup } from "react-bootstrap";
import { FilterButton } from "@components/common/filter-button";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";
import { Task } from "@/generated/graphql";

type Props = {
  tasks?: Task[];
  toggleShowMobileFilters: MouseEventHandler;
  toggleShowDesktopFilters: MouseEventHandler;
  onExport: () => void;
  isExportDisabled: boolean;
  isExportInProgress: boolean;
};

export const ExhibitsFilterBar: FC<Props> = ({
  tasks = [],
  toggleShowMobileFilters,
  toggleShowDesktopFilters,
  onExport,
  isExportDisabled,
  isExportInProgress,
}) => {
  const { searchValues, setValues, clearValues } = useExhibitsSearch();
  const [searchInput, setSearchInput] = useState<string>(searchValues.search || "");

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
            id="exhibits-search"
            placeholder="Search..."
            aria-label="Search exhibits"
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
        {renderFilterButton("desktop", toggleShowDesktopFilters, "exhibits-filter-btn")}
        {renderFilterButton("mobile", toggleShowMobileFilters)}

        {hasFilter("taskFilter") && (
          <FilterButton
            id="task-filter-pill"
            label={getTaskFilterLabel()}
            name="taskFilter"
            clear={removeFilter}
          />
        )}

        <Button
          id="exhibits-export-btn"
          variant="outline-primary"
          size="sm"
          className="icon-start ms-auto"
          onClick={onExport}
          disabled={isExportDisabled || isExportInProgress}
        >
          <i className="bi bi-download"></i>
          <span className="ms-1">{isExportInProgress ? "Exporting..." : "Export exhibit data"}</span>
        </Button>
      </div>
    </div>
  );
};
