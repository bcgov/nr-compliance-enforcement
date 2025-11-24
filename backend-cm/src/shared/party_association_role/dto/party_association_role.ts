import { party_association_role } from "../../../../prisma/shared/generated/party_association_role";
import { mapFrom, forMember, createMap, Mapper } from "@automapper/core";

export class PartyAssociationRole {
  partyAssociationRole: string;
  activeIndicator: boolean;
  displayOrder: number;
  longDescription: string;
  shortDescription: string;
  caseActivityTypeCode;
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
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.long_description),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.short_description),
    ),
    forMember(
      (dest) => dest.caseActivityTypeCode,
      mapFrom((src) => src.case_activity_type_code),
    ),
  );
};
