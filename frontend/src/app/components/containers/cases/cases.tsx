import { FC, useState, useCallback } from "react";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { CaseMomsSpaghettiFileResult } from "@/generated/graphql";
import { CaseFilter } from "./case-filter";
import { CaseList } from "./case-list";
import { CaseFilterBar } from "./case-filter-bar";
import { CaseMap } from "./case-map";
import { useCaseSearch } from "./hooks/use-case-search";

const SEARCH_CASE_FILES = gql`
  query SearchCaseMomsSpaghettiFiles($page: Int, $pageSize: Int, $filters: CaseMomsSpaghettiFileFilters) {
    searchCaseMomsSpaghettiFiles(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        caseIdentifier
        caseOpenedTimestamp
        caseStatus {
          caseStatusCode
          shortDescription
          longDescription
        }
        leadAgency {
          agencyCode
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

const Cases: FC = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const { searchValues, getFilters } = useCaseSearch();

  const { data, isLoading, error } = useGraphQLQuery<{ searchCaseMomsSpaghettiFiles: CaseMomsSpaghettiFileResult }>(
    SEARCH_CASE_FILES,
    {
      queryKey: [
        "searchCaseMomsSpaghettiFiles",
        searchValues.search,
        searchValues.caseStatus,
        searchValues.agencyCode,
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
    },
  );

  const toggleShowMobileFilters = useCallback(() => setShowMobileFilters((prevShow) => !prevShow), []);
  const toggleShowDesktopFilters = useCallback(() => setShowDesktopFilters((prevShow) => !prevShow), []);

  const handleCreateClick = () => {
    // Future implementation for creating cases
    console.log("Create case clicked");
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
            <CaseFilter />
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
        <CaseFilter />
      </Offcanvas.Body>
    </Offcanvas>
  );

  const renderCases = () => {
    const cases = data?.searchCaseMomsSpaghettiFiles?.items || [];
    const totalCases = data?.searchCaseMomsSpaghettiFiles?.pageInfo?.totalCount || 0;

    return searchValues.viewType === "list" ? (
      <CaseList
        cases={cases}
        totalItems={totalCases}
        isLoading={isLoading}
        error={error}
      />
    ) : (
      <CaseMap
        cases={cases}
        isLoading={isLoading}
        error={error}
      />
    );
  };

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <ToastContainer />
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Cases</h1>
          <Button onClick={handleCreateClick}>Create case</Button>
        </div>

        <CaseFilterBar
          toggleShowMobileFilters={toggleShowMobileFilters}
          toggleShowDesktopFilters={toggleShowDesktopFilters}
        />
      </div>

      <div className="comp-data-container">
        {renderDesktopFilterSection()}
        <div className="comp-data-list-map">{renderCases()}</div>
      </div>

      {renderMobileFilters()}
    </div>
  );
};

export default Cases;
