import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { hair_colour_code } from "prisma/shared/generated/hair_colour_code";

export class HairColourCode {
  hairColourCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaHairColourCodeToHairColourCode = (mapper: Mapper) => {
  createMap<hair_colour_code, HairColourCode>(
    mapper,
    "hair_colour_code",
    "HairColourCode",
    forMember(
      (dest) => dest.hairColourCode,
      mapFrom((src) => src.hair_colour_code),
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
