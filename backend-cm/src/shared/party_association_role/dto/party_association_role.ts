import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { party_association_role } from "../../../../prisma/shared/generated/party_association_role";

export class PartyAssociationRole {
  partyAssociationRole: string;
  caseActivityTypeCode;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaPartyAssociationRoleToPartyAssociationRole = (mapper: Mapper) => {
  createMap<party_association_role, PartyAssociationRole>(
    mapper,
    "party_association_role",
    "PartyAssociationRole",
    forMember(
      (dest) => dest.partyAssociationRole,
      mapFrom((src) => src.party_association_role),
    ),
    forMember(
      (dest) => dest.caseActivityTypeCode,
      mapFrom((src) => src.case_activity_type_code),
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
