import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { investigation_status_code } from "../../../../prisma/investigation/generated/investigation_status_code";

export class InvestigationStatusCode {
  investigationStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaInvestigationStatusCodeToInvestigationStatusCode = (mapper: Mapper) => {
  createMap<investigation_status_code, InvestigationStatusCode>(
    mapper,
    "investigation_status_code",
    "InvestigationStatusCode",
    forMember(
      (dest) => dest.investigationStatusCode,
      mapFrom((src) => src.investigation_status_code),
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
