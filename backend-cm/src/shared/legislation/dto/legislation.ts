import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { legislation } from "../../../../prisma/shared/generated/legislation";
import { toDateString } from "../../../common/custom_scalars";

export class Legislation {
  legislationGuid: string;
  legislationTypeCode: string;
  parentGuid: string;
  citation: string;
  fullCitation: string;
  sectionTitle: string;
  legislationText: string;
  alternateText: string;
  displayOrder: number;
  ancestors: Legislation[];
  isEnabled: boolean;
  versionEffectiveDate: string | null;
  sourceUrl: string | null;
}

type LegislationVersionAndConfiguration = {
  enabled_ind: boolean;
  version_effective_date: Date | null;
  source_url: string | null;
};

export const mapPrismaLegislationToLegislation = (mapper: Mapper) => {
  createMap<legislation, Legislation>(
    mapper,
    "legislation",
    "Legislation",
    forMember(
      (dest) => dest.legislationGuid,
      mapFrom((src) => src.legislation_guid),
    ),
    forMember(
      (dest) => dest.legislationTypeCode,
      mapFrom((src) => src.legislation_type_code),
    ),
    forMember(
      (dest) => dest.parentGuid,
      mapFrom((src) => src.parent_legislation_guid),
    ),
    forMember(
      (dest) => dest.citation,
      mapFrom((src) => src.citation),
    ),
    forMember(
      (dest) => dest.fullCitation,
      mapFrom((src) => src.full_citation),
    ),
    forMember(
      (dest) => dest.sectionTitle,
      mapFrom((src) => src.section_title),
    ),
    forMember(
      (dest) => dest.legislationText,
      mapFrom((src) => src.legislation_text),
    ),
    forMember(
      (dest) => dest.alternateText,
      mapFrom((src) => src.alternate_text),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.isEnabled,
      mapFrom((src) => (src as legislation & LegislationVersionAndConfiguration).enabled_ind),
    ),
    forMember(
      (dest) => dest.versionEffectiveDate,
      mapFrom((src) => toDateString((src as legislation & LegislationVersionAndConfiguration).version_effective_date)),
    ),
    forMember(
      (dest) => dest.sourceUrl,
      mapFrom((src) => (src as legislation & LegislationVersionAndConfiguration).source_url),
    ),
  );
};
