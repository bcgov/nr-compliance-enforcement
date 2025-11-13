import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { geo_organization_unit_code } from "../../../../prisma/shared/generated/geo_organization_unit_code";

export class GeoOrganizationUnitCode {
  geoOrganizationUnitCode: string;
  shortDescription: string;
  longDescription: string;
  effectiveDate: Date;
  expiryDate: Date;
  geoOrgUnitTypeCode: string;
  administrativeOfficeIndicator: boolean;
}

export const mapPrismaGeoOrganizationUnitCodeToGeoOrganizationUnitCode = (mapper: Mapper) => {
  createMap<geo_organization_unit_code, GeoOrganizationUnitCode>(
    mapper,
    "geo_organization_unit_code",
    "GeoOrganizationUnitCode",
    forMember(
      (dest) => dest.geoOrganizationUnitCode,
      mapFrom((src) => src.geo_organization_unit_code),
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
      (dest) => dest.effectiveDate,
      mapFrom((src) => src.effective_date),
    ),
    forMember(
      (dest) => dest.expiryDate,
      mapFrom((src) => src.expiry_date),
    ),
    forMember(
      (dest) => dest.geoOrgUnitTypeCode,
      mapFrom((src) => src.geo_org_unit_type_code),
    ),
    forMember(
      (dest) => dest.administrativeOfficeIndicator,
      mapFrom((src) => src.administrative_office_ind),
    ),
  );
};
