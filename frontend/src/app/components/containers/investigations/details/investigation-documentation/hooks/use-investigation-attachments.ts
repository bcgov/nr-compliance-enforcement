import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  searchAttachments,
  fetchObjectsMetadata,
  ParsedObjectMetadata,
  getDisplayFilename,
} from "@common/attachment-utils";
import { COMSObject } from "@apptypes/coms/object";
import { Task } from "@/generated/graphql";
import AttachmentEnum from "@constants/attachment-enum";
import { SORT_TYPES } from "@constants/sort-direction";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";

interface UseInvestigationAttachmentsParams {
  investigationIdentifier: string;
  tasks: Task[];
  search: string | null;
  taskFilter: string | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
  enabled?: boolean;
}

export interface Attachment extends COMSObject {
  taskId: string | null;
  taskNumber?: number;
  takenBy?: string | null;
  sequenceNumber?: string | null;
  fileType?: string | null;
  description?: string | null;
  title?: string | null;
  date?: string | null;
  location?: string | null;
}

export interface InvestigationAttachmentsResult {
  attachments: Attachment[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const FETCH_PAGE_SIZE = 100;

/**
 * Fetches attachments for an investigation by iterating through pages, then fetches metadata in bulk
 */
const fetchAttachmentsWithMetadata = async (investigationIdentifier: string): Promise<Attachment[]> => {
  const attachments: COMSObject[] = [];
  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    const searchResult = await searchAttachments({
      headerId: investigationIdentifier,
      page: currentPage,
      limit: FETCH_PAGE_SIZE,
      attachmentType: AttachmentEnum.TASK_ATTACHMENT,
    });

    attachments.push(...searchResult.attachments);

    hasMorePages = searchResult.attachments.length === FETCH_PAGE_SIZE;
    currentPage++;
  }

  if (attachments.length === 0) {
    return [];
  }

  // Fetch metadata for all objects
  const objectIds = attachments.map((a) => a.id).filter((id): id is string => !!id);
  const metadataMap = await fetchObjectsMetadata(objectIds, AttachmentEnum.TASK_ATTACHMENT);

  return attachments.map((attachment) => {
    const metadata: ParsedObjectMetadata | undefined = attachment.id ? metadataMap.get(attachment.id) : undefined;

    return {
      ...attachment,
      taskId: metadata?.taskId ?? null,
      type: metadata?.attachmentType ?? null,
      takenBy: metadata?.takenBy ?? null,
      sequenceNumber: metadata?.sequenceNumber ?? null,
      fileType: metadata?.fileType ?? null,
      description: metadata?.description ?? null,
      title: metadata?.title ?? null,
      date: metadata?.date ?? null,
      location: metadata?.location ?? null,
    };
  });
};

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
    sortBy,
    sortOrder,
    page,
    pageSize,
    enabled = true,
  } = params;

  const query = useQuery({
    queryKey: ["investigation-attachments-all", investigationIdentifier],
    queryFn: () => fetchAttachmentsWithMetadata(investigationIdentifier),
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

    // Filter to only include attachments belonging to the provided tasks
    const taskIdentifiers = new Set(tasks.map((t) => t.taskIdentifier));
    items = items.filter((a) => a.taskId && taskIdentifiers.has(a.taskId));

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter((a) => {
        const displayName = getDisplayFilename(a.name).toLowerCase();
        return displayName.includes(searchLower);
      });
    }

    // Filter by task
    if (taskFilter) {
      items = items.filter((a) => a.taskId === taskFilter);
    }

    // Sort
    items = [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name": {
          const nameA = getDisplayFilename(a.name).toLowerCase();
          const nameB = getDisplayFilename(b.name).toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        }
        case "taskNumber": {
          const taskA = a.taskNumber ?? Number.MAX_SAFE_INTEGER;
          const taskB = b.taskNumber ?? Number.MAX_SAFE_INTEGER;
          comparison = taskA - taskB;
          break;
        }
        case "createdAt":
        default: {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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
      totalCount,
    };
  }, [query.data, tasks, search, taskFilter, sortBy, sortOrder, page, pageSize]);

  return {
    attachments: attachmentResults.items,
    totalCount: attachmentResults.totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
