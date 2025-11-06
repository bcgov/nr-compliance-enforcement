import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { geo_org_unit_type_code } from "../../../../prisma/shared/generated/geo_org_unit_type_code";

export class GeoOrgUnitTypeCode {
  geoOrgUnitTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaGeoOrgUnitTypeCodeToGeoOrgUnitTypeCode = (mapper: Mapper) => {
  createMap<geo_org_unit_type_code, GeoOrgUnitTypeCode>(
    mapper,
    "geo_org_unit_type_code",
    "GeoOrgUnitTypeCode",
    forMember(
      (dest) => dest.geoOrgUnitTypeCode,
      mapFrom((src) => src.geo_org_unit_type_code),
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
