import { FC, useMemo } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { useAppSelector } from "@hooks/hooks";
import {
  selectCascadedCommunity,
  selectCascadedRegion,
  selectCascadedZone,
  selectComplaintStatusWithPendingCodeDropdown,
} from "@store/reducers/code-table";
import { selectOfficersByAgency } from "@store/reducers/officer";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { getUserAgency } from "@service/user-service";
import { useInvestigationSearch, InvestigationSearchParams } from "../hooks/use-investigation-search";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";

export const InvestigationFilter: FC = () => {
  const { searchValues, setValues } = useInvestigationSearch();
  const statusOptions = useAppSelector(selectComplaintStatusWithPendingCodeDropdown);
  const userAgency = getUserAgency();
  const agencyOfficers = useAppSelector((state) => selectOfficersByAgency(state, userAgency));
  const officerOptions: Option[] = useMemo(
    () =>
      (agencyOfficers ?? [])
        .map((o: AppUser) => ({ value: o.app_user_guid, label: `${o.last_name}, ${o.first_name}` }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [agencyOfficers],
  );

  const regionOptions = useAppSelector(
    selectCascadedRegion(
      searchValues.region ?? undefined,
      searchValues.zone ?? undefined,
      searchValues.community ?? undefined,
    ),
  );
  const zoneOptions = useAppSelector(
    selectCascadedZone(
      searchValues.region ?? undefined,
      searchValues.zone ?? undefined,
      searchValues.community ?? undefined,
    ),
  );

  const communityOptions = useAppSelector(
    selectCascadedCommunity(
      searchValues.region ?? undefined,
      searchValues.zone ?? undefined,
      searchValues.community ?? undefined,
    ),
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
        "Select",
        statusOptions.find((option) => option.value === searchValues.investigationStatus) || null,
        handleFieldChange("investigationStatus"),
      )}

      <FeatureFlag feature={FEATURE_TYPES.REGION_FILTER}>
        {renderSelectFilter(
          "region",
          "Region",
          regionOptions,
          "Select",
          regionOptions.find((option) => option.value === searchValues.region) || null,
          handleFieldChange("region"),
        )}
      </FeatureFlag>

      <FeatureFlag feature={FEATURE_TYPES.ZONE_FILTER}>
        {renderSelectFilter(
          "zone",
          "Zone",
          zoneOptions,
          "Select",
          zoneOptions.find((option) => option.value === searchValues.zone) || null,
          handleFieldChange("zone"),
        )}
      </FeatureFlag>

      {renderSelectFilter(
        "community",
        "Community",
        communityOptions,
        "Select",
        communityOptions.find((option) => option.value === searchValues.community) || null,
        handleFieldChange("community"),
      )}

      {renderSelectFilter(
        "primary-investigator",
        "Primary investigator",
        officerOptions,
        "Select",
        officerOptions.find((option) => option.value === searchValues.primaryInvestigator) || null,
        handleFieldChange("primaryInvestigator"),
      )}

      {renderSelectFilter(
        "file-coordinator",
        "File coordinator",
        officerOptions,
        "Select",
        officerOptions.find((option) => option.value === searchValues.fileCoordinator) || null,
        handleFieldChange("fileCoordinator"),
      )}

      {renderSelectFilter(
        "supervisor",
        "Supervisor",
        officerOptions,
        "Select",
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
