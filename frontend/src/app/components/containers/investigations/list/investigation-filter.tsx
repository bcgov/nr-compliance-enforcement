import { FC, useMemo } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { useAppSelector } from "@hooks/hooks";
import { selectCommunityCodeDropdown, selectComplaintStatusWithPendingCodeDropdown } from "@store/reducers/code-table";
import { selectOfficersByAgency } from "@store/reducers/officer";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { getUserAgency } from "@service/user-service";
import { useInvestigationSearch, InvestigationSearchParams } from "../hooks/use-investigation-search";

export const InvestigationFilter: FC = () => {
  const { searchValues, setValues } = useInvestigationSearch();
  const statusOptions = useAppSelector(selectComplaintStatusWithPendingCodeDropdown);
  const communityOptions = useAppSelector(selectCommunityCodeDropdown);
  const userAgency = getUserAgency();
  const agencyOfficers = useAppSelector((state) => selectOfficersByAgency(state, userAgency));
  const officerOptions: Option[] = useMemo(
    () =>
      (agencyOfficers ?? [])
        .map((o: AppUser) => ({ value: o.app_user_guid, label: `${o.last_name}, ${o.first_name}` }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [agencyOfficers],
  );

  const handleFieldChange = (fieldName: keyof InvestigationSearchParams) => (option: Option | null) => {
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
    <div id={`investigation-${id}-filter-id`}>
      <label htmlFor={`investigation-${id}-select-id`}>{label}</label>
      <div className="filter-select-padding">
        <CompSelect
          id={`investigation-${id}-select-id`}
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
        "investigationStatus",
        "Status",
        statusOptions,
        "Select status",
        statusOptions.find((option) => option.value === searchValues.investigationStatus) || null,
        handleFieldChange("investigationStatus"),
      )}

      {renderSelectFilter(
        "community",
        "Community",
        communityOptions,
        "Select community",
        communityOptions.find((option) => option.value === searchValues.community) || null,
        handleFieldChange("community"),
      )}

      {renderSelectFilter(
        "primary-investigator",
        "Primary investigator",
        officerOptions,
        "Select primary investigator",
        officerOptions.find((option) => option.value === searchValues.primaryInvestigator) || null,
        handleFieldChange("primaryInvestigator"),
      )}

      {renderSelectFilter(
        "file-coordinator",
        "File coordinator",
        officerOptions,
        "Select file coordinator",
        officerOptions.find((option) => option.value === searchValues.fileCoordinator) || null,
        handleFieldChange("fileCoordinator"),
      )}

      {renderSelectFilter(
        "supervisor",
        "Supervisor",
        officerOptions,
        "Select supervisor",
        officerOptions.find((option) => option.value === searchValues.supervisor) || null,
        handleFieldChange("supervisor"),
      )}

      <FilterDate
        id="investigation-date-range-filter"
        label="Date Range"
        startDate={searchValues.startDate || undefined}
        endDate={searchValues.endDate || undefined}
        handleDateChange={handleDateRangeChange}
      />
    </div>
  );
};
