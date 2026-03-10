import AttachmentEnum from "@constants/attachment-enum";
import { deleteAttachments, saveAttachments } from "@store/reducers/attachments";
import { COMSObject } from "@apptypes/coms/object";
import axios from "axios";
import config from "@/config";
import { AUTH_TOKEN } from "@service/user-service";
import { getAttachmentConfig } from "@apptypes/app/attachment-config";

// used to update the state of attachments that are to be added to a complaint
export const handleAddAttachments = (
  setAttachmentsToAdd: React.Dispatch<React.SetStateAction<File[] | null>>,
  selectedFiles: File[],
) => {
  setAttachmentsToAdd((prevFiles) => (prevFiles ? [...prevFiles, ...selectedFiles] : selectedFiles));
};

// used to update the state of attachments that are to be deleted from a complaint
export const handleDeleteAttachments = (
  attachmentsToAdd: File[] | null,
  setAttachmentsToAdd: React.Dispatch<React.SetStateAction<File[] | null>>,
  setAttachmentsToDelete: React.Dispatch<React.SetStateAction<COMSObject[] | null>>,
  fileToDelete: COMSObject,
) => {
  if (!fileToDelete.pendingUpload) {
    // a user is wanting to delete a previously uploaded attachment
    setAttachmentsToDelete((prevFiles) => (prevFiles ? [...prevFiles, fileToDelete] : [fileToDelete]));
  } else if (attachmentsToAdd) {
    // a user has added an attachment and deleted it, before the complaint was saved.  Let's make sure this file isn't uploaded, so remove it from the "attachmentsToAdd" state
    setAttachmentsToAdd((prevAttachments) =>
      prevAttachments
        ? prevAttachments.filter((file) => decodeURIComponent(file.name) !== decodeURIComponent(fileToDelete.name))
        : null,
    );
  }
};

interface PersistAttachmentsParams {
  dispatch: any;
  attachmentsToAdd: File[] | null;
  attachmentsToDelete: COMSObject[] | null;
  identifier: string;
  subIdentifier: string | undefined;
  setAttachmentsToAdd: any;
  setAttachmentsToDelete: any;
  attachmentType: AttachmentEnum;
  isSynchronous: boolean;
  complaintType?: string;
  extendedMeta?: Record<string, string>;
}

// Given a list of attachments to add/delete, call COMS to add/delete those attachments
export async function handlePersistAttachments({
  dispatch,
  attachmentsToAdd,
  attachmentsToDelete,
  identifier,
  subIdentifier,
  setAttachmentsToAdd,
  setAttachmentsToDelete,
  attachmentType,
  isSynchronous,
  extendedMeta,
}: PersistAttachmentsParams): Promise<void> {
  const tasks: Promise<unknown>[] = [];
  if (attachmentsToDelete) {
    tasks.push(dispatch(deleteAttachments(attachmentsToDelete, identifier, attachmentType)));
  }

  if (attachmentsToAdd) {
    tasks.push(
      dispatch(
        saveAttachments(attachmentsToAdd, identifier, subIdentifier, attachmentType, isSynchronous, extendedMeta),
      ),
    );
  }

  await Promise.all(tasks);

  // Clear the attachments since they've been added or saved.
  setAttachmentsToAdd(null);
  setAttachmentsToDelete(null);
}

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
  takenBy: string | null;
  date: string | null;
  fileType: string | null;
  location: string | null;
  description: string | null;
  title: string | null;
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
  const uniqueIds = [...new Set(objectIds)];

  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
  };

  // COMS API limits objectId to 20 per request
  const BATCH_SIZE = 20;
  const results: ObjectMetadata[] = [];

  for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
    const batch = uniqueIds.slice(i, i + BATCH_SIZE);
    // Use axios for array serialization
    const response = await axios.get<ObjectMetadata[]>(`${config.COMS_URL}/object/metadata`, {
      headers,
      params: {
        bucketId,
        objectId: batch,
      },
    });
    results.push(...response.data);
  }

  // Parse and index metadata by objectId. Map deduplicates, if multiple versions exist we keep the last one.
  // NOTE: There might be an issue with how this COMS API behaves as its returning more results then makes sense
  // to me, we may need to revisit in the future if there are performance issues.
  const metadataMap = new Map<string, ParsedObjectMetadata>();

  for (const item of results) {
    const taskIdMeta = item.metadata.find((m) => m.key === "task-id");
    const attachmentTypeMeta = item.metadata.find((m) => m.key === "attachment-type");
    const takenByMeta = item.metadata.find((m) => m.key === "taken-by");
    const dateMeta = item.metadata.find((m) => m.key === "date");
    const fileTypeMeta = item.metadata.find((m) => m.key === "file-type");
    const locationMeta = item.metadata.find((m) => m.key === "location");
    const descriptionMeta = item.metadata.find((m) => m.key === "description");
    const titleMeta = item.metadata.find((m) => m.key === "title");

    const attachmentTypeNum = attachmentTypeMeta ? Number.parseInt(attachmentTypeMeta.value, 10) : null;
    const validAttachmentType =
      attachmentTypeNum !== null && Object.values(AttachmentEnum).includes(attachmentTypeNum)
        ? (attachmentTypeNum as AttachmentEnum)
        : null;

    metadataMap.set(item.objectId, {
      objectId: item.objectId,
      taskId: taskIdMeta?.value ?? null,
      attachmentType: validAttachmentType,
      date: dateMeta?.value ?? null,
      takenBy: takenByMeta?.value ?? null,
      fileType: fileTypeMeta?.value ?? null,
      location: locationMeta?.value ?? null,
      description: descriptionMeta?.value ?? null,
      title: titleMeta?.value ?? null,
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

// Convert output from File picker to COMS Object Array for display sizing info in Upload Component
export const fileListToCOMSObjects = (files: FileList | null): COMSObject[] => {
  if (!files) return [];
  return Array.from<File>(files).map((f) => ({
    name: f.name,
    size: f.size,
    pendingUpload: true,
  }));
};
