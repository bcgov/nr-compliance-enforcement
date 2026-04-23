import { FC, useState, useCallback, useMemo } from "react";
import { CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { gql } from "graphql-request";
import { Exhibit, Task } from "@/generated/graphql";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { ExhibitsFilter } from "./exhibits-filter";
import { ExhibitsFilterBar } from "./exhibits-filter-bar";
import { ExhibitsList } from "./exhibits-list";
import { useExhibitsSearch } from "./hooks/use-exhibits-search";
import { graphqlRequest } from "@/app/graphql/client";
import { formatDateStr, escapeCsvCell } from "@common/methods";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectOfficers } from "@/app/store/reducers/officer";
import { DismissToast, ToggleError, ToggleInformation } from "@/app/common/toast";

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
        createdDate
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
  investigationName?: string | null;
  tasks?: Task[];
};

export const InvestigationExhibits: FC<Props> = ({ investigationGuid, investigationName, tasks = [] }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { searchValues } = useExhibitsSearch();
  const officers = useAppSelector(selectOfficers);

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
  }>(SEARCH_EXHIBITS_BY_INVESTIGATION, {
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
  });

  const exhibits = data?.searchExhibitsByInvestigation?.items ?? [];
  const totalCount = data?.searchExhibitsByInvestigation?.pageInfo?.totalCount ?? 0;

  const toggleShowMobileFilters = useCallback(() => setShowMobileFilters((prev) => !prev), []);
  const toggleShowDesktopFilters = useCallback(() => setShowDesktopFilters((prev) => !prev), []);

  const getOfficerName = useCallback(
    (officerGuid: string): string => {
      const officer = officers?.find((o) => o.app_user_guid === officerGuid);
      return officer ? `${officer.last_name}, ${officer.first_name}` : "";
    },
    [officers],
  );

  const getTaskLabel = useCallback(
    (taskGuid: string): string => {
      const taskNumber = tasks.find((t) => t.taskIdentifier === taskGuid)?.taskNumber;
      return taskNumber ? `Task ${taskNumber}` : "";
    },
    [tasks],
  );

  const handleExport = useCallback(async () => {
    if (!investigationGuid || isExporting) return;

    const toastId = ToggleInformation("Export in progress, please wait...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });

    setIsExporting(true);
    try {
      const headers = ["Exhibit number", "Description", "Date collected", "Officer collected", "Task", "Date logged"];

      const pageSize = 500;
      let page = 1;
      let totalPages = 1;
      const all: Exhibit[] = [];

      while (page <= totalPages) {
        const resp = await graphqlRequest(SEARCH_EXHIBITS_BY_INVESTIGATION, {
          page,
          pageSize,
          filters: {
            investigationGuid,
            search: searchValues.search || undefined,
            taskFilter: searchValues.taskFilter || undefined,
            sortBy: searchValues.sortBy,
            sortOrder: searchValues.sortOrder,
          },
        });

        const result = resp?.searchExhibitsByInvestigation;
        const items: Exhibit[] = result?.items ?? [];
        const pageInfo = result?.pageInfo;
        totalPages = pageInfo?.totalPages ?? 1;
        all.push(...items);

        if (items.length === 0) break;
        page += 1;
      }

      const rows = all.map((exhibit) => {
        const exhibitNumberStr = exhibit.exhibitNumber == null ? "" : String(exhibit.exhibitNumber).padStart(4, "0");
        return [
          exhibitNumberStr,
          exhibit.description ?? "",
          exhibit.dateCollected ? formatDateStr(exhibit.dateCollected, "") : "",
          getOfficerName(exhibit.collectedAppUserGuidRef ?? ""),
          getTaskLabel(exhibit.taskGuid ?? ""),
          exhibit.createdDate ? formatDateStr(exhibit.createdDate, "") : "",
        ]
          .map((v) => escapeCsvCell(v ?? ""))
          .join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const csvUrl = URL.createObjectURL(blob);
      const today = new Date().toISOString().split("T")[0];
      const filename = `Investigation ${investigationName || investigationGuid} Exhibits ${today}.csv`;

      const link = document.createElement("a");
      link.href = csvUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(csvUrl);
    } catch (e) {
      console.error("Exhibit export error:", e);
      ToggleError("Export failed. Please try again.");
    } finally {
      DismissToast(toastId);
      setIsExporting(false);
    }
  }, [
    investigationGuid,
    investigationName,
    isExporting,
    searchValues.search,
    searchValues.sortBy,
    searchValues.sortOrder,
    searchValues.taskFilter,
    getOfficerName,
    getTaskLabel,
  ]);

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
      <h2>Exhibits</h2>
      <ExhibitsFilterBar
        tasks={tasks}
        toggleShowMobileFilters={toggleShowMobileFilters}
        toggleShowDesktopFilters={toggleShowDesktopFilters}
        onExport={handleExport}
        isExportDisabled={isLoading || totalCount === 0}
        isExportInProgress={isExporting}
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
