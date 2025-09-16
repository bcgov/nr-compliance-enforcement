import { FC, useState, useCallback } from "react";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { PartyResult } from "@/generated/graphql";
import { PartyFilter } from "./list/party-filter";
import { PartyList } from "./list/party-list";
import { PartyFilterBar } from "./list/party-filter-bar";
import { usePartySearch } from "./hooks/use-party-search";

const SEARCH_PARTIES = gql`
  query SearchParties($page: Int, $pageSize: Int, $filters: PartyFilters) {
    searchParties(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        partyIdentifier
        partyTypeCode
        shortDescription
        longDescription
        createdDateTime
        person {
          personGuid
          firstName
          lastName
        }
        business {
          businessGuid
          name
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

const Parties: FC = () => {
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const { searchValues, getFilters } = usePartySearch();

  const { data, isLoading, error } = useGraphQLQuery<{ searchParties: PartyResult }>(SEARCH_PARTIES, {
    queryKey: [
      "searchParties",
      searchValues.search,
      searchValues.partyTypeCode,
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
    navigate("/party/create");
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
            <PartyFilter />
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
        <PartyFilter />
      </Offcanvas.Body>
    </Offcanvas>
  );

  const renderParties = () => {
    const parties = data?.searchParties?.items || [];
    const totalParties = data?.searchParties?.pageInfo?.totalCount || 0;

    return (
      <PartyList
        parties={parties}
        totalItems={totalParties}
        isLoading={isLoading}
        error={error}
      />
    );
  };

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Parties</h1>
          <Button
            onClick={handleCreateClick}
            variant="primary"
          >
            <i className="bi bi-plus-circle" />
            <span>Create party</span>
          </Button>
        </div>

        <PartyFilterBar
          toggleShowMobileFilters={toggleShowMobileFilters}
          toggleShowDesktopFilters={toggleShowDesktopFilters}
        />
      </div>

      <div className="comp-data-container">
        {renderDesktopFilterSection()}
        <div className="comp-data-list-map">{renderParties()}</div>
      </div>

      {renderMobileFilters()}
    </div>
  );
};

export default Parties;
