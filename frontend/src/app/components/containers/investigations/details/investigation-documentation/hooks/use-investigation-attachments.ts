import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDisplayFilename, Attachment, fetchAttachmentsWithMetadata } from "@common/attachment-utils";
import { Task } from "@/generated/graphql";
import { SORT_TYPES } from "@constants/sort-direction";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useAppSelector } from "@/app/hooks/hooks";

interface UseInvestigationAttachmentsParams {
  investigationIdentifier: string;
  tasks: Task[];
  search: string | null;
  taskFilter: string | null;
  fileTypeFilter: string | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
  enabled?: boolean;
  taskId?: string;
}

export interface InvestigationAttachmentsResult {
  attachments: Attachment[];
  filteredAttachments: Attachment[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * TanStack Query hook for fetching and processing investigation attachments
 */
export const useInvestigationAttachments = (
  params: UseInvestigationAttachmentsParams,
): InvestigationAttachmentsResult => {
  const {
    investigationIdentifier,
    tasks,
    search,
    taskFilter,
    fileTypeFilter,
    sortBy,
    sortOrder,
    page,
    pageSize,
    enabled = true,
    taskId,
  } = params;

  const officers = useAppSelector(selectOfficers);

  const geUserName = (officerGuid: string) => {
    const takenBy = officers?.find((o) => o.app_user_guid === officerGuid);
    return takenBy ? `${takenBy.last_name}, ${takenBy.first_name}` : "-";
  };

  const query = useQuery({
    queryKey: ["investigation-attachments-all", investigationIdentifier, taskId],
    queryFn: () => fetchAttachmentsWithMetadata(investigationIdentifier, taskId, undefined, true),
    enabled: enabled && !!investigationIdentifier,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const queryClient = useQueryClient();

  // Re-query when an upload is complete
  useEffect(() => {
    const subscription = attachmentUploadComplete$.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["investigation-attachments-all", investigationIdentifier] });
    });
    return () => subscription.unsubscribe();
  }, [queryClient, investigationIdentifier]);

  // Filter, sort, and paginate
  const attachmentResults = useMemo(() => {
    const attachments = query.data ?? [];

    // Get task numbers
    let items: Attachment[] = attachments.map((attachment) => {
      const task = attachment.taskId ? tasks.find((t) => t.taskIdentifier === attachment.taskId) : undefined;
      return {
        ...attachment,
        taskNumber: task?.taskNumber,
      };
    });

    // Filter to only include attachments belonging to the provided tasks or enforcement actions
    const taskIdentifiers = new Set(tasks.map((t) => t.taskIdentifier));
    items = items.filter((a) => a.enforcementActionId || (a.taskId && taskIdentifiers.has(a.taskId)));

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter((a) => {
        const displayName = getDisplayFilename(a.name).toLowerCase();
        return (
          a.fileType?.toLowerCase().includes(searchLower) ||
          a.sequenceNumber?.toString().includes(searchLower) ||
          a.description?.toLowerCase().includes(searchLower) ||
          a.title?.toLowerCase().includes(searchLower) ||
          a.taskNumber?.toString().includes(searchLower) ||
          geUserName(a.takenBy ?? "")
            .toLowerCase()
            .includes(searchLower) ||
          a.location?.toLowerCase().includes(searchLower) ||
          displayName.includes(searchLower)
        );
      });
    }

    // Filter by task
    if (taskFilter) {
      items = items.filter((a) => a.taskId === taskFilter);
    }

    // Filter by file type
    if (fileTypeFilter) {
      items = items.filter((a) => a.fileType === fileTypeFilter);
    }

    // Sort
    items = [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "fileType": {
          const fileTypeA = a.fileType ?? "";
          const fileTypeB = b.fileType ?? "";
          comparison = fileTypeA.localeCompare(fileTypeB);
          break;
        }
        case "sequenceNumber": {
          const sequenceA = Number.parseInt(a.sequenceNumber ?? "0", 10);
          const sequenceB = Number.parseInt(b.sequenceNumber ?? "0", 10);
          const numA = Number.isNaN(sequenceA) ? 0 : sequenceA;
          const numB = Number.isNaN(sequenceB) ? 0 : sequenceB;
          comparison = numA - numB;
          break;
        }
        case "description": {
          const descriptionA = a.description ?? "";
          const descriptionB = b.description ?? "";
          comparison = descriptionA.localeCompare(descriptionB);
          break;
        }

        case "title": {
          const titleA = a.title ?? "";
          const titleB = b.title ?? "";
          comparison = titleA.localeCompare(titleB);
          break;
        }

        case "taskNumber": {
          const taskA = a.taskNumber ?? Number.MAX_SAFE_INTEGER;
          const taskB = b.taskNumber ?? Number.MAX_SAFE_INTEGER;
          comparison = taskA - taskB;
          break;
        }

        case "takenBy": {
          const takenByA = geUserName(a.takenBy ?? "");
          const takenByB = geUserName(b.takenBy ?? "");
          comparison = takenByA.localeCompare(takenByB);
          break;
        }

        case "location": {
          const locationA = a.location ?? "";
          const locationB = b.location ?? "";
          comparison = locationA.localeCompare(locationB);
          break;
        }

        case "name": {
          const nameA = getDisplayFilename(a.name).toLowerCase();
          const nameB = getDisplayFilename(b.name).toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        }

        default: {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          comparison = dateA - dateB;
          break;
        }
      }

      return sortOrder === SORT_TYPES.DESC ? -comparison : comparison;
    });

    const totalCount = items.length;

    // Paginate
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      filtered: items,
      totalCount,
    };
  }, [query.data, tasks, search, taskFilter, fileTypeFilter, sortBy, sortOrder, page, pageSize]);

  return {
    attachments: attachmentResults.items,
    filteredAttachments: attachmentResults.filtered,
    totalCount: attachmentResults.totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
