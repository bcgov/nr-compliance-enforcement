import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { eye_colour_code } from "prisma/shared/generated/eye_colour_code";

export class EyeColourCode {
  eyeColourCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaEyeColourCodeToEyeColourCode = (mapper: Mapper) => {
  createMap<eye_colour_code, EyeColourCode>(
    mapper,
    "eye_colour_code",
    "EyeColourCode",
    forMember(
      (dest) => dest.eyeColourCode,
      mapFrom((src) => src.eye_colour_code),
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
