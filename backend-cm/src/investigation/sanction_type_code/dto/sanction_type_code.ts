import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { sanction_type_code } from "../../../../prisma/investigation/generated/sanction_type_code";

export class SanctionTypeCode {
  sanctionTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaSanctionTypeCodeToSanctionTypeCode = (mapper: Mapper) => {
  createMap<sanction_type_code, SanctionTypeCode>(
    mapper,
    "sanction_type_code",
    "SanctionTypeCode",
    forMember(
      (dest) => dest.sanctionTypeCode,
      mapFrom((src) => src.sanction_type_code),
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
