import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { team_code } from "../../../../prisma/shared/generated/team_code";

export class TeamCode {
  teamCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaTeamCodeToTeamCode = (mapper: Mapper) => {
  createMap<team_code, TeamCode>(
    mapper,
    "team_code",
    "TeamCode",
    forMember(
      (dest) => dest.teamCode,
      mapFrom((src) => src.team_code),
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
