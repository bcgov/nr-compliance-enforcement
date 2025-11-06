import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { team } from "../../../../prisma/shared/generated/team";

export class Team {
  teamGuid: string;
  teamCode: string;
  agencyCode: string;
  activeIndicator: boolean;
  createUserId: string;
  createTimestamp: Date;
  updateUserId: string;
  updateTimestamp: Date;
}

export const mapPrismaTeamToTeam = (mapper: Mapper) => {
  createMap<team, Team>(
    mapper,
    "team",
    "Team",
    forMember(
      (dest) => dest.teamGuid,
      mapFrom((src) => src.team_guid),
    ),
    forMember(
      (dest) => dest.teamCode,
      mapFrom((src) => src.team_code),
    ),
    forMember(
      (dest) => dest.agencyCode,
      mapFrom((src) => src.agency_code_ref),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.createUserId,
      mapFrom((src) => src.create_user_id),
    ),
    forMember(
      (dest) => dest.createTimestamp,
      mapFrom((src) => src.create_utc_timestamp),
    ),
    forMember(
      (dest) => dest.updateUserId,
      mapFrom((src) => src.update_user_id),
    ),
    forMember(
      (dest) => dest.updateTimestamp,
      mapFrom((src) => src.update_utc_timestamp),
    ),
  );
};
