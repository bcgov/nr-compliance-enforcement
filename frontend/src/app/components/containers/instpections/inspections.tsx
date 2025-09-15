import { FC, useState, useCallback } from "react";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { InspectionResult } from "@/generated/graphql";
import { InspectionFilter } from "./list/inspection-filter";
import { InspectionList } from "./list";
import { InspectionFilterBar } from "./list/inspection-filter-bar";
import { InspectionMap } from "./map/inspection-map";
import { useInspectionSearch } from "./hooks/use-inspection-search";

const SEARCH_INSPECTIONS = gql`
  query SearchInspections($page: Int, $pageSize: Int, $filters: InspectionFilters) {
    searchInspections(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        inspectionGuid
        openedTimestamp
        leadAgency
        caseIdentifier
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
      />
    ) : (
      <InspectionMap
        inspections={inspections}
        isLoading={isLoading}
        error={error}
      />
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
