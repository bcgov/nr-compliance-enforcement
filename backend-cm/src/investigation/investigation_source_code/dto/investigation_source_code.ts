import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { investigation_source_code } from "../../../../prisma/investigation/generated/investigation_source_code";

export class InvestigationSourceCode {
  investigationSourceCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaInvestigationSourceCodeToInvestigationSourceCode = (mapper: Mapper) => {
  createMap<investigation_source_code, InvestigationSourceCode>(
    mapper,
    "investigation_source_code",
    "InvestigationSourceCode",
    forMember(
      (dest) => dest.investigationSourceCode,
      mapFrom((src) => src.investigation_source_code),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.short_description),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.long_description),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
