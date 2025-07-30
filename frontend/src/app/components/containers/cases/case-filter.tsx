import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { CaseSearchFormData, useCaseSearchForm } from "./hooks/use-case-search-form";

// Re-export for backward compatibility
export interface CaseFilters {
  status?: Option | null;
  leadAgency?: Option | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export const CaseFilter: FC = () => {
  const { formValues, setFieldValue, statusOptions, leadAgencyOptions } = useCaseSearchForm();

  const handleFieldChange = (fieldName: keyof CaseSearchFormData) => (option: Option | null) => {
    setFieldValue(fieldName, option);
  };

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;

    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    setFieldValue("startDate", start);
    setFieldValue("endDate", end);
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
        formValues.status,
        handleFieldChange("status"),
      )}

      {renderSelectFilter(
        "lead-agency",
        "Lead Agency",
        leadAgencyOptions,
        "Select agency",
        formValues.leadAgency,
        handleFieldChange("leadAgency"),
      )}

      <FilterDate
        id="case-date-range-filter"
        label="Date Range"
        startDate={formValues.startDate || undefined}
        endDate={formValues.endDate || undefined}
        handleDateChange={handleDateRangeChange}
      />
    </div>
  );
};
