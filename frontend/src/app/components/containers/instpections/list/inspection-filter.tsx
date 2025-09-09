import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { useAppSelector } from "@hooks/hooks";
import { selectAgencyDropdown, selectComplaintStatusWithPendingCodeDropdown } from "@store/reducers/code-table";
import { useInspectionSearch, InspectionSearchParams } from "../hooks/use-inspection-search";

export const InspectionFilter: FC = () => {
  const { searchValues, setValues } = useInspectionSearch();
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const statusOptions = useAppSelector(selectComplaintStatusWithPendingCodeDropdown);

  const handleFieldChange = (fieldName: keyof InspectionSearchParams) => (option: Option | null) => {
    setValues({ [fieldName]: option?.value });
  };

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;

    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    setValues({
      startDate: start,
      endDate: end,
    });
  };

  const renderSelectFilter = (
    id: string,
    label: string,
    options: Option[],
    placeholder: string,
    value: Option | null,
    onChange: (option: Option | null) => void,
  ) => (
    <div id={`inspection-${id}-filter-id`}>
      <label htmlFor={`inspection-${id}-select-id`}>{label}</label>
      <div className="filter-select-padding">
        <CompSelect
          id={`inspection-${id}-select-id`}
          classNamePrefix="comp-select"
          onChange={onChange}
          classNames={{
            menu: () => "top-layer-select",
          }}
          options={options}
          placeholder={placeholder}
          enableValidation={false}
          value={value}
          isClearable={true}
          showInactive={false}
        />
      </div>
    </div>
  );

  return (
    <div className="comp-filter-container">
      {renderSelectFilter(
        "inspectionStatus",
        "Status",
        statusOptions,
        "Select status",
        statusOptions.find((option) => option.value === searchValues.inspectionStatus) || null,
        handleFieldChange("inspectionStatus"),
      )}

      {renderSelectFilter(
        "lead-agency",
        "Lead Agency",
        leadAgencyOptions,
        "Select agency",
        leadAgencyOptions.find((option) => option.value === searchValues.leadAgency) || null,
        handleFieldChange("leadAgency"),
      )}

      <FilterDate
        id="inspection-date-range-filter"
        label="Date Range"
        startDate={searchValues.startDate || undefined}
        endDate={searchValues.endDate || undefined}
        handleDateChange={handleDateRangeChange}
      />
    </div>
  );
};
