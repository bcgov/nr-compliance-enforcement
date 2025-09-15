import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { agency_code } from "../../../../prisma/shared/generated/agency_code";

export class AgencyCode {
  agencyCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
  externalAgencyIndicator: boolean;
}

export const mapPrismaAgencyCodeToAgencyCode = (mapper: Mapper) => {
  createMap<agency_code, AgencyCode>(
    mapper,
    "agency_code",
    "AgencyCode",
    forMember(
      (dest) => dest.agencyCode,
      mapFrom((src) => src.agency_code),
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
    forMember(
      (dest) => dest.externalAgencyIndicator,
      mapFrom((src) => src.external_agency_ind),
    ),
  );
};
