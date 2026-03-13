import { FC, useState, useCallback } from "react";
import { CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { Task } from "@/generated/graphql";
import { DocumentationFilter } from "./documentation-filter";
import { DocumentationFilterBar } from "./documentation-filter-bar";
import { DocumentationList } from "./documentation-list";
import { useDocumentationSearch } from "./hooks/use-documentation-search";
import { useInvestigationAttachments } from "./hooks/use-investigation-attachments";

type Props = {
  investigationGuid: string;
  tasks?: Task[];
};

export const InvestigationDocumentation: FC<Props> = ({ investigationGuid, tasks = [] }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const { searchValues } = useDocumentationSearch();

  // Fetch and process attachments (with client-side filtering, sorting, pagination)
  const { attachments, totalCount, isLoading, error } = useInvestigationAttachments({
    investigationIdentifier: investigationGuid,
    tasks,
    search: searchValues.search,
    taskFilter: searchValues.taskFilter,
    fileTypeFilter: searchValues.fileTypeFilter,
    sortBy: searchValues.sortBy,
    sortOrder: searchValues.sortOrder,
    page: searchValues.page,
    pageSize: searchValues.pageSize,
    enabled: !!investigationGuid,
  });

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
            <DocumentationFilter tasks={tasks} />
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
        <DocumentationFilter tasks={tasks} />
      </Offcanvas.Body>
    </Offcanvas>
  );

  return (
    <div className="comp-details-section--list-view">
      <DocumentationFilterBar
        tasks={tasks}
        toggleShowMobileFilters={toggleShowMobileFilters}
        toggleShowDesktopFilters={toggleShowDesktopFilters}
      />

      <div className="comp-data-container">
        {renderDesktopFilterSection()}
        <div className="comp-data-list-map">
          <DocumentationList
            attachments={attachments}
            tasks={tasks}
            totalItems={totalCount}
            isLoading={isLoading}
            error={error}
            investigationGuid={investigationGuid}
          />
        </div>
      </div>

      {renderMobileFilters()}
    </div>
  );
};
