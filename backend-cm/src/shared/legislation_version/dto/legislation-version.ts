import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { legislation_version } from "../../../../prisma/shared/generated/legislation_version";
import { toDateString } from "../../../common/custom_scalars";
import { LegislationSource } from "../../legislation_source/dto/legislation-source";

export type ImportStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ContraventionStats {
  count: number;
  earliest: string | null;
  latest: string | null;
}

export interface LegislationVersion {
  legislationVersionGuid: string;
  legislationSourceGuid: string;
  parentLegislationVersionGuid: string | null;
  effectiveDate: string;
  importStatus: ImportStatus;
  sourceUrl: string | null;
  sourceEffectiveDate: string | null;
  lastImportTimestamp: string | null;
  lastImportLog: string | null;
  createUserId?: string;
  createUtcTimestamp?: Date;
}

export interface ImportableLegislationVersion extends LegislationVersion {
  source: LegislationSource;
}

export const mapPrismaLegislationVersionToLegislationVersion = (mapper: Mapper) => {
  createMap<legislation_version, LegislationVersion>(
    mapper,
    "legislation_version",
    "LegislationVersion",
    forMember(
      (dest) => dest.legislationVersionGuid,
      mapFrom((src) => src.legislation_version_guid),
    ),
    forMember(
      (dest) => dest.legislationSourceGuid,
      mapFrom((src) => src.legislation_source_guid),
    ),
    forMember(
      (dest) => dest.parentLegislationVersionGuid,
      mapFrom((src) => src.parent_legislation_version_guid ?? null),
    ),
    forMember(
      (dest) => dest.effectiveDate,
      mapFrom((src) => toDateString(src.effective_date)),
    ),
    forMember(
      (dest) => dest.importStatus,
      mapFrom((src) => src.import_status as ImportStatus),
    ),
    forMember(
      (dest) => dest.sourceUrl,
      mapFrom((src) => src.source_url ?? null),
    ),
    forMember(
      (dest) => dest.sourceEffectiveDate,
      mapFrom((src) => toDateString(src.source_effective_date)),
    ),
    forMember(
      (dest) => dest.lastImportTimestamp,
      mapFrom((src) => src.last_import_timestamp?.toISOString() ?? null),
    ),
    forMember(
      (dest) => dest.lastImportLog,
      mapFrom((src) => src.last_import_log ?? null),
    ),
    forMember(
      (dest) => dest.createUserId,
      mapFrom((src) => src.create_user_id),
    ),
    forMember(
      (dest) => dest.createUtcTimestamp,
      mapFrom((src) => src.create_utc_timestamp),
    ),
  );
};
