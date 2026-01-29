import { Mapper, createMap, forMember, mapFrom, mapWithArguments } from "@automapper/core";
import { business } from "../../../../prisma/shared/generated/business";
import { BusinessDto } from "../../../common/party";
import { Alias } from "src/shared/alias/dto/alias";
import { BusinessIdentifier } from "src/shared/business_identifier/dto/business_identifier";

export class Business implements BusinessDto {
  businessGuid: string;
  partyGuid: string;
  name: string;
  aliases: Alias[];
  identifiers: BusinessIdentifier[];
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
    forMember(
      (dest) => dest.aliases,
      mapWithArguments((src) => mapper.mapArray(src.alias ?? [], "alias", "Alias")),
    ),
    forMember(
      (dest) => dest.identifiers,
      mapWithArguments((src) =>
        mapper.mapArray(src.business_identifier ?? [], "business_identifier", "BusinessIdentifier"),
      ),
    ),
  );
};
