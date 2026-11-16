import { FC, useMemo } from "react";
import { GroupBase } from "react-select";
import { gql } from "graphql-request";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { FilterDate } from "@components/common/filter-date";
import { useAppSelector } from "@hooks/hooks";
import {
  selectCascadedCommunity,
  selectCascadedRegion,
  selectCascadedZone,
  selectComplaintStatusCodeDropdown,
} from "@store/reducers/code-table";
import { selectOfficersByAgency } from "@store/reducers/officer";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { getUserAgency } from "@service/user-service";
import { useInvestigationSearch, InvestigationSearchParams } from "../hooks/use-investigation-search";
import { useInvestigationFilterOptions } from "../hooks/use-investigation-filter-options";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { InvestigationAssignees } from "@/generated/graphql";

const INVESTIGATION_ASSIGNEES = gql`
  query InvestigationAssignees($leadAgency: String!) {
    investigationAssignees(leadAgency: $leadAgency) {
      primaryInvestigators
      fileCoordinators
      supervisors
    }
  }
`;

export const InvestigationFilter: FC = () => {
  const { searchValues, setValues } = useInvestigationSearch();
  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const userAgency = getUserAgency();
  const agencyOfficers = useAppSelector((state) => selectOfficersByAgency(state, userAgency));
  const { data: assigneesData } = useGraphQLQuery<{ investigationAssignees: InvestigationAssignees }>(
    INVESTIGATION_ASSIGNEES,
    {
      queryKey: ["investigationAssignees", userAgency],
      variables: { leadAgency: userAgency },
      enabled: !!userAgency,
    },
  );
  const assignees = assigneesData?.investigationAssignees;

  // Deactivated officers are only offered for a role while they still hold it on one of the agency's investigations
  const toRoleOptions = (assignedGuids: string[] | undefined): Option[] =>
    (agencyOfficers ?? [])
      .map((o: AppUser) => ({
        value: o.app_user_guid,
        label: `${o.last_name}, ${o.first_name}`,
        isActive: !o.deactivate_ind || !!assignedGuids?.includes(o.app_user_guid),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

  const primaryInvestigatorOptions = useMemo(
    () => toRoleOptions(assignees?.primaryInvestigators),
    [agencyOfficers, assignees],
  );
  const fileCoordinatorOptions = useMemo(() => toRoleOptions(assignees?.fileCoordinators), [agencyOfficers, assignees]);
  const supervisorOptions = useMemo(() => toRoleOptions(assignees?.supervisors), [agencyOfficers, assignees]);

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

  const { sourceOptions, decisionOptions, actOptions, actGroups, regulationOptions } = useInvestigationFilterOptions(
    searchValues.act,
  );

  const handleFieldChange = (fieldName: keyof InvestigationSearchParams) => (option: Option | null) => {
    setValues({ [fieldName]: option?.value });
  };

  const handleActChange = (option: Option | null) => {
    setValues({ act: option?.value, regulation: null });
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
    options: Option[] | GroupBase<Option>[],
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
        primaryInvestigatorOptions,
        "Select",
        primaryInvestigatorOptions.find((option) => option.value === searchValues.primaryInvestigator) || null,
        handleFieldChange("primaryInvestigator"),
      )}

      {renderSelectFilter(
        "file-coordinator",
        "File coordinator",
        fileCoordinatorOptions,
        "Select",
        fileCoordinatorOptions.find((option) => option.value === searchValues.fileCoordinator) || null,
        handleFieldChange("fileCoordinator"),
      )}

      {renderSelectFilter(
        "supervisor",
        "Supervisor",
        supervisorOptions,
        "Select",
        supervisorOptions.find((option) => option.value === searchValues.supervisor) || null,
        handleFieldChange("supervisor"),
      )}

      <FilterDate
        id="investigation-date-range-filter"
        label="Date opened"
        startDate={searchValues.startDate || undefined}
        endDate={searchValues.endDate || undefined}
        handleDateChange={handleDateRangeChange}
      />

      {renderSelectFilter(
        "investigationStatus",
        "Status",
        statusOptions,
        "Select",
        statusOptions.find((option) => option.value === searchValues.investigationStatus) || null,
        handleFieldChange("investigationStatus"),
      )}

      {renderSelectFilter(
        "source",
        "Source",
        sourceOptions,
        "Select",
        sourceOptions.find((option) => option.value === searchValues.investigationSource) || null,
        handleFieldChange("investigationSource"),
      )}

      {renderSelectFilter(
        "act",
        "Act",
        actGroups,
        "Select",
        actOptions.find((option) => option.value === searchValues.act) || null,
        handleActChange,
      )}

      {searchValues.act &&
        renderSelectFilter(
          "regulation",
          "Regulation",
          regulationOptions,
          "Select",
          regulationOptions.find((option) => option.value === searchValues.regulation) || null,
          handleFieldChange("regulation"),
        )}

      {renderSelectFilter(
        "decision",
        "Decision",
        decisionOptions,
        "Select",
        decisionOptions.find((option) => option.value === searchValues.decision) || null,
        handleFieldChange("decision"),
      )}
    </div>
  );
};
