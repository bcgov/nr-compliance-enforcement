import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { CaseSearchParams, useCaseSearch } from "./hooks/use-case-search";
import { useAppSelector } from "@hooks/hooks";
import { selectAgencyDropdown, selectComplaintStatusWithPendingCodeDropdown } from "@store/reducers/code-table";

export const CaseFilter: FC = () => {
  const { searchValues, setValue } = useCaseSearch();
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const statusOptions = useAppSelector(selectComplaintStatusWithPendingCodeDropdown);

  const handleFieldChange = (fieldName: keyof CaseSearchParams) => (option: Option | null) => {
    setValue(fieldName, option?.value);
  };

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;

    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    setValue("startDate", start);
    setValue("endDate", end);
  };

  const renderSelectFilter = (
    id: string,
    label: string,
    options: Option[],
    placeholder: string,
    value: Option | null,
    onChange: (option: Option | null) => void,
  ) => (
    <div id={`case-${id}-filter-id`}>
      <label htmlFor={`case-${id}-select-id`}>{label}</label>
      <div className="filter-select-padding">
        <CompSelect
          id={`case-${id}-select-id`}
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
        "status",
        "Status",
        statusOptions,
        "Select status",
        statusOptions.find((option) => option.value === searchValues.caseStatus) || null,
        handleFieldChange("caseStatus"),
      )}

      {renderSelectFilter(
        "lead-agency",
        "Lead Agency",
        leadAgencyOptions,
        "Select agency",
        leadAgencyOptions.find((option) => option.value === searchValues.agencyCode) || null,
        handleFieldChange("agencyCode"),
      )}

      <FilterDate
        id="case-date-range-filter"
        label="Date Range"
        startDate={searchValues.startDate || undefined}
        endDate={searchValues.endDate || undefined}
        handleDateChange={handleDateRangeChange}
      />
    </div>
  );
};
