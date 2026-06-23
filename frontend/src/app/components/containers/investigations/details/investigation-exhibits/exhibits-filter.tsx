import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";
import { Task } from "@/generated/graphql";
import { PROPERTY_TYPE_OPTIONS } from "@/app/types/app/investigation/exhibits";

type Props = {
  tasks?: Task[];
};

export const ExhibitsFilter: FC<Props> = ({ tasks = [] }) => {
  const { searchValues, setValues } = useExhibitsSearch();

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

  const handlePropertyTypeFilterChange = (option: Option | null) => {
    setValues({ propertyTypeFilter: option?.value ?? null });
  };

  const selectedPropertyType =
    PROPERTY_TYPE_OPTIONS.find((option) => option.value === searchValues.propertyTypeFilter) || null;

  const selectedTask = taskOptions.find((option) => option.value === searchValues.taskFilter) || null;

  return (
    <div className="comp-filter-container">
      <div id="exhibits-task-filter-id">
        <label htmlFor="exhibits-task-select-id">Task</label>
        <div className="filter-select-padding">
          <CompSelect
            id="exhibits-task-select-id"
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

        <div
          id="exhibits-property-type-filter-id"
          className="mt-3"
        >
          <label htmlFor="exhibits-property-type-select-id">Property type</label>
          <div className="filter-select-padding">
            <CompSelect
              id="exhibits-property-type-select-id"
              classNamePrefix="comp-select"
              onChange={handlePropertyTypeFilterChange}
              classNames={{
                menu: () => "top-layer-select",
              }}
              options={PROPERTY_TYPE_OPTIONS}
              placeholder="Select property type"
              enableValidation={false}
              value={selectedPropertyType}
              isClearable={true}
              showInactive={false}
              menuPlacement="top"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
