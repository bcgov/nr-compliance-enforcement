import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { gender_code } from "prisma/shared/generated/gender_code";

export class Gender {
  genderCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaGenderCodeToGenderCode = (mapper: Mapper) => {
  createMap<gender_code, Gender>(
    mapper,
    "gender_code",
    "Gender",
    forMember(
      (dest) => dest.genderCode,
      mapFrom((src) => src.gender_code),
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
