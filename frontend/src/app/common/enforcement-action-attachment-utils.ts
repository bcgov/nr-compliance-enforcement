import { format } from "date-fns";
import AttachmentEnum from "@constants/attachment-enum";
import { COMSObject } from "@apptypes/coms/object";
import {
  searchAttachments,
  fetchObjectsMetadata,
  getDisplayFilename,
  ParsedObjectMetadata,
} from "@common/attachment-utils";

const FETCH_PAGE_SIZE = 100;

/** Values entered in the attachment metadata fields. */
export interface EnforcementActionAttachmentFieldValues {
  fileType: string;
  title: string;
  description: string;
  date: Date | null;
  takenBy: string;
  location: string;
}

/** A COMS attachment parsed with its enforcement-action metadata. */
export interface EnforcementActionAttachment extends COMSObject {
  enforcementActionId: string | null;
  taskId: string | null;
  takenBy?: string | null;
  sequenceNumber?: string | null;
  fileType?: string | null;
  description?: string | null;
  title?: string | null;
  date?: string | null;
  location?: string | null;
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

/** Computes a padded sequence number per file, scoped to this EA's attachments of the same file type. */
export const computeSequenceNumbers = (
  existingAttachments: EnforcementActionAttachment[],
  fileType: string,
  files: File[],
): string[] => {
  const baseSequence = existingAttachments
    .filter((a) => a.fileType === fileType)
    .reduce((max, a) => Math.max(max, Number.parseInt(a.sequenceNumber ?? "0", 10)), 0);

  return files.map((file, i) => {
    const existing = existingAttachments.find((a) => getDisplayFilename(a.name) === file.name)?.sequenceNumber;
    return existing ?? String(baseSequence + i + 1).padStart(4, "0");
  });
};

const mapWithMetadata = (
  attachments: COMSObject[],
  metadataMap: Map<string, ParsedObjectMetadata>,
): EnforcementActionAttachment[] =>
  attachments.map((attachment) => {
    const metadata = attachment.id ? metadataMap.get(attachment.id) : undefined;
    return {
      ...attachment,
      enforcementActionId: metadata?.enforcementActionId ?? null,
      taskId: metadata?.taskId ?? null,
      type: metadata?.attachmentType ?? null,
      takenBy: metadata?.takenBy ?? null,
      sequenceNumber: metadata?.sequenceNumber ?? null,
      fileType: metadata?.fileType ?? null,
      description: metadata?.description ?? null,
      title: metadata?.title ?? null,
      date: metadata?.date ?? null,
      location: metadata?.location ?? null,
      size: metadata?.size ?? attachment.size,
    };
  });

/** Fetches all enforcement-action attachments for an investigation, optionally scoped to a single enforcement action. */
export const fetchEnforcementActionAttachments = async (
  investigationGuid: string,
  enforcementActionId?: string,
): Promise<EnforcementActionAttachment[]> => {
  const attachments: COMSObject[] = [];
  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    const searchResult = await searchAttachments({
      headerId: investigationGuid,
      subHeaderId: enforcementActionId,
      page: currentPage,
      limit: FETCH_PAGE_SIZE,
      attachmentType: AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT,
    });
    attachments.push(...searchResult.attachments);
    hasMorePages = searchResult.attachments.length === FETCH_PAGE_SIZE;
    currentPage++;
  }

  if (attachments.length === 0) return [];

  const objectIds = attachments.map((a) => a.id).filter((id): id is string => !!id);
  const metadataMap = await fetchObjectsMetadata(objectIds, AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT);
  return mapWithMetadata(attachments, metadataMap);
};
