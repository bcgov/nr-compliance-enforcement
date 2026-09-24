import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { sanction_status_code } from "../../../../prisma/investigation/generated/sanction_status_code";

export class SanctionStatusCode {
  sanctionStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaSanctionStatusCodeToSanctionStatusCode = (mapper: Mapper) => {
  createMap<sanction_status_code, SanctionStatusCode>(
    mapper,
    "sanction_status_code",
    "SanctionStatusCode",
    forMember(
      (dest) => dest.sanctionStatusCode,
      mapFrom((src) => src.sanction_status_code),
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
