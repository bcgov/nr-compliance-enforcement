export type ImportStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface LegislationSource {
  legislationSourceGuid: string;
  shortDescription: string;
  longDescription: string | null;
  sourceUrl: string;
  regulationsSourceUrl: string | null;
  agencyCode: string;
  activeInd: boolean;
  importedInd: boolean;
  importStatus: ImportStatus | null;
  lastImportTimestamp: string | null;
  lastImportLog: string | null;
  createUserId?: string;
  createUtcTimestamp?: Date;
}

export interface CreateLegislationSourceInput {
  shortDescription: string;
  longDescription?: string | null;
  sourceUrl: string;
  regulationsSourceUrl?: string | null;
  agencyCode: string;
  createUserId: string;
}

export interface UpdateLegislationSourceInput {
  legislationSourceGuid: string;
  shortDescription?: string;
  longDescription?: string | null;
  sourceUrl?: string;
  regulationsSourceUrl?: string | null;
  agencyCode?: string;
  activeInd?: boolean;
  importedInd?: boolean;
  updateUserId: string;
}
