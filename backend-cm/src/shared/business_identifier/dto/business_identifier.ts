import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { business_identifier } from "prisma/shared/generated/business_identifier";
import { BusinessIdentifierCode } from "src/shared/business_identifier_code/dto/business_identifier_code";

export class BusinessIdentifier {
  businessIdentifierGuid: string;
  businessGuid: string;
  identifierCode: BusinessIdentifierCode;
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
      (dest) => dest.identifierValue,
      mapFrom((src) => src.identifier_value),
    ),
    forMember(
      (dest) => dest.identifierCode,
      mapFrom((src) =>
        mapper.map(
          src.business_identifier_code_business_identifier_business_identifier_codeTobusiness_identifier_code,
          "business_identifier_code",
          "BusinessIdentifierCode",
        ),
      ),
    ),
  );
};
