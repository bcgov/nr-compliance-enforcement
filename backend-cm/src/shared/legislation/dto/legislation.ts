import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { legislation } from "../../../../prisma/shared/generated/legislation";

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
}

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
  );
};
