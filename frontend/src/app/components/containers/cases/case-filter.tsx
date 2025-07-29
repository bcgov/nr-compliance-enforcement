import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { CaseSearchFormData } from "./hooks/use-case-search-form";

type Props = {
  form: any; // Using any to simplify Tanstack Form type complexity
  statusOptions: Option[];
  leadAgencyOptions: Option[];
};

// Re-export for backward compatibility
export interface CaseFilters {
  status?: Option | null;
  leadAgency?: Option | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export const CaseFilter: FC<Props> = ({ form, statusOptions, leadAgencyOptions }) => {
  const formValues = form.store.state.values;

  const handleStatusChange = (option: Option | null) => {
    form.setFieldValue("status", option);
  };

  const handleLeadAgencyChange = (option: Option | null) => {
    form.setFieldValue("leadAgency", option);
  };

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;

    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    form.setFieldValue("startDate", start);
    form.setFieldValue("endDate", end);
  };

  return (
    <div className="comp-filter-container">
      <div id="case-status-filter-id">
        <label htmlFor="case-status-select-id">Status</label>
        <div className="filter-select-padding">
          <CompSelect
            id="case-status-select-id"
            classNamePrefix="comp-select"
            onChange={handleStatusChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={statusOptions}
            placeholder="Select status"
            enableValidation={false}
            value={formValues.status}
            isClearable={true}
            showInactive={false}
          />
        </div>
      </div>

      <div id="case-lead-agency-filter-id">
        <label htmlFor="case-lead-agency-select-id">Lead Agency</label>
        <div className="filter-select-padding">
          <CompSelect
            id="case-lead-agency-select-id"
            classNamePrefix="comp-select"
            onChange={handleLeadAgencyChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={leadAgencyOptions}
            placeholder="Select agency"
            enableValidation={false}
            value={formValues.leadAgency}
            isClearable={true}
            showInactive={false}
          />
        </div>
      </div>

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
