import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { facial_hair_style_code } from "prisma/shared/generated/facial_hair_style_code";

export class FacialHairStyleCode {
  facialHairStyleCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaFacialHairStyleCodeToFacialHairStyleCode = (mapper: Mapper) => {
  createMap<facial_hair_style_code, FacialHairStyleCode>(
    mapper,
    "facial_hair_style_code",
    "FacialHairStyleCode",
    forMember(
      (dest) => dest.facialHairStyleCode,
      mapFrom((src) => src.facial_hair_style_code),
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
