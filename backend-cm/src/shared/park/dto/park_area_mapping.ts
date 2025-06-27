import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { park_area_mapping } from "../../../../prisma/shared/generated/park_area_mapping";

export class ParkAreaMapping {
  parkAreaMappingGuid: string;
  parkAreaGuid: string;
  externalId: string;
}

export const mapPrismaParkAreaMappingToParkAreaMapping = (mapper: Mapper) => {
  createMap<park_area_mapping, ParkAreaMapping>(
    mapper,
    "park_area_mapping",
    "ParkAreaMapping",
    forMember(
      (dest) => dest.parkAreaMappingGuid,
      mapFrom((src) => src.park_area_mapping_guid),
    ),
    forMember(
      (dest) => dest.parkAreaGuid,
      mapFrom((src) => src.park_area_guid),
    ),
    forMember(
      (dest) => dest.externalId,
      mapFrom((src) => src.external_id),
    ),
  );
};
