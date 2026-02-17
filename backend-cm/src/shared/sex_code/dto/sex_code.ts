import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { sex_code } from "../../../../prisma/shared/generated/sex_code";

export class SexCode {
  sexCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaSexCodeToSexCode = (mapper: Mapper) => {
  createMap<sex_code, SexCode>(
    mapper,
    "sex_code",
    "SexCode",
    forMember(
      (dest) => dest.sexCode,
      mapFrom((src) => src.sex_code),
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
