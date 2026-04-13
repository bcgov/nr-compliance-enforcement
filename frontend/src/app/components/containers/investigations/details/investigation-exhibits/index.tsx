import { FC, useState, useCallback, useMemo } from "react";
import { CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { gql } from "graphql-request";
import { Exhibit, Task } from "@/generated/graphql";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { ExhibitsFilter } from "./exhibits-filter";
import { ExhibitsFilterBar } from "./exhibits-filter-bar";
import { ExhibitsList } from "./exhibits-list";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";

export const SEARCH_EXHIBITS_BY_INVESTIGATION = gql`
  query SearchExhibitsByInvestigation($page: Int, $pageSize: Int, $filters: ExhibitFilters!) {
    searchExhibitsByInvestigation(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        exhibitGuid
        taskGuid
        investigationGuid
        exhibitNumber
        description
        dateCollected
        collectedAppUserGuidRef
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

type Props = {
  investigationGuid: string;
  tasks?: Task[];
};

export const InvestigationExhibits: FC<Props> = ({ investigationGuid, tasks = [] }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const { searchValues } = useExhibitsSearch();

  const queryVariables = useMemo(
    () => ({
      page: searchValues.page,
      pageSize: searchValues.pageSize,
      filters: {
        investigationGuid,
        search: searchValues.search || undefined,
        taskFilter: searchValues.taskFilter || undefined,
        sortBy: searchValues.sortBy,
        sortOrder: searchValues.sortOrder,
      },
    }),
    [investigationGuid, searchValues],
  );

  const { data, isLoading } = useGraphQLQuery<{
    searchExhibitsByInvestigation: { items: Exhibit[]; pageInfo: { totalCount: number } };
  }>(
    SEARCH_EXHIBITS_BY_INVESTIGATION,
    {
      queryKey: [
        "searchExhibitsByInvestigation",
        investigationGuid,
        searchValues.search,
        searchValues.taskFilter,
        searchValues.sortBy,
        searchValues.sortOrder,
        searchValues.page,
        searchValues.pageSize,
      ],
      variables: queryVariables,
      enabled: !!investigationGuid,
    },
  );

  const exhibits = data?.searchExhibitsByInvestigation?.items ?? [];
  const totalCount = data?.searchExhibitsByInvestigation?.pageInfo?.totalCount ?? 0;

  const toggleShowMobileFilters = useCallback(() => setShowMobileFilters((prev) => !prev), []);
  const toggleShowDesktopFilters = useCallback(() => setShowDesktopFilters((prev) => !prev), []);

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
            <ExhibitsFilter tasks={tasks} />
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
        <ExhibitsFilter tasks={tasks} />
      </Offcanvas.Body>
    </Offcanvas>
  );

  return (
    <div className="comp-details-section--list-view">
      <ExhibitsFilterBar
        tasks={tasks}
        toggleShowMobileFilters={toggleShowMobileFilters}
        toggleShowDesktopFilters={toggleShowDesktopFilters}
      />

      <div className="comp-data-container">
        {renderDesktopFilterSection()}
        <div className="comp-data-list-map">
          <ExhibitsList
            exhibits={exhibits}
            tasks={tasks}
            totalItems={totalCount}
            isLoading={isLoading}
            investigationGuid={investigationGuid}
          />
        </div>
      </div>

      {renderMobileFilters()}
    </div>
  );
};
