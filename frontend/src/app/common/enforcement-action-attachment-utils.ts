import { format } from "date-fns";
import AttachmentEnum from "@constants/attachment-enum";
import { COMSObject } from "@apptypes/coms/object";
import {
  searchAttachments,
  fetchObjectsMetadata,
  getDisplayFilename,
  ParsedObjectMetadata,
  getBucketForAttachmentType,
} from "@common/attachment-utils";
import { fetchHighestSequenceNumber } from "@/app/common/attachment-sequence-utils";
import { getAttachmentConfig } from "@/app/types/app/attachment-config";
import { isImage } from "@/app/common/methods";
import config from "@/config";
import axios from "axios";
import { AUTH_TOKEN } from "@/app/service/user-service";

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

/**
 * Computes a padded sequence number per file. The base is investigation-wide (all tasks and all
 * enforcement actions) for the given file type, fetched at upload time so it reflects the current
 * state of the investigation. Files matching an existing attachment on this enforcement action by
 * name reuse that attachment's sequence number.
 */
export const computeSequenceNumbers = async (
  investigationGuid: string,
  existingAttachments: EnforcementActionAttachment[],
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

/**
 * Resolves the thumbnail image for each image attachment, mutating `imageIconString` / `imageIconId` in place.
 * Non-image attachments are skipped — the UI falls back to a file-type placeholder icon.
 */
const resolveThumbnails = async (
  attachments: COMSObject[],
  identifier: string,
  subIdentifier: string | undefined,
  attachmentType: AttachmentEnum,
): Promise<void> => {
  const attachmentConfig = getAttachmentConfig(attachmentType);
  const bucketId = getBucketForAttachmentType(attachmentType);
  const authHeader = { Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}` };

  for (const attachment of attachments) {
    if (!isImage(attachment.name) || !attachment.id) continue;

    try {
      const lookupUrl = new URL(`${config.COMS_URL}/object`);
      lookupUrl.searchParams.append("bucketId", bucketId);
      lookupUrl.searchParams.append("latest", "true");

      const lookupHeaders: Record<string, string> = {
        ...authHeader,
        [attachmentConfig.headerKey]: identifier,
        "x-amz-meta-is-thumb": "Y",
        "x-amz-meta-attachment-type": attachmentType.toString(),
        "x-amz-meta-thumb-for": attachment.id,
        "Content-Disposition": `attachment; filename="${attachment.name}"`,
      };

      if (attachmentConfig.subHeaderKey) {
        // matches buildAttachmentHeader: a dummy value filters everything out when there is no sub identifier yet
        lookupHeaders[attachmentConfig.subHeaderKey] = subIdentifier ?? "00000000-0000-0000-0000-000000000000";
      }

      const lookupResponse = await axios.get<COMSObject[]>(lookupUrl.toString(), { headers: lookupHeaders });

      const thumbId = lookupResponse.data[0]?.id;
      if (!thumbId) continue;

      const downloadResponse = await axios.get<string>(`${config.COMS_URL}/object/${thumbId}?download=url`, {
        headers: authHeader,
      });

      attachment.imageIconString = downloadResponse.data;
      attachment.imageIconId = thumbId;
    } catch (error) {
      // A thumbnail failure must not fail the whole fetch — fall back to the placeholder icon.
      console.error(`Unable to resolve thumbnail for attachment ${attachment.id}`, error);
    }
  }
};

/** Fetches all enforcement-action attachments for an investigation, optionally scoped to a single enforcement action. */
export const fetchEnforcementActionAttachments = async (
  investigationGuid: string,
  enforcementActionId?: string,
  includeThumbnails: boolean = false,
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

  if (includeThumbnails) {
    await resolveThumbnails(
      attachments,
      investigationGuid,
      enforcementActionId,
      AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT,
    );
  }

  return mapWithMetadata(attachments, metadataMap);
};
