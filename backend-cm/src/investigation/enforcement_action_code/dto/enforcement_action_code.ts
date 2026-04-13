import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { enforcement_action_code } from "../../../../prisma/investigation/generated/enforcement_action_code";

export class EnforcementActionCode {
  enforcementActionCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaEnforcementActionCodeToEnforcementActionCode = (mapper: Mapper) => {
  createMap<enforcement_action_code, EnforcementActionCode>(
    mapper,
    "enforcement_action_code",
    "EnforcementActionCode",
    forMember(
      (dest) => dest.enforcementActionCode,
      mapFrom((src) => src.enforcement_action_code),
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
