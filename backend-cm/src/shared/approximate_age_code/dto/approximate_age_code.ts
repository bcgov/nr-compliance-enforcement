import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { approximate_age_code } from "prisma/shared/generated/approximate_age_code";

export class ApproximateAgeCode {
  approximateAgeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaApproximateAgeCodeToApproximateAgeCode = (mapper: Mapper) => {
  createMap<approximate_age_code, ApproximateAgeCode>(
    mapper,
    "approximate_age_code",
    "ApproximateAgeCode",
    forMember(
      (dest) => dest.approximateAgeCode,
      mapFrom((src) => src.approximate_age_code),
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
