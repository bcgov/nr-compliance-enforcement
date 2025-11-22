import { FC, useState, useCallback, useMemo } from "react";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { InspectionResult, CaseFile } from "@/generated/graphql";
import { InspectionFilter } from "./list/inspection-filter";
import { InspectionList } from "./list";
import { InspectionFilterBar } from "./list/inspection-filter-bar";
import { InspectionMap } from "./map/inspection-map";
import { useInspectionSearch } from "./hooks/use-inspection-search";
import { uniq, compact } from "lodash";

const SEARCH_INSPECTIONS = gql`
  query SearchInspections($page: Int, $pageSize: Int, $filters: InspectionFilters) {
    searchInspections(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        inspectionGuid
        name
        openedTimestamp
        leadAgency
        inspectionStatus {
          inspectionStatusCode
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

const Inspections: FC = () => {
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const { searchValues, getFilters } = useInspectionSearch();

  const { data, isLoading, error } = useGraphQLQuery<{ searchInspections: InspectionResult }>(SEARCH_INSPECTIONS, {
    queryKey: [
      "searchInspections",
      searchValues.search,
      searchValues.inspectionStatus,
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
  });

  const inspectionGuids = useMemo(
    () =>
      data?.searchInspections?.items
        ? uniq(compact(data.searchInspections.items.map((item) => item.inspectionGuid)))
        : [],
    [data?.searchInspections?.items],
  );

  const { data: caseData } = useGraphQLQuery<{ caseFilesByActivityIds: CaseFile[] }>(GET_CASE_FILES_BY_ACTIVITIES, {
    queryKey: ["caseFilesByActivityIds", ...inspectionGuids],
    variables: { activityIdentifiers: inspectionGuids },
    enabled: inspectionGuids.length > 0,
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

  const handleCreateClick = () => {
    navigate("/inspection/create");
  };

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
            <InspectionFilter />
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
        <InspectionFilter />
      </Offcanvas.Body>
    </Offcanvas>
  );

  const renderInspections = () => {
    const inspections = data?.searchInspections?.items || [];
    const totalInspections = data?.searchInspections?.pageInfo?.totalCount || 0;

    return searchValues.viewType === "list" ? (
      <InspectionList
        inspections={inspections}
        totalItems={totalInspections}
        isLoading={isLoading}
        error={error}
        cases={cases}
      />
    ) : (
      <InspectionMap error={error} />
    );
  };

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Inspections</h1>
          <Button
            onClick={handleCreateClick}
            variant="primary"
          >
            <i className="bi bi-plus-circle" />
            <span>Create inspection</span>
          </Button>
        </div>

        <InspectionFilterBar
          toggleShowMobileFilters={toggleShowMobileFilters}
          toggleShowDesktopFilters={toggleShowDesktopFilters}
        />
      </div>

      <div className="comp-data-container">
        {renderDesktopFilterSection()}
        <div className="comp-data-list-map">{renderInspections()}</div>
      </div>

      {renderMobileFilters()}
    </div>
  );
};

export default Inspections;
