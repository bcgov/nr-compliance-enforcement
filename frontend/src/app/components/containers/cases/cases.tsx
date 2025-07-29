import { FC, useState, useCallback } from "react";
import { Button, CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { CaseMomsSpaghettiFileResult } from "@/generated/graphql";
import { CaseFilter, CaseFilters } from "./case-filter";
import { CaseList } from "./case-list";
import { CaseFilterBar } from "./case-filter-bar";
import { CaseMap } from "./case-map";
import { useCaseSearchForm } from "./hooks/use-case-search-form";

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
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  // Use Tanstack Form hook for all search/filter state
  const { form, formValues, statusOptions, leadAgencyOptions, clearFilter, getAPIFilters, updateURLImmediate } =
    useCaseSearchForm();

  const { data, isLoading, error } = useGraphQLQuery<{ searchCaseMomsSpaghettiFiles: CaseMomsSpaghettiFileResult }>(
    SEARCH_CASE_FILES,
    {
      queryKey: [
        "searchCaseMomsSpaghettiFiles",
        formValues.searchQuery,
        formValues.status,
        formValues.leadAgency,
        formValues.sortBy,
        formValues.sortOrder,
        formValues.page,
        formValues.pageSize,
      ],
      variables: {
        page: formValues.page,
        pageSize: formValues.pageSize,
        filters: getAPIFilters(),
      },
    },
  );

  const hideFilters = () => setShow(false);
  const toggleShowMobileFilters = useCallback(() => setShow((prevShow) => !prevShow), []);
  const toggleShowDesktopFilters = useCallback(() => setOpen((prevShow) => !prevShow), []);

  const handleCreateClick = () => {
    // Future implementation for creating cases
    console.log("Create case clicked");
  };

  const handleSort = useCallback(
    (column: string, direction: string) => {
      form.setFieldValue("sortBy", column);
      form.setFieldValue("sortOrder", direction);
      // Immediately update URL for sorting (no debounce)
      setTimeout(() => {
        updateURLImmediate(form.store.state.values);
      }, 50);
    },
    [form, updateURLImmediate],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      form.setFieldValue("page", newPage);
      // Immediately update URL for pagination (no debounce)
      setTimeout(() => {
        updateURLImmediate(form.store.state.values);
      }, 50);
    },
    [form, updateURLImmediate],
  );

  const handleClearFilter = useCallback(
    (filterName: string) => {
      clearFilter(filterName as keyof typeof formValues);
    },
    [clearFilter],
  );

  const cases = data?.searchCaseMomsSpaghettiFiles?.items || [];
  const totalCases = data?.searchCaseMomsSpaghettiFiles?.pageInfo?.totalCount || 0;

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <ToastContainer />
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Cases</h1>
          <Button onClick={handleCreateClick}>Create case</Button>
        </div>

        <CaseFilterBar
          formValues={formValues}
          form={form}
          toggleShowMobileFilters={toggleShowMobileFilters}
          toggleShowDesktopFilters={toggleShowDesktopFilters}
          onClearFilter={handleClearFilter}
        />
      </div>

      <div className="comp-data-container">
        <Collapse
          in={open}
          dimension="width"
        >
          <div className="comp-data-filters">
            <div className="comp-data-filters-inner">
              <div className="comp-data-filters-header">
                Filter by{" "}
                <CloseButton
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  aria-label="Close filters"
                />
              </div>
              <div className="comp-data-filters-body">
                <CaseFilter
                  form={form}
                  statusOptions={statusOptions}
                  leadAgencyOptions={leadAgencyOptions}
                />
              </div>
            </div>
          </div>
        </Collapse>

        <div className="comp-data-list-map">
          {formValues.viewType === "list" ? (
            <CaseList
              cases={cases}
              searchQuery={formValues.searchQuery}
              filters={{
                status: formValues.status,
                leadAgency: formValues.leadAgency,
                startDate: formValues.startDate,
                endDate: formValues.endDate,
              }}
              onSort={handleSort}
              currentPage={formValues.page}
              totalItems={totalCases}
              resultsPerPage={formValues.pageSize}
              onPageChange={handlePageChange}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <CaseMap
              cases={cases}
              searchQuery={formValues.searchQuery}
              filters={{
                status: formValues.status,
                leadAgency: formValues.leadAgency,
                startDate: formValues.startDate,
                endDate: formValues.endDate,
              }}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>

      <Offcanvas
        show={show}
        onHide={hideFilters}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CaseFilter
            form={form}
            statusOptions={statusOptions}
            leadAgencyOptions={leadAgencyOptions}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Cases;
