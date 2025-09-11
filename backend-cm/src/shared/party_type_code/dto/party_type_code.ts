import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { party_type_code } from "../../../../prisma/shared/generated/party_type_code";

export class PartyTypeCode {
  partyTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaPartyTypeCodeToPartyTypeCode = (mapper: Mapper) => {
  createMap<party_type_code, PartyTypeCode>(
    mapper,
    "party_type_code",
    "PartyTypeCode",
    forMember(
      (dest) => dest.partyTypeCode,
      mapFrom((src) => src.party_type_code),
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
