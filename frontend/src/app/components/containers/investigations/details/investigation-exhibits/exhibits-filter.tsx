import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";
import { Task } from "@/generated/graphql";

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
      </div>
    </div>
  );
};
