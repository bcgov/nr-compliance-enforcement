import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { useDocumentationSearch } from "./hooks/use-documentation-search";
import { Task } from "@/generated/graphql";
import { fileTypeOptions } from "@/app/components/common/file-type-options";

type Props = {
  tasks?: Task[];
};

export const DocumentationFilter: FC<Props> = ({ tasks = [] }) => {
  const { searchValues, setValues } = useDocumentationSearch();

  const taskOptions: Option[] = tasks
    .filter((task) => task.activeIndicator)
    .sort((a, b) => a.taskNumber - b.taskNumber)
    .map((task) => ({
      value: task.taskIdentifier,
      label: `Task ${task.taskNumber}`,
    }));

  const handleTaskFilterChange = (option: Option | null) => {
    setValues({ taskFilter: option?.value ?? null });
  };

  const handleFileTypeFilterChange = (option: Option | null) => {
    setValues({ fileTypeFilter: option?.value ?? null });
  };

  const selectedTask = taskOptions.find((option) => option.value === searchValues.taskFilter) || null;
  const selectedFileType = fileTypeOptions.find((option) => option.value === searchValues.fileTypeFilter) || null;

  return (
    <div className="comp-filter-container">
      <div id="documentation-task-filter-id">
        <label htmlFor="documentation-task-select-id">Task</label>
        <div className="filter-select-padding">
          <CompSelect
            id="documentation-task-select-id"
            classNamePrefix="comp-select"
            onChange={handleTaskFilterChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={taskOptions}
            placeholder="Select task"
            enableValidation={false}
            value={selectedTask}
            isClearable={true}
            showInactive={false}
          />
        </div>
      </div>

      <div id="documentation-filetype-filter-id">
        <label htmlFor="documentation-filetype-select-id">File type</label>
        <div className="filter-select-padding">
          <CompSelect
            id="documentation-filetype-select-id"
            classNamePrefix="comp-select"
            onChange={handleFileTypeFilterChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={fileTypeOptions}
            placeholder="Select file type"
            enableValidation={false}
            value={selectedFileType}
            isClearable={true}
            showInactive={false}
          />
        </div>
      </div>
    </div>
  );
};
