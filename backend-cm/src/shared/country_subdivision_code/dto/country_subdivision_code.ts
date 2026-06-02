import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { country_subdivision_code } from "prisma/shared/generated/country_subdivision_code";

export class CountrySubdivisionCode {
  countrySubdivisionCode: string;
  countryCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
  externalAgencyIndicator: boolean;
}

export const mapPrismaCountrySubdivisionCodeToCountrySubdivisionCode = (mapper: Mapper) => {
  createMap<country_subdivision_code, CountrySubdivisionCode>(
    mapper,
    "country_subdivision_code",
    "CountrySubdivisionCode",
    forMember(
      (dest) => dest.countrySubdivisionCode,
      mapFrom((src) => src.country_subdivision_code),
    ),
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
