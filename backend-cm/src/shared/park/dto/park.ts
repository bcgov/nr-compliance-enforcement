import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { park } from "../../../../prisma/shared/generated/park";
import { ParkArea } from "./park_area";

export class Park {
  parkGuid: string;
  externalId: string;
  name: string;
  legalName?: string;
  parkAreas?: ParkArea[];
}

export const mapPrismaParkToPark = (mapper: Mapper) => {
  createMap<park, Park>(
    mapper,
    "park",
    "Park",
    forMember(
      (dest) => dest.parkGuid,
      mapFrom((src) => src.park_guid),
    ),
    forMember(
      (dest) => dest.externalId,
      mapFrom((src) => src.external_id),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
    forMember(
      (dest) => dest.legalName,
      mapFrom((src) => src.legal_name),
    ),
    forMember(
      (dest) => dest.parkAreas,
      mapWithArguments((src) =>
        mapper.mapArray(src.park_area_xref?.map((xref) => xref.park_area) ?? [], "park_area", "ParkArea"),
      ),
    ),
  );
};
