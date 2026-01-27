import axios from "axios";
import config from "@/config";
import { AUTH_TOKEN } from "@service/user-service";
import { COMSObject } from "@apptypes/coms/object";
import AttachmentEnum from "@constants/attachment-enum";
import { getAttachmentConfig } from "@apptypes/app/attachment-config";

/**
 * Generic parameters for searching attachments in COMS.
 */
export interface SearchAttachmentsParams {
  /** Primary identifier (e.g., investigationGuid, inspectionGuid) */
  headerId: string;
  /** Optional sub-identifier (e.g., taskGuid) */
  subHeaderId?: string;
  /** Filename search */
  name?: string;
  /** Page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Attachment type */
  attachmentType: AttachmentEnum;
}

export interface SearchAttachmentsResult {
  attachments: COMSObject[];
  total: number;
}

export interface ObjectMetadataItem {
  key: string;
  value: string;
}

export interface ObjectMetadata {
  objectId: string;
  metadata: ObjectMetadataItem[];
}

export interface ParsedObjectMetadata {
  objectId: string;
  taskId: string | null;
  attachmentType: AttachmentEnum | null;
}

/**
 * Which bucket to use based on attachment type.
 */
const getBucketForAttachmentType = (attachmentType: AttachmentEnum): string => {
  return attachmentType === AttachmentEnum.TASK_ATTACHMENT ? config.SECURE_COMS_BUCKET : config.COMS_BUCKET;
};

/**
 * Search for attachments in COMS across any type (Investigations, Inspections, etc.)
 */
export const searchAttachments = async (params: SearchAttachmentsParams): Promise<SearchAttachmentsResult> => {
  const { headerId, subHeaderId, name, page, limit, attachmentType } = params;

  const attachmentConfig = getAttachmentConfig(attachmentType);
  const bucketId = getBucketForAttachmentType(attachmentType);

  const url = new URL(`${config.COMS_URL}/object`);
  url.searchParams.append("bucketId", bucketId);
  url.searchParams.append("latest", "true");
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("page", page.toString());
  if (name) {
    url.searchParams.append("name", name);
  }

  // Headers for filtering
  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
    [attachmentConfig.headerKey]: headerId,
    "x-amz-meta-is-thumb": "N",
    "x-amz-meta-attachment-type": attachmentType.toString(),
  };

  // Add filter by sub-header
  if (subHeaderId && attachmentConfig.subHeaderKey) {
    headers[attachmentConfig.subHeaderKey] = subHeaderId;
  }

  const response = await axios.get(url.toString(), { headers });

  const total = Number.parseInt(response.headers["x-total-count"] ?? "0", 10);

  return {
    attachments: response.data as COMSObject[],
    total: total || response.data.length,
  };
};

/**
 * Fetch metadata for multiple objects
 */
export const fetchObjectsMetadata = async (
  objectIds: string[],
  attachmentType: AttachmentEnum,
): Promise<Map<string, ParsedObjectMetadata>> => {
  if (objectIds.length === 0) {
    return new Map();
  }

  const bucketId = getBucketForAttachmentType(attachmentType);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
  };

  // Use axios for array serialization
  const response = await axios.get<ObjectMetadata[]>(`${config.COMS_URL}/object/metadata`, {
    headers,
    params: {
      bucketId,
      objectId: objectIds,
    },
  });

  // Parse and index metadata by objectId
  // Map deduplicates, if multiple versions exist we keep the last one.
  // NOTE: There might be an issue with how this COMS API behaves, we may need to revisit in the future.
  const metadataMap = new Map<string, ParsedObjectMetadata>();

  for (const item of response.data) {
    const taskIdMeta = item.metadata.find((m) => m.key === "task-id");
    const attachmentTypeMeta = item.metadata.find((m) => m.key === "attachment-type");

    const attachmentTypeNum = attachmentTypeMeta ? Number.parseInt(attachmentTypeMeta.value, 10) : null;
    const validAttachmentType =
      attachmentTypeNum !== null && Object.values(AttachmentEnum).includes(attachmentTypeNum)
        ? (attachmentTypeNum as AttachmentEnum)
        : null;

    metadataMap.set(item.objectId, {
      objectId: item.objectId,
      taskId: taskIdMeta?.value ?? null,
      attachmentType: validAttachmentType,
    });
  }

  return metadataMap;
};

// Strip embedded tags from filename
export const getDisplayFilename = (storedName: string): string => {
  const decoded = decodeURIComponent(storedName);
  // {name}_{uuid}_{type}.{ext} or {name}_{uuid}_{type} (no extension)
  const match = new RegExp(/^(.+)_[a-f0-9-]{36}_\d+(\.[^.]+)?$/i).exec(decoded);
  return match ? `${match[1]}${match[2] || ""}` : decoded;
};
