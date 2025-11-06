import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";

export interface CosGeoOrgUnitRaw {
  region_code: string;
  region_name: string;
  zone_code: string;
  zone_name: string;
  offloc_code: string;
  offloc_name: string;
  area_code: string;
  area_name: string;
  administrative_office_ind: boolean;
}

export class CosGeoOrgUnit {
  regionCode: string;
  regionName: string;
  zoneCode: string;
  zoneName: string;
  officeLocationCode: string;
  officeLocationName: string;
  areaCode: string;
  areaName: string;
  administrativeOfficeIndicator: boolean;
}

export const mapPrismaCosGeoOrgUnitFlatMvwToCosGeoOrgUnit = (mapper: Mapper) => {
  createMap<CosGeoOrgUnitRaw, CosGeoOrgUnit>(
    mapper,
    "CosGeoOrgUnitRaw",
    "CosGeoOrgUnit",
    forMember(
      (dest) => dest.regionCode,
      mapFrom((src) => src.region_code),
    ),
    forMember(
      (dest) => dest.regionName,
      mapFrom((src) => src.region_name),
    ),
    forMember(
      (dest) => dest.zoneCode,
      mapFrom((src) => src.zone_code),
    ),
    forMember(
      (dest) => dest.zoneName,
      mapFrom((src) => src.zone_name),
    ),
    forMember(
      (dest) => dest.officeLocationCode,
      mapFrom((src) => src.offloc_code),
    ),
    forMember(
      (dest) => dest.officeLocationName,
      mapFrom((src) => src.offloc_name),
    ),
    forMember(
      (dest) => dest.areaCode,
      mapFrom((src) => src.area_code),
    ),
    forMember(
      (dest) => dest.areaName,
      mapFrom((src) => src.area_name),
    ),
    forMember(
      (dest) => dest.administrativeOfficeIndicator,
      mapFrom((src) => src.administrative_office_ind),
    ),
  );
};
