import { format } from "date-fns";
import AttachmentEnum from "@constants/attachment-enum";
import { Attachment, getDisplayFilename } from "@common/attachment-utils";
import { fetchHighestSequenceNumber } from "@/app/common/attachment-sequence-utils";

/** Values entered in the attachment metadata fields. */
export interface EnforcementActionAttachmentFieldValues {
  fileType: string;
  title: string;
  description: string;
  date: Date | null;
  takenBy: string;
  location: string;
}

const MEDIA_FILE_TYPES = new Set(["Audio", "Video", "Photo"]);

/** Builds the COMS extended-metadata object for an EA attachment (keys are un-prefixed; saveAttachments adds x-amz-meta-). */
export const buildEnforcementActionMeta = (
  values: EnforcementActionAttachmentFieldValues,
  ctx: { investigationGuid: string; enforcementActionId: string },
): Record<string, string> => {
  const isMediaType = MEDIA_FILE_TYPES.has(values.fileType);
  // Omit empty optional fields — COMS rejects blank metadata values
  return {
    "is-thumb": "N",
    "attachment-type": String(AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT),
    "investigation-id": ctx.investigationGuid,
    "enforcement-action-id": ctx.enforcementActionId,
    "file-type": values.fileType,
    ...(values.title && { title: values.title }),
    ...(values.description && { description: values.description }),
    ...(values.date && { date: format(values.date, "yyyy-MM-dd") }),
    ...(isMediaType && values.takenBy && { "taken-by": values.takenBy }),
    ...(isMediaType && values.location && { location: values.location }),
  };
};

/**
 * Computes a padded sequence number per file. The base is investigation-wide (all tasks and all
 * enforcement actions) for the given file type, fetched at upload time so it reflects the current
 * state of the investigation. Files matching an existing attachment on this enforcement action by
 * name reuse that attachment's sequence number.
 */
export const computeSequenceNumbers = async (
  investigationGuid: string,
  existingAttachments: Attachment[],
  fileType: string,
  files: File[],
): Promise<string[]> => {
  const baseSequence = await fetchHighestSequenceNumber(investigationGuid, fileType);

  return files.map((file, i) => {
    const existing = existingAttachments.find(
      (a) => getDisplayFilename(a.name) === file.name && a.fileType === fileType,
    )?.sequenceNumber;
    return existing ?? String(baseSequence + i + 1).padStart(4, "0");
  });
};
