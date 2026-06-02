import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { country_code } from "../../../../prisma/shared/generated/country_code";

export class CountryCode {
  countryCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
  externalAgencyIndicator: boolean;
}

export const mapPrismaCountryCodeToCountryCode = (mapper: Mapper) => {
  createMap<country_code, CountryCode>(
    mapper,
    "country_code",
    "CountryCode",
    forMember(
      (dest) => dest.countryCode,
      mapFrom((src) => src.country_code),
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
