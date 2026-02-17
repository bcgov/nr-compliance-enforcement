import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { business_identifier_code } from "prisma/shared/generated/business_identifier_code";

export class BusinessIdentifierCode {
  businessIdentifierCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaBusinessIdentifierCodeToBusinessIdentifierCode = (mapper: Mapper) => {
  createMap<business_identifier_code, BusinessIdentifierCode>(
    mapper,
    "business_identifier_code",
    "BusinessIdentifierCode",
    forMember(
      (dest) => dest.businessIdentifierCode,
      mapFrom((src) => src.business_identifier_code),
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
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
