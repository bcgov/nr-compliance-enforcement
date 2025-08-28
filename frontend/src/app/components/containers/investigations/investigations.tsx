import { FC, useState, useCallback } from "react";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { InvestigationResult } from "@/generated/graphql";
import { InvestigationFilter } from "./list/investigation-filter";
import { InvestigationList } from "./list";
import { InvestigationFilterBar } from "./list/investigation-filter-bar";
import { InvestigationMap } from "./map/investigation-map";
import { useInvestigationSearch } from "./hooks/use-investigation-search";

const SEARCH_INVESTIGATIONS = gql`
  query SearchInvestigations($page: Int, $pageSize: Int, $filters: InvestigationFilters) {
    searchInvestigations(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        investigationGuid
        openedTimestamp
        leadAgency
        caseIdentifier
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

  const toggleShowMobileFilters = useCallback(() => setShowMobileFilters((prevShow) => !prevShow), []);
  const toggleShowDesktopFilters = useCallback(() => setShowDesktopFilters((prevShow) => !prevShow), []);

  const handleCreateClick = () => {
    navigate("/investigation/create");
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
      />
    ) : (
      <InvestigationMap
        investigations={investigations}
        isLoading={isLoading}
        error={error}
      />
    );
  };

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Investigations</h1>
          <Button
            onClick={handleCreateClick}
            variant="primary"
          >
            <i className="bi bi-plus-circle" />
            <span>Create investigation</span>
          </Button>
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
