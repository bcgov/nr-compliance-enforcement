import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { legislation_source } from "../../../../prisma/shared/generated/legislation_source";

// M = Mandatory, O = Optional, H = Hidden
export type AnimalInformationDisplayType = "M" | "O" | "H";

export interface LegislationSource {
  legislationSourceGuid: string;
  shortDescription: string;
  longDescription: string | null;
  sourceUrl: string;
  regulationsSourceUrl: string | null;
  agencyCode: string;
  sourceType: string;
  activeInd: boolean;
  parentLegislationSourceGuid: string | null;
  externalKey: string | null;
  animalInformationDisplayType: AnimalInformationDisplayType;
  createUserId?: string;
  createUtcTimestamp?: Date;
}

export interface CreateLegislationSourceInput {
  shortDescription: string;
  longDescription?: string | null;
  sourceUrl: string;
  regulationsSourceUrl?: string | null;
  agencyCode: string;
  sourceType?: string;
  effectiveDate?: string;
  animalInformationDisplayType?: AnimalInformationDisplayType;
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
  updateUserId: string;
  animalInformationDisplayType?: AnimalInformationDisplayType;
}

export const mapPrismaLegislationSourceToLegislationSource = (mapper: Mapper) => {
  createMap<legislation_source, LegislationSource>(
    mapper,
    "legislation_source",
    "LegislationSource",
    forMember(
      (dest) => dest.legislationSourceGuid,
      mapFrom((src) => src.legislation_source_guid),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.short_description),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.long_description ?? null),
    ),
    forMember(
      (dest) => dest.sourceUrl,
      mapFrom((src) => src.source_url ?? ""),
    ),
    forMember(
      (dest) => dest.regulationsSourceUrl,
      mapFrom((src) => src.regulations_source_url ?? null),
    ),
    forMember(
      (dest) => dest.agencyCode,
      mapFrom((src) => src.agency_code),
    ),
    forMember(
      (dest) => dest.sourceType,
      mapFrom((src) => src.source_type ?? "BCLAWS"),
    ),
    forMember(
      (dest) => dest.activeInd,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.parentLegislationSourceGuid,
      mapFrom((src) => src.parent_legislation_source_guid ?? null),
    ),
    forMember(
      (dest) => dest.externalKey,
      mapFrom((src) => src.external_key ?? null),
    ),
    forMember(
      (dest) => dest.createUserId,
      mapFrom((src) => src.create_user_id),
    ),
    forMember(
      (dest) => dest.createUtcTimestamp,
      mapFrom((src) => src.create_utc_timestamp),
    ),
    forMember(
      (dest) => dest.animalInformationDisplayType,
      mapFrom((src) => src.animal_information_display_code ?? null),
    ),
  );
};
