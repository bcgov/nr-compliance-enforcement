import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { CaseSearchFormData, useCaseSearchForm } from "./hooks/use-case-search-form";

export const CaseFilter: FC = () => {
  const { formValues, setFieldValue, statusOptions, leadAgencyOptions } = useCaseSearchForm();

  const handleFieldChange = (fieldName: keyof CaseSearchFormData) => (option: Option | null) => {
    setFieldValue(fieldName, option);
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null] | null) => {
    if (!dates) {
      setFieldValue("startDate", null);
      setFieldValue("endDate", null);
      return;
    }

    const [start, end] = dates;

    // Create new Date objects to avoid mutating the originals
    const startDate = start ? new Date(start.getTime()) : null;
    const endDate = end ? new Date(end.getTime()) : null;

    // Set start date to beginning of day
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }

    // Set end date to end of day
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    setFieldValue("startDate", startDate);
    setFieldValue("endDate", endDate);
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
