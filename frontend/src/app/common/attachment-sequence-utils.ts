import {
  Attachment,
  fetchAttachmentsWithMetadata,
} from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";

/**
 * Returns the highest sequence number currently in use for a given file type
 * across an entire investigation (all tasks and all enforcement actions).
 * Returns 0 when no attachment of that file type exists yet.
 */
export const getHighestSequenceNumber = (attachments: Attachment[], fileType: string): number =>
  attachments
    .filter((attachment) => attachment.fileType === fileType)
    .reduce((max, attachment) => {
      const sequence = Number.parseInt(attachment.sequenceNumber ?? "0", 10);
      return Math.max(max, Number.isNaN(sequence) ? 0 : sequence);
    }, 0);

/**
 * Fetches every attachment on the investigation (task and enforcement action) and returns
 * the highest sequence number in use for the given file type. Called at upload time so the
 * number reflects the current state of the investigation rather than a cached view.
 */
export const fetchHighestSequenceNumber = async (
  investigationIdentifier: string,
  fileType: string,
): Promise<number> => {
  const attachments = await fetchAttachmentsWithMetadata(investigationIdentifier);
  return getHighestSequenceNumber(attachments, fileType);
};
