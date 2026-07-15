import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import { FilterDate } from "@components/common/filter-date";
import Option from "@apptypes/app/option";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";
import { Task } from "@/generated/graphql";
import { PROPERTY_TYPE_OPTIONS } from "@/app/types/app/investigation/exhibits";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficersByAgencyDropdownUsingPersonGuid } from "@store/reducers/officer";
import { getUserAgency } from "@/app/service/user-service";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";

type Props = {
  tasks?: Task[];
};

export const ExhibitsFilter: FC<Props> = ({ tasks = [] }) => {
  const { searchValues, setValues } = useExhibitsSearch();

  const userAgency = getUserAgency();
  const officerOptions = useAppSelector(selectOfficersByAgencyDropdownUsingPersonGuid(userAgency, COMPLAINT_TYPES.ERS));

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

  const handleOfficerFilterChange = (option: Option | null) => {
    setValues({ officerFilter: option?.value ?? null });
  };

  const handleIntakeDateChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setValues({
      intakeStartDate: start ? start.toISOString().slice(0, 10) : null,
      intakeEndDate: end ? end.toISOString().slice(0, 10) : null,
    });
  };

  const selectedPropertyType =
    PROPERTY_TYPE_OPTIONS.find((option) => option.value === searchValues.propertyTypeFilter) || null;
  const selectedTask = taskOptions.find((option) => option.value === searchValues.taskFilter) || null;
  const selectedOfficer = officerOptions.find((option) => option.value === searchValues.officerFilter) || null;

  const intakeStartDate = searchValues.intakeStartDate ? new Date(searchValues.intakeStartDate) : undefined;
  const intakeEndDate = searchValues.intakeEndDate ? new Date(searchValues.intakeEndDate) : undefined;

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

        <div
          id="exhibits-officer-filter-id"
          className="mt-3"
        >
          <label htmlFor="exhibits-officer-select-id">Officer</label>
          <div className="filter-select-padding">
            <CompSelect
              id="exhibits-officer-select-id"
              classNamePrefix="comp-select"
              onChange={handleOfficerFilterChange}
              classNames={{
                menu: () => "top-layer-select",
              }}
              options={officerOptions}
              placeholder="Select officer"
              enableValidation={false}
              value={selectedOfficer}
              isClearable={true}
              showInactive={false}
              menuPlacement="top"
            />
          </div>
        </div>

        <div
          id="exhibits-intake-date-filter-id"
          className="mt-3"
        >
          <FilterDate
            id="exhibits-intake-date-id"
            label="Date of intake"
            startDate={intakeStartDate}
            endDate={intakeEndDate}
            handleDateChange={handleIntakeDateChange}
            popperPlacement="top-start"
          />
        </div>
      </div>
    </div>
  );
};
