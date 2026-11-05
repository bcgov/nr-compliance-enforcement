import { useMemo } from "react";
import { useAppSelector } from "@hooks/hooks";
import { selectInvestigationSourceCodeDropdown } from "@store/reducers/code-table";
import { selectEnforcementActionsByAgency } from "@store/reducers/code-table-selectors";
import {
  convertActsToGroupedOptions,
  convertLegislationToOption,
  useLegislationSearchQuery,
} from "@/app/graphql/hooks/useLegislationSearchQuery";
import { LegislationType } from "@/app/types/app/legislation";
import { getUserAgency } from "@service/user-service";

export const useInvestigationFilterOptions = (act: string | null) => {
  const userAgency = getUserAgency();

  const sourceOptions = useAppSelector(selectInvestigationSourceCodeDropdown);

  const decisionSelector = useMemo(() => selectEnforcementActionsByAgency(userAgency), [userAgency]);
  const decisionOptions = useAppSelector(decisionSelector);

  const actsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [LegislationType.ACT],
    enabled: !!userAgency,
  });
  const acts = actsQuery.data?.legislations;

  // Regulations hang off the act's current version, so look up its legislationGuid from the selected source
  const actLegislationGuid = acts?.find((legislation) => legislation.legislationSourceGuid === act)?.legislationGuid;

  const regulationsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [LegislationType.REGULATION],
    ancestorGuid: actLegislationGuid ?? "",
    enabled: !!actLegislationGuid,
  });

  const actGroups = useMemo(() => convertActsToGroupedOptions(acts, "legislationSourceGuid"), [acts]);
  const actOptions = useMemo(() => actGroups.flatMap((group) => group.options), [actGroups]);

  const regulationOptions = useMemo(
    () =>
      act && !regulationsQuery.isPlaceholderData
        ? convertLegislationToOption(regulationsQuery.data?.legislations, "legislationSourceGuid")
        : [],
    [act, regulationsQuery.data, regulationsQuery.isPlaceholderData],
  );

  return { sourceOptions, decisionOptions, actOptions, actGroups, regulationOptions };
};
