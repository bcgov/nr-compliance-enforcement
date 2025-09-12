import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { business } from "../../../../prisma/shared/generated/business";

export class Business {
  businessGuid: string;
  name: string;
}

export const mapPrismaBusinessToBusiness = (mapper: Mapper) => {
  createMap<business, Business>(
    mapper,
    "business",
    "Business",
    forMember(
      (dest) => dest.businessGuid,
      mapFrom((src) => src.business_guid),
    ),
    forMember(
      (dest) => dest.name,
      mapFrom((src) => src.name),
    ),
  );
};
