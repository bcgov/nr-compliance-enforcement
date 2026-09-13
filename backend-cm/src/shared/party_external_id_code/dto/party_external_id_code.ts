import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { party_external_id_code } from "prisma/shared/generated/party_external_id_code";

export class PartyExternalIdCode {
  partyExternalIdCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaPartyExternalIdCodeToPartyExternalIdCode = (mapper: Mapper) => {
  createMap<party_external_id_code, PartyExternalIdCode>(
    mapper,
    "party_external_id_code",
    "PartyExternalIdCode",
    forMember(
      (dest) => dest.partyExternalIdCode,
      mapFrom((src) => src.party_external_id_code),
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
