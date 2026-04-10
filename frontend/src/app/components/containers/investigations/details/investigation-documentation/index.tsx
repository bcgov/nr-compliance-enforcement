import { FC, useState, useCallback } from "react";
import { CloseButton, Collapse, Offcanvas } from "react-bootstrap";
import { Task } from "@/generated/graphql";
import { formatDate, escapeCsvCell } from "@common/methods";
import { getDisplayFilename } from "@common/attachment-utils";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { DocumentationFilter } from "./documentation-filter";
import { DocumentationFilterBar } from "./documentation-filter-bar";
import { DocumentationList } from "./documentation-list";
import { useDocumentationSearch } from "./hooks/use-documentation-search";
import { useInvestigationAttachments, Attachment } from "./hooks/use-investigation-attachments";
import { bulkDownload } from "@/app/store/reducers/bulk-download";
import { DismissToast, ToggleError, ToggleInformation } from "@/app/common/toast";
import { DownloadType } from "@/app/constants/download-type";

type Props = {
  investigationGuid: string;
  investigationName?: string | null;
  tasks?: Task[];
};

export const InvestigationDocumentation: FC<Props> = ({ investigationGuid, investigationName, tasks = [] }) => {
  const dispatch = useAppDispatch();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  const officers = useAppSelector(selectOfficers);

  const { searchValues } = useDocumentationSearch();

  // Fetch and process attachments (with client-side filtering, sorting, pagination)
  const { attachments, filteredAttachments, totalCount, isLoading, error } = useInvestigationAttachments({
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

  const getOfficerName = useCallback(
    (officerGuid: string): string => {
      const officer = officers?.find((o) => o.app_user_guid === officerGuid);
      return officer ? `${officer.last_name}, ${officer.first_name}` : "";
    },
    [officers],
  );

  const handleExportAttachmentsAndCsv = useCallback(() => {
    let toastDownloadInfo: any;
    try {
      toastDownloadInfo = ToggleInformation("Download in progress, do not close the NatSuite application.", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });
      const headers = ["File type", "ID", "Description", "Title", "Date", "Taken By", "Location", "Task", "File Name"];

      const sorted = [...filteredAttachments].sort(
        (a, b) => (Number.parseInt(a.sequenceNumber ?? "0") || 0) - (Number.parseInt(b.sequenceNumber ?? "0") || 0),
      );

      const rows = sorted.map((a: Attachment) => {
        const task = a.taskId ? tasks.find((t) => t.taskIdentifier === a.taskId) : undefined;
        return [
          a.fileType,
          a.sequenceNumber,
          a.description,
          a.title,
          a.date ? formatDate(a.date) : "",
          getOfficerName(a.takenBy ?? ""),
          a.location,
          task ? `Task ${task.taskNumber}` : "",
          getDisplayFilename(a.name),
        ]
          .map((v) => escapeCsvCell(v ?? ""))
          .join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const csvUrl = URL.createObjectURL(blob);
      const today = new Date().toISOString().split("T")[0];
      const csvFile = {
        id: undefined,
        name: `Investigation ${investigationName || investigationGuid} ${today}.csv`,
        size: blob.size,
        url: csvUrl,
      };
      dispatch(
        bulkDownload(
          investigationGuid,
          investigationName || "",
          filteredAttachments,
          [csvFile],
          DownloadType.INVESTIGATION,
        ),
      );
    } catch (error) {
      console.error("Bulk download error:", error);
      ToggleError("Download failed. Please try again.");
    } finally {
      DismissToast(toastDownloadInfo);
    }
  }, [filteredAttachments, tasks, investigationName, investigationGuid, getOfficerName]);

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
        investigationId={investigationGuid}
        tasks={tasks}
        toggleShowMobileFilters={toggleShowMobileFilters}
        toggleShowDesktopFilters={toggleShowDesktopFilters}
        onExport={handleExportAttachmentsAndCsv}
        isExportDisabled={isLoading || filteredAttachments.length === 0}
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
