import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { park_area } from "../../../../prisma/shared/generated/park_area";

export class ParkArea {
  parkAreaGuid: string;
  name: string;
  regionName?: string;
}

export const mapPrismaParkAreaToParkArea = (mapper: Mapper) => {
  createMap<park_area, ParkArea>(
    mapper,
    "park_area",
    "ParkArea",
    forMember(
      (dest) => dest.parkAreaGuid,
      mapFrom((src) => src.park_area_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.regionName,
      mapFrom((src) => src.region_name),
    ),
  );
};
