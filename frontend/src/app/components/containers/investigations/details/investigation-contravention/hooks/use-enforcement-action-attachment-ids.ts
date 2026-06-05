import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEnforcementActionAttachments } from "@common/enforcement-action-attachment-utils";
import { attachmentUploadComplete$ } from "@/app/types/events/attachment-events";

// Get enforcement action ids that have attachments
export const useEnforcementActionAttachmentIds = (investigationGuid: string): Set<string> => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["enforcement-action-attachment-ids", investigationGuid],
    queryFn: () => fetchEnforcementActionAttachments(investigationGuid),
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
