import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { business } from "../../../../prisma/shared/generated/business";
import { BusinessDto } from "../../../common/party";

export class Business implements BusinessDto {
  businessGuid: string;
  partyGuid: string;
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
