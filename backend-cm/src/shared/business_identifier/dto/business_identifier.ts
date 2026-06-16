import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { business_identifier } from "prisma/shared/generated/business_identifier";

export class BusinessIdentifier {
  businessIdentifierGuid: string;
  businessGuid: string;
  identifierCode: string;
  identifierValue: string;
}

export const mapPrismaBusinessIdentifierToIdentifier = (mapper: Mapper) => {
  createMap<business_identifier, BusinessIdentifier>(
    mapper,
    "business_identifier",
    "BusinessIdentifier",
    forMember(
      (dest) => dest.businessIdentifierGuid,
      mapFrom((src) => src.business_identifier_guid),
    ),
    forMember(
      (dest) => dest.businessGuid,
      mapFrom((src) => src.business_guid),
    ),
    forMember(
      (dest) => dest.identifierCode,
      mapFrom((src) => src.business_identifier_code),
    ),
    forMember(
      (dest) => dest.identifierValue,
      mapFrom((src) => src.identifier_value),
    ),
  );
};
