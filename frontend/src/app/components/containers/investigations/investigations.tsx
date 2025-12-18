import { FC, useState, useCallback, useMemo } from "react";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { InvestigationResult, CaseFile } from "@/generated/graphql";
import { InvestigationFilter } from "./list/investigation-filter";
import { InvestigationList } from "./list";
import { InvestigationFilterBar } from "./list/investigation-filter-bar";
import { InvestigationMap } from "./map/investigation-map";
import { useInvestigationSearch } from "./hooks/use-investigation-search";
import { uniq, compact } from "lodash";

const SEARCH_INVESTIGATIONS = gql`
  query SearchInvestigations($page: Int, $pageSize: Int, $filters: InvestigationFilters) {
    searchInvestigations(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        investigationGuid
        name
        openedTimestamp
        leadAgency
        caseIdentifier
        locationGeometry
        investigationStatus {
          investigationStatusCode
          shortDescription
          longDescription
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalPages
        totalCount
      }
    }
  }
`;

const GET_CASE_FILES_BY_ACTIVITIES = gql`
  query GetCaseFilesByActivityIds($activityIdentifiers: [String!]!) {
    caseFilesByActivityIds(activityIdentifiers: $activityIdentifiers) {
      caseIdentifier
      name
      activities {
        activityIdentifier
      }
    }
  }
`;

const Investigations: FC = () => {
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const { searchValues, getFilters } = useInvestigationSearch();

  const { data, isLoading, error } = useGraphQLQuery<{ searchInvestigations: InvestigationResult }>(
    SEARCH_INVESTIGATIONS,
    {
      queryKey: [
        "searchInvestigations",
        searchValues.search,
        searchValues.investigationStatus,
        searchValues.leadAgency,
        searchValues.startDate,
        searchValues.endDate,
        searchValues.sortBy,
        searchValues.sortOrder,
        searchValues.page,
        searchValues.pageSize,
      ],
      variables: {
        page: searchValues.page,
        pageSize: searchValues.pageSize,
        filters: getFilters(),
      },
      placeholderData: (previousData) => previousData,
    },
  );

  const investigationGuids = useMemo(
    () =>
      data?.searchInvestigations?.items
        ? uniq(compact(data.searchInvestigations.items.map((item) => item.investigationGuid)))
        : [],
    [data?.searchInvestigations?.items],
  );

  const { data: caseData } = useGraphQLQuery<{ caseFilesByActivityIds: CaseFile[] }>(GET_CASE_FILES_BY_ACTIVITIES, {
    queryKey: ["caseFilesByActivityIds", ...investigationGuids],
    variables: { activityIdentifiers: investigationGuids },
    enabled: investigationGuids.length > 0,
  });

  // Map of activityIdentifier -> related cases
  const cases = useMemo(() => {
    const map = new Map<string, CaseFile[]>();
    for (const casefile of caseData?.caseFilesByActivityIds || []) {
      for (const activity of casefile.activities || []) {
        if (activity?.activityIdentifier) {
          const existing = map.get(activity.activityIdentifier) || [];
          map.set(activity.activityIdentifier, [...existing, casefile]);
        }
      }
    }
    return map;
  }, [caseData]);

  const toggleShowMobileFilters = useCallback(() => setShowMobileFilters((prevShow) => !prevShow), []);
  const toggleShowDesktopFilters = useCallback(() => setShowDesktopFilters((prevShow) => !prevShow), []);

  const renderDesktopFilterSection = () => (
    <Collapse
      in={showDesktopFilters}
      dimension="width"
    >
      <div className="comp-data-filters">
        <div className="comp-data-filters-inner">
          <div className="comp-data-filters-header">
            Filter by{" "}
            <CloseButton
              onClick={() => setShowDesktopFilters(false)}
              aria-expanded={showDesktopFilters}
              aria-label="Close filters"
            />
          </div>
          <div className="comp-data-filters-body">
            <InvestigationFilter />
          </div>
        </div>
      </div>
    </Collapse>
  );

  const renderMobileFilters = () => (
    <Offcanvas
      show={showMobileFilters}
      onHide={() => setShowMobileFilters(false)}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <InvestigationFilter />
      </Offcanvas.Body>
    </Offcanvas>
  );

  const renderInvestigations = () => {
    const investigations = data?.searchInvestigations?.items || [];
    const totalInvestigations = data?.searchInvestigations?.pageInfo?.totalCount || 0;

    return searchValues.viewType === "list" ? (
      <InvestigationList
        investigations={investigations}
        totalItems={totalInvestigations}
        isLoading={isLoading}
        error={error}
        cases={cases}
      />
    ) : (
      <InvestigationMap error={error} />
    );
  };

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Investigations</h1>
        </div>

        <InvestigationFilterBar
          toggleShowMobileFilters={toggleShowMobileFilters}
          toggleShowDesktopFilters={toggleShowDesktopFilters}
        />
      </div>

      <div className="comp-data-container">
        {renderDesktopFilterSection()}
        <div className="comp-data-list-map">{renderInvestigations()}</div>
      </div>

      {renderMobileFilters()}
    </div>
  );
};

export default Investigations;
