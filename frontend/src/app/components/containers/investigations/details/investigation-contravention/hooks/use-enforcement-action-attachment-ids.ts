import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";
import { fetchAttachmentsWithMetadata } from "@/app/common/attachment-utils";

// Get enforcement action ids that have attachments
export const useEnforcementActionAttachmentIds = (investigationGuid: string): Set<string> => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["investigation-attachments-all", investigationGuid, undefined],
    queryFn: () => fetchAttachmentsWithMetadata(investigationGuid, undefined, undefined, true),
    enabled: !!investigationGuid,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const subscription = attachmentUploadComplete$.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["enforcement-action-attachment-ids", investigationGuid] });
    });
    return () => subscription.unsubscribe();
  }, [queryClient, investigationGuid]);

  return useMemo(() => {
    const ids = new Set<string>();
    for (const a of query.data ?? []) {
      if (a.enforcementActionId) ids.add(a.enforcementActionId);
    }
    return ids;
  }, [query.data]);
};
