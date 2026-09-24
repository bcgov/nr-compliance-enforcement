import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { wildlife_management_unit_code } from "../../../../prisma/shared/generated/wildlife_management_unit_code";

export class WildlifeManagementUnitCode {
  wildlifeManagementUnitCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaWMUCodeToWMUCode = (mapper: Mapper) => {
  createMap<wildlife_management_unit_code, WildlifeManagementUnitCode>(
    mapper,
    "wildlife_management_unit_code",
    "WildlifeManagementUnitCode",
    forMember(
      (dest) => dest.wildlifeManagementUnitCode,
      mapFrom((src) => src.wildlife_management_unit_code),
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
