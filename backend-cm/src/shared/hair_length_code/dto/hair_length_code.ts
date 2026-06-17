import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { hair_length_code } from "prisma/shared/generated/hair_length_code";

export class HairLengthCode {
  hairLengthCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaHairLengthCodeToHairLengthCode = (mapper: Mapper) => {
  createMap<hair_length_code, HairLengthCode>(
    mapper,
    "hair_length_code",
    "HairLengthCode",
    forMember(
      (dest) => dest.hairLengthCode,
      mapFrom((src) => src.hair_length_code),
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
